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
class dbusers extends appdb_1.appdb {
    constructor() {
        super();
        this.table = "users";
        this.uniqueField = "id";
    }
    static whereClause(obj) {
        let where = "WHERE ";
        for (let key in obj) {
            where += `${key} = '${obj[key]}' `;
        }
        return where;
    }
    insertUser(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.insertRecord(userObj);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUser(login_body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.where = dbusers.whereClause(login_body);
                this.page = 1;
                this.rpp = 1;
                this.orderby = "";
                const user = yield this.listRecords("*");
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update_user(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.updateRecord(id, data);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.dbusers = dbusers;
const user = new dbusers();
exports.default = user;
//# sourceMappingURL=dbusers.js.map