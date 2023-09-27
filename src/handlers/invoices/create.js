import Invoice from "../../entities/invoice.js";

export async function handler(event) {
  const body = JSON.parse(event.body);
  const { userId } = event.requestContext.authorizer;

  try {
    console.log("userId", userId);
    console.log("body", body);
    const invoice = new Invoice({ userId, ...body });
    await invoice.setup(body);
    await invoice.create();

    return {
      statusCode: 201,
      body: JSON.stringify(invoice),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not create the invoice",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
