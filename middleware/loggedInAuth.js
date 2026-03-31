export default function loggedInAuth(req, res, next) {
    const userId = req.headers['x-user-id'];

    if(!userId) {
        req.user = null;
        return next()
    }
       
    if(typeof userId !== 'string') {
        return res.status(400).json({ fel: "Ogiltigt userId" })
    }
    req.user = { id: userId };
    next();
}