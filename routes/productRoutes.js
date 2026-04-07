import { Router } from "express";
//import { v4 as uuidv4 } from 'uuid';  //ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUCTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from "../data/db.js";
import { validateProduct } from "../middleware/productVaild.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

//get all items from the menu
router.get("/menu", (req, res) => {
  try {
    const items = db.prepare("SELECT * FROM products").all();
    res.status(200).json({ menu: items });
  } catch (error) {
    res.status(500).json({ error: "Kan inte fetch menu" });
  }
});

//get single item on the menu
router.get("/menu/:id", (req, res) => {
  try {
    const item = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);
    if (!item)
      return res.status(404).json({ error: "Kan inte hitta item i menu" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Kan inte fetch item" });
  }
});

//Update (PUT) items on the menu
router.put('/menu/:id', (req, res) => {
    const {id} = req.params;
    const {title, price, desc} = req.body;

   
        const item = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!item) return res.status(404).json({error: 'Kan inte hitta item i menu'});
        db.prepare(`
            UPDATE products
            SET title = COALESCE(?, title),
                price = COALESCE(?, price),
                \`desc\`   = COALESCE(?, \`desc\`),
                updatedAt = ? WHERE id = ?`,
    ).run(
      title ?? null,
      price ?? null,
      desc ?? null,
      new Date().toISOString(),
      id,
    );

    const updateProduct = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(id);
    res.status(200).json(updateProduct);
  } catch (error) {
    console.error("PUT/menu/:id", error);
    res.status(500).json({ error: "Kan inte uppdatera menu item" });
  }
});

// Lägg till produkt (admin):
router.post("/menu", requireAdmin, validateProduct, (req, res) => { // Lägg till en ny produkt i menyn, kräver admin-åtkomst
  const { title, price, desc } = req.body;
  const createdAt = new Date().toISOString(); // Skapa en tidsstämpel för när produkten skapades
  const result = db // Infoga den nya produkten i databasen
    .prepare(
      `
        INSERT INTO products (title, price, \`desc\`, createdAt)
        VALUES (?, ?, ?, ?)
    `,
    )
    
    .run(title, price, desc, createdAt);

  res.status(201).json({ id: result.lastInsertRowid, title, price, desc }); // Returnera den nya produkten som JSON med statuskod 201 (Created)
});

// Ta bort produkt (admin):
router.delete("/menu/:id", requireAdmin, (req, res) => { // Ta bort en produkt från menyn, kräver admin-åtkomst
  const id = parseInt(req.params.id, 10);
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);

  if (result.changes === 0) { // Om ingen rad påverkades, betyder det att produkten inte fanns
    return res.status(404).json({ error: "Produkt hittades inte." });
  }
  res.status(200).json({ message: "Produkt borttagen." });
});

export default router;
