import AWS from "aws-sdk";
import crypto from "crypto";

class CognitoService {
  private config = {
    region: process.env.AWS_REGION,
  };
  private secretHash: string = process.env.COGNITO_SECRET_HASH;
  private clientID: string = process.env.COGNITO_CLIENT_ID;
  private cognitoIdentity;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(
    email: string,
    password: string,
    userAttributes: Array<any>
  ): Promise<boolean> {
    const params = {
      ClientId: this.clientID,
      Username: email,
      Password: password,
      SecretHash: this.generateSecretHash(email),
      UserAttributes: userAttributes,
    };

    try {
      const data = await this.cognitoIdentity.signUp(params).promise();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async verifyAccount(email: string, code: string): Promise<any> {
    const params = {
      ClientId: this.clientID,
      ConfirmationCode: code,
      Username: email,
      SecretHash: this.generateSecretHash(email),
    };

    const data = await this.cognitoIdentity.confirmSignUp(params).promise();
    return data;
  }

  public async signInUser(email: string, password: string): Promise<any> {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.generateSecretHash(email),
      },
    };

    const data = await this.cognitoIdentity.initiateAuth(params).promise();
    return data;
  }

  private generateSecretHash(email: string): string {
    return crypto
      .createHmac("SHA256", this.secretHash)
      .update(email + this.clientID)
      .digest("base64");
  }
}

export default CognitoService;
