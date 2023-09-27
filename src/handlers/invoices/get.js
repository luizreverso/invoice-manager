import Invoice from "../../entities/invoice.js";

export async function handler(event) {
  const { invoiceId } = event.pathParameters;
  const { userId } = event.requestContext.authorizer;

  try {
    const invoice = new Invoice({ userId, id: invoiceId });
    const found = await invoice.load();

    if (!found) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Invoice not found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

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
        error: "Could not retrieve the invoice",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
