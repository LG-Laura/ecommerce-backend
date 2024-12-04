const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Modelo de Estado de la Orden
const OrderStatus = sequelize.define('OrderStatus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false // Opcional: Si no necesitas manejar createdAt/updatedAt
});

module.exports = OrderStatus;
