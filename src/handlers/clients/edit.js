import Client from "../../entities/client.js";

export async function handler(event) {
  const { clientId } = event.pathParameters;
  const { userId } = event.requestContext.authorizer;
  const body = JSON.parse(event.body);

  try {
    const client = new Client({ userId, id: clientId, ...body }, true);
    await client.update(body);

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
        error: "Could not update the client",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
