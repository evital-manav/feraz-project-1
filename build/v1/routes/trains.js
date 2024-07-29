"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const train_1 = require("../controller/train");
const helpfn_1 = require("../helper.ts/helpfn");
const router = express_1.default.Router();
router.post("/search", helpfn_1.protect, train_1.search_train);
exports.default = router;
//# sourceMappingURL=trains.js.map