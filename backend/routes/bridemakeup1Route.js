import express from 'express'
import { getBridemakeup1,postBridemakeup1, deleteBridemakeup1, putBridemakeup1 } from '../controller/bridemakeup1Controller.js'

const   bridemakeup1router = express.Router()

bridemakeup1router.get('/', getBridemakeup1)
bridemakeup1router.post('/', postBridemakeup1)
bridemakeup1router.delete('/:id', deleteBridemakeup1)
bridemakeup1router.put('/:id', putBridemakeup1)

export default bridemakeup1router
