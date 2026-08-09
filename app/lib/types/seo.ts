// app/lib/types/seo.ts
import { SubjectId, DifficultyLevel, EducationalLevel } from "./knowledge";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface RelatedContentItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "lab" | "concept" | "blog" | "path";
  subject: SubjectId;
  difficulty?: DifficultyLevel;
}

export interface SEOPageConfig {
  title: string;
  description: string;
  pathname: string;
  subject?: SubjectId;
  topic?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}
