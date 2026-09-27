import type { Metadata } from "next";

/**
 * Global layout for interactive simulation workspaces (/labs/*).
 * Strictly enforces noindex, nofollow robots metadata across all interactive labs,
 * keeping search engines focused on public educational landing pages.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
