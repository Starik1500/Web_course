const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const HOST = 'localhost';
const SECRET_KEY = 'simple_key';

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: HOST,
    user: 'root',
    password: '123456789',
    database: 'planesdb'
});

db.connect(err => {
    if (err) throw err;
    console.log('Підключено до MySQL');
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.error('Токен не надано');
    return res.status(401).json({ error: 'Токен не надано' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Помилка перевірки токена:', err);
      return res.status(403).json({ error: 'Недійсний токен' });
    }
    req.user = user; 
    next();
  });
};

app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  const loginQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(loginQuery, [email], (err, results) => {
    console.log('Database query results:', results); 
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      console.log('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    const storedHashedPassword = results[0].password;
    bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
      console.log('Password comparison result:', isMatch); 
      if (err) {
        console.error('Bcrypt comparison error:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (!isMatch) {
        console.log('Incorrect password');
        return res.status(400).json({ error: 'Incorrect password' });
      }

      const user = { id: results[0].id, email: results[0].email };
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Успішний вхід', token });
      });
    });
  });



app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
      }

      const insertQuery = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [firstName, lastName, email, hashedPassword], (err, results) => {
          if (err) {
              console.error('Error registering user:', err);
              return res.status(500).json({ error: 'Error registering user' });
          }
          res.status(200).json({ message: 'User registered successfully' });
      });
  });
});

app.get('/api/planes', authenticateToken, (req, res) => {
  const { searchText = '', priceFilter = 'price', categoryFilter = 'category' } = req.query;
  let query = 'SELECT * FROM planes WHERE 1=1';
  const params = [];

  if (searchText) {
      const trimmedText = searchText.trim().toLowerCase();
      query += ' AND LOWER(name) LIKE ?';
      params.push(`%${trimmedText}%`);
  }

  if (categoryFilter && categoryFilter !== 'category') {
      query += ' AND category = ?';
      params.push(categoryFilter);
  }

  if (priceFilter === 'Low to High') {
      query += ' ORDER BY price ASC';
  } else if (priceFilter === 'High to Low') {
      query += ' ORDER BY price DESC';
  }

  db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ error: 'Помилка запиту до бази даних' });
      res.json(results);
  });
});


app.get('/api/planes/:id', (req, res) => {
    const { id } = req.params;
    console.log("Отримано ID:", id);
    const query = 'SELECT * FROM planes WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Помилка запиту:', err);
            return res.status(500).json({ error: 'Помилка запиту до бази даних' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { item_id, quantity, selected_option } = req.body;

  db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: 'Не вдалося почати транзакцію' });

      const checkQuery = 'SELECT * FROM cart WHERE user_adress = ? AND item_id = ? AND selected_option = ? FOR UPDATE';
      db.query(checkQuery, [userId, item_id, selected_option], (err, results) => {
          if (err) {
              return db.rollback(() => res.status(500).json({ error: 'Помилка запиту до корзини' }));
          }

          if (results.length > 0) {
              const totalQuantity = results[0].quantity + quantity;

              if (totalQuantity > 10) {
                  return db.rollback(() => res.status(400).json({ error: 'Кількість не може перевищувати 10' }));
              }

              const updateQuery = 'UPDATE cart SET quantity = quantity + ? WHERE user_adress = ? AND item_id = ? AND selected_option = ?';
              db.query(updateQuery, [quantity, userId, item_id, selected_option], (err) => {
                  if (err) {
                      return db.rollback(() => res.status(500).json({ error: 'Помилка оновлення корзини' }));
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => res.status(500).json({ error: 'Не вдалося завершити транзакцію' }));
                      }
                      res.status(200).json({ message: 'Корзина оновлена' });
                  });
              });
          } else {
              if (quantity > 10) {
                  return db.rollback(() => res.status(400).json({ error: 'Кількість не може перевищувати 10' }));
              }

              const insertQuery = 'INSERT INTO cart (user_adress, item_id, quantity, selected_option) VALUES (?, ?, ?, ?)';
              db.query(insertQuery, [userId, item_id, quantity, selected_option], (err) => {
                  if (err) {
                      return db.rollback(() => res.status(500).json({ error: 'Помилка додавання до корзини' }));
                  }

                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => res.status(500).json({ error: 'Не вдалося завершити транзакцію' }));
                      }
                      res.status(201).json({ message: 'Товар додано до корзини' });
                  });
              });
          }
      });
  });
});


app.get('/api/cart/:token', (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
          console.error('Помилка перевірки токена:', err);
          return res.status(403).json({ error: 'Недійсний токен' });
      }

      const userId = user.id;

      const query = `
          SELECT cart.id, cart.item_id, cart.quantity, cart.selected_option, 
                 planes.name, planes.price, planes.img
          FROM cart
          JOIN planes ON cart.item_id = planes.id
          WHERE cart.user_adress = ?;
      `;

      db.query(query, [userId], (err, results) => {
          if (err) {
              console.error('Помилка запиту до корзини:', err);
              return res.status(500).json({ error: 'Помилка запиту до корзини' });
          }

          res.status(200).json(results);
      });
  });
});

app.put('/api/cart/:id', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const { id } = req.params; 
  const { quantity } = req.body;

  if (quantity < 1) {
      return res.status(400).json({ error: 'Кількість не може бути меншою за 1' });
  }

  const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_adress = ? AND id = ?';
  db.query(updateQuery, [quantity, userId, id], (err, results) => {
      if (err) {
          console.error('Помилка оновлення кількості в корзині:', err);
          return res.status(500).json({ error: 'Помилка оновлення кількості в корзині' });
      }

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Кількість успішно оновлена' });
      } else {
          res.status(404).json({ error: 'Товар не знайдено в корзині' });
      }
  });
});


app.delete('/api/cart/clear', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'DELETE FROM cart WHERE user_adress = ?';
  db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Помилка очищення корзини' });

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Корзина очищена' });
      } else {
          res.status(404).json({ message: 'Корзина не знайдена' });
      }
  });
});

app.delete('/api/cart/clear/:token', (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
          console.error('Помилка перевірки токена:', err);
          return res.status(403).json({ error: 'Недійсний токен' });
      }

      const userId = user.id;

      const clearCartQuery = 'DELETE FROM cart WHERE user_adress = ?';
      db.query(clearCartQuery, [userId], (err, results) => {
          if (err) {
              console.error('Помилка очищення корзини:', err);
              return res.status(500).json({ error: 'Помилка очищення корзини' });
          }

          if (results.affectedRows > 0) {
              res.status(200).json({ message: 'Корзина успішно очищена' });
          } else {
              res.status(404).json({ message: 'Корзина вже порожня' });
          }
      });
  });
});

app.post('/api/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const clearCartQuery = 'DELETE FROM cart WHERE user_adress = ?';
  db.query(clearCartQuery, [userId], (err, results) => {
      if (err) {
          console.error('Помилка очищення корзини:', err);
          return res.status(500).json({ error: 'Помилка очищення корзини' });
      }

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Корзина успішно очищена' });
      } else {
          res.status(404).json({ message: 'Корзина вже порожня' });
      }
  });
});

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM cart WHERE user_adress = ? AND id = ?';
  db.query(deleteQuery, [userId, id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Помилка видалення товару з корзини' });

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Товар успішно видалено з корзини' });
      } else {
          res.status(404).json({ error: 'Товар не знайдено в корзині' });
      }
  });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://${HOST}:${PORT}`);
});