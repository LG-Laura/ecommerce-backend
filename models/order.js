const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const OrderStatus = require('./orderStatus');

// Modelo de Orden/Compra
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    orderStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'OrderStatuses',
            key: 'id'
        }
    }
});

// Relaciones
User.hasMany(Order, { foreignKey: 'userId', as: 'ordenes' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

OrderStatus.hasMany(Order, { foreignKey: 'orderStatusId', as: 'ordenes' });
Order.belongsTo(OrderStatus, { foreignKey: 'orderStatusId', as: 'estado' });


module.exports = Order;

