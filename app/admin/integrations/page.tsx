"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Calendar,
  Lock,
  Globe,
  Trash2,
  Edit3,
  Power,
  ChevronRight,
  Sliders,
  DollarSign,
  FileText,
  X,
  Radio,
  BarChart3,
  CheckCircle2,
  Zap,
} from "lucide-react";
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getAdminHref } from "@/app/lib/adminUrl";

interface OrgStats {
  activeKeysCount: number;
  totalKeysCount: number;
  monthlyRequests: number;
  monthlyQuota: number;
  usagePercent: number;
}

interface OrganizationItem {
  _id: string;
  name: string;
  slug: string;
  type: "school" | "university" | "company" | "partner";
  status: "pending" | "active" | "suspended";
  contactEmail: string;
  plan: {
    name: "pilot" | "institutional" | "enterprise";
    maxMonthlyRequests: number;
    requestsPerMinute: number;
    maxStudents: number;
  };
  licenseType: string;
  billing?: {
    paymentStatus: "paid" | "pending" | "overdue" | "waived" | "trial";
    invoiceReference?: string;
    billingContact?: string;
    notes?: string;
    renewalDate?: string;
  };
  allowedOrigins: string[];
  licensedLabs: string[];
  licensedSubjects: string[];
  validUntil: string;
  createdAt: string;
  stats?: OrgStats;
}

interface ApiKeyItem {
  _id: string;
  name: string;
  keyPrefix: string;
  organizationId: any;
  scopes: string[];
  permittedLabs: string[];
  status: "active" | "revoked" | "expired";
  expiresAt: string | null;
  lastUsedAt: string | null;
  requestCount: number;
  createdAt: string;
}

interface TelemetryStats {
  organizations: {
    total: number;
    active: number;
    suspended: number;
  };
  keys: {
    total: number;
    active: number;
  };
  usage: {
    totalRequests: number;
    requests30d: number;
    requests24h: number;
    rateLimitViolations30d: number;
    errors30d: number;
    topOrganizations: Array<{
      organizationId: string;
      name: string;
      slug: string;
      plan: string;
      status: string;
      requests30d: number;
    }>;
  };
}

interface IntegrationEventItem {
  _id: string;
  organizationId: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  eventType: string;
  details: any;
  actorUserId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  timestamp: string;
}

export default function AdminIntegrationsPage() {
  const { isUnlocked, isHydrated, isAdmin } = useAdminSecret();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"organizations" | "keys" | "events">(
    "organizations"
  );

  // Data states
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [events, setEvents] = useState<IntegrationEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Modals state
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [selectedOrgForAction, setSelectedOrgForAction] = useState<OrganizationItem | null>(null);
  const [selectedOrgDetail, setSelectedOrgDetail] = useState<OrganizationItem | null>(null);
  const [orgDetailKeys, setOrgDetailKeys] = useState<ApiKeyItem[]>([]);
  const [showOrgDetailDrawer, setShowOrgDetailDrawer] = useState(false);

  // Reveal new key state
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Form states for creating Organization
  const [newOrgForm, setNewOrgForm] = useState({
    name: "",
    slug: "",
    type: "school" as const,
    contactEmail: "",
    planName: "pilot" as "pilot" | "institutional" | "enterprise",
    licenseType: "pilot",
    allowedOrigins: "",
    licensedLabs: "*",
    paymentStatus: "trial" as "trial" | "paid" | "pending" | "overdue",
    invoiceReference: "",
    notes: "",
    validMonths: 12,
  });

  // Form states for generating Key
  const [newKeyForm, setNewKeyForm] = useState({
    name: "Production LMS Connector",
    organizationId: "",
    scopes: ["labs:read", "embed:create", "usage:read"],
    permittedLabs: "*",
    expiresInDays: 365,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch telemetry stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/integrations/stats", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json);
      }
    } catch (err) {
      console.error("Failed to load integration stats:", err);
    }
  }, []);

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("query", searchQuery);
      if (statusFilter !== "all") queryParams.set("status", statusFilter);
      if (planFilter !== "all") queryParams.set("plan", planFilter);

      const res = await fetch(`/api/admin/integrations/organizations?${queryParams.toString()}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        throw new Error(`Failed to load organizations (${res.status})`);
      }
      const json = await res.json();
      setOrganizations(json.organizations || []);
    } catch (err: any) {
      console.error("Failed to load organizations:", err);
      setError(err?.message || "Failed to load partners");
    }
  }, [searchQuery, statusFilter, planFilter]);

  // Fetch audit events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/integrations/events?limit=40", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        setEvents(json.events || []);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }, []);

  // Load all data
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchStats(), fetchOrganizations(), fetchEvents()]);
    setLoading(false);
  }, [fetchStats, fetchOrganizations, fetchEvents]);

  useEffect(() => {
    if (isHydrated && isUnlocked) {
      loadAll();
    }
  }, [isHydrated, isUnlocked, loadAll]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchOrganizations(), fetchEvents()]);
    setRefreshing(false);
    showToast("Integration telemetry updated");
  };

  // Toggle Organization Status (Active / Suspended)
  const handleToggleOrgStatus = async (org: OrganizationItem) => {
    const newStatus = org.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`/api/admin/integrations/organizations/${org._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to change organization status");
      showToast(`Partner '${org.name}' is now ${newStatus}`);
      fetchOrganizations();
      fetchStats();
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || "Status change failed");
    }
  };

  // Open Organization Detail Drawer
  const handleOpenOrgDetail = async (org: OrganizationItem) => {
    setSelectedOrgDetail(org);
    setShowOrgDetailDrawer(true);
    try {
      const res = await fetch(`/api/admin/integrations/organizations/${org._id}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedOrgDetail(json.organization);
        setOrgDetailKeys(json.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch detailed org view:", err);
    }
  };

  // Revoke or Restore Key
  const handleToggleKeyStatus = async (key: ApiKeyItem) => {
    const newStatus = key.status === "active" ? "revoked" : "active";
    try {
      const res = await fetch(`/api/admin/integrations/keys/${key._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update key status");
      showToast(`API Key ${key.keyPrefix} is now ${newStatus}`);
      if (selectedOrgDetail) {
        handleOpenOrgDetail(selectedOrgDetail);
      }
      fetchStats();
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle key status");
    }
  };

  // Delete Key
  const handleDeleteKey = async (key: ApiKeyItem) => {
    if (!confirm(`Are you sure you want to permanently delete API Key ${key.name} (${key.keyPrefix})?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/integrations/keys/${key._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete key");
      showToast(`Key ${key.keyPrefix} permanently removed`);
      if (selectedOrgDetail) {
        handleOpenOrgDetail(selectedOrgDetail);
      }
      fetchStats();
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || "Failed to delete key");
    }
  };

  // Handle Create Organization Form Submit
  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allowedOriginsArr = newOrgForm.allowedOrigins
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const licensedLabsArr = newOrgForm.licensedLabs
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const validUntil = new Date(
        Date.now() + newOrgForm.validMonths * 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      const res = await fetch("/api/admin/integrations/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOrgForm.name,
          slug: newOrgForm.slug || undefined,
          type: newOrgForm.type,
          contactEmail: newOrgForm.contactEmail,
          planName: newOrgForm.planName,
          licenseType: newOrgForm.licenseType,
          allowedOrigins: allowedOriginsArr,
          licensedLabs: licensedLabsArr.length > 0 ? licensedLabsArr : ["*"],
          validUntil,
          billing: {
            paymentStatus: newOrgForm.paymentStatus,
            invoiceReference: newOrgForm.invoiceReference,
            notes: newOrgForm.notes,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to create organization");
      }

      showToast(`Partner '${json.organization.name}' successfully created!`);
      setShowCreateOrgModal(false);
      // Reset form
      setNewOrgForm({
        name: "",
        slug: "",
        type: "school",
        contactEmail: "",
        planName: "pilot",
        licenseType: "pilot",
        allowedOrigins: "",
        licensedLabs: "*",
        paymentStatus: "trial",
        invoiceReference: "",
        notes: "",
        validMonths: 12,
      });

      fetchOrganizations();
      fetchStats();
      fetchEvents();

      // Offer to generate API key for newly created org
      setSelectedOrgForAction(json.organization);
      setNewKeyForm((prev) => ({
        ...prev,
        organizationId: json.organization._id,
        name: `${json.organization.name} Default Key`,
      }));
      setShowGenerateKeyModal(true);
    } catch (err: any) {
      showToast(err.message || "Failed to create partner");
    }
  };

  // Handle Generate Key Form Submit
  const handleGenerateKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const permittedLabsArr = newKeyForm.permittedLabs
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/integrations/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: newKeyForm.organizationId,
          name: newKeyForm.name,
          scopes: newKeyForm.scopes,
          permittedLabs: permittedLabsArr.length > 0 ? permittedLabsArr : ["*"],
          expiresInDays: newKeyForm.expiresInDays,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to generate API key");
      }

      // Present key reveal screen
      setNewlyGeneratedKey(json.key);
      setCopiedKey(false);
      showToast("API Key generated successfully!");
      fetchOrganizations();
      fetchStats();
      fetchEvents();
      if (selectedOrgDetail && selectedOrgDetail._id === newKeyForm.organizationId) {
        handleOpenOrgDetail(selectedOrgDetail);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to generate key");
    }
  };

  // Copy API Key to clipboard
  const handleCopyKey = () => {
    if (newlyGeneratedKey) {
      navigator.clipboard.writeText(newlyGeneratedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
      showToast("API Key copied to clipboard");
    }
  };

  // Auth gate
  if (!isHydrated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isUnlocked) {
    return <AdminLockScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ── Background Ambient Lighting ── */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-card border border-primary/40 shadow-xl shadow-primary/10 text-xs font-semibold flex items-center gap-2 text-foreground"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* ── Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                  Institutional Integrations &amp; API Management
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>SaaS Partners, Scoped LTI Embeds &amp; Cryptographic Keys</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    REST API v1 Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-muted/60 hover:bg-accent border border-border/70 text-xs font-bold text-foreground inline-flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowCreateOrgModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-primary/20 hover:opacity-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Partner</span>
            </button>
          </div>
        </div>

        {/* ── Telemetry Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Total Partners */}
          <div className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Partners</span>
              <Building2 className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {stats?.organizations.total ?? organizations.length}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="font-bold text-emerald-500">
                {stats?.organizations.active ?? 0} Active
              </span>
              <span>•</span>
              <span>{stats?.organizations.suspended ?? 0} Suspended</span>
            </div>
          </div>

          {/* Card 2: Active API Keys */}
          <div className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Active Keys</span>
              <Key className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {stats?.keys.active ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span>Hashed via SHA-256</span>
            </div>
          </div>

          {/* Card 3: Monthly Requests */}
          <div className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Requests (30d)</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {(stats?.usage.requests30d ?? 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span>{stats?.usage.requests24h ?? 0} in past 24h</span>
            </div>
          </div>

          {/* Card 4: Rate Limit Breaches */}
          <div className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Rate Limits (429)</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-foreground">
              {stats?.usage.rateLimitViolations30d ?? 0}
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span>Sliding token bucket</span>
            </div>
          </div>

          {/* Card 5: Embed Security Shield */}
          <div className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-xs space-y-1 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Embed Guard</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg font-black text-emerald-500">
              CSP Active
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span>Scoped frame-ancestors</span>
            </div>
          </div>
        </div>

        {/* ── Tabbed Controller ── */}
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "organizations"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partners Directory ({organizations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Operational Audit Trail ({events.length})</span>
          </button>
        </div>

        {/* ── Tab 1: Organizations View ── */}
        {activeTab === "organizations" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/70 border border-border/70 rounded-2xl p-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search partner by name, slug, or contact email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-background border border-border/80 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                  <option value="pending">Pending Only</option>
                </select>

                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-background border border-border/80 text-xs text-foreground focus:outline-hidden"
                >
                  <option value="all">All Plans</option>
                  <option value="pilot">Pilot Plan</option>
                  <option value="institutional">Institutional Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>
            </div>

            {/* Organizations Table / Cards */}
            {loading ? (
              <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading partner organizations...</span>
              </div>
            ) : organizations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-card/60 border border-border/70 space-y-3">
                <Building2 className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div className="text-sm font-bold text-foreground">No partners found</div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search or filters to locate partner records."
                    : "No institutional partners have been registered yet. Get started by clicking 'Register Partner'."}
                </p>
                <button
                  onClick={() => setShowCreateOrgModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-1.5 mt-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register First Partner</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {organizations.map((org) => {
                  const usagePercent = org.stats?.usagePercent ?? 0;
                  const isSuspended = org.status === "suspended";

                  return (
                    <div
                      key={org._id}
                      className={`p-5 rounded-3xl bg-card/80 border transition-all ${
                        isSuspended
                          ? "border-red-500/30 opacity-75"
                          : "border-border/80 hover:border-primary/40 shadow-xs"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Org Identity */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base text-foreground">
                              {org.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-muted text-muted-foreground border border-border">
                              {org.slug}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                org.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                  : org.status === "suspended"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}
                            >
                              {org.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                              {org.plan?.name || "pilot"} plan
                            </span>
                            {org.licenseType && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20 capitalize">
                                {org.licenseType.replace("-", " ")}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span>📧 {org.contactEmail}</span>
                            <span>•</span>
                            <span className="capitalize">Type: {org.type}</span>
                            <span>•</span>
                            <span>
                              Valid until:{" "}
                              <strong className="text-foreground">
                                {new Date(org.validUntil).toLocaleDateString()}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Payment:{" "}
                              <strong className="text-foreground capitalize">
                                {org.billing?.paymentStatus || "trial"}
                              </strong>
                            </span>
                          </div>

                          {/* Allowed Domains */}
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Allowed Embed Origins:</span>
                            {org.allowedOrigins && org.allowedOrigins.length > 0 ? (
                              <span className="font-mono text-foreground">
                                {org.allowedOrigins.join(", ")}
                              </span>
                            ) : (
                              <span className="italic text-amber-500/90">
                                None configured (LMS iframe embeds will fail origin check)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quota & Usage Bar */}
                        <div className="w-full md:w-64 space-y-1.5 bg-muted/30 p-3 rounded-2xl border border-border/60">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground font-semibold">
                              Monthly Consumption
                            </span>
                            <span className="font-bold text-foreground">
                              {(org.stats?.monthlyRequests ?? 0).toLocaleString()} /{" "}
                              {(org.plan?.maxMonthlyRequests ?? 10000).toLocaleString()}
                            </span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                usagePercent > 90
                                  ? "bg-red-500"
                                  : usagePercent > 70
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(100, usagePercent)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{org.plan?.requestsPerMinute ?? 60} RPM limit</span>
                            <span>{org.stats?.activeKeysCount ?? 0} active keys</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-start md:self-center">
                          <button
                            onClick={() => {
                              setSelectedOrgForAction(org);
                              setNewKeyForm((prev) => ({
                                ...prev,
                                organizationId: org._id,
                                name: `${org.name} Integration Key`,
                              }));
                              setShowGenerateKeyModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-bold inline-flex items-center gap-1 transition"
                            title="Generate cryptographic API key"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Add Key</span>
                          </button>

                          <button
                            onClick={() => handleOpenOrgDetail(org)}
                            className="px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-accent border border-border/80 text-xs font-bold text-foreground inline-flex items-center gap-1 transition"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleToggleOrgStatus(org)}
                            className={`p-1.5 rounded-xl border text-xs font-bold transition ${
                              org.status === "active"
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30"
                            }`}
                            title={org.status === "active" ? "Suspend Partner" : "Activate Partner"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Operational Audit Trail ── */}
        {activeTab === "events" && (
          <div className="space-y-3">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Integration Audit Log
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Showing last {events.length} system operations
                </span>
              </div>

              {events.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No integration audit events logged yet.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {events.map((evt) => (
                    <div
                      key={evt._id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">
                            {evt.eventType}
                          </span>
                          {evt.organizationId && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-muted text-foreground font-semibold">
                              {evt.organizationId.name} ({evt.organizationId.slug})
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {JSON.stringify(evt.details || {})}
                        </div>
                      </div>

                      <div className="text-[11px] text-muted-foreground sm:text-right shrink-0">
                        <div>{new Date(evt.timestamp).toLocaleString()}</div>
                        {evt.actorUserId && (
                          <div className="text-[10px] text-muted-foreground">
                            Actor: {evt.actorUserId.name || evt.actorUserId.email}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Modal: Register New Organization ── */}
      <AnimatePresence>
        {showCreateOrgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-card border border-border/80 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Register Partner Organization
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Create institutional account and configure licensing parameters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateOrgModal(false)}
                  className="p-1 rounded-xl text-muted-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOrgSubmit} className="space-y-4 text-xs">
                {/* Name and Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stanford University"
                      value={newOrgForm.name}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Unique Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. stanford-university"
                      value={newOrgForm.slug}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Email and Org Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@institution.edu"
                      value={newOrgForm.contactEmail}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          contactEmail: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Organization Type
                    </label>
                    <select
                      value={newOrgForm.type}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          type: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value="school">K-12 School</option>
                      <option value="university">University / College</option>
                      <option value="company">EdTech Company</option>
                      <option value="partner">SaaS Platform Partner</option>
                    </select>
                  </div>
                </div>

                {/* Plan Tier & License Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Service Plan Tier
                    </label>
                    <select
                      value={newOrgForm.planName}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          planName: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value="pilot">Pilot (10,000 req/mo, 60 RPM)</option>
                      <option value="institutional">Institutional (100,000 req/mo, 300 RPM)</option>
                      <option value="enterprise">Enterprise (1,000,000 req/mo, 1200 RPM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Licensing Agreement
                    </label>
                    <select
                      value={newOrgForm.licenseType}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          licenseType: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value="pilot">Pilot Evaluation</option>
                      <option value="single-institution">Single Institution License</option>
                      <option value="multi-institution">Multi-Institution SaaS License</option>
                      <option value="white-label">White-Label Partner License</option>
                      <option value="custom-enterprise">Custom Enterprise Master Agreement</option>
                    </select>
                  </div>
                </div>

                {/* Allowed LMS Iframe Origins */}
                <div>
                  <label className="block font-semibold mb-1 text-foreground">
                    Allowed LMS Iframe Domains (Comma or newline separated)
                  </label>
                  <input
                    type="text"
                    placeholder="https://canvas.stanford.edu, https://moodle.stanford.edu"
                    value={newOrgForm.allowedOrigins}
                    onChange={(e) =>
                      setNewOrgForm((prev) => ({
                        ...prev,
                        allowedOrigins: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Embedding route (/embed/:labSlug) enforces these origins. Embed requests from other origins will be blocked.
                  </p>
                </div>

                {/* Licensed Labs */}
                <div>
                  <label className="block font-semibold mb-1 text-foreground">
                    Licensed Labs (Use &apos;*&apos; for all or specify comma-separated slugs)
                  </label>
                  <input
                    type="text"
                    placeholder="* or ohms-law, projectile-motion, rna-transcription"
                    value={newOrgForm.licensedLabs}
                    onChange={(e) =>
                      setNewOrgForm((prev) => ({
                        ...prev,
                        licensedLabs: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Validity Period & Billing Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Validity Period
                    </label>
                    <select
                      value={newOrgForm.validMonths}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          validMonths: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value={1}>1 Month (Trial)</option>
                      <option value={3}>3 Months (Quarterly)</option>
                      <option value={6}>6 Months (Semester)</option>
                      <option value={12}>12 Months (Annual)</option>
                      <option value={24}>24 Months (2 Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Payment / Invoicing Status
                    </label>
                    <select
                      value={newOrgForm.paymentStatus}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          paymentStatus: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value="trial">Free Evaluation / Trial</option>
                      <option value="paid">Paid &amp; Invoiced</option>
                      <option value="pending">Invoice Pending Payment</option>
                      <option value="waived">Waived / Non-Profit Grant</option>
                    </select>
                  </div>
                </div>

                {/* Invoice Ref & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Invoice Reference
                    </label>
                    <input
                      type="text"
                      placeholder="INV-2026-0042"
                      value={newOrgForm.invoiceReference}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          invoiceReference: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Internal Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Pilot rollout for Physics Dept."
                      value={newOrgForm.notes}
                      onChange={(e) =>
                        setNewOrgForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70">
                  <button
                    type="button"
                    onClick={() => setShowCreateOrgModal(false)}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 hover:opacity-95"
                  >
                    Register Organization
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Generate API Key ── */}
      <AnimatePresence>
        {showGenerateKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Generate API Key
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Create cryptographically secure credentials for REST API &amp; Embeds
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowGenerateKeyModal(false);
                    setNewlyGeneratedKey(null);
                  }}
                  className="p-1 rounded-xl text-muted-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reveal newly generated key if present */}
              {newlyGeneratedKey ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>One-Time Cryptographic Key Reveal</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-foreground">
                      OpenLabs only stores a <strong>SHA-256 hash</strong> of this key. For security, this secret token will <strong>never be shown again</strong>. Please copy and store it securely right now.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      API Secret Token:
                    </label>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border font-mono text-xs text-primary break-all">
                      <span className="flex-1 select-all">{newlyGeneratedKey}</span>
                      <button
                        onClick={handleCopyKey}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setShowGenerateKeyModal(false);
                        setNewlyGeneratedKey(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                    >
                      I Have Stored the Key Safely
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGenerateKeySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Target Organization *
                    </label>
                    <select
                      required
                      value={newKeyForm.organizationId}
                      onChange={(e) =>
                        setNewKeyForm((prev) => ({
                          ...prev,
                          organizationId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value="">Select Partner Organization...</option>
                      {organizations.map((o) => (
                        <option key={o._id} value={o._id}>
                          {o.name} ({o.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Key Name / Purpose *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Production LMS Connector"
                      value={newKeyForm.name}
                      onChange={(e) =>
                        setNewKeyForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      API Scopes
                    </label>
                    <div className="space-y-2 bg-muted/40 p-3 rounded-xl border border-border/60">
                      {[
                        { id: "labs:read", desc: "List and inspect labs catalog" },
                        { id: "embed:create", desc: "Authorize short-lived iframe embeds" },
                        { id: "usage:read", desc: "Read monthly quota consumption" },
                        { id: "subjects:read", desc: "List licensed subject disciplines" },
                      ].map((sc) => (
                        <label
                          key={sc.id}
                          className="flex items-center gap-2 cursor-pointer text-foreground"
                        >
                          <input
                            type="checkbox"
                            checked={newKeyForm.scopes.includes(sc.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewKeyForm((prev) => ({
                                ...prev,
                                scopes: checked
                                  ? [...prev.scopes, sc.id]
                                  : prev.scopes.filter((s) => s !== sc.id),
                              }));
                            }}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="font-mono text-[11px] font-semibold">
                            {sc.id}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            — {sc.desc}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Permitted Labs Wildcard
                    </label>
                    <input
                      type="text"
                      placeholder="* or physics/*, ohms-law"
                      value={newKeyForm.permittedLabs}
                      onChange={(e) =>
                        setNewKeyForm((prev) => ({
                          ...prev,
                          permittedLabs: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-foreground">
                      Key Expiration
                    </label>
                    <select
                      value={newKeyForm.expiresInDays}
                      onChange={(e) =>
                        setNewKeyForm((prev) => ({
                          ...prev,
                          expiresInDays: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-hidden"
                    >
                      <option value={30}>30 Days</option>
                      <option value={90}>90 Days</option>
                      <option value={180}>180 Days (Half Year)</option>
                      <option value={365}>365 Days (1 Year)</option>
                      <option value={0}>No Expiration (Indefinite)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/70">
                    <button
                      type="button"
                      onClick={() => setShowGenerateKeyModal(false)}
                      className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20"
                    >
                      Generate Secret Key
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Drawer / Modal: Organization Details & Keys ── */}
      <AnimatePresence>
        {showOrgDetailDrawer && selectedOrgDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-card border border-border/80 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedOrgDetail.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted text-muted-foreground border border-border">
                      {selectedOrgDetail.slug}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Partner configuration, active API credentials, and billing terms
                  </p>
                </div>

                <button
                  onClick={() => setShowOrgDetailDrawer(false)}
                  className="p-1 rounded-xl text-muted-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Details Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground">Status</span>
                  <div className="font-bold text-foreground uppercase pt-1">
                    {selectedOrgDetail.status}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground">Plan Tier</span>
                  <div className="font-bold text-primary capitalize pt-1">
                    {selectedOrgDetail.plan?.name || "pilot"}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground">Payment Status</span>
                  <div className="font-bold text-foreground capitalize pt-1">
                    {selectedOrgDetail.billing?.paymentStatus || "trial"}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground">Valid Until</span>
                  <div className="font-bold text-foreground pt-1">
                    {new Date(selectedOrgDetail.validUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Allowed Origins List */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-foreground">
                  Allowed Embed Domains:
                </span>
                <div className="p-3 rounded-2xl bg-background border border-border font-mono text-[11px]">
                  {selectedOrgDetail.allowedOrigins?.length ? (
                    selectedOrgDetail.allowedOrigins.join("\n")
                  ) : (
                    <span className="text-amber-500 italic">
                      None configured. Iframe embed requests will fail security validation.
                    </span>
                  )}
                </div>
              </div>

              {/* API Keys for this Org */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-foreground">
                      API Credentials ({orgDetailKeys.length})
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setNewKeyForm((prev) => ({
                        ...prev,
                        organizationId: selectedOrgDetail._id,
                        name: `${selectedOrgDetail.name} Connector Key`,
                      }));
                      setShowGenerateKeyModal(true);
                    }}
                    className="px-3 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Generate New Key</span>
                  </button>
                </div>

                {orgDetailKeys.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground rounded-2xl bg-muted/20 border border-border/60">
                    No API keys have been generated for this organization yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orgDetailKeys.map((k) => (
                      <div
                        key={k._id}
                        className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          k.status === "revoked"
                            ? "bg-red-500/5 border-red-500/20 opacity-75"
                            : "bg-muted/30 border-border/70"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{k.name}</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              {k.keyPrefix}••••••
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                                k.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {k.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                            <span>Scopes: {k.scopes.join(", ")}</span>
                            <span>•</span>
                            <span>Requests: {k.requestCount}</span>
                            <span>•</span>
                            <span>
                              Created: {new Date(k.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleKeyStatus(k)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                              k.status === "active"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            {k.status === "active" ? "Revoke" : "Restore"}
                          </button>

                          <button
                            onClick={() => handleDeleteKey(k)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                            title="Delete Key Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-border/70">
                <button
                  onClick={() => setShowOrgDetailDrawer(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

