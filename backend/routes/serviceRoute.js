import express from "express"
import { deleteService, getService, postService, putService } from "../controller/serviceController.js"

const servicerouter=express.Router()
servicerouter.get("/",getService)
servicerouter.post("/",postService)
servicerouter.put("/:id",putService)
servicerouter.delete("/:id",deleteService)

export default servicerouter;