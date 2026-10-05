import { MetadataRoute } from "next";
import { SITE_METADATA } from "@/app/lib/constants/subjects";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_METADATA.baseUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: ["/"],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/ads.txt",
          "/robots.txt",
          "/sitemap.xml",
          "/physics",
          "/physics/",
          "/chemistry",
          "/chemistry/",
          "/biology",
          "/biology/",
          "/computer-science",
          "/computer-science/",
          "/mathematics",
          "/mathematics/",
          "/tracks",
          "/leaderboard",
          "/blog",
          "/blog/",
          "/about",
          "/contact",
          "/llms.txt",
          "/llms-full.txt",
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
          "/403",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}