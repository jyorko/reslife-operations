import express, { Request, Response } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";

class ProtectedController {
  public path = "/";
  public router = express.Router();
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(this.authMiddleware.verifyToken);
    this.router.get("/protected", this.home);
  }

  home(req: Request, res: Response) {
    res.status(200).send({ message: "On protected route" });
  }
}

export default ProtectedController;
