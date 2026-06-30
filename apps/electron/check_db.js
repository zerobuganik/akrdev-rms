const Database = require('better-sqlite3');
const db = new Database('D:/AI Project/AKRDev RMS/apps/electron/data/local.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log(JSON.stringify(tables, null, 2));
db.close();
