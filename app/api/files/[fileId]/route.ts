import { handleRouteError, json } from "@/lib/http";
import { getSignedResumeDownloadUrl } from "@/lib/storage";
import { getFile } from "@/server/data/file-store";
import { requireApiUser } from "@/server/auth/guards";

interface RouteContext {
  params: Promise<{ fileId: string }>;
}

export async function GET(_: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser();
    const { fileId } = await context.params;

    const signedUrl = await getSignedResumeDownloadUrl(fileId);
    if (signedUrl) {
      return Response.redirect(signedUrl, 302);
    }

    const file = getFile(fileId);

    if (!file) {
      return json({ error: "File not found" }, 404);
    }

    return new Response(new Uint8Array(file.data), {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename="${file.fileName}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
