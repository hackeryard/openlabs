// app/lib/types/schema.ts

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export interface SchemaLearningResource {
  "@context": "https://schema.org";
  "@type": "LearningResource";
  name: string;
  description: string;
  url: string;
  learningResourceType: string;
  educationalLevel: string;
  competencyRequired?: string;
  inLanguage: string;
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  provider: {
    "@type": "EducationalOrganization";
    name: string;
    url: string;
  };
}

export interface SchemaFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }[];
}

export interface SchemaDefinedTerm {
  "@context": "https://schema.org";
  "@type": "DefinedTerm";
  name: string;
  description: string;
  inDefinedTermSet?: string;
  termCode?: string;
}

export interface SchemaBlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  image?: string[];
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person" | "Organization";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}
