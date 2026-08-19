import Clarity from "@microsoft/clarity";
import { ClarityEventName, ClarityUserTags } from "@/types/analytics";
import { trackEvent } from "@/app/lib/tracker";

class AnalyticsService {
  private memoryFiredEvents = new Set<string>();

  private isLocalDev(): boolean {
    if (process.env.NODE_ENV !== "production") return true;
    if (typeof window !== "undefined") {
      const h = window.location.hostname;
      const port = window.location.port;
      if (
        h === "localhost" ||
        h === "127.0.0.1" ||
        h === "0.0.0.0" ||
        h.endsWith(".local") ||
        h === "[::1]" ||
        h.includes("localhost") ||
        port === "3000" ||
        port === "5000" ||
        port !== ""
      ) {
        return true;
      }
    }
    return false;
  }

  constructor() {
    if (typeof window !== "undefined" && !this.isLocalDev()) {
      try {
        const stored = sessionStorage.getItem("openlabs_clarity_events");
        if (stored) {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) {
            arr.forEach((e) => this.memoryFiredEvents.add(e));
          }
        }
      } catch (err) {
        console.warn("Clarity analytics: failed to load from sessionStorage", err);
      }
    }
  }

  private persistFiredEvent(eventName: string) {
    if (this.isLocalDev()) return;
    this.memoryFiredEvents.add(eventName);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "openlabs_clarity_events",
          JSON.stringify(Array.from(this.memoryFiredEvents))
        );
      } catch (err) {
        // Ignore storage errors
      }
    }
  }

  /**
   * Identifies the user in Microsoft Clarity.
   */
  identify(userId: string, username?: string) {
    if (typeof window === "undefined" || this.isLocalDev()) return;

    const identifyKey = `identify:${userId}:${username || ""}`;
    if (this.memoryFiredEvents.has(identifyKey)) return;

    try {
      Clarity.identify(userId, undefined, undefined, username);
      this.persistFiredEvent(identifyKey);
    } catch (err) {
      console.error("Clarity analytics: identify failed", err);
    }
  }

  /**
   * Sets a custom session tag.
   */
  setTag(key: string, value: string) {
    if (typeof window === "undefined" || this.isLocalDev()) return;

    const tagKey = `tag:${key}:${value}`;
    if (this.memoryFiredEvents.has(tagKey)) return;

    try {
      Clarity.setTag(key, value);
      this.persistFiredEvent(tagKey);
    } catch (err) {
      console.error(`Clarity analytics: setTag [${key}] failed`, err);
    }
  }

  /**
   * Sets multiple user tags at once.
   */
  setUserTags(tags: ClarityUserTags) {
    if (this.isLocalDev()) return;
    Object.entries(tags).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.setTag(key, String(value));
      }
    });
  }

  /**
   * Dispatches a custom business event to both Microsoft Clarity and OpenLabs Analytics Engine.
   */
  event(eventName: ClarityEventName | string, properties: Record<string, any> = {}, value?: number) {
    if (typeof window === "undefined" || this.isLocalDev()) return;

    // 1. Send to first-party OpenLabs MongoDB telemetry
    try {
      trackEvent(eventName, properties, value);
    } catch {}

    // 2. Send to Microsoft Clarity
    if (this.memoryFiredEvents.has(eventName)) {
      return;
    }

    try {
      Clarity.event(eventName as ClarityEventName);
      this.persistFiredEvent(eventName);
    } catch (err) {
      console.error(`Clarity analytics: event [${eventName}] failed`, err);
    }
  }

  // --- Helper Business & Learning Methods ---

  trackSignupStarted(properties?: Record<string, any>) {
    this.event("signup_started", { category: "auth", ...properties });
  }

  trackSignupCompleted(properties?: Record<string, any>) {
    this.event("signup_completed", { category: "auth", ...properties });
  }

  trackLoginCompleted(properties?: Record<string, any>) {
    this.event("login_completed", { category: "auth", ...properties });
  }

  trackLogoutCompleted() {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("openlabs_clarity_events");
      } catch {}
    }
    this.memoryFiredEvents.clear();
    this.event("logout_completed", { category: "auth" });
  }

  trackOnboardingStarted() {
    this.event("onboarding_started", { category: "onboarding" });
  }

  trackOnboardingCompleted() {
    this.event("onboarding_completed", { category: "onboarding" });
  }

  trackLabCompleted(labId: string, subject: string, xpEarned?: number, leveledUp?: boolean) {
    this.event(
      "lab_completed",
      {
        category: "learning",
        labId,
        subject,
        xpEarned: xpEarned || 0,
        leveledUp: !!leveledUp,
      },
      xpEarned
    );
  }

  trackChallengeCompleted(labId: string, difficulty?: string, xpEarned?: number, correct = true) {
    this.event(
      "challenge_completed",
      {
        category: "challenge",
        labId,
        difficulty: difficulty || "medium",
        xpEarned: xpEarned || 0,
        correct,
      },
      xpEarned
    );
  }

  trackFeedbackSubmitted(labId: string, rating: number, category?: string) {
    this.event(
      "feedback_submitted",
      {
        category: "feedback",
        labId,
        rating,
        feedbackCategory: category || "general",
      },
      rating
    );
  }

  trackAiQueryAsked(subject?: string, labId?: string, queryLength?: number) {
    this.event("ai_query_asked", {
      category: "ai",
      subject: subject || "general",
      labId: labId || null,
      queryLength: queryLength || 0,
    });
  }

  trackWorkspaceCreated() {
    this.event("workspace_created", { category: "editor" });
  }

  trackProjectCreated(projectId?: string, title?: string) {
    if (projectId) {
      this.setTag("last_created_project_id", projectId);
    }
    this.event("project_created", { category: "editor", projectId, title });
  }

  trackProjectDeleted(projectId?: string) {
    this.event("project_deleted", { category: "editor", projectId });
  }

  trackInviteSent() {
    this.event("invite_sent", { category: "social" });
  }

  trackCheckoutStarted() {
    this.event("checkout_started", { category: "billing" });
  }

  trackCheckoutCompleted() {
    this.event("checkout_completed", { category: "billing" });
  }

  trackSubscriptionUpgraded() {
    this.event("subscription_upgraded", { category: "billing" });
  }

  trackSubscriptionCancelled() {
    this.event("subscription_cancelled", { category: "billing" });
  }
}

export const analyticsService = new AnalyticsService();
