import { Router } from 'express'
import { requireApiKey } from '../middleware/requireApiKey.js'
import userRoutes from './userRoutes.js'
import orderRoutes from './orderRoutes.js'
import productRoutes from './productRoutes.js';


const router = Router();

router.use(requireApiKey);
router.use('/users', userRoutes)
router.use('/orders', orderRoutes)
router.use('/', productRoutes)

export default router;