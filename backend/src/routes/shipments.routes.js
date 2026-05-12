import { Router } from 'express';

import {
  createShipment,
  getMyShipment,
  listMyShipments,
} from '../controllers/shipments.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listMyShipments);
router.post('/', createShipment);
router.get('/:trackingCode', getMyShipment);

export default router;
