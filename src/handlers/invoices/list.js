import Invoice from "../../entities/invoice.js";

export async function handler(event) {
  const { userId } = event.requestContext.authorizer;

  try {
    const invoices = await Invoice.list(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(invoices),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not retrieve the invoices",
        message: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
