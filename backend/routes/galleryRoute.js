import express from "express"
import {galleryGet,galleryPost,galleryDelete,galleryPut} from "../controller/galleryController.js"

const galleryroute = express.Router();

galleryroute.get("/",galleryGet);
galleryroute.post("/",galleryPost)
galleryroute.delete("/:id",galleryDelete)
galleryroute.put("/:id",galleryPut)

export default galleryroute;