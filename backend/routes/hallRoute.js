import express from "express"
import { getHall,postHall,deleteHall,putHall } from "../controller/hallController.js";

const hallrouter=express.Router()

hallrouter.get("/",getHall)
hallrouter.post("/",postHall)
hallrouter.delete("/:id",deleteHall)
hallrouter.put("/:id",putHall)

export default hallrouter;