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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbusers_1 = __importDefault(require("../model/dbusers"));
const constants_1 = require("../constants");
const geolib_1 = require("geolib");
const moment_1 = __importDefault(require("moment"));
const validation_1 = require("./validation");
exports.protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            throw {
                message: "please send token in headers",
            };
        }
        const decode = yield util_1.promisify(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET || "");
        if (!decode) {
            throw {
                message: "Invalid user",
            };
        }
        const id = decode.id;
        const dbuser = yield dbusers_1.default.getUser({ id });
        if (dbuser.length === 0) {
            throw { message: "Invalid user" };
        }
        req.user = dbuser[0];
        next();
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            error: true,
            message: err.message,
        });
    }
});
exports.create_date = (date, time, minutes_to_add) => {
    console.log(date, time, minutes_to_add);
    // Create the initial date object from dateStr
    const initialDate = new Date(date);
    // Parse the time string
    const [hours, minutes, seconds] = time.split(":").map(Number);
    // Set the time to the initial date object
    initialDate.setHours(hours, minutes, seconds);
    // Add the specified number of minutes
    initialDate.setMinutes(initialDate.getMinutes() + minutes_to_add);
    const addLeadingZero = (num) => (num * 1 < 10 ? `0${num}` : num);
    console.log("sssfgdfgddfgdgfdgfwwwwwwwwwwwwwwwwww", initialDate);
    // Create the array with formatted values
    let formatedDate = [
        initialDate.getFullYear(),
        addLeadingZero(initialDate.getMonth() + 1),
        addLeadingZero(initialDate.getDate()),
    ].join("-");
    const formatedTime = [
        addLeadingZero(initialDate.getHours()),
        addLeadingZero(initialDate.getMinutes()),
    ].join(":");
    return [formatedDate, formatedTime];
};
const check_timeLimit = (dateStr, timeStr) => {
    try {
        const initialDate = new Date(dateStr);
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        initialDate.setHours(hours, minutes, seconds);
        if (initialDate > new Date()) {
            const current_date = new Date();
            let difference = (initialDate - current_date) / (1 * 60 * 60 * 1000);
            console.log(difference);
            if (difference >= 4)
                return true;
            else {
                throw {
                    message: "you can only get the ticket before three hours of train departure from source station",
                };
            }
        }
        throw {
            message: "train  has been left source station",
        };
    }
    catch (error) {
        const err = error;
        console.log(err.message);
        throw err;
    }
};
exports.restrict_to = (...allowed) => {
    console.log();
    return (req, res, next) => {
        if (allowed.includes(req.user.role)) {
            next();
        }
        else {
            res.status(401).json({
                error: true,
                message: "you are not authorize to perform this action",
                data: {},
            });
        }
    };
};
exports.calculate_amount = (train_id, num_of_customers, minutes) => {
    let rate = 4;
    let id = train_id * 1;
    if (id === 1) {
        rate = constants_1.rate_train_one;
    }
    else if (id === 2) {
        rate = constants_1.rate_train_two;
    }
    else if (id === 3) {
        rate = constants_1.rate_train_three;
    }
    console.log("AAAAAAAAAAAAAAAAAA", num_of_customers, minutes, rate);
    const amount = num_of_customers * minutes * rate;
    return amount;
};
exports.validateDay = (days, date, start_time, total_minute) => {
    console.log(days, date, start_time, total_minute);
    let initialDate = new Date(date);
    let day = initialDate.getDay();
    const arr = date.split("-");
    let previous_date = new Date(date);
    console.log("FFFertyrertretre", previous_date);
    const [hours, minutes, second] = start_time.split(":").map(Number);
    initialDate.setHours(hours, minutes, second);
    for (let i = day; i >= 0; i--) {
        console.log("DEFDEREDFDGFVCDFVCDFFVDFFCDFCXFCV", `${initialDate.getFullYear()}-${initialDate.getMonth() + 1}-${initialDate.getDate()}`);
        previous_date = new Date(initialDate);
        console.log(previous_date);
        initialDate.setMinutes(initialDate.getMinutes() + total_minute);
        const a = days[i] * 1;
        if (a === 1) {
            if (initialDate.getDay() === day)
                return previous_date;
        }
        initialDate.setMinutes(initialDate.getMinutes() - total_minute - 1440);
    }
    return false;
};
exports.formatDateString = (dateString, pattern) => moment_1.default(dateString).format(pattern);
exports.send_mail = ({ reciever, html, subject, sender }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOption = {
            from: `Feraz khan <${sender}>`,
            to: reciever,
            subject: subject,
            html,
        };
        const response = yield transporter.sendMail(mailOption);
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.create_random_token = () => {
    const random_token = crypto_1.default.randomBytes(32).toString("hex");
    const hashed_token = crypto_1.default
        .createHash("sha256")
        .update(random_token)
        .digest("hex");
    return [random_token, hashed_token];
};
exports.calculate_distance = (p1, p2) => {
    const distance = geolib_1.getPreciseDistance(p1, p2, 1);
    return distance;
};
exports.calculate_general_amount = (train_type, distance, quantity = 1) => {
    let rate = 0.4;
    if (train_type === "SF") {
        rate = 0.5;
    }
    else if (train_type === "EX") {
        rate = 0.4;
    }
    const amount = Math.floor(rate * (distance / 1000) * quantity);
    return amount;
};
exports.validate_body = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validate = yield validation_1.applyValidation(schema, req.body);
            req.body = validate;
            next();
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                error: true,
                message: err.message,
                data: {},
            });
        }
    });
};
//# sourceMappingURL=helpfn.js.map