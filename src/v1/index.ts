import express from "express";
import Joi from "joi";
import { validations } from "./library/validations";
import authRouter from "./routes/auth";
import generel_ticket_router from "./routes/general_ticket";
import reserve_ticket_router from "./routes/reserve_ticket";
import train_router from "./routes/trains";
const router = express.Router();

/*
 *  Controllers (route handlers)
 */
let productsRouter = require("./controller/products");

/*
 * Primary app routes.
 */
console.log("I am  running");
router.use("/products", productsRouter);
router.use("/general_ticket", generel_ticket_router);
router.use("/reservation", reserve_ticket_router);
router.use("/train", train_router);

router.use("/user", authRouter);

module.exports = router;
