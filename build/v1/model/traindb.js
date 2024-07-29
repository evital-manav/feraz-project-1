"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appdb_1 = require("../model/appdb");
class traindb extends appdb_1.appdb {
    constructor() {
        super();
    }
}
const train_obj = new traindb();
exports.default = train_obj;
//# sourceMappingURL=traindb.js.map