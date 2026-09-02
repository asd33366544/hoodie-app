const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function getDbConnection() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDbConnection();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      size TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

module.exports = {
  getDbConnection,
  initDb
};
