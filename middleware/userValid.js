export function validateUser(req, res, next) {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ fel: "Name och email krävs" });
    }
    
    next();
}
export function validateUserId(req, res, next) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ fel: "Användar-ID saknas" });
    }

    next();
}