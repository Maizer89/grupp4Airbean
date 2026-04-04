import { Router } from 'express';
import orderShipping from '../middleware/orderShipping.js';
import orderValidation from '../middleware/orderValidation.js';
import db from '../data/db.js';

const router = Router();


router.post('/', orderValidation, (req, res) => {
    const {userId, shippingAddress, orderItems } = req.body;
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
        `).run(  totalAmount, shippingAddress, deliveryTime, createdAt);

    const orderId = order.lastInsertRowid;

    const stmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, price, quantity, product_name, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
        `)

    for (let item of orderItems) {
        stmt.run(orderId, item.productId, item.price, item.quantity, item.productName, createdAt)
    }

    res.json({
        id: orderId,
        totalAmount,
        shippingAddress,
        deliveryTime,
        orderItems
    })
})

// vet ej om jag har gjort rätt... och hur avancerad klockan måste vara?
router.get('/status/:orderId', orderShipping, (req, res) => {
    const { orderId } = req.params;

    try {
    const order = db.prepare('SELECT createdAt FROM orders WHERE id = ?').get(orderId);
// Ska denna rad nedan också in i middleware?
    if (!order) {
        return res.status(404).json({ error: "Order hittades inte." })
    }

    const totalTime = 15
    const now = new Date();
    const createdAt = new Date(order.createdAt);
    const passedTime = Math.floor((now - createdAt) / 60000);
    const remainingTime = Math.max(0, totalTime - passedTime);

    res.json({
        orderId,
        remainingTime,
        status: "Shipping"
    });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ett fel inträffade." });
    }
});

export default router;