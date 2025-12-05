import express from "express"
import { deleteTransport, getTransport, postTransport, putTransport, } from "../controller/transportController.js"

const transrouter=express.Router()

transrouter.get("/",getTransport)
transrouter.post("/",postTransport)
transrouter.put("/:id",putTransport)
transrouter.delete("/:id",deleteTransport)

export default transrouter;