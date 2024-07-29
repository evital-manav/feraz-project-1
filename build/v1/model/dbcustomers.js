"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appdb_1 = require("./appdb");
class dbcustomers extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "customers";
        this.uniqueField = "id";
    }
    insert_customers(data) {
        return this.insertRecord(data);
    }
}
const CUSTOMERS = new dbcustomers();
exports.default = CUSTOMERS;
//# sourceMappingURL=dbcustomers.js.map