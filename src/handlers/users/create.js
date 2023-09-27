import AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export async function handler(event) {
  const { email, password } = JSON.parse(event.body);

  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{}|']).{8,}$/;
    if (!email || !password) {
      throw new Error("email or password was not set");
    } else if (!emailRegex.test(email)) {
      throw new Error("email is not valid");
    } else if (!passwordRegex.test(password)) {
      throw new Error(
        "password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special symbol"
      );
    }

    const params = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
        {
          Name: "email",
          Value: email,
        },
      ],
      TemporaryPassword: `Temp?${Math.random().toString(36).slice(-8)}`,
      MessageAction: password ? "SUPPRESS" : undefined,
    };

    const createUserResult = await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();

    if (password) {
      const authParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: params.TemporaryPassword,
        },
      };

      const authResponse = await cognitoIdentityServiceProvider
        .adminInitiateAuth(authParams)
        .promise();

      const challengeParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: password,
        },
        Session: authResponse.Session,
      };

      await cognitoIdentityServiceProvider
        .adminRespondToAuthChallenge(challengeParams)
        .promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: createUserResult.User }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not create the user",
        message: error.message,
      }),
    };
  }
}
