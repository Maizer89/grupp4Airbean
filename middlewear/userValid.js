export function validateUser(req, res, next) {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ fel: "Name och email krävs" });
    }
    
    next();
}