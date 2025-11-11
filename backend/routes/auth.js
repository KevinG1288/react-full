const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST - Login (sin validación de contraseña)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email y contraseña son obligatorios' 
    });
  }
  
  // Solo busca por email (sin validar password porque no existe en la BD)
  const query = 'SELECT id, nombre, email FROM usuarios WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({
        success: false,
        message: 'Error en el servidor',
        details: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }
    
    // Login exitoso
    res.json({
      success: true,
      message: 'Login exitoso',
      usuario: results[0]
    });
  });
});

module.exports = router;