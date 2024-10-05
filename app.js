const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const User = require('./models/user');
const cors = require('cors'); // Importar CORS

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la aplicación
const app = express();
app.use(express.json()); // Asegúrate de que esta línea esté presente

// Usar CORS
app.use(cors());

// //permitir sólo ciertas URLs (como la de tu frontend)
// app.use(cors({
//     origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// Middleware para manejar JSON
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Sincroniza el modelo con la base de datos
const syncModels = async () => {
    try {
        await User.sync(); // Crea la tabla si no existe
        console.log('Tabla Usuario creada o ya existe.');
    } catch (error) {
        console.error('Error al crear la tabla Usuario:', error);
    }
};

syncModels();

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
