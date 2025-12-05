import express from "express";
import {
    getBridejewel1,
    postBridejewel1,
    putBridejewel1,
    deleteBridejewel1
} from "../controller/bridejewel1Controller.js";

const bridejewel1router = express.Router();

bridejewel1router.get("/", getBridejewel1);
bridejewel1router.post("/", postBridejewel1);
bridejewel1router.put("/:id", putBridejewel1);
bridejewel1router.delete("/:id", deleteBridejewel1);

export default bridejewel1router;
