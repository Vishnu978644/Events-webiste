import express from "express"
import { getArtist, postArtist, putArtist, deleteArtist } from '../controller/artistController.js';

const artistrouter=express.Router()

artistrouter.get("/",getArtist)
artistrouter.post("/",postArtist)
artistrouter.put("/:id",putArtist)
artistrouter.delete("/:id",deleteArtist)

export default artistrouter