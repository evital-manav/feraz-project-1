"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateformat_1 = __importDefault(require("dateformat"));
const fs_1 = __importDefault(require("fs"));
const ini_1 = __importDefault(require("ini"));
const path_1 = __importDefault(require("path"));
let ENVIRONMENT = process.env.APP_ENV || 'localhost';
class functions {
    constructor() {
        this.languagevars = {};
        this.language = '';
        /* Get Language Data */
        this.language = 'english';
        this.languagevars = this.getLanguageData();
    }
    /**
     * Get language.ini variable to available in whole app
     */
    getLanguageData() {
        if (Object.keys(functions.static_languagevars).length == 0) {
            let languageArray = ini_1.default.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../', 'language.ini'), 'utf-8'));
            functions.static_languagevars = languageArray[this.language];
        }
        return functions.static_languagevars;
    }
    /**
     * Function to convert date in Long date format
     * @param date Date
     * @param showtime if want to show time or not
     * @returns date in format of "02 Aug 2019" or "02 Aug 2019 12:47 PM"
     */
    DatabaseToDisplayDate(date, showtime = false) {
        if (showtime) {
            return dateformat_1.default(date, 'dd mmm yyyy h:MM TT');
        }
        else {
            return dateformat_1.default(date, 'dd mmm yyyy');
        }
    }
    /**
     * Send output to client with status code and message
     * @param status_code status code of a response
     * @param status_message status message of a response
     * @param data response data
     * @returns object with 3 parameters
     */
    output(status_code, status_message, data = null) {
        if (this.languagevars[status_message])
            status_message = this.languagevars[status_message];
        let output = {
            status_code: status_code.toString(),
            status_message: status_message,
            datetime: dateformat_1.default(new Date(), 'yyyy-mm-dd HH:MM:ss'),
            data: data
        };
        /* if (data.length > 0 || Object.keys(data).length) {
            output.data = data;
        } else {
            delete output.data;
        } */
        return output;
    }
}
exports.functions = functions;
functions.static_languagevars = {};
//# sourceMappingURL=functions.js.map