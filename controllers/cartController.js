const Cart = require('../models/cart');
const Product = require('../models/product');

// Obtener carrito de un usuario
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID es requerido.' });
    }

    try {
        const cart = await Cart.findAll({
            where: { userId },
            include: [Product]
        });

        const normalizedCart = cart.map(item => ({
            productId: item.productId,
            cantidad: item.cantidad,
            nombre: item.Product.nombre,
            precio: item.Product.precio,
            imageUrl: item.Product.imageUrl
        }));

        res.json(normalizedCart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
};

// Guardar carrito al cerrar sesión
const saveCart = async (req, res) => {
    const { userId } = req.params;
    const { cartItems } = req.body;

    try {
        for (const item of cartItems) {
            const existingCartItem = await Cart.findOne({ where: { userId, productId: item.productId } });
            if (existingCartItem) {
                existingCartItem.cantidad = item.cantidad;
                await existingCartItem.save();
            } else {
                await Cart.create({ userId, productId: item.productId, cantidad: item.cantidad });
            }
        }
        res.status(200).json({ message: 'Carrito actualizado correctamente.' });
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
        res.status(500).json({ error: 'Error al guardar el carrito.' });
    }
};

// Eliminar producto del carrito
const deleteProductFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        await Cart.destroy({ where: { userId, productId } });
        res.json({ message: 'Producto eliminado del carrito.' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito.' });
    }
};

module.exports = { getCartByUserId, saveCart, deleteProductFromCart };
