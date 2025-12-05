import express from "express"
import { deleteClient, getClient, postClient, putClient } from "../controller/clientController.js"

const clientrouter=express.Router()

clientrouter.get("/",getClient)
clientrouter.post("/",postClient)
clientrouter.put("/:id",putClient)
clientrouter.delete("/:id",deleteClient)

export default clientrouter;