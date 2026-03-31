import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';  ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUCTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from '../data/db.js';

const router = Router();

//get all items from the menu
router.get('/menu', (req, res) =>{
    try{
        const items = db.prepare('SELECT * FROM products').all();
        res.status(200).json({menu: items});
    } catch (error) {
        res.status(500).json({error: 'Kan inte fetch menu'});
    }
});

//get single item on the menu
router.get('/menu/:id', (req, res) =>{
    try {
        const item = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        if (!item) return res.json(404).json({error: 'Kan inte hitta item i menu'});
    } catch (error) {
        res.status(500).json({error: 'Kan inte fetch item'});
    }
});
export default router;