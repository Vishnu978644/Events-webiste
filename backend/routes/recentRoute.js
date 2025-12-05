import express from "express";
import { getRecent, postRecent, deleteRecent, putRecent } from "../controller/recentController.js";

const router = express.Router();

router.get("/", getRecent);
router.post("/", postRecent);
router.delete("/:id", deleteRecent);
router.put("/:id", putRecent);

export default router;
