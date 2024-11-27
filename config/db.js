// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); 

// Crea instancia de Sequelize con los datos de conexión
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, 
    dialect: 'postgres',          
});

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

