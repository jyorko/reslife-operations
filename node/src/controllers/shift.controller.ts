import express, { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { query, validationResult } from "express-validator";
import User from "../models/user.model";
import Shift from "../models/shift.model";
import ShiftQueryHelper from "../utility/shift.query.helpers";
import UserQueryHelper from "../utility/user.query.helpers";

class ShiftController {
  public path = "/";
  public router = express.Router();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/shifts", this.validateRequest("shifts"), this.fetchShifts);
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

class ShiftError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "ShiftError";
  }
}

export default ShiftController;
