import { TTaskPreview, status } from "../models/task.model";
import { Types } from "mongoose";

class TaskQueryHelper {
  public static appendUserIDFilter(userID: string, query: Record<string, any>) {
    if (userID) {
      query.assignedTo = userID;
    }
  }

  public static appendStatusFilter(query: Record<string, any>, status: string) {
    if (status) {
      query.status = status;
    }
  }

  public static appendLocationFilter(query: Record<string, any>, location: string) {
    if (location) {
      query.location = location;
    }
  }

  public static getPreviewFields(): string {
    const previewObj = {
      _id: "",
      title: "",
      description: "",
      location: "",
      status: status.pending,
      assignedTo: [new Types.ObjectId()],
      createdBy: new Types.ObjectId(),
      toolsRequired: [""],
      comments: [new Types.ObjectId()],
      dateCreated: new Date(),
      dateCompleted: new Date(),
    } as TTaskPreview;
    const previewFields = Object.keys(previewObj);
    return previewFields.join(" ");
  }
}

export default TaskQueryHelper;
