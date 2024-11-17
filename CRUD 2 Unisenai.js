const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_banco_de_dados'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    connection.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email], (err, results) => {
        if (err) throw err;
        res.status(201).json({ id: results.insertId, nome, email });
    });
});

app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json(results[0]);
    });
});

app.put('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nome, email } = req.body;
    connection.query('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json({ id, nome, email });
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.status(204).send();
    });
});