const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
function authMiddleware(req, res, next) {
    // Obtener el token del header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Authorization header:', token); // Log del token

    if (!token) {
        return res.status(401).json({ msg: 'No token, autorización denegada' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar los datos del usuario en la request
        next(); // Continua a la siguiente función o ruta
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}

module.exports = authMiddleware;
