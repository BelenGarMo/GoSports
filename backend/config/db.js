const mysql = require('mysql2');

// Estoy usando un pool de conexiones en lugar de una conexión única porque esta app puede tener varios usuarios accediendo a la base de datos al mismo tiempo.
// El pool maneja múltiples conexiones abiertas y las reutiliza de forma automática, mejorando el rendimiento y evitando errores de conexión.

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gosports_bdd'
});

module.exports = db;