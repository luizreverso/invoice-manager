import Client from "../../entities/client.js";

export async function handler(event) {
  const { clientId } = event.pathParameters;
  const { userId } = event.requestContext.authorizer;

  try {
    const client = new Client({ userId, id: clientId });
    await client.delete();

    return {
      statusCode: 204,
      body: JSON.stringify({ message: "Client deleted" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not delete the client",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
