"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const general_ticket_1 = __importDefault(require("./routes/general_ticket"));
const reserve_ticket_1 = __importDefault(require("./routes/reserve_ticket"));
const trains_1 = __importDefault(require("./routes/trains"));
const router = express_1.default.Router();
/*
 *  Controllers (route handlers)
 */
let productsRouter = require("./controller/products");
/*
 * Primary app routes.
 */
console.log("I am  running");
router.use("/products", productsRouter);
router.use("/general_ticket", general_ticket_1.default);
router.use("/reservation", reserve_ticket_1.default);
router.use("/train", trains_1.default);
router.use("/user", auth_1.default);
module.exports = router;
//# sourceMappingURL=index.js.map