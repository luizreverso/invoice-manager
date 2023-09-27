import AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export async function handler(event, context) {
  const { username, password } = JSON.parse(event.body);

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognitoIdentityServiceProvider
      .adminInitiateAuth(params)
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        data: response.AuthenticationResult,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode ?? 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}
