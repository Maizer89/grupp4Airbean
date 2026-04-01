import db from '../data/db.js';

export default function validateProducts(req, res, next) {
    const { orderItems } = req.body;

    for (let item of orderItems) {
        const product = db
            .prepare('SELECT id FROM products WHERE id = ?')
            .get(item.product_id);

        if (!product) {
            return res.status(400).json({ error: "Produkten finns inte" });
        }
    }

    next();
}