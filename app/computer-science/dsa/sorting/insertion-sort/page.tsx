import React from "react";
import DsaLanding from "../../DsaLanding";
import { createDsaMetadata, dsaContent } from "../../dsaContent";

const content = dsaContent["insertion-sort"];

export const metadata = createDsaMetadata(content);

export default function Page() {
  return <DsaLanding content={content} />;
}
