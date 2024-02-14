import { Schema, Document, model, Types } from "mongoose";

export enum status {
  pending = "pending",
  in_progress = "in progress",
  completed = "completed",
  unable_to_complete = "unable to complete",
}

export type TTask = {
  title: string;
  description: string;
  location: string;
  status: string;
  assignedTo: Types.ObjectId[];
  createdBy: Types.ObjectId;
  toolsRequired?: string[];
  comments?: Types.ObjectId[]; // Reference to Comment model (if you have one)
  dateCreated?: Date;
  dateCompleted?: Date;
};

export interface ITask extends TTask, Document {}
export type TTaskPreview = Pick<
  ITask,
  "_id" | "title" | "description" | "location" | "status" | "assignedTo" | "createdBy" | "toolsRequired" | "comments" | "dateCreated" | "dateCompleted"
>;

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(status),
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toolsRequired: [String],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export default model<ITask>("Task", TaskSchema);
