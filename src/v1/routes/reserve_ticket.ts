import express from "express";
import {
  create_reserve_ticket,
  get_all_ticket,
  cancel_ticket,
} from "../controller/reserve_ticket";
import { protect } from "../helper.ts/helpfn";
const router = express.Router();

router
  .route("/")
  .post(protect, create_reserve_ticket)
  .get(protect, get_all_ticket);
router.post("/cancelticket", protect, cancel_ticket);
export default router;
