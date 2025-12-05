// routes/bgalleryRoute.js
import express from "express";
import { bgalleryGet, bgalleryPost, bgalleryDelete, bgalleryPut } from "../controller/bgalleryController.js";

const bgalleryroute=express.Router();

bgalleryroute.get("/",bgalleryGet);
bgalleryroute.post("/",bgalleryPost);
bgalleryroute.delete("/:id",bgalleryDelete);
bgalleryroute.put("/:id",bgalleryPut);

export default bgalleryroute;