import AWS from "aws-sdk";

import Client from "./client.js";
import DynamoDBRepository from "./dynamoDBRepository.js";

const sns = new AWS.SNS();
const possibleStatus = new Set(["created", "sent", "paid", "canceled"]);
const identifier = "i";

export default class Invoice extends DynamoDBRepository {
  constructor(invoiceData, build = false) {
    super("invoice", identifier);
    if (invoiceData) {
      this.setup(invoiceData, build);
    }
  }

  get status() {
    return this._status;
  }

  set status(status) {
    if (possibleStatus.has(status)) {
      this._status = status;
    } else {
      throw new Error("status is not valid");
    }
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(value) {
    if (value && isNaN(new Date(value).getTime())) {
      throw new Error("due date is not valid");
    }
    this._dueDate = value;
  }

  get client() {
    return this._client;
  }

  set client(_clientId) {
    throw new Error("Use validateAndSetClient to set client");
  }

  async validateAndSetClient(clientId) {
    const client = new Client({ id: clientId, userId: this.pk });
    if (await client.load()) {
      this._client = client.toJSON();
      return clientId;
    } else {
      throw new Error(`Client with id ${clientId} does not exist`);
    }
  }

  async setup(
    { id, userId, userEmail, invoiceNumber, dueDate, status, clientId },
    build = true
  ) {
    this.sk = id;
    this.pk = userId;
    this.ownerEmail = userEmail ?? this.ownerEmail;
    if (build) {
      this.invoiceNumber = invoiceNumber ?? this.invoiceNumber;
      this.dueDate = dueDate ?? this.dueDate;
      this.status =
        status ?? this.status ?? possibleStatus.values().next().value;
      console.log("1", clientId, this.clientId);
      this.clientId = clientId ?? this.clientId;
      console.log("2", clientId, this.clientId);
      return await this.validateAndSetClient(clientId ?? this.clientId);
    }
  }

  async update(updateData) {
    await this.load();
    const status = this.status;
    await super.update(updateData);
    if (this.status !== status) {
      // TODO: send notification via sns
      // await this.notifyStatusChange();
    }
  }

  static async list(userId, filters) {
    const items = await this.fetchItems(`u#${userId}`, identifier, filters);
    const invoices = [];
    for (const item of items) {
      const formatted = Invoice.formatToObject(item);
      const invoice = new Invoice(formatted);
      await invoice.setup(formatted);
      invoices.push(invoice);
    }
    return invoices;
  }

  toJSON() {
    return {
      id: this.sk,
      owner: this.pk,
      invoiceNumber: this.invoiceNumber,
      dueDate: this.dueDate,
      status: this.status,
      client: this.client,
    };
  }

  formatToObject(data) {
    return Invoice.formatToObject(data);
  }

  static formatToObject(data) {
    return {
      userId: data?.PK?.replace("u#", ""),
      id: data?.SK?.replace("i#", ""),
      ...data,
    };
  }

  formatToDynamo() {
    return {
      PK: `u#${this.pk}`,
      SK: `${this.identifier}#${this.sk}`,
      entity: this.entity,
      invoiceNumber: this.invoiceNumber,
      dueDate: this.dueDate,
      status: this.status,
      clientId: this.clientId,
    };
  }
}
