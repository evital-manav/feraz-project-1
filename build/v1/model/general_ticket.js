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
class general_ticket extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "general_ticket";
        this.uniqueField = "id";
    }
    insert_general_ticket(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.insertRecord(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const obj = new general_ticket();
exports.default = obj;
//# sourceMappingURL=general_ticket.js.map