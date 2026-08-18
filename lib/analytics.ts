import Clarity from "@microsoft/clarity";
import { ClarityEventName, ClarityUserTags } from "@/types/analytics";

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
   * Dispatches a custom business event.
   */
  event(eventName: ClarityEventName) {
    if (typeof window === "undefined" || this.isLocalDev()) return;

    if (this.memoryFiredEvents.has(eventName)) {
      return;
    }

    try {
      Clarity.event(eventName);
      this.persistFiredEvent(eventName);
    } catch (err) {
      console.error(`Clarity analytics: event [${eventName}] failed`, err);
    }
  }

  // --- Helper Business Methods ---

  trackSignupStarted() {
    this.event("signup_started");
  }

  trackSignupCompleted() {
    this.event("signup_completed");
  }

  trackLoginCompleted() {
    this.event("login_completed");
  }

  trackLogoutCompleted() {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("openlabs_clarity_events");
      } catch {}
    }
    this.memoryFiredEvents.clear();
    this.event("logout_completed");
  }

  trackOnboardingStarted() {
    this.event("onboarding_started");
  }

  trackOnboardingCompleted() {
    this.event("onboarding_completed");
  }

  trackWorkspaceCreated() {
    this.event("workspace_created");
  }

  trackProjectCreated(projectId?: string) {
    if (projectId) {
      this.setTag("last_created_project_id", projectId);
    }
    this.event("project_created");
  }

  trackInviteSent() {
    this.event("invite_sent");
  }

  trackCheckoutStarted() {
    this.event("checkout_started");
  }

  trackCheckoutCompleted() {
    this.event("checkout_completed");
  }

  trackSubscriptionUpgraded() {
    this.event("subscription_upgraded");
  }

  trackSubscriptionCancelled() {
    this.event("subscription_cancelled");
  }
}

export const analyticsService = new AnalyticsService();
