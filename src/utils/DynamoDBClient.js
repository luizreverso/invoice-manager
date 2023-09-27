import AWS from "aws-sdk";

let instance = null;

class DynamoDBClient {
  constructor() {
    if (!instance) {
      this.client = new AWS.DynamoDB.DocumentClient();
      instance = this;
    }

    return instance;
  }
}

export default new DynamoDBClient();
