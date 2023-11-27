import "dotenv/config";
import express from "express";
import Database from "../config/database";
import { InitializeDatabase } from "../config/database.init";
import { Application } from "express";
import cors from "cors";

class App {
  public app: Application;
  public port: number;
  public database: Database;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;
    this.database = new Database();

    if (process.env.NODE_ENV === "development") {
      this.app.use(
        cors({
          credentials: true,
          origin: true,
        })
      );
    }

    if (process.env.NODE_ENV === "development") {
      this.database.connect().then(() => {
        InitializeDatabase();
      });
    } else {
      this.database.connect();
    }

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private middlewares(middlewares: any) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private routes(controllers: any) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }
}

export default App;
