import { Router } from 'express'
import { requireApiKey } from '../middlewear/requireApiKey.js'
//import  userRoutes  from './userRoutes.js';
import productRoutes from './productRoutes.js'

const router = Router();

router.use(requireApiKey);
//router.use('/users', userRoutes);
router.use('/', productRoutes)

export default router;