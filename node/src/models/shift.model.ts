import { Schema, Document, model, Types } from "mongoose";

export type TShift = {
  userID: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  active: boolean;
  duplicateOf?: Types.ObjectId;
  recurring?: boolean;
  recurringEndDate?: Date;
};

export interface IShift extends TShift, Document {}
export type TShiftPreview = Pick<IShift, "_id" | "userID" | "startTime" | "endTime" | "active" | "duplicateOf" | "recurring" | "recurringEndDate">;

const ShiftSchema = new Schema<IShift>({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  duplicateOf: {
    type: Schema.Types.ObjectId,
    ref: "Shift",
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  recurringEndDate: {
    type: Date,
  },
});

export default model<IShift>("Shift", ShiftSchema);
