import { Router } from 'express';
import orderValidation from '../middleware/orderValidation.js';
import loggedInAuth from '../middleware/loggedInAuth.js';
import validateProducts from '../middleware/validateProducts.js';
import db from '../data/db.js';

const router = Router();

router.post('/', loggedInAuth, orderValidation, validateProducts, (req, res) => {
    const {shippingAddress, orderItems } = req.body;
    const userId = req.user?.id || null
    const deliveryTime = "10-15min leveranstid";
    let totalAmount = 0;
    const products = []

    for (let item of orderItems) {
        const product = db.prepare('SELECT price, title FROM products WHERE id = ?').get(item.product_id);

        products.push(product)
        totalAmount += product.price * item.quantity
    }

    const createdAt = new Date().toISOString()
    const order = db.prepare(`
        INSERT INTO orders (total_amount, shipping_address, delivery_time, user_id, createdAt)
        VALUES (?, ?, ?, ?, ?)
        `).run(totalAmount, shippingAddress, deliveryTime, userId, createdAt);

    const orderId = order.lastInsertRowid;

    const stmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, price, quantity, product_name, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
        `)

    orderItems.forEach((item, index) => {
        const product = products[index]
        stmt.run(orderId, item.product_id, product.price, item.quantity, product.title, createdAt)
    });
    

    res.json({
        id: orderId,
        userId,
        totalAmount,
        shippingAddress,
        deliveryTime,
        orderItems,
        createdAt
    })
})

router.get('/my-orders', loggedInAuth, (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ fel: "Logga in för att se orders" });
    }

    const orders = db.prepare(`SELECT id, total_amount, shipping_address, delivery_time, COALESCE(updatedAt, createdAt) AS date FROM orders WHERE user_id = ?`).all(userId)
    const orderItems = db.prepare(`SELECT product_id, price, quantity, product_name FROM order_items WHERE order_id = ?`)

    const result = orders.map(order => {
        const items = orderItems.all(order.id)

        return {
            ...order,
            items
        }
    })

    res.json(result)
})

export default router;