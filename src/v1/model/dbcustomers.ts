import { appdb } from "./appdb";

class dbcustomers extends appdb {
  constructor() {
    super();
    this.table = "customers";
    this.uniqueField = "id";
  }

  insert_customers(data: any) {
    return this.insertRecord(data);
  }
}

const CUSTOMERS = new dbcustomers();
export default CUSTOMERS;
