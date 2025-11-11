const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST - Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email y contraseña son obligatorios' 
    });
  }
  
  const query = 'SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({
        error: 'Error en el servidor',
        details: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Login exitoso
    res.json({
      message: 'Login exitoso',
      user: results[0]
    });
  });
});

module.exports = router;