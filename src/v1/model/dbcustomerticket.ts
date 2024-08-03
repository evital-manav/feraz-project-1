import { appdb } from "./appdb";

class customer_ticket extends appdb {
  constructor() {
    super();
    this.table = "customerticket";
    this.uniqueField = "id";
  }

  insert_customer_ticket(data: any) {
    return this.insertRecord(data);
  }
}

const inst_customer_ticket = new customer_ticket();

export default inst_customer_ticket;
