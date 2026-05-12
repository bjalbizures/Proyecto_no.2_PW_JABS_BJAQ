import { Router } from 'express';

import { trackShipment } from '../controllers/shipments.controller.js';

const router = Router();

router.get('/:trackingCode', trackShipment);

export default router;
