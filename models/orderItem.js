const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('./order');
const Product = require('./product');

// Modelo de Detalle de Orden (Productos en la compra)
const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // ID autoincremental
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1 // Al menos 1 producto
        }
    },
    precioUnitario: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.cantidad * this.precioUnitario; // Cálculo del subtotal
        }
    }
});

// Relación: Una orden tiene muchos productos
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'detalles' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'orden' });

// Relación: Un producto puede estar en múltiples órdenes
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'ordenes' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'producto' });

module.exports = OrderItem;
