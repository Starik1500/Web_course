const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'planesdb'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/planes', (req, res) => {
    let { searchQuery = '', sortBy = '' } = req.query;
    searchQuery = searchQuery.toLowerCase();

    let query = "SELECT * FROM planes";
    
    if (searchQuery) {
        query += ` WHERE LOWER(name) LIKE '%${searchQuery}%'`;
    }

    if (sortBy === 'name') {
        query += " ORDER BY name";
    } else if (sortBy === 'fuel') {
        query += " ORDER BY fuelCapacity";
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching planes:', err);
            res.status(500).send('Server error');
        } else {
            const totalPassengers = results.reduce((acc, plane) => acc + plane.passengers, 0);
            const totalFuelCapacity = results.reduce((acc, plane) => acc + plane.fuelCapacity, 0);

            res.json({
                planes: results,
                totalPassengers,
                totalFuelCapacity
            });
        }
    });
});

app.get('/planes/:id', (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM planes WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching plane:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Plane not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.put('/planes/:id', (req, res) => {
    const { id } = req.params;
    const { name, passengers, fuelCapacity, image } = req.body;

    db.query(
        "UPDATE planes SET name = ?, passengers = ?, fuelCapacity = ?, image = ? WHERE id = ?",
        [name, passengers, fuelCapacity, image, id],
        (err, result) => {
            if (err) {
                console.error('Error updating plane:', err);
                res.status(500).send('Server error');
            } else if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Plane not found' });
            } else {
                res.json({ id, name, passengers, fuelCapacity, image });
            }
        }
    );
});

app.post('/planes', (req, res) => {
    console.log('Received data:', req.body); 

    const { name, passengers, fuelCapacity, image } = req.body;

    if (!name || !passengers || !fuelCapacity) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const sql = 'INSERT INTO planes (name, passengers, fuelCapacity, image) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, passengers, fuelCapacity, image], (err, result) => {
        if (err) {
            console.error('Error inserting plane:', err); 
            return res.status(500).json({ message: 'Error inserting plane into database' });
        } else {
            res.status(201).json({ id: result.insertId, name, passengers, fuelCapacity, image });
        }
    });
});

app.delete('/planes/:id', (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM planes WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Error deleting plane:', err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Plane not found' });
        } else {
            res.json({ message: 'Plane deleted successfully' });
        }
    });
});

app.delete('/planes', (req, res) => {
    db.query("DELETE FROM planes", (err, result) => {
        if (err) {
            console.error('Error deleting all planes:', err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json({ message: 'All planes deleted successfully' });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
