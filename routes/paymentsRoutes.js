import { Router } from 'express';
import {
  createOrder,
  gettingOrder,
  cancelOrder,
} from '../controllers/paymentsController.js';

const router = Router();

router.post('/create-order', createOrder);

router.get('/getting-order', gettingOrder);

router.get('/cancel-order', cancelOrder);

export default router;
