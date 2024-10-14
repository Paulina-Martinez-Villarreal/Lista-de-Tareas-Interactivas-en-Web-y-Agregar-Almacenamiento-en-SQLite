const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu MySQL no está en localhost
    user: 'root', // Reemplaza con tu usuario de MySQL
    password: '1234', // Reemplaza con tu contraseña de MySQL
    database: 'tareas_db' // Reemplaza con el nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Usa path.join para construir la ruta
});

// Ruta para obtener tareas
app.get('/tareas', (req, res) => {
    db.query('SELECT * FROM tareas', (err, results) => { // Asegúrate de que el nombre de la tabla sea 'tareas'
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para agregar una tarea
app.post('/tareas', (req, res) => {
    const newTask = req.body;
    db.query('INSERT INTO tareas SET ?', newTask, (err, result) => { // Cambia tasks por tareas
        if (err) throw err;
        res.status(201).json({ id: result.insertId, ...newTask });
    });
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('DELETE FROM tareas WHERE id = ?', taskId, (err, result) => { // Cambia tasks por tareas
        if (err) throw err;
        res.sendStatus(204);
    });
});

// Ruta para eliminar todas las tareas
app.delete('/tareas', (req, res) => {
    db.query('DELETE FROM tareas', (err) => { // Cambia tasks por tareas
        if (err) throw err;
        res.sendStatus(204);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
