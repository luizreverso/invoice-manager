import Client from "../../entities/client.js";

export async function handler(event) {
  const { clientId } = event.pathParameters;
  const { userId } = event.requestContext.authorizer;

  try {
    const client = new Client({ userId, id: clientId });
    const found = await client.load();

    if (!found) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Client not found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(client),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not retrieve the client",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
