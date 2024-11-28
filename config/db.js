// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


// Configuración de Sequelize según el entorno
let sequelize;

if (process.env.NODE_ENV === 'development') {
    // Conexión a MySQL para entorno local
    sequelize = new Sequelize(
        process.env.DB_NAME,      // Nombre de la base de datos
        process.env.DB_USER,      // Usuario de MySQL
        process.env.DB_PASSWORD,  // Contraseña de MySQL
        {
            host: process.env.DB_HOST,    // Host (localhost para desarrollo)
            dialect: 'mysql',             // Dialecto MySQL
            port: process.env.DB_PORT || 5000,  // Puerto (3306 para MySQL)
            logging: true,                // Habilitar logs solo en desarrollo
        }
    );
} else {
    // Conexión a PostgreSQL para producción (Render)
    sequelize = new Sequelize(
        process.env.DB_NAME,      
        process.env.DB_USER,      
        process.env.DB_PASSWORD,  
        {
            host: process.env.DB_HOST,   
            dialect: 'postgres',          
            port: process.env.DB_PORT || 5432,  
            logging: false,               
        }
    );
}

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL exitosa');
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

