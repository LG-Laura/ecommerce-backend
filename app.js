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

const cartRoutes = require('./routes/cart');


// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar la aplicación
const app = express();
app.use(express.json()); // Asegúrate de que esta línea esté presente

// Usar CORS
app.use(cors());

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




// Sincroniza el modelo con la base de datos
const syncModels = async () => {
    try {
        await Role.sync({ force: false });
        await User.sync({ force: false });
        await Category.sync({ force: false });
        await Product.sync({ force: false });
        await OrderStatus.sync({ force: false   });
        await Order.sync({ force: false });  
        await OrderItem.sync({ force: false });
        await Cart.sync({ force: false  });

        // Agregar roles por defecto si no existen
        const rolesExist = await Role.count();
        if (rolesExist === 0) {
            await Role.bulkCreate([
                { nombre: 'admin' },
                { nombre: 'user' }
            ]);
        }

        // OrderStatus si está vacío
        const estadosExistentes = await OrderStatus.count();
        if (estadosExistentes === 0) {
            await OrderStatus.bulkCreate([
                { nombre: "En Carrito", descripcion: "Orden en proceso de compra" },
                { nombre: "Finalizada", descripcion: "Compra completada" },
                { nombre: "Cancelada", descripcion: "Orden descartada" },
              ]);              
        }

        console.log('Tablas sincronizadas.');
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
