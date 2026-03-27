import Database from "better-sqlite3";
import { menu } from "../routes/menu.js";

const db = new Database("./data/cafeMenu.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS cafeMenu (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    desc  TEXT NOT NULL,
    price INTEGER NOT NULL
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM cafeMenu').get();

if (count.count === 0) {
  const insert = db.prepare('INSERT INTO cafeMenu (id, title, desc, price) VALUES (?, ?, ?, ?)');
  menu.forEach(item => insert.run(item.id, item.title, item.desc, item.price));
  console.log('Menu seeded successfully');
}

export default db;