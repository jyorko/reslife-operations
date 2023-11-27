import express, { Request, Response } from "express";

class HomeController {
  public path = "/";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(this.path, this.home);
  }

  home(req: Request, res: Response) {
    res.status(200).send({ message: "Hello" });
  }
}

export default HomeController;
