const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function authMiddleware(req, res, next) {
    // Obtener el token del header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Autorización denegada: formato de token incorrecto' });
    }

    // Extraer el token
    const token = authHeader.replace('Bearer ', '');

    // Log del token para depuración (siempre se muestra en desarrollo)
    console.log('Token recibido:', token);

    if (!token) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar los datos del usuario en la request
        next(); // Continua a la siguiente función o ruta
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expirado' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token no válido' });
        } else {
            // Para cualquier otro tipo de error
            return res.status(500).json({ msg: 'Error en la validación del token' });
        }
    }
}

module.exports = authMiddleware;

