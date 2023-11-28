import Shift from "../models/shift.model";
import { TShiftPreview } from "../models/shift.model";
import { Types } from "mongoose";

class ShiftQueryHelper {
  public static appendUserIDFilter(userID: string, query: Record<string, any>) {
    if (userID) {
      query.userID = userID;
    }
  }

  public static appendPeriodFilter(period_from: string, period_to: string, query: Record<string, any>) {
    if (period_from && period_to) {
      query.$and = [
        {
          $or: [
            {
              startTime: {
                $gte: new Date(period_from),
                $lte: new Date(period_to),
              },
            },
            {
              endTime: {
                $gte: new Date(period_from),
                $lte: new Date(period_to),
              },
            },
          ],
        },
      ];
    }
  }

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
