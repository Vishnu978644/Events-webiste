import express from 'express'
import { getHero, postHero, deleteHero, putHero } from '../controller/heroController.js'

const herorouter = express.Router()

herorouter.get('/', getHero)
herorouter.post('/', postHero)
herorouter.delete('/:id', deleteHero)
herorouter.put('/:id', putHero)

export default herorouter
