export type ClarityEventName =
  | "signup_started"
  | "signup_completed"
  | "login_completed"
  | "logout_completed"
  | "onboarding_started"
  | "onboarding_completed"
  | "workspace_created"
  | "project_created"
  | "invite_sent"
  | "checkout_started"
  | "checkout_completed"
  | "subscription_upgraded"
  | "subscription_cancelled";

export interface ClarityUserTags {
  role?: string;
  plan?: string;
  country?: string;
  organizationId?: string;
  accountType?: string;
  [key: string]: string | undefined; // Allow custom extensible tags
}

export interface ClarityUserInfo {
  userId: string;
  username?: string;
  tags?: ClarityUserTags;
}
