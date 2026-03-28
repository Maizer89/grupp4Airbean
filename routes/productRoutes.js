import { Router } from 'express';
// import { v4 as uuidv4 } from 'uuid';  ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUCTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from '../data/menudb.js';

const router = Router();

//middleware/requireApiKey
export const requireApiKey = (req, res, next) =>{
    if (!apiKey) return res.status(401).json({error:'API Key is missing'});
    if (apiKey !== process.env.API_KEY1) return res.status(403).json({error:'Invlaild API Key'});
    next();
};

// get all items on the menu.
router.get("/menu", (req, res) =>{
    try {
        const items = db.prepare('SELECT * FROM cafeMenu').all();
        res.status(200).json({menu: items});
    } catch (error) {
        res.status(500).json({error: 'Could not fetch menu'});
    }
});

// get one item on the menu.
router.get("/menu/:id", (req, res) =>{
    try {
        const item = db.prepare('SELECT * FROM cafeMenu WHERE id = ?').get(req.params.id);
        if (!item) return res.status(404).json({error: 'Item not found'});
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error: 'Could not fetch item'});
    }
});

// add items on the menu.
router.post("/menu", (req, res) =>{
    const { title, desc, price } = req.body;
    if (!title || !desc || !price) return res.status(400).json({error: 'Title, desc and price are required'});
    const result = db.prepare(
        'INSERT INTO cafeMenu (title, desc, price) VALUES (?, ?, ?)'
    ).run(title, desc, price);
    const newItem = db.prepare ('SELECT * FROM cafeMenu WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newItem);
});

// update menu items
router.put("/menu/:id", (req, res) => {
    const item = db.prepare('SELECT * FROM cafeMenu WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({error: 'Item not found'});
    const { title, desc, price } = req.body;
    db.prepare ('UPDATE cafeMenu SET title = ?, desc = ?, price = ? WHERE id = ?')
    .run(
        title       ?? item.name,
        desc        ?? item.desc,
        price       ?? item.price,
        req.params.id
    );
    const updated = db.prepare('SELECT * FROM cafeMenu WHERE id = ?').get(req.params.id);
    res.json(updated);
});

// delete an item from the menu
router.delete("/menu/:id", (req, res) =>{
    const item = db.prepare('SELECT * FROM cafeMenu WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({error: 'Item not found'});
    db.prepare('DELETE FROM cafeMenu WHERE id = ?').run(req.params.id);
    res.status(200).json({message: 'Item successfully deleted'});
});

 export default router;


