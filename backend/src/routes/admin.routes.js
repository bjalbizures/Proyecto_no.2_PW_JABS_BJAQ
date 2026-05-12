import { Router } from 'express';

import {
  createShipment,
  createUser,
  deleteShipment,
  deleteUser,
  getShipment,
  getUser,
  listShipments,
  listUsers,
  updateShipment,
  updateUser,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/users', listUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/shipments', listShipments);
router.post('/shipments', createShipment);
router.get('/shipments/:id', getShipment);
router.put('/shipments/:id', updateShipment);
router.delete('/shipments/:id', deleteShipment);

export default router;
