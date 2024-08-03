import { appdb } from "./appdb";

class general_ticket extends appdb {
  constructor() {
    super();
    this.table = "general_ticket";
    this.uniqueField = "id";
  }

  async insert_general_ticket(data: any) {
    try {
      return await this.insertRecord(data);
    } catch (error) {
      throw error;
    }
  }
}

const obj = new general_ticket();

export default obj;
