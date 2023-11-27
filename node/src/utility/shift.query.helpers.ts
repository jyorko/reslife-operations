import Shift from "../models/shift.model";
import { TShiftPreview } from "../models/shift.model";
import { Types } from "mongoose";

class ShiftQueryHelper {
  public static getPreviewFields(): string {
    const previewObj = {
      _id: "",
      userID: new Types.ObjectId(),
      startTime: new Date(),
      endTime: new Date(),
      active: false,
    } as TShiftPreview;
    const previewFields = Object.keys(previewObj);
    return previewFields.join(" ");
  }
}

export default ShiftQueryHelper;
