import express from "express"

import { deleteDecor, getDecor, postDecor, putDecor } from "../controller/decorController.js"

const decorrouter = express.Router()

decorrouter.get("/",getDecor)
decorrouter.post("/",postDecor)
decorrouter.put("/:id",putDecor)
decorrouter.delete("/:id",deleteDecor)

export default decorrouter