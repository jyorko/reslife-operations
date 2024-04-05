import AWS from "aws-sdk";
import crypto from "crypto";

class CognitoService {
  private config = {
    region: process.env.AWS_REGION,
  };
  private secretHash: string = process.env.COGNITO_SECRET_HASH;
  private userPoolID: string = process.env.COGNITO_POOL_ID;
  private clientID: string = process.env.COGNITO_CLIENT_ID;
  private cognitoIdentity;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(email: string, userAttributes: Array<any>): Promise<void> {
    const params = {
      UserPoolId: this.userPoolID,
      Username: email,
      UserAttributes: userAttributes,
      DesiredDeliveryMediums: ["EMAIL"],
    };

    try {
      await this.cognitoIdentity.adminCreateUser(params).promise();
    } catch (err) {
      throw err;
    }
  }

  public async signUpInitialUser(email: string, password: string, userAttributes: Array<any>): Promise<void> {
    const params = {
      ClientId: this.clientID,
      Username: email,
      Password: password,
      UserAttributes: userAttributes,
      SecretHash: this.generateSecretHash(email),
    };

    try {
      await this.cognitoIdentity.signUp(params).promise();
      await this.cognitoIdentity.adminConfirmSignUp({ UserPoolId: this.userPoolID, Username: email }).promise();
    } catch (err) {
      throw err;
    }
  }

  public async respondToAuthChallenge(email: string, password: string, session: string): Promise<any> {
    const params = {
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      ClientId: this.clientID,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: password,
        SECRET_HASH: this.generateSecretHash(email),
      },
      Session: session,
    };

    try {
      const data = await this.cognitoIdentity.respondToAuthChallenge(params).promise();
      return data;
    } catch (err) {
      throw err;
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
    try {
      const data = await this.cognitoIdentity.initiateAuth(params).promise();

      return data;
    } catch (err) {
      throw err;
    }
  }

  private generateSecretHash(email: string): string {
    return crypto
      .createHmac("SHA256", this.secretHash)
      .update(email + this.clientID)
      .digest("base64");
  }
}

export default CognitoService;
