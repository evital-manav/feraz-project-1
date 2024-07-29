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
const schema_1 = require("../helper.ts/schema");
const validation_1 = require("../helper.ts/validation");
const general_ticket_1 = __importDefault(require("../model/general_ticket"));
const helpfn_1 = require("../helper.ts/helpfn");
const traindb_1 = __importDefault(require("../model/traindb"));
exports.create_general_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = yield validation_1.applyValidation(schema_1.general_ticket_schema, req.body);
        let query_one = `select id, lat as latitude,long as longitude from station where code ILIKE '%${validate.from}%' OR stn_name ILIKE '%${validate.from}%' ORDER BY stn_name LIMIT 1 `;
        let query_two = `select id, lat as latitude,long as longitude from station where code ILIKE '%${validate.to}%' OR stn_name ILIKE '%${validate.to}%' ORDER BY stn_name LIMIT 1 `;
        const [[from_station], [to_staion]] = yield Promise.all([
            traindb_1.default.executeQuery(query_one),
            traindb_1.default.executeQuery(query_two),
        ]);
        console.log(to_staion, from_station);
        if (!from_station) {
            throw { message: "no source station found " };
        }
        if (!to_staion) {
            throw {
                message: "no destination station found",
            };
        }
        const p1 = {
            latitude: from_station.latitude,
            longitude: from_station.longitude,
        };
        const p2 = { latitude: to_staion.latitude, longitude: to_staion.longitude };
        const distance = helpfn_1.calculate_distance(p1, p2);
        console.log(distance / 1000);
        const amount = helpfn_1.calculate_general_amount(validate.train_type, distance, validate.quantity);
        const right_now = helpfn_1.formatDateString(new Date(), "YYYY-MM-DD HH:mm:ss");
        const response = yield general_ticket_1.default.insert_general_ticket({
            amount,
            agentid: req.user.id,
            source_stn: from_station.id * 1,
            destination_stn: to_staion.id * 1,
            time: right_now,
            quantity: validate.quantity,
        });
        res.status(200).json({
            from: validate.from,
            to: validate.to,
            amount,
        });
    }
    catch (error) {
        const err = error;
        res.status(err.errorCode || 400).json({
            error: false,
            message: err.message,
            data: {},
        });
    }
});
//# sourceMappingURL=general_ticket.js.map