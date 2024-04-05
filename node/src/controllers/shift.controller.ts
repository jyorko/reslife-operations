import express, { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { query, body, validationResult } from "express-validator";
import User from "../models/user.model";
import Shift from "../models/shift.model";
import ShiftQueryHelper from "../utility/shift.query.helpers";
import UserQueryHelper from "../utility/user.query.helpers";
import moment from "moment";

class ShiftController {
  public path = "/";
  public router = express.Router();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    // this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/shifts", this.validateRequest("shifts"), this.fetchShifts);
    this.router.post("/shift-create", this.validateRequest("createShift"), this.createShift);
  }

  async fetchShifts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const { userID, period_from, period_to } = req.query;

      const query: Record<string, any> = {};
      ShiftQueryHelper.appendUserIDFilter(userID as string, query);
      ShiftQueryHelper.appendPeriodFilter(period_from as string, period_to as string, query);

      const limit = 500;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const shifts = await Shift.find(query)
        .select(ShiftQueryHelper.getPreviewFields())
        .populate({
          path: "userID",
          select: UserQueryHelper.getPreviewFields(),
        })
        .skip(startIndex)
        .limit(limit)
        .exec();

      const total = await Shift.countDocuments(query, {
        maxTimeMS: 10000,
        limit: 300,
      }).exec();

      const results = {
        results: shifts,
        page: page,
        pages: Math.ceil(total / limit),
      };
      res.status(200).send(results);
    } catch (error) {
      if (error instanceof ShiftError) {
        return res.status(error.code).send({ message: error.message });
      }
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  async createShift(req: Request, res: Response) {
    try {
      // if shift has recurring true, create multiple shifts up until recurringEndDate
      const { date, recurring, recurringEndDate, assignedTo } = req.body;
      let { startTime, endTime } = req.body;

      // iterate through assignedTo array
      for (const userID of assignedTo) {
        const shift = new Shift({
          recurring,
          recurringEndDate,
          startTime,
          endTime,
          userID,
        });
        await shift.save();

        if (recurring) {
          let currentDate = moment(date);
          const endDate = moment(recurringEndDate);
          while (currentDate.isBefore(endDate)) {
            currentDate = currentDate.add(7, "day");
            startTime = moment(startTime).add(7, "day").toISOString();
            endTime = moment(endTime).add(7, "day").toISOString();

            const newShift = new Shift({
              recurring,
              recurringEndDate,
              startTime,
              endTime,
              userID,
              duplicateOf: shift._id,
            });
            await newShift.save();
          }
        }
      }
      res.status(201).send({ message: "Shift(s) created successfully", displayMessage: true });
    } catch (error) {
      if (error instanceof ShiftError) {
        return res.status(error.code).send({ message: error.message });
      }
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }

  private validateRequest(type: string) {
    const validations = [];

    switch (type) {
      case "shifts":
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
        break;
      case "createShift":
        // date must be entered, must be date format
        validations.push(body("date").exists().isISO8601().withMessage("Invalid date format").notEmpty().withMessage("Date is required"));
        // recurring is optional, must be boolean
        validations.push(body("recurring").optional().isBoolean().withMessage("Invalid recurring value"));
        // recurringEndDate MUST be present only IF recurring is true, must be date format. Must be in the future
        validations.push(
          body("recurringEndDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format")
            .custom((value, { req }) => {
              if (req.body.recurring) {
                if (new Date(value) < new Date()) {
                  throw new Error("Recurring end date must be in the future");
                }
              }
              return true;
            })
        );
        // startTime must be entered, must be date format
        validations.push(body("startTime").exists().isISO8601().withMessage("Invalid date format").notEmpty().withMessage("Start time is required"));
        // endTime must be entered, must be date format. Must be after startTime
        validations.push(
          body("endTime")
            .exists()
            .isISO8601()
            .withMessage("Invalid date format")
            .custom((value, { req }) => {
              if (new Date(value) < new Date(req.body.startTime)) {
                throw new Error("End time must be after start time");
              }
              return true;
            })
        );
        // assignedTo must be entered, must be array of user IDs
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

class ShiftError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "ShiftError";
  }
}

export default ShiftController;
