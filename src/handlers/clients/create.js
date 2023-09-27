import Client from "../../entities/client.js";

export async function handler(event) {
  const body = JSON.parse(event.body);
  const { userId } = event.requestContext.authorizer;

  try {
    const client = new Client({ userId, ...body }, true);
    await client.create();

    return {
      statusCode: 201,
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
        error: "Could not create the client",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
