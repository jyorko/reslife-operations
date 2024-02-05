import { Schema, Document, model, Types } from "mongoose";

export enum role {
  student_staff = "student_staff",
  administrator = "administrator",
}

export enum gender {
  male = "male",
  female = "female",
  other = "other",
}

export type TUser = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  role: role;
  gender: gender;
  phone?: string;
  shifts: Types.ObjectId[];
  tasksCompleted: number;
};

export interface IUser extends TUser, Document {}
export type TUserPreview = Pick<IUser, "_id" | "firstName" | "lastName" | "fullName" | "email" | "role" | "gender" | "phone" | "shifts" | "tasksCompleted">;

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  gender: {
    type: String,
    enum: Object.values(gender),
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(role),
    required: true,
  },
  phone: { type: String },
  shifts: [{ type: Types.ObjectId, ref: "Shift" }],
  tasksCompleted: { type: Number, default: 0 },
});

export default model<IUser>("User", UserSchema);
