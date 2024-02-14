import express, { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { query, validationResult } from "express-validator";
import Task from "../models/task.model";
import TaskQueryHelper from "../utility/task.query.helpers";
import UserQueryHelper from "../utility/user.query.helpers";

class TaskController {
  public path = "/";
  public router = express.Router();
  // private authMiddleware: AuthMiddleware;

  constructor() {
    // this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    // this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/tasks", this.validateRequest("tasks"), this.fetchTasks);
  }

  async fetchTasks(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const { userID, period_from, period_to, status, location } = req.query;

      const query: Record<string, any> = {};
      TaskQueryHelper.appendUserIDFilter(userID as string, query);
      // TaskQueryHelper.appendCreationPeriodFilter(period_from as string, period_to as string, query);
      TaskQueryHelper.appendStatusFilter(query, status as string);
      TaskQueryHelper.appendLocationFilter(query, location as string);

      const limit = 20;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const tasks = await Task.find(query)
        .select(TaskQueryHelper.getPreviewFields())
        .populate([
          {
            path: "assignedTo",
            select: UserQueryHelper.getPreviewFields(),
          },
          {
            path: "createdBy",
            select: UserQueryHelper.getPreviewFields(),
          },
        ])
        .skip(startIndex)
        .limit(limit)
        .exec();

      const total = await Task.countDocuments(query, {
        maxTimeMS: 10000,
        limit: 300,
      }).exec();

      const results = {
        results: tasks,
        page: page,
        pages: Math.ceil(total / limit),
      };
      res.status(200).send(results);
    } catch (error) {
      if (error instanceof TaskError) {
        return res.status(error.code).send({ message: error.message });
      }
      res.status(500).send({ message: "Internal server error" });
    }
  }

  private validateRequest(type: string) {
    const validations = [];
    switch (type) {
      case "tasks":
        validations.push(query("page").exists().withMessage("Page is required"));
        validations.push(query("userID").optional().isMongoId().withMessage("Invalid user ID"));
        validations.push(
          query("period_from")
            .optional()
            .isDate()
            .withMessage("Invalid date format")
            .custom((value, { req }) => {
              if (req.query.period_to) {
                const periodFrom = new Date(value);
                const periodTo = new Date(req.query.period_to);
                const difference = periodTo.getTime() - periodFrom.getTime();
                if (difference > 5184000000) {
                  throw new Error("Difference between period from and to should be less than 60 days");
                }
              }
              return true;
            })
        );
        validations.push(
          query("period_to")
            .optional()
            .isDate()
            .withMessage("Invalid date format")
            .custom((value, { req }) => {
              if (req.query.period_from) {
                const periodFrom = new Date(req.query.period_from);
                const periodTo = new Date(value);
                const difference = periodTo.getTime() - periodFrom.getTime();
                if (difference > 5184000000) {
                  throw new Error("Difference between period from and to should be less than 60 days");
                }
              }
              return true;
            })
        );
        validations.push(query("status").optional().isString().withMessage("Invalid status"));
        validations.push(query("location").optional().isString().withMessage("Invalid location"));
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

class TaskError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "TaskError";
  }
}

export default TaskController;
