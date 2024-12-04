// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); 

// Configuración de Sequelize para PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME,        
    process.env.DB_USER,        
    process.env.DB_PASSWORD,    
    {
        host: process.env.DB_HOST, 
        dialect: 'postgres',       
        logging: false,            
        port: process.env.DB_PORT || 5432, 
    }
);

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

