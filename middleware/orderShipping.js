export default function orderShipping(req, res, next) {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: "Ordernummer saknas." })
    }

    next()
}