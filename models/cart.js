const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Product = require('./product');
const OrderStatus = require('./orderStatus'); // Asegúrate de importar el modelo de OrderStatus

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: 0 // No se permite cantidad negativa
        }
    },

}, {
    timestamps: true,
    uniqueKeys: {
        userProductUnique: {
            fields: ['userId', 'productId'] // Evitar duplicados para un mismo usuario y producto
        }
    }
});

// Relaciones
Cart.belongsTo(User, { foreignKey: 'userId'});
Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;






