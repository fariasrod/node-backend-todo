const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(function () {
  db.run(`
  CREATE TABLE IF NOT EXISTS tbl_user (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS tbl_project (
    id INTEGER PRIMARY KEY,
    user INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES USER(id)
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS tbl_task (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT 0,
    creation_date TEXT NOT NULL,
    finish_date TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES PROJECT(id)
  )
`);
});

module.exports = db;
