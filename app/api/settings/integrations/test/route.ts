import { handleRouteError, json } from "@/lib/http";
import { testGoogleSheetsConnection } from "@/lib/sheets";
import { requireApiUser } from "@/server/auth/guards";

export async function POST(): Promise<Response> {
  try {
    await requireApiUser(["ADMIN"]);
    const result = await testGoogleSheetsConnection();

    return json({
      success: true,
      healthy: result.healthy,
      message: result.message,
      sheet_tab: result.sheetTab ?? null,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
