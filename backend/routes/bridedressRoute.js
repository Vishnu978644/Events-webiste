import express from 'express'
import { getBridedress, postBridedress, deleteBridedress,putBridedress } from '../controller/bridedressController.js'

const bridedressrouter = express.Router()

bridedressrouter.get('/', getBridedress)
bridedressrouter.post('/', postBridedress)
bridedressrouter.delete('/', deleteBridedress)
bridedressrouter.put('/', putBridedress)
export default bridedressrouter
