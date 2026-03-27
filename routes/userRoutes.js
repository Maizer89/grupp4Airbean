import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../data/db.js";

const router = Router();

router.post("/", (req, res) => {
  const { name, email } = req.body; 
  if (!name || !email)
  {
    return res.status(400).json({ fel: "Name och email krävs" });
  }
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, name, email, createdAt);

    const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    res.status(201).json(newUser);
  } catch (err) {
    console.error("POST /users:", err);
    res.status(500).json({ fel: "Kunde inte skapa användare" });
  }
});
