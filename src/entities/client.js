import DynamoDBRepository from "./dynamoDBRepository.js";

const identifier = "c";

export default class Client extends DynamoDBRepository {
  constructor(clientData, build = false) {
    super("client", identifier);
    if (clientData) {
      this.setup(clientData, build);
    }
  }

  get email() {
    return this._email;
  }

  set email(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(value)) {
      this._email = value;
    } else {
      throw new Error("email is not valid");
    }
  }

  get phone() {
    return this._phone;
  }

  set phone(value) {
    const phoneRegex = /^\+?\d+$/;
    if (phoneRegex.test(value)) {
      this._phone = value;
    } else {
      throw new Error("phone number is not valid");
    }
  }

  async setup({ id, userId, name, email, address, phone }, build = true) {
    this.sk = id;
    this.pk = userId;
    if (build) {
      this.name = name;
      this.email = email;
      this.address = address;
      this.phone = phone;
    }
  }

  static async list(userId, filters) {
    const items = await this.fetchItems(`u#${userId}`, identifier, filters);
    return items.map((item) => {
      const formatted = Client.formatToObject(item);
      return new Client(formatted, true);
    });
  }

  toJSON() {
    return {
      id: this.sk,
      owner: this.pk,
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
    };
  }

  formatToObject(data) {
    return Client.formatToObject(data);
  }

  static formatToObject(data) {
    return {
      userId: data?.PK?.replace("u#", ""),
      id: data?.SK?.replace(`${identifier}#`, ""),
      ...data,
    };
  }

  formatToDynamo() {
    return {
      PK: `u#${this.pk}`,
      SK: `${this.identifier}#${this.sk}`,
      entity: this.entity,
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
    };
  }
}
