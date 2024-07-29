"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const appdb_1 = require("./appdb");
class dbreservetickets extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "tickets";
        this.uniqueField = "id";
    }
    insert_reserve_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.insertRecord(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    update_reserve_ticket(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("update reserve ticket", id, data);
                return yield this.updateRecord(id, data);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const reservation = new dbreservetickets();
exports.default = reservation;
//# sourceMappingURL=dbreservetickets.js.map