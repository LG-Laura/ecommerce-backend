const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./category'); // Importar el modelo de Categoría

// Definir el modelo de Producto
const Product = sequelize.define('Product', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,  // El nombre no puede ser nulo
        validate: {
            notEmpty: true  // Validar que no esté vacío
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,  // La descripción no puede ser nula
        validate: {
            notEmpty: true  // Validar que no esté vacío
        }
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,  // El precio no puede ser nulo
        validate: {
            isFloat: true,  // Validar que sea un número decimal
            min: 0  // El precio no puede ser menor a 0
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,  // El stock no puede ser nulo
        validate: {
            isInt: true,  // Validar que sea un número entero
            min: 0  // El stock no puede ser negativo
        }
    },
    imageUrl: {
        type: DataTypes.STRING,  // Almacenar la URL de la imagen
        allowNull: true,  // La imagen es opcional
        // validate: {
        //     isUrl: true  // Validar que sea una URL válida si es proporcionada
        // }
    }
});

// Definir la relación: un producto pertenece a una categoría
Product.belongsTo(Category, {
    foreignKey: 'categoriaId',  // La clave foránea en la tabla de productos
    as: 'categoria'  // Alias para acceder a la categoría desde el producto
});

// La relación inversa, donde una categoría tiene muchos productos
Category.hasMany(Product, {
    foreignKey: 'categoriaId',  // La clave foránea en la tabla de productos
    as: 'productos'  // Alias para acceder a los productos desde la categoría
});

module.exports = Product;
