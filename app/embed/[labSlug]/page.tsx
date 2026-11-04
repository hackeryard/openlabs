import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { LABS } from "@/app/lib/labs";
import { getJwtSecret } from "@/app/lib/auth";
import { recordApiUsage } from "@/app/lib/integrations/usageMeter";
import EmbedSimulationFrame from "./EmbedSimulationFrame";

export const dynamic = "force-dynamic";

interface EmbedPageProps {
  params: {
    labSlug: string;
  };
  searchParams: {
    token?: string;
    theme?: string;
  };
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const slugParam = decodeURIComponent(params.labSlug || "").toLowerCase();
  const normalizedId = slugParam.replace(/-/g, "/");
  const lab = LABS.find(
    (l) =>
      l.id.toLowerCase() === normalizedId ||
      l.id.replace(/\//g, "-").toLowerCase() === slugParam
  );

  return {
    title: lab ? `${lab.name} - OpenLabs Embed` : "OpenLabs Embed Simulation",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const slugParam = decodeURIComponent(params.labSlug || "").toLowerCase().trim();
  const normalizedId = slugParam.replace(/-/g, "/");

  const lab = LABS.find(
    (l) =>
      l.id.toLowerCase() === normalizedId ||
      l.id.replace(/\//g, "-").toLowerCase() === slugParam ||
      l.id.split("/")[1]?.toLowerCase() === slugParam
  );

  if (!lab) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-4 text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold mb-2">Lab Simulation Not Found</h1>
          <p className="text-sm text-slate-400 mb-6">
            The requested simulation identifier <code className="text-xs bg-slate-800 px-2 py-1 rounded">{slugParam}</code> does not exist in the OpenLabs catalog.
          </p>
          <a
            href="https://www.openlabs.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Visit OpenLabs Catalog →
          </a>
        </div>
      </div>
    );
  }

  const isDev = process.env.NODE_ENV !== "production";
  const token = searchParams?.token;
  let isAuthorized = false;
  let authError: string | null = null;
  let partnerOrgId: string | null = null;
  let partnerKeyId: string | null = null;

  if (token) {
    try {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as any;

      if (decoded && decoded.type === "embed_auth") {
        if (decoded.labId && decoded.labId !== lab.id) {
          authError = "Token is not valid for this specific simulation";
        } else {
          isAuthorized = true;
          partnerOrgId = decoded.orgId || null;
          partnerKeyId = decoded.keyId || null;
        }
      } else {
        authError = "Invalid embed token payload";
      }
    } catch (err: any) {
      authError = err?.name === "TokenExpiredError" ? "Embed token has expired" : "Invalid or tampered embed signature";
    }
  } else if (isDev) {
    // Development sandbox preview clearance
    isAuthorized = true;
  } else {
    authError = "Missing institutional embed authorization token";
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4 text-xl font-bold">
            🛡️
          </div>
          <h1 className="text-lg font-bold mb-2">Embed Authorization Required</h1>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {authError || "This virtual experiment requires an active institutional license and signed embed token from your LMS provider."}
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs text-slate-500 mb-6 font-mono break-all">
            lab: {lab.id}
            <br />
            status: unauthorized_embed
          </div>
          <div className="text-[11px] text-slate-500">
            Powered by{" "}
            <a
              href="https://www.openlabs.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              OpenLabs Education
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Record usage in background if associated with partner
  if (partnerOrgId) {
    recordApiUsage({
      organizationId: partnerOrgId,
      apiKeyId: partnerKeyId || undefined,
      endpoint: `/embed/${slugParam}`,
      method: "GET",
      statusCode: 200,
      labId: lab.id,
      responseTimeMs: 0,
    });
  }

  const labPath = `/labs/${lab.id}`;
  const subjectName = lab.subject === "computerScience" ? "Computer Science" : lab.subject;

  return (
    <EmbedSimulationFrame
      labId={lab.id}
      labName={lab.name}
      subjectName={subjectName}
      labPath={labPath}
      isDevPreview={!token && isDev}
    />
  );
}

