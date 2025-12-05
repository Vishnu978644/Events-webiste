import express from "express";
import { getCoGallery, postCoGallery, deleteCoGallery, putCoGallery } from "../controller/cogalleryController.js";

const cogalleryrouter = express.Router();


cogalleryrouter.get("/", getCoGallery);


cogalleryrouter.get("/:id", getCoGallery);


cogalleryrouter.post("/", postCoGallery);


cogalleryrouter.delete("/:id", deleteCoGallery);


cogalleryrouter.put("/:id", putCoGallery);

export default cogalleryrouter;
