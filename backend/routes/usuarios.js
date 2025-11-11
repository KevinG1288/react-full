
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los usuarios
router.get('/', (req, res) => {
  const query = 'SELECT id, nombre, email, telefono, fecha_registro FROM usuarios ORDER BY id DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({
        error: 'Error al obtener usuarios',
        details: err.message
      });
    }
    res.json(results);
  });
});

// GET - Obtener usuario por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, nombre, email, telefono, fecha_registro FROM usuarios WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener usuario:', err);
      return res.status(500).json({
        error: 'Error al obtener usuario',
        details: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// POST - Crear nuevo usuario
router.post('/', (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  
  // Validaciones básicas
  if (!nombre || !email || !password) {
    return res.status(400).json({ 
      error: 'Nombre, email y contraseña son obligatorios' 
    });
  }
  
  const query = 'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)';
  
  db.query(query, [nombre, email, telefono, password], (err, result) => {
    if (err) {
      console.error('Error al crear usuario:', err);
      
      // Error de email duplicado
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }
      
      return res.status(500).json({
        error: 'Error al crear usuario',
        details: err.message
      });
    }
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });
  });
});

// PUT - Actualizar usuario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ 
      error: 'Nombre y email son obligatorios' 
    });
  }
  
  const query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?';
  
  db.query(query, [nombre, email, telefono, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          error: 'El email ya está registrado por otro usuario' 
        });
      }
      
      return res.status(500).json({
        error: 'Error al actualizar usuario',
        details: err.message
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario actualizado exitosamente' });
  });
});

// DELETE - Eliminar usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({
        error: 'Error al eliminar usuario',
        details: err.message
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

module.exports = router;