import { Router } from "express";
import { v4 as uuidv4 } from "uuid"; // Importera uuidv4 för att generera unika ID:n
import db from "../data/db.js"; // Importera databasanslutningen
import { validateUser, validateUserId } from "../middleware/userValid.js";
const router = Router(); // Skapa en router-instans

router.post("/", validateUser, (req, res) => {
  const { name, email } = req.body;

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, createdAt)
      VALUES (?, ?, ?, ?)
    `); // Förbered SQL-satsen för att infoga en ny användare i databasen
    stmt.run(id, name, email, createdAt); // Kör SQL-satsen med de angivna värdena

    const newUser = db
      .prepare("SELECT name, email, createdAt FROM users WHERE id = ?")
      .get(id); // Hämta den nyligen skapade användaren från databasen

    res.status(201).json(newUser); // Resturnera den nya användaren som JSON med statuskod 201 (Created)
  } catch (err) {
    //Hantera eventuella fel som kan uppstå under databasoperationen
    console.error("POST /users:", err); // Logga felet i serverkonsolen för felsökning
    res.status(500).json({ fel: "Kunde inte skapa användare" }); // Returnera ett felmeddelande i svaret med statuskod 500 (Internal Server Error)
  }
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    db.prepare(
      `
            UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), updatedAt = ?
            WHERE id = ?
        `,
    ).run(name ?? null, email ?? null, new Date().toISOString(), id);

    const updatedUser = db
      .prepare("SELECT name, email, createdAt FROM users WHERE id = ?")
      .get(id);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("PUT /users:", err);
    res.status(500).json({ fel: "Kunde inte uppdatera användare" });
  }
});

  //Delete användare konto
  router.delete('/:id', (req, res) =>{
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({error: 'Kan inte hitta användaren'});

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.status(200).json({message: 'Konto är radera'});
  });
  
export default router; // Exportera router-instansen så att den kan användas i server.js
