"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reserve_ticket_1 = require("../controller/reserve_ticket");
const helpfn_1 = require("../helper.ts/helpfn");
const router = express_1.default.Router();
router
    .route("/")
    .post(helpfn_1.protect, reserve_ticket_1.create_reserve_ticket)
    .get(helpfn_1.protect, reserve_ticket_1.get_all_ticket);
router.post("/cancelticket", helpfn_1.protect, reserve_ticket_1.cancel_ticket);
exports.default = router;
//# sourceMappingURL=reserve_ticket.js.map