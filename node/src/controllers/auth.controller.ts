import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import CognitoService from "../services/cognito.service";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

class AuthController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/signup", this.validateBody("signup"), this.signUp);
    this.router.post("/signin", this.validateBody("signin"), this.signIn);
    this.router.post("/verify", this.validateBody("verify"), this.verify);
  }

  signUp(req: Request, res: Response) {
    const cognito = new CognitoService();
    const { email, password, name } = req.body;
    let userAttributes = [];
    userAttributes.push({ Name: "name", Value: name });

    cognito.signUpUser(email, password, userAttributes).then((success) => {
      if (success) {
        return res.status(200).send({ message: "User signed up successfully" });
      } else {
        return res.status(500).send({ message: "Something went wrong" });
      }
    });
  }

  signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const cognito = new CognitoService();

    cognito
      .signInUser(email, password)
      .then((data) => {
        let { AccessToken } = data.AuthenticationResult;
        let decodedIDToken = jwt.decode(data.AuthenticationResult.IdToken, {
          complete: true,
        }).payload;

        if (AccessToken) {
          const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1";

          return res
            .status(200)
            .setHeader(
              "Set-Cookie",
              serialize("Auth", AccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: isLocalhost ? "Lax" : "None",
                domain: !isLocalhost ? "ondigitalocean.app" : undefined,
                path: "/",
                maxAge: decodedIDToken.exp - Math.floor(Date.now() / 1000),
              })
            )
            .send({
              message: "User signed in successfully",
              userData: decodedIDToken,
            });
        }
      })
      .catch((err) => {
        if (err.name === "NotAuthorizedException") return res.status(401).send({ message: err.message });
        return res.status(500).send({ message: err.message });
      });
  }

  verify(req: Request, res: Response) {
    const { email, code } = req.body;
    const cognito = new CognitoService();
    cognito
      .verifyAccount(email, code)
      .then((data) => {
        return res.status(200).send({ message: "User verified successfully" });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  }

  private validateBody(type: string) {
    const validations = [];

    switch (type) {
      case "signup":
        validations.push(
          body("email").notEmpty().normalizeEmail().isEmail(),
          body("password").notEmpty().isLength({ min: 8 }),
          body("name").notEmpty().isString()
        );
        break;
      case "signin":
        validations.push(body("email").notEmpty().normalizeEmail().isEmail(), body("password").notEmpty().isLength({ min: 8 }));
        break;
      case "verify":
        validations.push(body("email").notEmpty().normalizeEmail().isEmail(), body("code").notEmpty().isString().isLength({ min: 6, max: 6 }));
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

export default AuthController;
