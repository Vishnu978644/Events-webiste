import express from "express"
import { deleteDestini, getDestini, postDestini, putDestini } from "../controller/destiniController.js"

const destinirouter=express.Router()
destinirouter.get("/",getDestini)
destinirouter.post("/",postDestini)
destinirouter.put("/:id",putDestini)
destinirouter.delete("/:id",deleteDestini)

export default destinirouter