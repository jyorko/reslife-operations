import { TUserPreview, role, gender } from "../models/user.model";
import ShiftQueryHelper from "./shift.query.helpers";

class UserQueryHelper {
  public static appendIDFilter(id: string, query: Record<string, any>) {
    if (id) {
      query._id = id;
    }
  }

  public static appendIDsFilter(ids: string[], query: Record<string, any>) {
    if (ids && ids.length) {
      query._id = { $in: ids };
    }
  }

  public static appendNameFilter(name: string, query: Record<string, any>) {
    if (name) {
      // if name can be split into first and last name, search by both
      const nameParts = name.split(" ");
      if (nameParts.length > 1) {
        query.fullName = name;
      } else {
        // if name can't be split, search by first name, last name and full name
        if (name.length > 2) {
          const nameRegex = new RegExp(name, "i");
          query.$or = [{ firstName: { $regex: nameRegex } }, { lastName: { $regex: nameRegex } }, { fullName: { $regex: nameRegex } }];
        }
      }
    }
  }

  public static appendGenderFilter(gender: string, query: Record<string, any>) {
    if (gender) {
      query.gender = gender;
    }
  }

  public static appendRoleFilter(role: string, query: Record<string, any>) {
    if (role) {
      query.role = role;
    }
  }

  public static appendPhoneFilter(phone: string, query: Record<string, any>) {
    if (phone) {
      phone = phone.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const phoneRegex = new RegExp(phone, "i");
      query.phone = { $regex: phoneRegex };
    }
  }

  public static getPreviewFields(): string {
    const previewObj = {
      _id: "",
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      role: role.student_staff,
      phone: "",
      gender: gender.other,
      shifts: [],
      tasksCompleted: 0,
      active: false,
    } as TUserPreview;
    const previewFields = Object.keys(previewObj);
    return previewFields.join(" ");
  }

  public static getTodaysShiftsPopulate() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return {
      path: "shifts",
      select: ShiftQueryHelper.getPreviewFields(),
      match: {
        startTime: { $gte: startOfToday, $lte: endOfToday },
      },
    };
  }
}

export default UserQueryHelper;
