import express from 'express'
import { getBridemakeup,postBridemakeup, deleteBridemakeup, putBridemakeup } from '../controller/bridemakeupController.js'

const   bridemakeuprouter = express.Router()

bridemakeuprouter.get('/', getBridemakeup)
bridemakeuprouter.post('/', postBridemakeup)
bridemakeuprouter.delete('/:id', deleteBridemakeup)
bridemakeuprouter.put('/:id', putBridemakeup)

export default bridemakeuprouter
