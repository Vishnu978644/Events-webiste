import express from "express"
import { deleteContact, getContact, postContact, putContact } from "../controller/contactController.js"

const contactrouter=express.Router()

contactrouter.get("/",getContact)
contactrouter.post("/",postContact)
contactrouter.put("/:id",putContact)
contactrouter.delete("/:id",deleteContact)

export default contactrouter;