import { apiSuccess } from "@/app/lib/integrations/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  return apiSuccess({
    status: "ok",
    service: "OpenLabs Institutional Integration API",
    version: "v1",
    timestamp: new Date().toISOString(),
  });
}

