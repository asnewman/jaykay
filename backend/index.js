const { Server } = require('@hocuspocus/server');
const { Database } = require('@hocuspocus/extension-database');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const db = new sqlite3.Database('./knowledge.db');

// Middleware for parsing JSON
app.use(bodyParser.json());

// Initialize the database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id INTEGER,
      title TEXT NOT NULL,
      content TEXT DEFAULT '', -- Content of the document stored here
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES documents (id)
    )
  `);
  console.log('Database initialized.');
});

// Express API Routes
app.post('/documents', (req, res) => {
  const { parent_id, title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    `INSERT INTO documents (parent_id, title, content) VALUES (?, ?, ?)`,
    [parent_id, title, content || ''],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, parent_id, title });
    }
  );
});

app.get('/documents', (req, res) => {
  db.all(`SELECT * FROM documents ORDER BY title`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/documents/:id', (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(row);
  });
});

// Start the Express server
const expressPort = 3000;
app.listen(expressPort, () => {
  console.log(`Express server running at http://localhost:${expressPort}`);
});

// Hocuspocus Server Integration
const hocuspocusServer = Server.configure({
  port: 3001,
  extensions: [
    new Database({
      fetch: async ({documentName}) => {
        console.log(`Loading document: ${documentName}`);
        return new Promise((resolve, reject) => {
          db.get(
            `SELECT content FROM documents WHERE title = ?`,
            [documentName],
            (err, row) => {
              if (err) {
                console.error(err);
                return reject(err);
              }
              if (!row) {
                console.warn(`Document ${documentName} not found. Creating new.`);
                db.run(
                  `INSERT INTO documents (title, content) VALUES (?, '')`,
                  [documentName],
                  function (insertErr) {
                    if (insertErr) {
                      console.error(insertErr);
                      return reject(insertErr);
                    }
                    resolve('');
                  }
                );
              } else {
                resolve(row.content || '');
              }
            }
          );
        });
      },
      store: async ({documentName, state}) => {
        console.log(`Storing document: ${documentName}`);
        const content = state; // Assuming state is a string; adjust for actual data type
        return new Promise((resolve, reject) => {
          db.run(
            `UPDATE documents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE title = ?`,
            [content, documentName],
            function (err) {
              if (err) {
                console.error(err);
                return reject(err);
              }
              resolve();
            }
          );
        });
      }
    })
  ],
});

hocuspocusServer.listen();
console.log('Hocuspocus server running on ws://localhost:3001');
