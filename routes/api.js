import { Router } from 'express'
import { requireApiKey } from '../middlewear/requireApiKey.js'
import { userRoutes } from './userRoutes.js'

const router = Router();

router.use(requireApiKey);
router.use('/users', userRoutes)

export default router;