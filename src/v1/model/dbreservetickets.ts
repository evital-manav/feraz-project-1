import { appdb } from "./appdb";

class dbreservetickets extends appdb {
  constructor() {
    super();
    this.table = "tickets";
    this.uniqueField = "id";
  }

  async insert_reserve_ticket(data: any) {
    try {
      return await this.insertRecord(data);
    } catch (error) {
      throw error;
    }
  }

  async update_reserve_ticket(id: any, data: any) {
    try {
      console.log("update reserve ticket", id, data);
      return await this.updateRecord(id, data);
    } catch (error) {
      throw error;
    }
  }
}

const reservation = new dbreservetickets();
export default reservation;
