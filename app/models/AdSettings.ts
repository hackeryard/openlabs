import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdNetworks {
  googleAdSense: boolean;
  adsterraPopunder: boolean;
  adsterraBanners: boolean;
}

export interface IAdSettings extends Document {
  key: string;
  globalAdsEnabled: boolean;
  snoozeUntil: Date | null;
  snoozeReason: string;
  networks: IAdNetworks;
  lastUpdatedBy: string;
  updatedAt: Date;
}

export interface EffectiveAdSettings {
  allowed: boolean;
  globalAdsEnabled: boolean;
  isSnoozed: boolean;
  snoozeUntil: string | null;
  snoozeReason: string;
  remainingMs: number;
  networks: IAdNetworks;
  lastUpdatedBy: string;
  updatedAt: string;
}

interface IAdSettingsModel extends Model<IAdSettings> {
  getEffectiveSettings(): Promise<EffectiveAdSettings>;
}

const AdNetworksSchema = new Schema<IAdNetworks>(
  {
    googleAdSense: { type: Boolean, default: true },
    adsterraPopunder: { type: Boolean, default: true },
    adsterraBanners: { type: Boolean, default: true },
  },
  { _id: false }
);

const AdSettingsSchema = new Schema<IAdSettings, IAdSettingsModel>(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      index: true,
    },
    globalAdsEnabled: {
      type: Boolean,
      default: true,
    },
    snoozeUntil: {
      type: Date,
      default: null,
    },
    snoozeReason: {
      type: String,
      default: "",
      trim: true,
    },
    networks: {
      type: AdNetworksSchema,
      default: () => ({
        googleAdSense: true,
        adsterraPopunder: true,
        adsterraBanners: true,
      }),
    },
    lastUpdatedBy: {
      type: String,
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

AdSettingsSchema.statics.getEffectiveSettings = async function (): Promise<EffectiveAdSettings> {
  let doc = await this.findOne({ key: "default" }).lean();
  if (!doc) {
    try {
      doc = await this.create({ key: "default" });
    } catch {
      // In case of race condition
      doc = await this.findOne({ key: "default" }).lean();
    }
  }

  const now = new Date();
  const snoozeDate = doc?.snoozeUntil ? new Date(doc.snoozeUntil) : null;
  const isSnoozed = Boolean(snoozeDate && snoozeDate.getTime() > now.getTime());
  const remainingMs = isSnoozed && snoozeDate ? Math.max(0, snoozeDate.getTime() - now.getTime()) : 0;
  const globalEnabled = doc?.globalAdsEnabled ?? true;
  const isAllowed = globalEnabled && !isSnoozed;

  const rawNetworks: IAdNetworks = {
    googleAdSense: doc?.networks?.googleAdSense ?? true,
    adsterraPopunder: doc?.networks?.adsterraPopunder ?? true,
    adsterraBanners: doc?.networks?.adsterraBanners ?? true,
  };

  return {
    allowed: isAllowed,
    globalAdsEnabled: globalEnabled,
    isSnoozed,
    snoozeUntil: isSnoozed && snoozeDate ? snoozeDate.toISOString() : null,
    snoozeReason: doc?.snoozeReason || "",
    remainingMs,
    networks: {
      googleAdSense: isAllowed && rawNetworks.googleAdSense,
      adsterraPopunder: isAllowed && rawNetworks.adsterraPopunder,
      adsterraBanners: isAllowed && rawNetworks.adsterraBanners,
    },
    lastUpdatedBy: doc?.lastUpdatedBy || "system",
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  };
};

const AdSettings: IAdSettingsModel =
  (mongoose.models.AdSettings as IAdSettingsModel) ||
  mongoose.model<IAdSettings, IAdSettingsModel>("AdSettings", AdSettingsSchema);

export default AdSettings;
