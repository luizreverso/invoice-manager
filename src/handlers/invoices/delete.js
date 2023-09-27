import Invoice from "../../entities/invoice.js";

export async function handler(event) {
  const { invoiceId } = event.pathParameters;
  const { userId } = event.requestContext.authorizer;

  try {
    const invoice = new Invoice({ userId, id: invoiceId });
    await invoice.delete();

    return {
      statusCode: 204,
      body: JSON.stringify({ message: "Invoice deleted" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not delete the invoice",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
