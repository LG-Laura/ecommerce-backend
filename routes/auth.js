const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail'); // Requiere SendGrid
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../routes/authMiddleware'); // Importar el middleware

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Función para enviar el correo de confirmación
const sendConfirmationEmail = (email, nombre) => {
    const msg = {
        to: email,
        from: 'lalopezgar@gmail.com', // Cambia esto a tu correo verificado en SendGrid
        subject: 'Confirmación de Registro',
        html: `<h1>Hola ${nombre},</h1><p>Gracias por registrarte. Tu cuenta ha sido creada exitosamente.</p>`,
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Correo de confirmación enviado');
        })
        .catch((error) => {
            console.error('Error al enviar el correo:', error);
        });
};

// Ruta de registro
router.post('/register', async (req, res) => {
    const { nombre, apellido, telefono, email, password } = req.body;

    // Validación básica
    if (!nombre || !apellido || !telefono || !email || !password) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({
            nombre,
            apellido,
            telefono,
            email,
            password: hashedPassword, // Almacenar la contraseña cifrada
        });

        // Enviar correo de confirmación
        sendConfirmationEmail(email, nombre);

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).send('Error del servidor');
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'usuario no encontrado.' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrectos.' });
        }

         // Crear un token JWT
         const token = jwt.sign(
            { id: user.id, email: user.email }, // Datos del usuario que se almacenarán en el token
            process.env.JWT_SECRET, // Llave secreta (asegúrate de definir esta variable en tu archivo .env)
            { expiresIn: '1h' } // El token expirará en 1 hora 
        );
        console.log('Token generado:', token); // Log del token

        // Enviar el token y algunos datos del usuario como respuesta
        res.json({
            msg: 'Inicio de sesión exitoso',
            token, // Aquí está el token que debe ser almacenado en el frontend
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });

        //res.status(200).json({ msg: 'Login exitoso', nombre: user.nombre }); // Envía el nombre del usuario en la respuesta
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).send('Error del servidor');
    }
});

// Ruta protegida, solo accesible si el token es válido
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ msg: `Bienvenido ${req.user.email}, tienes acceso a esta ruta protegida` });
});

module.exports = router;
