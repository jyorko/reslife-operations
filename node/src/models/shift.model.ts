import { Schema, Document, model, Types } from "mongoose";
import User from "./user.model";

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

// before saving the shift, make sure that shift is pushed to the user's shifts array
ShiftSchema.pre<IShift>("save", async function () {
  const user = await User.findById(this.userID);
  if (!user) {
    throw new Error("User does not exist");
  }
  user.shifts.push(this._id);
  await user.save();
});

export default model<IShift>("Shift", ShiftSchema);
