import DynamoDBClientInstance from "../utils/DynamoDBClient.js";
import { v4 as uuid } from "uuid";

const TABLE_NAME = process.env.INVOICE_MANAGER_TABLE_NAME;

export default class DynamoDBRepository {
  constructor(entity, identifier) {
    this.dynamoClient = DynamoDBClientInstance.client;
    this.entity = entity;
    this.identifier = identifier;
  }

  get pk() {
    if (!this._pk) {
      throw new Error("pk(user id) is not valid");
    }
    return this._pk;
  }

  set pk(value) {
    if (!!value) {
      this._pk = value;
    }
  }

  get sk() {
    if (!this._sk) {
      this._sk = uuid();
    }
    return this._sk;
  }

  set sk(value) {
    if (!!value) {
      this._sk = value;
    }
  }

  create() {
    const params = {
      TableName: TABLE_NAME,
      Item: this.formatToDynamo(),
    };

    return this.dynamoClient.put(params).promise();
  }

  async update(updateData) {
    const formattedExpressions = this.formatEditExpressions(updateData);
    const { PK, SK } = this.formatToDynamo();

    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
      ...formattedExpressions,
      ReturnValues: "ALL_NEW",
    };

    const result = await this.dynamoClient.update(params).promise();

    await this.setup(result.Attributes);
  }

  formatEditExpressions(updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    for (let key in updateData) {
      const attributeKey = `#${key}`;
      const attributeValue = `:${key}`;

      updateExpressions.push(`${attributeKey} = ${attributeValue}`);
      expressionAttributeNames[attributeKey] = key;
      expressionAttributeValues[attributeValue] = updateData[key];
    }

    return {
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
  }

  delete() {
    const { PK, SK } = this.formatToDynamo();
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK,
        SK,
      },
    };

    return this.dynamoClient.delete(params).promise();
  }

  async load() {
    const { PK, SK } = this.formatToDynamo();

    const params = {
      TableName: TABLE_NAME,
      Key: { PK, SK },
    };

    const result = await this.dynamoClient.get(params).promise();

    if (result.Item) {
      const formatted = this.formatToObject(result.Item);
      await this.setup(formatted);
    }

    return !!result.Item;
  }

  static async fetchItems(PK, identifier, filters) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": PK,
        ":sk": `${identifier}#`,
      },
    };

    const result = await DynamoDBClientInstance.client.query(params).promise();

    return result.Items;
  }

  async setup() {
    throw new Error("setup must be implemented in derived classes");
  }

  toJSON() {
    throw new Error("toJSON must be implemented in derived classes");
  }

  formatToObject() {
    throw new Error("formatToObject must be implemented in derived classes");
  }

  formatToDynamo() {
    throw new Error("formatToDynamo must be implemented in derived classes");
  }
}
