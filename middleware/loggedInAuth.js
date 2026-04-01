import db from '../data/db.js'

export default function loggedInAuth(req, res, next) {
    const userId = req.headers['x-user-id'];
    
    if(!userId) {
        req.user = null;
        return next()
    }
    
    if(typeof userId !== 'string') {
        return res.status(400).json({ fel: "Ogiltigt userId" })
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId)
    
    if(!user) {
        return res.status(400).json({ fel: "Användaren finns inte" })
    } 
       
    req.user = { id: userId };
    next();
}