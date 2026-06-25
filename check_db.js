const { Database } = require('better-sqlite3')
const path = require('path')

// Check dev DB
const devDb = new Database(path.join(__dirname, 'apps', 'electron', 'data', 'local.db'))
const devTables = devDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
console.log('Dev DB tables:', devTables.map(r => r.name))

// Check asar.unpacked DB
const asarDbPath = path.join(__dirname, 'apps', 'electron', 'release', 'win-unpacked', 'resources', 'app.asar.unpacked', 'data', 'local.db')
if (require('fs').existsSync(asarDbPath)) {
  const asarDb = new Database(asarDbPath)
  const asarTables = asarDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log('Asar DB tables:', asarTables.map(r => r.name))
} else {
  console.log('Asar DB not found at:', asarDbPath)
}
