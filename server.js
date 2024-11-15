const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcrypt');

// Configuración del servidor
const app = express();
const port = 3001;

// Habilitar CORS
app.use(cors());

// Analizar cuerpos JSON
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  user: 'PRACTICA-TIC\\samu',  // usuario 
  password: '', // No tengo contraseña 
  server: 'PRACTICA-TIC\\SQLEXPRESS', //  servidor 
  database: 'SamuDashboard', //  base de datos
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

// Ruta para probar el login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Conectar a la base de datos
    const pool = await sql.connect(dbConfig);

    // consulta por el usuario
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM usuario WHERE nombre_usuario = @username');

    // Verificar si existe
    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      // Comparar la contraseña que esta en la bd
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }
    } else {
      res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error.message);
    res.status(500).json({ message: 'Error en la conexión a la base de datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


