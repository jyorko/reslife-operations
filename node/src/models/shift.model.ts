import { Schema, Document, model, Types } from "mongoose";

export type TShift = {
  userID: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  active: boolean;
};

export interface IShift extends TShift, Document {}
export type TShiftPreview = Pick<IShift, "_id" | "userID" | "startTime" | "endTime" | "active">;

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
  },
});

export default model<IShift>("Shift", ShiftSchema);
