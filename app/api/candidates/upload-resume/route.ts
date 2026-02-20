import { handleRouteError, json } from "@/lib/http";
import { uploadResumeFile } from "@/lib/storage";
import { ValidationError } from "@/server/errors";
import { parseResume } from "@/server/services/resume-parser.service";
import { requireApiUser } from "@/server/auth/guards";
import type { UploadResumeResponse } from "@/types/api";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER"]);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ValidationError("Resume upload failed", {
        file: "A file is required.",
      });
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new ValidationError("Resume upload failed", {
        file: "Only PDF or DOCX files are allowed.",
      });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError("Resume upload failed", {
        file: "File size exceeds 5MB limit.",
      });
    }

    const resumeUrl = await uploadResumeFile(file);
    const parseResult = await parseResume(file);

    const payload: UploadResumeResponse = {
      resume_url: resumeUrl,
      parsed: parseResult.parsed,
      parse_failed: parseResult.parseFailed,
    };

    return json(payload, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
