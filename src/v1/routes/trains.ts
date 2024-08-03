import express from "express";
import { search_train } from "../controller/train";
import { protect } from "../helper.ts/helpfn";
const router = express.Router();
router.post("/search", protect, search_train);
export default router;
