import express from "express";
import {
    getBridejewel,
    postBridejewel,
    putBridejewel,
    deleteBridejewel
} from "../controller/bridejewelController.js";

const bridejewelrouter = express.Router();

bridejewelrouter.get("/", getBridejewel);
bridejewelrouter.post("/", postBridejewel);
bridejewelrouter.put("/:id", putBridejewel);
bridejewelrouter.delete("/:id", deleteBridejewel);

export default bridejewelrouter;
