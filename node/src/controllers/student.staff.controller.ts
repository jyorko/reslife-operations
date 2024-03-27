import express, { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { query, validationResult } from "express-validator";
import User, { role } from "../models/user.model";
import UserQueryHelper from "../utility/user.query.helpers";
import ShiftQueryHelper from "../utility/shift.query.helpers";

class StudentStaffController {
  public path = "/";
  public router = express.Router();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    // this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/student_staff", this.validateRequest("student_staff"), this.fetchStudentStaff);
  }

  async fetchStudentStaff(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const studentStaffOnly = req.query.studentStaffOnly === "true";

      const { name, gender, phone } = req.query;

      const query: Record<string, any> = {};
      UserQueryHelper.appendNameFilter(name as string, query);
      UserQueryHelper.appendGenderFilter(gender as string, query);
      UserQueryHelper.appendPhoneFilter(phone as string, query);
      UserQueryHelper.appendRoleFilter(studentStaffOnly ? role.student_staff : "", query);

      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const Staff = await User.find(query)
        .select(UserQueryHelper.getPreviewFields())
        .populate({
          path: "shifts",
          select: ShiftQueryHelper.getPreviewFields(),
        })
        .skip(startIndex)
        .limit(limit)
        .exec();
      const total = await User.countDocuments(query, {
        maxTimeMS: 10000,
        limit: 300,
      }).exec();

      const results = {
        results: Staff,
        page: page,
        pages: Math.ceil(total / limit),
      };
      res.status(200).send(results);
    } catch (error) {
      if (error instanceof StudentStaffError) {
        return res.status(error.code).send({ message: error.message });
      }
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }

  private validateRequest(type: string) {
    const validations = [];

    switch (type) {
      case "student_staff":
        validations.push(query("page").exists().withMessage("Page is required"));
        validations.push(query("name").optional({ values: "falsy" }).isString().withMessage("Name must be a string"));
        validations.push(query("gender").optional({ values: "falsy" }).isIn(["male", "female"]).withMessage("Gender must be either male or female"));
        validations.push(query("phone").optional({ values: "falsy" }).isString().withMessage("Phone must be a string"));
        break;
    }

    return [
      ...validations,
      (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          return res.status(422).send({ errors: result.array() });
        }
        next();
      },
    ];
  }
}

class StudentStaffError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "StudentStaffError";
  }
}

export default StudentStaffController;
