import Invoice from "../../entities/invoice.js";

export async function handler(event) {
  const { invoiceId } = event.pathParameters;
  const { userId, userEmail } = event.requestContext.authorizer;
  const body = JSON.parse(event.body);

  try {
    const invoice = new Invoice({ userId, userEmail, id: invoiceId });
    await invoice.update(body);

    return {
      statusCode: 200,
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
        error: "Could not update the invoice",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
