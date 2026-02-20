import "server-only";

import { env } from "@/lib/env";
import type { ParsedResumeData } from "@/types/domain";

const CANONICAL_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "FastAPI",
  "Python",
  "Tailwind CSS",
  "GraphQL",
];

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeNameFromFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExtension.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "";
  }

  return titleCase(cleaned);
}

function inferSkillsFromFileName(fileName: string): string[] {
  const lowered = fileName.toLowerCase();

  return CANONICAL_SKILLS.filter((skill) => lowered.includes(skill.toLowerCase()));
}

export async function parseResumeFallback(file: File): Promise<ParsedResumeData> {
  const guessedName = normalizeNameFromFileName(file.name);
  const skills = inferSkillsFromFileName(file.name);

  return {
    full_name: guessedName,
    email: "",
    phone: "",
    current_role: "",
    current_company: "",
    total_experience_yrs: null,
    skills,
    raw_text:
      "Fallback parser is active. Set PARSER_SERVICE_URL and PARSER_API_KEY to connect external parser service.",
  };
}

export async function parseResume(file: File): Promise<{ parsed: ParsedResumeData | null; parseFailed: boolean }> {
  if (!env.PARSER_SERVICE_URL || !env.PARSER_API_KEY) {
    return {
      parsed: await parseResumeFallback(file),
      parseFailed: false,
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${env.PARSER_SERVICE_URL.replace(/\/$/, "")}/parse`, {
      method: "POST",
      headers: {
        "X-API-Key": env.PARSER_API_KEY,
      },
      body: formData,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        parsed: await parseResumeFallback(file),
        parseFailed: true,
      };
    }

    const payload = (await response.json()) as ParsedResumeData;

    return {
      parsed: payload,
      parseFailed: false,
    };
  } catch {
    return {
      parsed: await parseResumeFallback(file),
      parseFailed: true,
    };
  }
}
