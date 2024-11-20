const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { searchQuery, sortBy, category } = req.query;

  let sql = 'SELECT * FROM planes WHERE 1 = 1';
  const params = [];

  if (searchQuery) {
    sql += ' AND name LIKE ?';
    params.push(`%${searchQuery}%`);
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM planes WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(`Error fetching item with ID ${id}:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]);
  });
});

router.post('/', (req, res) => {
  const { name, category, price } = req.body;
  db.query(
    'INSERT INTO planes (name, category, price) VALUES (?, ?, ?)',
    [name, category, price],
    (err, results) => {
      if (err) {
        console.error('Error creating item:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: results.insertId, name, category, price });
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price } = req.body;
  db.query(
    'UPDATE planes SET name = ?, category = ?, price = ? WHERE id = ?',
    [name, category, price, id],
    (err) => {
      if (err) {
        console.error(`Error updating item with ID ${id}:`, err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id, name, category, price });
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM planes WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(`Error deleting item with ID ${id}:`, err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(204).send();
  });
});

module.exports = router;
