const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./category'); // Importar el modelo de Categoría

// Definir el modelo de Producto
const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,  
        validate: {
            notEmpty: true  
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,  
        validate: {
            notEmpty: true 
        }
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,  
        validate: {
            isFloat: true, 
            min: 0  
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,  
        validate: {
            isInt: true,  
            min: 0  
        }
    },
    imageUrl: {
        type: DataTypes.STRING,  
        allowNull: true,  
        // validate: {
        //     isUrl: true  // Validar que sea una URL válida si es proporcionada
        // }
    }
});

// Definir la relación: un producto pertenece a una categoría
Product.belongsTo(Category, {
    foreignKey: 'categoriaId',  
    as: 'categoria' 
});

// La relación inversa, donde una categoría tiene muchos productos
Category.hasMany(Product, {
    foreignKey: 'categoriaId', 
    as: 'productos'  
});

module.exports = Product;
