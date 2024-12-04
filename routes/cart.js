const express = require('express');
// const Cart  = require('../models/cart');
// const Order = require('../models/order');
// const OrderItem = require('../models/orderItem');
// const orderStatus = require('../models/orderStatus');
// const Product = require('../models/product');
const { getCartByUserId, saveCart, deleteProductFromCart } = require('../controllers/cartController');
const router = express.Router();


// Rutas del carrito
router.get('/:userId/cart', getCartByUserId); // Obtener carrito
router.post('/:userId/cart', saveCart); // Guardar carrito
router.delete('/:userId/cart/:productId', deleteProductFromCart);

module.exports = router;
//loagregue 20/11/08:58