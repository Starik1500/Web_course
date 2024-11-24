const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;
const HOST = 'localhost';

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

      console.log('Login successful');
      res.status(200).json({
        message: 'Login successful',
        userId: results[0].id,
        email: results[0].email,
      });
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

app.get('/api/planes', (req, res) => {
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
    } else if (!categoryFilter || categoryFilter === 'category') {
    query += ''; 
    }

  if (priceFilter === 'Low to High') {
    query += ' ORDER BY price ASC';
    } else if (priceFilter === 'High to Low') {
    query += ' ORDER BY price DESC';
    }

  db.query(query, params, (err, results) => {
      if (err) {
          console.error('Error fetching planes:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }
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

app.post('/api/cart', (req, res) => {
    const { user_adress, item_id, quantity, selected_option } = req.body;
    console.log('Received data:', req.body)
    
    const checkQuery = 'SELECT * FROM cart WHERE user_adress = ? AND item_id = ? AND selected_option = ?';
    db.query(checkQuery, [user_adress, item_id, selected_option], (err, results) => {
        if (err) {
            console.error('Error checking cart:', err);  
            return res.status(500).json({ error: 'Error checking cart' });
        }

        console.log('Cart check results:', results);

        if (results.length > 0) {
          const existingItem = results[0];
          const totalQuantity = existingItem.quantity + quantity;

          if (totalQuantity > 10) {
              return res.status(400).json({ error: 'Total quantity cannot exceed 10 items' });
          }

          const updateQuery = 'UPDATE cart SET quantity = quantity + ? WHERE user_adress = ? AND item_id = ? AND selected_option = ?';
          db.query(updateQuery, [quantity, user_adress, item_id, selected_option], (err, updateResults) => {
              if (err) {
                  console.error('Error updating cart:', err);
                  return res.status(500).json({ error: 'Error updating cart' });
              }
              console.log('Cart updated:', updateResults);
              res.status(200).json({ message: 'Cart updated successfully' });
          });
        } else {
            if (quantity > 10) {
              return res.status(400).json({ error: 'Quantity cannot exceed 10 items' });
            }
            const insertQuery = 'INSERT INTO cart (user_adress, item_id, quantity, selected_option) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [user_adress, item_id, quantity, selected_option], (err, insertResults) => {
                if (err) {
                    console.error('Error adding item to cart:', err);
                    return res.status(500).json({ error: 'Error adding item to cart' });
                }
                console.log('Item added to cart:', insertResults);
                res.status(200).json({ message: 'Item added to cart' });
            });
        }
    });
});

app.get('/api/cart/:user_adress', (req, res) => {
    const { user_adress } = req.params;
    const query = `
    SELECT cart.id, cart.user_adress, cart.item_id, cart.quantity, cart.selected_option, 
           planes.name, planes.price, planes.img
    FROM cart
    JOIN planes ON cart.item_id = planes.id
    WHERE cart.user_adress = ?;
  `;

  db.query(query, [user_adress], (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ error: 'Error fetching cart' });
    }

    res.status(200).json(results);
  });
});

app.put('/api/cart/:user_adress/:id', (req, res) => {
  const { user_adress, id } = req.params;
  const { quantity } = req.body;

  console.log('Received data for update:', req.body);

  const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_adress = ? AND id = ?';
  db.query(updateQuery, [quantity, user_adress, id], (err, results) => {
    if (err) {
      console.error('Error updating quantity in cart:', err);
      return res.status(500).json({ error: 'Error updating quantity in cart' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  });
});

app.delete('/api/cart/clear/:user_adress', (req, res) => {
  let { user_adress } = req.params;
  user_adress = Number(user_adress);
  
  if (isNaN(user_adress)) {
    console.error('Invalid user_adress:', req.params.user_adress);
    return res.status(400).json({ error: 'Invalid user_adress value' });
  }
  const query = 'DELETE FROM cart WHERE user_adress = ?';
  db.query(query, [user_adress], (err, results) => {
    if (err) {
      console.error('Error clearing cart:', err);
      return res.status(500).json({ error: 'Error clearing cart' });
    }
    
    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Cart cleared successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found for this user' });
    }
  });
});

app.delete('/api/cart/:user_adress/:id', (req, res) => {
    const { user_adress, id } = req.params;
    const query = 'DELETE FROM cart WHERE user_adress = ? AND id = ?';

    db.query(query, [user_adress, id], (err, results) => {
    if (err) {
      console.error('Error removing item from cart:', err);
      return res.status(500).json({ error: 'Error removing item from cart' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  });
});


app.listen(PORT, () => {
    console.log(`Сервер працює на http://${HOST}:${PORT}`);
});