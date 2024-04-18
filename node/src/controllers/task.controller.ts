import express, { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { query, body, validationResult } from "express-validator";
import Task from "../models/task.model";
import TaskQueryHelper from "../utility/task.query.helpers";
import UserQueryHelper from "../utility/user.query.helpers";
import User from "../models/user.model";

class TaskController {
  public path = "/";
  public router = express.Router();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/tasks", this.validateRequest("tasks"), this.fetchTasks);
    this.router.post("/task-create", this.validateRequest("createTask"), this.createTask);
  }

  async fetchTasks(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const ownOnly = req.query.ownOnly === "true";
      const { taskID, userID, period_from, period_to, status, location } = req.query;

      const query: Record<string, any> = {};
      TaskQueryHelper.appendIDFilter(taskID as string, query);
      TaskQueryHelper.appendUserIDFilter(ownOnly ? req.body.user["custom:mongoID"] : (userID as string), query);
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

  async createTask(req: Request, res: Response) {
    try {
      const { title, description, location, assignedTo } = req.body;
      const randomUser = await User.findOne();
      // We should use the user ID from the token

      const task = new Task({
        title,
        description,
        location,
        assignedTo,
        createdBy: randomUser._id,
      });
      await task.save();
      res.status(201).send({
        message: "Task created successfully",
        displayMessage: true,
        task,
      });
    } catch (error) {
      if (error instanceof TaskError) {
        return res.status(error.code).send({ message: error.message });
      }
      console.error(error);
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
      case "createTask":
        validations.push(
          body("title").exists().withMessage("Title is required").isString().withMessage("Invalid title").notEmpty().withMessage("Title cannot be empty")
        );
        validations.push(body("description").optional().isString().withMessage("Invalid description").notEmpty().withMessage("Description cannot be empty"));
        validations.push(
          body("location")
            .exists()
            .withMessage("Location is required")
            .isString()
            .withMessage("Invalid location")
            .notEmpty()
            .withMessage("Location cannot be empty")
        );
        validations.push(
          body("assignedTo")
            .exists()
            .withMessage("Assigned to is required")
            .isArray({ min: 1 })
            .withMessage("At least one staff is required")
            .custom((value) => {
              if (value.length > 10) {
                throw new Error("Maximum of 10 staff can be assigned to a task");
              }
              return true;
            })
            .custom((value) => {
              for (const id of value) {
                if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                  throw new Error("Invalid staff ID");
                }
              }
              return true;
            })
        );
        break;
    }
    return [
      ...validations,
      (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          return res.status(422).send({ errors: result.array(), message: result.array()[0].msg });
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
