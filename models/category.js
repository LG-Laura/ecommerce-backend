const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Product = require('./product'); // Importar el modelo de Producto

// Definir el modelo de Categoría
const Category = sequelize.define('Category', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
});



module.exports = Category;
