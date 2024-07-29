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
class dbproducts extends appdb_1.appdb {
    constructor() {
        super();
        this.table = 'products';
        this.uniqueField = 'id';
    }
    /**
     * Make sure to write proper commenting for future reference
     * @param seller_id seller whom products is needed
     * @returns array
     */
    getProducts(seller_id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.where = " WHERE seller_id = " + seller_id;
            this.page = 5;
            this.orderby = ' ORDER by id desc';
            this.rpp = 50;
            let results = yield this.listRecords("*");
            return results;
        });
    }
}
exports.dbproducts = dbproducts;
//# sourceMappingURL=dbproducts.js.map