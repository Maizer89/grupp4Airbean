import { Router } from 'express';
import orderValidation from '../middleware/orderValidation.js';
import db from '../data/db.js';

const router = Router();


router.post('/', orderValidation, (req, res) => {
    const {shippingAddress, orderItems } = req.body;
    const deliveryTime = "10-15min leveranstid";
    let totalAmount = 0;

    for (let item of orderItems) {
        const product = db.prepare('SELECT price FROM products WHERE id = ?').get(item.productId);

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal
    }

    const createdAt = new Date().toISOString()
    const order = db.prepare(`
        INSERT INTO orders (total_amount, shipping_address, delivery_time, createdAt)
        VALUES (?, ?, ?, ?)
        `).run(totalAmount, shippingAddress, deliveryTime, createdAt);

    const orderId = order.lastInsertRowid;

    const stmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, price, quantity, product_name, createdAt)
        VALUE (?, ?, ?, ?, ?, ?)
        `)

    for (let item of orderItems) {
        stmt.run(orderId, item.productId, item.price, item.quantity, item.productName)
    }

    res.json({
        id: orderId,
        totalAmount,
        shippingAddress,
        deliveryTime,
        orderItems
    })
})

export default router;