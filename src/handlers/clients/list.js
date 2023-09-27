import Client from "../../entities/client.js";

export async function handler(event) {
  const { userId } = event.requestContext.authorizer;

  try {
    const clients = await Client.list(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(clients),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not retrieve the clients",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
