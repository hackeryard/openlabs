import React from "react";
import DsaLanding from "../../DsaLanding";
import { createDsaMetadata, dsaContent } from "../../dsaContent";

const content = dsaContent["heap-sort"];

export const revalidate = 86400; // 24 hours ISR Edge CDN cache

export const metadata = createDsaMetadata(content);

export default function Page() {
  return <DsaLanding content={content} />;
}
