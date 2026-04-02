import { Router } from 'express';
//import { v4 as uuidv4 } from 'uuid';  //ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUCTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from '../data/db.js';
import { validateProduct } from '../middleware/productVaild.js';

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
        if (!item) return res.status(404).json({error: 'Kan inte hitta item i menu'});
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({error: 'Kan inte fetch item'});
    }
});

//Update (PUT) items on the menu
router.put('/menu/:id', validateProduct, (req, res) => {
    const {id} = req.params;
    const {title, price, desc} = req.body;

    try{
        const item = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!item) return res.status(404).json({error: 'Kan inte hitta item i menu'});
        db.prepare(`
            UPDATE products
            SET title = COALESCE(?, title),
                price = COALESCE(?, price),
                \`desc\`   = COALESCE(?, \`desc\`),
                updatedAt = ? WHERE id = ?`)
                .run(title ?? null,
                    price ?? null,
                    desc ?? null,
                    new Date().toISOString(),
                    id);

                    const updateProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
                    res.status(200).json(updateProduct);
    } catch (error) {
        console.error('PUT/menu/:id', error);
        res.status(500).json({error: 'Kan inte uppdatera menu item'});
    }

});

export default router;