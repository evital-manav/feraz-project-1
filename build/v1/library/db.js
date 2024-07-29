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
const connection_1 = require("./connection");
class db {
    constructor() {
        this.table = "";
        this.connection = "";
        this.query = "";
        this.uniqueField = "";
        this.where = "";
        this.orderby = "";
        this.rpp = 20;
        this.page = 1;
        this.limit = "";
        this.url = "";
        this.totalRecords = 0;
    }
    /**
     * This function will execute given Query with checking of DB connection. It will return appropriate type of response in case of insert, update, delete, select etc.
     * @param query query string
     * @returns array | number
     */
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            this.query = query;
            let connectionObj = new connection_1.connection();
            try {
                this.connection = yield connectionObj.getConnection();
                if (!this.connection) {
                    throw "Not connected to database.";
                }
                let result = yield this.connection.query(query);
                if (!result)
                    return false;
                if (result.command == "INSERT") {
                    if (this.uniqueField != "")
                        return result["rows"][0]["id"];
                    else
                        return result["rowCount"];
                }
                else if (result.command == "UPDATE")
                    return result["rowCount"];
                else if (result.command == "REPLACE")
                    return result["rowCount"];
                else if (result.command == "DELETE")
                    return result["rowCount"];
                else
                    return result.rows;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    /**
     * Select records from DB with appropriate table and required where conditions. This function will use in SelectRecord, allRecords, list Records function with appropriate parameters.
     * @param table table name
     * @param fields fields of DB
     * @param where where condition
     * @param orderby order by starting with " ORDER BY"
     * @param limit limit of DB records required
     * @returns array
     */
    select(table, fields, where, orderby, limit) {
        let query = "SELECT " +
            fields +
            " FROM " +
            table +
            " " +
            where +
            " " +
            orderby +
            " " +
            limit;
        console.log("fffffffffffffffffff", query);
        return this.executeQuery(query);
    }
    /**
     * Insert given data into given table. Given data should be key-value pair object with DB field name and it's value.
     * @param table table name
     * @param data array of data
     */
    insert(table, data) {
        let columnsArray = new Array();
        let valuesArray = new Array();
        for (let key in data) {
            columnsArray.push(key);
            valuesArray.push(data[key]);
        }
        let columns = columnsArray.join(",");
        for (let i = 0; i < valuesArray.length; i++) {
            valuesArray[i] = String(valuesArray[i]);
            valuesArray[i] = valuesArray[i].replace(/'/g, "''");
        }
        let values = valuesArray.join("','");
        let query = "INSERT INTO " +
            table +
            "(" +
            columns +
            ") values('" +
            values +
            "') RETURNING id";
        return this.executeQuery(query);
    }
    /**
     * Update given data into table with appropriate where condition.
     * @param table tablename
     * @param data key value pair array/object
     * @param where Where condition
     */
    update(table, data, where) {
        let updatestring = "";
        for (let key in data) {
            if (updatestring !== "") {
                updatestring += ",";
            }
            if (data[key] == null) {
                updatestring += key + "=''";
            }
            else {
                data[key] = String(data[key]);
                updatestring += key + "='" + data[key].replace(/'/g, "''") + "'";
            }
        }
        let query = "UPDATE " + table + " SET " + updatestring + " " + where;
        return this.executeQuery(query);
    }
    /**
     * Delete record from table with given where condition.
     * @param table tablename
     * @param where where condition
     */
    delete(table, where) {
        let query = "DELETE FROM " + table + " " + where;
        return this.executeQuery(query);
    }
    /**
     * Select given fields from given table with unique id.
     * @param id table unique id
     * @param fields DB fields
     */
    selectRecord(id, fields = "*") {
        return this.select(this.table, fields, "WHERE " + this.uniqueField + " = " + id, this.orderby, this.limit);
    }
    /**
     * Insert record into DB with given array
     * @param data key-value pair object
     */
    insertRecord(data) {
        return this.insert(this.table, data);
    }
    /**
     * Update given data with unique id
     * @param id unique id
     * @param data key-value pair array
     */
    updateRecord(id, data) {
        return this.update(this.table, data, " WHERE " + this.uniqueField + "=" + id);
    }
    /**
     * Delete record with given unique id
     * @param id unique id
     */
    deleteRecord(id) {
        return this.delete(this.table, " WHERE " + this.uniqueField + "=" + id);
    }
    /**
     * Return records with given fields and limit.
     * @param fields DB fields
     */
    listRecords(fields = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ttttttttttttt", this.where);
            let start = (this.page - 1) * this.rpp;
            let result = yield this.select(this.table, fields, this.where, this.orderby, "LIMIT " + this.rpp + " OFFSET " + start);
            return !result ? [] : result;
        });
    }
    /**
     * Return all records with given where condition and order by.
     * @param fields fields
     */
    allRecords(fields = "*") {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.select(this.table, fields, this.where, this.orderby, "");
            return !result ? [] : result;
        });
    }
    /**
     * Get count of records with given condition
     * @param table tablename
     * @param uniqueField unique fields
     * @param where where condition
     */
    selectCount(table, uniqueField, where) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT count(" + uniqueField + ") as cnt FROM " + table + " " + where;
            let result = yield this.executeQuery(query);
            return result.length > 0 ? result[0].cnt : 0;
        });
    }
    /**
     * Get total pages of records with given condition and given rpp.
     */
    getTotalPages() {
        return __awaiter(this, void 0, void 0, function* () {
            this.totalRecords = yield this.selectCount(this.table, this.uniqueField, this.where);
            let totalpages = Math.ceil(this.totalRecords / this.rpp);
            return totalpages;
        });
    }
}
exports.db = db;
//# sourceMappingURL=db.js.map