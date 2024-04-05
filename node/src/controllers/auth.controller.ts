import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import CognitoService from "../services/cognito.service";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

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
    this.router.post("/set-first-password", this.setFirstPassword);
  }

  signUp(req: Request, res: Response) {
    const cognito = new CognitoService();
    const { email, firstName, lastName, phone, gender, role } = req.body;
    let userAttributes = [];
    userAttributes.push({ Name: "name", Value: `${firstName} ${lastName}` });
    // mongoID custom attribute
    const user = new User({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      role,
      gender,
      phone,
    });

    userAttributes.push({ Name: "custom:mongoID", Value: user._id.toString() });

    cognito
      .signUpUser(email, userAttributes)
      .then(async () => {
        await user.save();
        res.status(200).send({ message: "User signed up successfully", displayMessage: true });
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "UsernameExistsException") {
          res.status(409).send({ message: "An account with the given email already exists." });
        } else if (error.code === "InvalidPasswordException") {
          res.status(400).send({ message: error.message });
        } else {
          res.status(500).send({ message: "Something went wrong. Please try again." });
        }
      });
  }

  signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const cognito = new CognitoService();

    cognito
      .signInUser(email, password)
      .then((data) => {
        if (data.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          return res.status(200).send({ message: "User must set a new password", newPasswordRequired: true, session: data.Session });
        }

        let { AccessToken } = data.AuthenticationResult;
        let decodedIDToken = jwt.decode(data.AuthenticationResult.IdToken, {
          complete: true,
        }).payload;

        if (AccessToken) {
          return res
            .status(200)
            .setHeader(
              "Set-Cookie",
              serialize("Auth", AccessToken, {
                httpOnly: true,
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
        console.error(err);
        return res.status(500).send({ message: err.message });
      });
  }

  setFirstPassword(req: Request, res: Response) {
    const { email, password, session } = req.body;
    const cognito = new CognitoService();
    cognito
      .respondToAuthChallenge(email, password, session)
      .then((data) => {
        return res.status(200).send({ message: "User signed in successfully" });
      })
      .catch((err) => {
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
          body("email").notEmpty().withMessage("Email is required").normalizeEmail().isEmail().withMessage("Invalid email"),
          body("firstName").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
          body("lastName").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string")
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
          return res.status(422).send({ errors: result.array(), message: result.array()[0].msg });
        }
        next();
      },
    ];
  }
}

export default AuthController;
