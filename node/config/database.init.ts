import User, { IUser, role } from "../src/models/user.model";
import Shift, { IShift } from "../src/models/shift.model";
import studentStaff from "./initial_data/student.staff";

function parseHours(hours: string): { startTime: Date; endTime: Date } {
  const [start, end] = hours.split(" - ").map((time) => `2023-11-27T${time}:00Z`);
  return { startTime: new Date(start), endTime: new Date(end) };
}

// Initialization function
export async function InitializeDatabase() {
  // count number of users in database
  const numUsers = await User.countDocuments();
  // if there are users in the database, do not initialize
  if (numUsers > 0) {
    return;
  }

  // First, create and store all users
  const users = await Promise.all(
    studentStaff.map(async (staff) => {
      const user = new User({
        firstName: staff.firstName,
        lastName: staff.lastName,
        fullName: `${staff.firstName} ${staff.lastName}`,
        gender: staff.gender,
        email: `${staff.firstName.toLowerCase()}@example.com`,
        password: "password",
        role: role.student_staff,
        phone: staff.phone,
        tasksCompleted: staff.tasksCompleted,
      });

      return user.save();
    })
  );

  // Then, create shifts referencing the users
  for (let i = 0; i < studentStaff.length; i++) {
    const { startTime, endTime } = parseHours(studentStaff[i].hoursOnShift);
    const shift = new Shift({
      userID: users[i]._id,
      startTime: startTime,
      endTime: endTime,
      active: true, // or based on your logic
    });

    await shift.save();

    // Finally, update the user to reference the shift
    users[i].shifts.push(shift._id);
    await users[i].save();
  }
}
