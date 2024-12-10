const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const User = require('./models/user');
const Product = require('./models/product');
const Category = require('./models/category');
const Cart = require('./models/cart');
const cors = require('cors');
const Role = require('./models/role');
const path = require('path');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');
const OrderStatus = require('./models/orderStatus');
const bcrypt = require('bcryptjs');

const cartRoutes = require('./routes/cart');


// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la aplicación
const app = express();
app.use(express.json()); // Asegúrate de que esta línea esté presente

//app.use(cors());
app.use(cors({
    origin: 'https://ecommerce-frontend-cade.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Middleware para manejar JSON
app.use(bodyParser.json());

// Ruta registro y login
app.use('/api/auth', require('./routes/auth'));
// Ruta productos
app.use('/api/products', require('./routes/products'));
// Ruta imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Ruta cart
// Ruta cart (descomentar y agregar la ruta correcta)
app.use('/api/users', cartRoutes);


const syncModels = async () => {
    try {
        await Role.sync({ force: false });
        await User.sync({ force: false });
        await Category.sync({ force: true });
        await Product.sync({ force: true });
        await OrderStatus.sync({ force: false });
        await Order.sync({ force: false });
        await OrderItem.sync({ force: false });
        await Cart.sync({ force: false });

        // Agregar roles por defecto si no existen
        const rolesExist = await Role.count();
        if (rolesExist === 0) {
            await Role.bulkCreate([
                { nombre: 'admin' },
                { nombre: 'user' }
            ]);
        }

// //         // Crear usuario administrador por defecto
// const adminEmail = 'admin@ecommerce.com';
// const adminPassword = 'admin123'; // Cambia esta contraseña si es necesario

// const adminExistente = await User.findOne({ where: { email: adminEmail } });

// if (!adminExistente) {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(adminPassword, salt);

//     await User.create({
//         nombre: 'Administrador',
//         apellido: 'General',
//         telefono: '1234567890',
//         email: adminEmail,
//         password: hashedPassword,
//         roleId: 1 // Asigna el rol "admin" con ID 1
//     });

//     console.log('Usuario administrador creado con éxito.');
// } else {
//     console.log('Usuario administrador ya existe.');
// }

        // Agregar estados de orden por defecto si no existen
        const estadosExistentes = await OrderStatus.count();
        if (estadosExistentes === 0) {
            await OrderStatus.bulkCreate([
                { nombre: "En Carrito", descripcion: "Orden en proceso de compra" },
                { nombre: "Finalizada", descripcion: "Compra completada" },
                { nombre: "Cancelada", descripcion: "Orden descartada" },
            ]);
        }

        // Agregar categorías por defecto si no existen
        const categoriasExistentes = await Category.count();
        if (categoriasExistentes === 0) {
            await Category.bulkCreate([
                { nombre: 'Tecnologia' },
                { nombre: 'Moda' },
                { nombre: 'Hogar' },
                { nombre: 'Deportes' },
            ]);
        }

        // Agregar productos por defecto si no existen
        const productosExistentes = await Product.count();
        if (productosExistentes === 0) {
            await Product.bulkCreate(
                [
                    {
                        nombre: 'Reloj Inteligente Apple Watch Series 8',
                        descripcion: 'El Apple Watch Series 8 incluye monitorización de salud avanzada, seguimiento de actividad física y notificaciones inteligentes. Compatible con iOS, ideal para quienes buscan mantenerse conectados y saludables.',
                        precio: 399000,
                        stock: 30,
                        imageUrl: 'http://ecommerce-backend-vevb.onrender.com/uploads/imgAppleWatch.png',
                        categoriaId: 1,
                    },
                    {
                        nombre: 'PlayStation 5',
                        descripcion: 'Consola de videojuegos de última generación con gráficos impresionantes y un catálogo de juegos exclusivo. Incluye control DualSense para una experiencia de juego inmersiva.',
                        precio: 499000,
                        stock: 50,
                        imageUrl: 'http://ecommerce-backend-vevb.onrender.com/uploads/imgPlayStation5.png',
                        categoriaId: 1,
                    },
                    {
                        nombre: 'Smartphone Samsung Galaxy S23 Plus 512gb',
                        descripcion: 'El Samsung Galaxy S23 es un smartphone de alta gama con una pantalla AMOLED de 6.1 pulgadas, procesador Snapdragon 8 Gen 2 y una cámara principal de 50 MP. Ideal para quienes buscan un rendimiento excepcional y una experiencia multimedia envolvente.',
                        precio: 2199000,
                        stock: 30,
                        imageUrl: 'http://ecommerce-backend-vevb.onrender.com/uploads/imgSmartphoneSamsung.png',
                        categoriaId: 1,
                    },
                    {
                        nombre: 'Dron DJI Mini 2',
                        descripcion: 'Dron compacto y ligero con cámara 4K, ideal para capturar vistas aéreas impresionantes. Ofrece hasta 31 minutos de tiempo de vuelo y es fácil de usar para principiantes.',
                        precio: 1699000,
                        stock: 30,
                        imageUrl: 'http://ecommerce-backend-vevb.onrender.com/uploads/imgDron.png',
                        categoriaId: 1,
                    },
                ],
                { updateOnDuplicate: ['descripcion', 'precio', 'stock', 'imageUrl', 'categoriaId'] }
            );
            console.log('Productos actualizados o agregados.');
            
        }

        console.log('Tablas sincronizadas y datos iniciales agregados.');
    } catch (error) {
        console.error('Error al sincronizar tablas:', error);
    }
};



syncModels();

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
