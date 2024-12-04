// config/db.js
const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config(); 
// Configura Sequelize usando la URL de conexión proporcionada por Render
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, 
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false, 
        },
    },
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

