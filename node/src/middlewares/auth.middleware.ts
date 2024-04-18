import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

let pems = {};
class AuthMiddleware {
  private poolRegion: string = process.env.AWS_REGION;
  private userPoolId: string = process.env.COGNITO_POOL_ID;

  constructor() {
    this.setUp();
  }

  verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.IDToken; // Changed from Auth to IDToken

    if (!token) return res.status(401).send({ message: "No token provided" });

    let decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) return res.status(401).send({ message: "Invalid token" });

    const { kid } = decodedToken.header;
    const pem = pems[kid];
    if (!pem) return res.status(401).send({ message: "Invalid token" });
    jwt.verify(token, pem, (err, payload) => {
      if (err) return res.status(401).send({ message: "Invalid token" });
      else {
        req.body.user = payload; // Now this should include custom:mongoID
        next();
      }
    });
  }

  private async setUp() {
    const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;

    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Request failed");

      const data: any = await response.json();
      const { keys } = data;
      for (let i = 0; i < keys.length; i++) {
        const key_id = keys[i].kid;
        const modulus = keys[i].n;
        const exponent = keys[i].e;
        const key_type = keys[i].kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default AuthMiddleware;
