import AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export async function handler(event, context) {
  const { authorizationToken, methodArn } = event;

  try {
    const user = await cognitoIdentityServiceProvider
      .getUser({
        AccessToken: authorizationToken,
      })
      .promise();

    const { Username: userId, UserAttributes } = user;
    const userEmail = UserAttributes.find(
      (item) => item.Name === "email"
    ).Value;

    return generatePolicy("user", "Allow", methodArn, userId, userEmail);
  } catch (error) {
    return generatePolicy("user", "Deny", methodArn);
  }
}

function generatePolicy(principalId, effect, resource, userId, userEmail) {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId: principalId,
    policyDocument: policyDocument,
    context: {
      userId,
      userEmail,
    },
  };
}
