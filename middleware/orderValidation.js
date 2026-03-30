export default function orderValidation(req, res, next) {
    const { totalAmount, shippingAddress, orderItems } = req.body;

    if(!totalAmount || !shippingAddress || !orderItems) {
        return res.status(400).json({ error: "Order kräver antal varor och leveransadress!" })
    }

    next()
}