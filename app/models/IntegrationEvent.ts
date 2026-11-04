import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIntegrationEvent extends Document {
  organizationId: mongoose.Types.ObjectId;
  eventType: string;
  details: any;
  actorUserId?: mongoose.Types.ObjectId;
  timestamp: Date;
}

const IntegrationEventSchema = new Schema<IIntegrationEvent>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    eventType: { type: String, required: true, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

const IntegrationEvent: Model<IIntegrationEvent> =
  mongoose.models.IntegrationEvent ||
  mongoose.model<IIntegrationEvent>("IntegrationEvent", IntegrationEventSchema);

export default IntegrationEvent;

