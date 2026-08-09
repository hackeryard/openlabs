// app/robots.ts
import { MetadataRoute } from "next";
import { SITE_METADATA } from "@/app/lib/constants/subjects";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/physics/",
          "/chemistry/",
          "/biology/",
          "/computer-science/",
          "/labs/",
          "/blog/",
          "/about",
          "/contact",
          "/llms.txt",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/private/",
          "/login",
          "/signup",
          "/forgotpassword",
          "/reset-password",
          "/verify-email",
          "/setup-profile",
        ],
      },
    ],
    sitemap: `${SITE_METADATA.baseUrl}/sitemap.xml`,
  };
}