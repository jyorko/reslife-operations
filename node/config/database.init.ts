import User, { gender, IUser, role } from "../src/models/user.model";
import Shift, { IShift } from "../src/models/shift.model";
import Task, { ITask } from "../src/models/task.model";
import studentStaff from "./initial_data/student.staff";
import tasks from "./initial_data/tasks";
import CognitoService from "../src/services/cognito.service";

function parseHours(hours: string): { startTime: Date; endTime: Date } {
  const [start, end] = hours.split(" - ").map((time) => `2023-11-27T${time}:00Z`);
  return { startTime: new Date(start), endTime: new Date(end) };
}

// Initialization function
export async function InitializeDatabase() {
  await initializeSuperAdmin();
  // await initializeUsersAndShifts();
  // await initializeTasks();
  console.log("Database initialized");
}

async function initializeSuperAdmin() {
  // if user does NOT exist, create super admin (set email to process.env.COGNITO_INIT_EMAIL)
  const user = await User.findOne({ email: process.env.COGNITO_INIT_EMAIL });
  if (!user) {
    const cognito = new CognitoService();

    const superAdmin = new User({
      firstName: "System",
      lastName: " ",
      fullName: "System ",
      gender: gender.other,
      email: process.env.COGNITO_INIT_EMAIL,
      role: role.administrator,
      active: true,
      tasksCompleted: 0,
    });

    const userAttributes = [
      { Name: "name", Value: superAdmin.fullName },
      { Name: "custom:mongoID", Value: superAdmin._id.toString() },
    ];

    await cognito.signUpInitialUser(process.env.COGNITO_INIT_EMAIL, process.env.COGNITO_INIT_PASSWORD, userAttributes);

    await superAdmin.save();
  }
}

// async function initializeUsersAndShifts() {
//   // count number of users in database
//   const numUsers = await User.countDocuments();
//   // if there are users in the database, do not initialize
//   if (numUsers > 0) {
//     return;
//   }

//   // First, create and store all users
//   const users = await Promise.all(
//     studentStaff.map(async (staff) => {
//       const user = new User({
//         firstName: staff.firstName,
//         lastName: staff.lastName,
//         fullName: `${staff.firstName} ${staff.lastName}`,
//         gender: staff.gender,
//         email: `${staff.firstName.toLowerCase()}@example.com`,
//         password: "password",
//         role: role.student_staff,
//         phone: staff.phone,
//         tasksCompleted: staff.tasksCompleted,
//       });

//       return user.save();
//     })
//   );

//   // Then, create shifts referencing the users
//   for (let i = 0; i < studentStaff.length; i++) {
//     const { startTime, endTime } = parseHours(studentStaff[i].hoursOnShift);
//     const shift = new Shift({
//       userID: users[i]._id,
//       startTime: startTime,
//       endTime: endTime,
//       active: true, // or based on your logic
//     });

//     await shift.save();

//     // Finally, update the user to reference the shift
//     users[i].shifts.push(shift._id);
//     await users[i].save();
//   }
// }

// async function initializeTasks() {
//   const numTasks = await Task.countDocuments();
//   if (numTasks > 0) {
//     return;
//   }

//   // Fetch all users (we need to link tasks to users)

//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("No users found in the database");
//   }

//   const savedTasks = await Promise.all(
//     tasks.map(async (task) => {
//       const user = users[Math.floor(Math.random() * users.length)];
//       const newTask = new Task({
//         title: task.title,
//         description: task.description,
//         location: task.location,
//         status: task.status,
//         assignedTo: [user._id],
//         createdBy: users[0]._id,
//         toolsRequired: task.toolsRequired,
//         dateCreated: task.dateCreated,
//       });

//       return newTask.save();
//     })
//   );
// }
