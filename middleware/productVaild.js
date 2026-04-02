export function validateProduct(req, res, next) {
    const { title, price, desc } = req.body;
    
    if (!title || !price || !desc) {
        return res.status(400).json({ fel: "Title, price och desc krävs"});
    }
    
    next();
}