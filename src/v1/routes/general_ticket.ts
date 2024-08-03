import express from "express";
import { create_general_ticket } from "../controller/general_ticket";
import { protect } from "../helper.ts/helpfn";
const router = express.Router();
router.route("/").post(protect, create_general_ticket);
export default router;
