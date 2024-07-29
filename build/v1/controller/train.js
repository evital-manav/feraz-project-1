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
const traindb_1 = __importDefault(require("../model/traindb"));
const helpfn_1 = require("../helper.ts/helpfn");
exports.search_train = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = yield validation_1.applyValidation(schema_1.search_train_schema, req.body);
        // need station id of source and destination
        let query_one = `select * from station where code ILIKE '%${validate.from}%' OR stn_name ILIKE '%${validate.from}%' ORDER BY stn_name LIMIT 1 `;
        let query_two = `select * from station where code ILIKE '%${validate.to}%' OR stn_name ILIKE '%${validate.to}%' ORDER BY stn_name LIMIT 1 `;
        const [[from_station], [to_staion]] = yield Promise.all([
            traindb_1.default.executeQuery(query_one),
            traindb_1.default.executeQuery(query_two),
        ]);
        console.log(to_staion, from_station);
        if (!from_station) {
            throw { message: " source station not found " };
        }
        if (!to_staion) {
            throw {
                message: "no destination station found",
            };
        }
        const from_station_id = from_station.id;
        const to_staion_id = to_staion.id;
        console.log(from_station, to_staion);
        // fetch all trains that runs beatwean the station
        let query_three = `select s1.train_id as from_train_id,s1.minutes as from_minutes, s1.stop_order as from_stop_order,s2.train_id  as end_train_id,s2.minutes as end_minutes ,s2.stop_order as end_stop_order from schedule s1 JOIN schedule s2 ON s1.train_id=s2.train_id WHERE  s1.station_id=${from_station_id} AND s2.station_id=${to_staion_id} AND s1.stop_order < s2.stop_order `;
        const scheduledTrain = yield traindb_1.default.executeQuery(query_three);
        const day = new Date(validate.date_of_journey).getDay();
        const trains_at_that_day = yield Promise.all(scheduledTrain.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const train = yield traindb_1.default.executeQuery(`select days,start_time,t_number from train where id = ${obj.from_train_id}`);
            const days = train[0].days;
            const start_time = train[0].start_time;
            const b = days[day] * 1 === 1;
            const train_number = train[0].t_number;
            console.log(b);
            if (b) {
                const [end_date_of_journey, end_time] = helpfn_1.create_date(validate.date_of_journey, start_time, obj.end_minutes * 1);
                return Object.assign(Object.assign({}, obj), { start_station_name: from_station.stn_name, end_station_name: to_staion.stn_name, start_date_of_journey: validate.date_of_journey, start_time: start_time, end_date_of_journey,
                    end_time,
                    train_number });
            }
            return {};
        })));
        res.status(200).json({
            error: false,
            message: "this is available train for your journey ",
            data: trains_at_that_day,
        });
        //get trains detail from train table
        // const trains_at_any_day = await Promise.all(
        //   scheduledTrain.map((obj: any) =>
        //     train_obj.executeQuery(
        //       `select * from train where id = ${obj.from_train_id}`
        //     )
        //   )
        // );
        // console.log(trains_at_any_day, scheduledTrain);
        // filter the trains runs only at that particular day
        // const train_at_date = trains_at_any_day.filter(
        //   (arr: any) => arr[0].days[day] * 1 === 1
        // );
        // console.log("gggggggggggg",train_at_date)
        // console.log(train_at_date, scheduledTrain);
        // train_at_date.map((arr:any)=>{arr[0]})
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            status: "Fail",
            message: err.message,
        });
    }
});
//# sourceMappingURL=train.js.map