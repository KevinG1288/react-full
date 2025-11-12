const express = require('express');
const cors = require('cors');  // ← DEBE ESTAR AQUÍ
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');  // ← ASEGÚRATE QUE ESTÉ

const app = express();
const PORT = 5001;

app.use(cors());  // ← DEBE ESTAR AQUÍ (ANTES de las rutas)
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);  // ← ASEGÚRATE QUE ESTÉ

app.get('/', (req, res) => {
  res.json({ message: 'API de Usuarios funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});