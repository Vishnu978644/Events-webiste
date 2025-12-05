import express from "express";
import { getType,postType ,typePut,typeDelete} from "../controller/typeController.js";

const typeroute = express.Router();

typeroute.get("/", getType);
typeroute.post("/",postType)
typeroute.put("/:id",typePut)
typeroute.delete("/:id",typeDelete)
export default typeroute;
