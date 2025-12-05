import express from 'express'
import { getGroomdress, postGroomdress, deleteGroomdress,putGroomdress } from '../controller/groomdressController.js'

const groomdressrouter = express.Router()

groomdressrouter.get('/', getGroomdress)
groomdressrouter.post('/', postGroomdress)
groomdressrouter.delete('/', deleteGroomdress)
groomdressrouter.put('/', putGroomdress)
export default groomdressrouter
