const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Definir el modelo de Rol
const Role = sequelize.define('Role', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        //unique: true
    }
});

module.exports = Role;
