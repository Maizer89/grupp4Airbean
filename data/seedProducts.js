import fs from 'fs'
import db from './db.js'


function seedProducts() {
    const menuData = JSON.parse(fs.readFileSync('./data/menu.json', 'utf-8')).menu;
    
    const insert = db.prepare(`
        INSERT INTO products (title, price, desc)
        VALUES (?, ?, ?)
        `);
        
        const insertMany = db.transaction((products) => {
            for (const product of products) {
                insert.run(product.title, product.price, product.desc);
            }
        });
        
        const existing = db.prepare("SELECT COUNT(*) as count FROM products").get();
    
          if (existing.count === 0) {
              insertMany(menuData);
               console.log('menu.json har lagts till i databasen!')
              }
   
    }
    
export default seedProducts;