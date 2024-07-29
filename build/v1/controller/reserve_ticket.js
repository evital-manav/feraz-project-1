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
const validation_1 = require("../helper.ts/validation");
const schema_1 = require("../helper.ts/schema");
const dbcustomers_1 = __importDefault(require("../model/dbcustomers"));
const dbcustomerticket_1 = __importDefault(require("../model/dbcustomerticket"));
const general_ticket_1 = __importDefault(require("../model/general_ticket"));
const helpfn_1 = require("../helper.ts/helpfn");
const dbreservetickets_1 = __importDefault(require("../model/dbreservetickets"));
exports.create_reserve_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // vaidate login user limit
        // validate request body
        const validate = yield validation_1.applyValidation(schema_1.reserve_ticket_schema, req.body);
        // find train source station and destination station
        const find_train_query = `select * from train where t_number = '${validate.trainnumber}'`;
        const find_source_staion_query = `select * from station where code ILIKE '%${validate.from}%' OR stn_name ILIKE '%${validate.from}%' ORDER BY stn_name LIMIT 1 `;
        const find_destination_query = `select * from station where code ILIKE '%${validate.to}%' OR stn_name ILIKE '%${validate.to}%' ORDER BY stn_name LIMIT 1  `;
        const [[train], [source_station], [destination_station]] = yield Promise.all([
            dbreservetickets_1.default.executeQuery(find_train_query),
            dbreservetickets_1.default.executeQuery(find_source_staion_query),
            dbreservetickets_1.default.executeQuery(find_destination_query),
        ]);
        // validate if enter input exist in database or not
        if (!train || !source_station || !destination_station) {
            throw {
                message: "your input is incorrect either train number or  station name",
            };
        }
        // validate train if it runs beatween selected stations
        const source_station_id = source_station.id;
        const destination_station_id = destination_station.id;
        const train_id = train.id;
        const find_schedule_for_source = `select id, stop_order,minutes from schedule where station_id = '${source_station_id}' AND train_id = '${train_id}' `;
        const find_schedule_for_destination = `select id, stop_order,minutes from schedule where station_id = '${destination_station_id}' AND train_id = '${train_id}' `;
        const [[source_schedule], [destination_schedule]] = yield Promise.all([
            dbreservetickets_1.default.executeQuery(find_schedule_for_source),
            dbreservetickets_1.default.executeQuery(find_schedule_for_destination),
        ]);
        if (!source_schedule || !destination_schedule) {
            throw {
                message: "selected train does not runs between selected source and destination",
            };
        }
        // validate stop order
        if (source_schedule.stop_order > destination_schedule.stop_order) {
            throw {
                message: "selected train does not runs between selected source and destination",
            };
        }
        //  validate if trains runs on selected date or not .some trains runs two days or three days
        // validate if ticket is available or not
        // make response
        const train_start_time = train.start_time;
        const source_minute = source_schedule.minutes;
        const train_date = helpfn_1.validateDay(train.days, validate.startdate, train.start_time, source_minute * 1);
        if (!train_date) {
            throw { message: "Train does not run on specified date" };
        }
        const formated_train_date = helpfn_1.formatDateString(train_date, "YYYY-MM-DD HH:mm:ss");
        const count_ticket_query = `SELECT COUNT(*)
    FROM tickets
    WHERE source_date = '${formated_train_date}'
      AND train_id = ${train_id}
      AND status = '${1}';
    `;
        let [{ count }] = yield dbreservetickets_1.default.executeQuery(count_ticket_query);
        count = count * 1;
        if (count >= 250) {
            throw {
                message: "Not available",
            };
        }
        if (count < 250 && count + validate.customers.length > 250) {
            let difference = 250 - count;
            throw {
                message: `only ${difference} ticket is available`,
            };
        }
        console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFF", train_date, formated_train_date);
        const destination_minutes = destination_schedule.minutes * 1;
        const [start_d_j, arrival_time_at_source_station] = helpfn_1.create_date(train_date, train_start_time, source_minute * 1);
        const [end_date_of_journey, arrival_time_at_destination_station] = helpfn_1.create_date(train_date, train_start_time, destination_minutes);
        const enddate = [
            end_date_of_journey,
            arrival_time_at_destination_station,
        ].join(" ");
        let pnr = Date.now().toString().slice(-7) + "123";
        // insert ticket in tickets table
        const amount = helpfn_1.calculate_amount(train_id, validate.customers.length, destination_minutes - source_minute);
        const seatnumber = 1;
        const userid = 1;
        const { mobile, familymobile, email, district, country, pincode, state } = validate;
        const ticket_entry_data = {
            quantity: validate.customers.length,
            startdate: validate.startdate,
            enddate,
            amount,
            mobile,
            familymobile,
            email,
            status: 1,
            district,
            country,
            pincode,
            state,
            pnr,
            userid: req.user.id,
            source_date: formated_train_date,
            train_id,
            start_schedule: source_schedule.id,
            end_schedule: destination_schedule.id,
        };
        console.log("Ticket-entry-data", ticket_entry_data);
        const response = yield dbreservetickets_1.default.insert_reserve_ticket(ticket_entry_data);
        console.log("RRRRRrr", response);
        // insert customers in customer table
        const insert_customer_response = yield Promise.all(validate.customers.map(({ first_name, last_name, dob }) => {
            return dbcustomers_1.default.insert_customers({
                first_name,
                last_name,
                dob: helpfn_1.formatDateString(dob, "YYYY-MM-DD HH:mm:ss"),
            });
        }));
        console.log(insert_customer_response);
        // const customer_entry_data = { firstname, lastname, dob };
        // insert ticket id and customer id in customerticket table
        const start = count + 1;
        let all_seat = [];
        const insert_customer_ticket = yield Promise.all(insert_customer_response.map((id, i) => {
            const seat_number = start + i;
            all_seat.push(seat_number);
            return dbcustomerticket_1.default.insert_customer_ticket({
                customerid: id,
                ticketid: response,
                seat_number,
            });
        }));
        console.log(insert_customer_ticket);
        const data = {
            souce_station_name: source_station.stn_name,
            source_station_departure_time: arrival_time_at_source_station,
            start_date_of_journey: validate.startdate,
            destination_station_name: destination_station.stn_name,
            seats: all_seat,
            passengers: validate.customers,
            end_date_of_journey,
            arrival_time_at_destination_station,
            train_number: validate.trainnumber,
            pnr,
        };
        res.status(200).json({
            error: false,
            data,
            message: "this is your ticket",
        });
        // const customerticket_entry_data = { ticketid, customerid };
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
exports.get_all_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const general_ticket_query = `select * from general_ticker where agentid = '${req.user.id}'  `;
        const reservation_ticket_query = `select * from tickets where userid = '${req.user.id}' `;
        const [resevation_ticket, general_ticket] = yield Promise.all([
            dbreservetickets_1.default.executeQuery(reservation_ticket_query),
            general_ticket_1.default.executeQuery(general_ticket_query),
        ]);
        let message = "success";
        if (!resevation_ticket && general_ticket) {
            message = "you did not cut a single ticket";
        }
        res.status(200).json({
            error: false,
            message: message,
            data: { resevation_ticket, general_ticket },
        });
    }
    catch (error) {
        res.status(400).json({
            error: true,
        });
    }
});
exports.cancel_ticket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const validate = yield validation_1.applyValidation(schema_1.cancel_ticket_schema, req.body);
        const find_query_ticket = `select id, status,userid from tickets where pnr = '${validate.pnr}'  `;
        const ticket = yield dbreservetickets_1.default.executeQuery(find_query_ticket);
        console.log(ticket);
        if (!ticket) {
            throw {
                message: "this is wrong pnr",
            };
        }
        if (ticket.length == 0) {
            throw {
                message: "this is wrong pnr",
            };
        }
        let response;
        if (req.user.role === "railway") {
            const response = yield dbreservetickets_1.default.update_reserve_ticket(ticket[0].id, {
                status: "0",
            });
            console.log(response);
            if (!response) {
                throw {
                    message: "Internal server error",
                };
            }
            res.status(200).json({
                error: false,
                message: "your ticket has been cancel",
                dtat: {
                    pnr: validate.pnr,
                },
            });
            return;
        }
        else if (req.user.id !== ticket[0].userid) {
            throw {
                message: "you ca not cancel other's ticket",
            };
        }
        else {
            const response = yield dbreservetickets_1.default.update_reserve_ticket(ticket[0].id, {
                status: 0,
            });
            if (!response) {
                throw {
                    message: "Internal server error",
                };
            }
            res.status(200).json({
                error: false,
                message: "your ticket has been cancel",
                dtat: {
                    pnr: validate.pnr,
                },
            });
        }
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
//# sourceMappingURL=reserve_ticket.js.map