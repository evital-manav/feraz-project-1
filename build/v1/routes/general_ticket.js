"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const general_ticket_1 = require("../controller/general_ticket");
const helpfn_1 = require("../helper.ts/helpfn");
const router = express_1.default.Router();
router.route("/").post(helpfn_1.protect, general_ticket_1.create_general_ticket);
exports.default = router;
//# sourceMappingURL=general_ticket.js.map