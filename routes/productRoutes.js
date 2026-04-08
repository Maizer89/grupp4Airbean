import { Router } from "express";
//import { v4 as uuidv4 } from 'uuid';  //ANVÄND OM VI VILL HA UNIKA ID PÅ PRODUCTER? KANSKE BLIR SVÅRT ATT SÖKA PÅ ID?
import db from "../data/db.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { validateProducts } from "../middleware/validateProducts.js"

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
})

// Lägg till produkt (admin):
router.post("/menu", requireAdmin, validateProducts, (req, res) => { // Lägg till en ny produkt i menyn, kräver admin-åtkomst
  const { title, price, desc } = req.body;
  const createdAt = new Date().toISOString(); // Skapa en tidsstämpel för när produkten skapades
  
  const existingProducts = db.prepare('SELECT title FROM products WHERE title = ?').get(title)

    if (existingProducts)  {
      return res.status(400).json({ fel: "Produkten finns redan" })
    }
  
  const result = db // Infoga den nya produkten i databasen
    .prepare(
      `
        INSERT INTO products (title, price, \`desc\`, createdAt)
        VALUES (?, ?, ?, ?)
    `,
    ).run(title, price, desc, createdAt);

  res.status(201).json({ id: result.lastInsertRowid, title, price, desc }); // Returnera den nya produkten som JSON med statuskod 201 (Created)
});


export default router;
