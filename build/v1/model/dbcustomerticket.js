"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appdb_1 = require("./appdb");
class customer_ticket extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "customerticket";
        this.uniqueField = "id";
    }
    insert_customer_ticket(data) {
        return this.insertRecord(data);
    }
}
const inst_customer_ticket = new customer_ticket();
exports.default = inst_customer_ticket;
//# sourceMappingURL=dbcustomerticket.js.map