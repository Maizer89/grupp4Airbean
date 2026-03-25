import Databas from 'better-sqlite3'

const db = new Databas('./data/Airbean.db')

db.exec(``)

export default db;