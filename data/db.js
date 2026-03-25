import Databas from 'better-sqlite3'

const DB_PATH = process.env.DB_PATH || './data/Airbean.db'
const db = new Databas(DB_PATH)

db.exec(``)

export default db;