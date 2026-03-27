import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';  ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUKTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from '../data/db.js';

const router = Router();

router.get('/', (req, res) => {
    const userId = req.user.id;

    const orders = db.prepare('SELECT id, total_amount, status, shipping_address FROM orders WHERE user_id = ?').all(userId)

    res.json(orders)
})