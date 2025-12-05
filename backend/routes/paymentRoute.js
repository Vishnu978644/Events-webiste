import express from 'express';

import { deletePayment, getPayment, postPayment, putPayment } from '../controller/paymentController.js'; 


const paymentrouter = express.Router();

paymentrouter.get('/', getPayment);

paymentrouter.post('/', postPayment);

paymentrouter.put('/:paymentId', putPayment);



paymentrouter.delete('/:paymentId', deletePayment);

export default paymentrouter;