export default function orderValidation(req, res, next) {
    const { shippingAddress, orderItems } = req.body;

    if(!shippingAddress || !shippingAddress.trim()) {
        return res.status(400).json({ fel: "Leverans adress krävs!" })
    }

    if(!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json( { fel: "orderItems måste vara en array och innehålla minst 1 produkt" } )
    }

    for (let item of orderItems) {
        if(!Number.isInteger(item.product_id)) {
            return res.status(400).json({ fel: "Produkten hittades inte!" })
        }
        if(!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return res.status(400).json({ fel: "Antal får inte vara 0" })
        }
    }

    next()
}