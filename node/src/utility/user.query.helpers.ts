import { TUserPreview, role, gender } from "../models/user.model";

class UserQueryHelper {
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
}

export default UserQueryHelper;
