import "server-only";

import { google, type sheets_v4 } from "googleapis";

import { nowIso } from "@/lib/dates";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const DEFAULT_SHEET_TAB_NAME = "Pipeline";
const MAX_SHEET_ROUNDS = 3;
const MAX_ERROR_LENGTH = 500;
const SHEETS_SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];
const CANDIDATE_ID_COLUMN_RANGE = "A:A";

const resolvedSheetTabCache = new Map<string, string>();

interface GoogleServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

export interface SheetsConnectionResult {
  healthy: boolean;
  message: string;
  sheetTab?: string;
}

function asErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message.slice(0, MAX_ERROR_LENGTH);
  }

  return "Unknown sheets sync error";
}

function hasSheetsConfig(): boolean {
  return Boolean(env.GOOGLE_SHEET_ID && (env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 || env.GOOGLE_SERVICE_ACCOUNT_KEY));
}

function getGoogleServiceAccountKey(): string {
  return env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 || env.GOOGLE_SERVICE_ACCOUNT_KEY;
}

function toA1SheetTitle(sheetTitle: string): string {
  return `'${sheetTitle.replace(/'/g, "''")}'`;
}

function buildA1Range(sheetTitle: string, range: string): string {
  return `${toA1SheetTitle(sheetTitle)}!${range}`;
}

function parseServiceAccountCredentials(rawValue: string): GoogleServiceAccountCredentials {
  const parseJson = (raw: string): GoogleServiceAccountCredentials => {
    const parsed = JSON.parse(raw) as Partial<GoogleServiceAccountCredentials>;

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("Invalid Google service account key: missing client_email or private_key");
    }

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  };

  try {
    const decoded = Buffer.from(rawValue, "base64").toString("utf8");
    return parseJson(decoded);
  } catch {
    return parseJson(rawValue);
  }
}

async function createSyncLog(candidateId: string, status: "SUCCESS" | "FAILED" | "PENDING", errorMessage: string | null): Promise<void> {
  await prisma.syncLog.create({
    data: {
      id: crypto.randomUUID(),
      candidate_id: candidateId,
      status,
      error_message: errorMessage,
      synced_at: new Date(nowIso()),
    },
  });
}

function buildRoundCells(candidate: {
  interview_rounds: Array<{
    round_number: number;
    round_type: string;
    scheduled_at: Date | null;
    interviewer: { full_name: string };
    feedback: {
      overall_rating: number;
      recommendation: string;
    } | null;
  }>;
}): string[] {
  const rounds = candidate.interview_rounds.slice(0, MAX_SHEET_ROUNDS);
  const cells: string[] = [];

  for (const round of rounds) {
    cells.push(
      round.round_type,
      round.interviewer.full_name,
      round.scheduled_at ? round.scheduled_at.toISOString() : "",
      round.feedback ? `${round.feedback.overall_rating}` : "",
      round.feedback ? round.feedback.recommendation : "",
    );
  }

  const expectedCellCount = MAX_SHEET_ROUNDS * 5;
  while (cells.length < expectedCellCount) {
    cells.push("");
  }

  return cells;
}

function buildCandidateRow(candidate: {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  source: string;
  current_stage: string;
  total_experience_yrs: number | null;
  skills: string[];
  resume_url: string;
  linkedin_url: string | null;
  updated_at: Date;
  job: { title: string };
  rejection: { category: string; notes: string } | null;
  interview_rounds: Array<{
    round_number: number;
    round_type: string;
    scheduled_at: Date | null;
    interviewer: { full_name: string };
    feedback: {
      overall_rating: number;
      recommendation: string;
    } | null;
  }>;
}): string[] {
  return [
    candidate.id,
    candidate.full_name,
    candidate.email,
    candidate.phone ?? "",
    candidate.job.title,
    candidate.source,
    candidate.current_stage,
    candidate.total_experience_yrs !== null ? String(candidate.total_experience_yrs) : "",
    candidate.skills.join(", "),
    ...buildRoundCells(candidate),
    candidate.rejection?.category ?? "",
    candidate.rejection?.notes ?? "",
    candidate.resume_url,
    candidate.linkedin_url ?? "",
    candidate.updated_at.toISOString(),
  ];
}

async function getSheetsClient() {
  const credentials = parseServiceAccountCredentials(getGoogleServiceAccountKey());
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SHEETS_SCOPE,
  });

  return google.sheets({
    version: "v4",
    auth,
  });
}

async function resolveSheetTabName(sheets: sheets_v4.Sheets): Promise<string> {
  const spreadsheetId = env.GOOGLE_SHEET_ID;
  const preferredTabName = env.GOOGLE_SHEET_TAB_NAME || DEFAULT_SHEET_TAB_NAME;
  const cacheKey = `${spreadsheetId}:${preferredTabName}`;
  const cached = resolvedSheetTabCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const availableTitles =
    metadata.data.sheets
      ?.map((sheet) => sheet.properties?.title?.trim())
      .filter((title): title is string => Boolean(title)) ?? [];

  if (availableTitles.length === 0) {
    throw new Error("Google sheet sync failed: spreadsheet has no available tabs");
  }

  if (availableTitles.includes(preferredTabName)) {
    resolvedSheetTabCache.set(cacheKey, preferredTabName);
    return preferredTabName;
  }

  const fallbackTab = availableTitles[0];
  console.warn(
    `Google sheet tab "${preferredTabName}" not found for spreadsheet ${spreadsheetId}. Falling back to "${fallbackTab}".`,
  );
  resolvedSheetTabCache.set(cacheKey, fallbackTab);
  return fallbackTab;
}

export async function syncCandidateToSheets(candidateId: string): Promise<void> {
  if (!hasSheetsConfig()) {
    await createSyncLog(candidateId, "PENDING", "Google Sheets configuration is missing");
    return;
  }

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        job: true,
        interview_rounds: {
          include: {
            interviewer: true,
            feedback: true,
          },
          orderBy: {
            round_number: "asc",
          },
        },
        rejection: true,
      },
    });

    if (!candidate) {
      throw new Error(`Candidate not found for sheet sync: ${candidateId}`);
    }

    const sheets = await getSheetsClient();
    const sheetTabName = await resolveSheetTabName(sheets);
    const row = buildCandidateRow(candidate);
    const lookupRange = buildA1Range(sheetTabName, CANDIDATE_ID_COLUMN_RANGE);

    const searchResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: lookupRange,
    });

    const values = searchResponse.data.values ?? [];
    const existingRowIndex = values.findIndex((entry) => entry?.[0] === candidateId);

    if (existingRowIndex >= 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: buildA1Range(sheetTabName, `A${existingRowIndex + 1}`),
        valueInputOption: "RAW",
        requestBody: {
          values: [row],
        },
      });
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: lookupRange,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [row],
        },
      });
    }

    await createSyncLog(candidateId, "SUCCESS", null);
  } catch (error) {
    const message = asErrorMessage(error);
    await createSyncLog(candidateId, "FAILED", message);
    throw error;
  }
}

export async function testGoogleSheetsConnection(): Promise<SheetsConnectionResult> {
  if (!hasSheetsConfig()) {
    return {
      healthy: false,
      message: "Missing Google Sheets configuration. Set GOOGLE_SHEET_ID and service account credentials.",
    };
  }

  try {
    const sheets = await getSheetsClient();
    const sheetTabName = await resolveSheetTabName(sheets);
    await sheets.spreadsheets.values.get({
      spreadsheetId: env.GOOGLE_SHEET_ID,
      range: buildA1Range(sheetTabName, "A1:A1"),
    });

    return {
      healthy: true,
      message: `Connected to "${sheetTabName}" tab successfully.`,
      sheetTab: sheetTabName,
    };
  } catch (error) {
    return {
      healthy: false,
      message: asErrorMessage(error),
    };
  }
}
