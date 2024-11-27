const express = require('express');
const Product = require('../models/product');
const Category = require('../models/category');
const router = express.Router();

// Obtener todos los productos con sus categorías
router.get('/all', async (req, res) => {
    try {
        const productos = await Product.findAll({
            include: [{ model: Category, as: 'categoria' }]
        });
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error del servidor');
    }
});

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Category.findAll();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).send('Error del servidor');
    }
});

// Obtener todos los productos por categoría
router.get('/productosPorCategoria', async (req, res) => {
    try {
        const categorias = await Category.findAll({
            include: [{ 
                model: Product,
                as: 'productos',  // Alias que asocia los productos
                limit: 5, // Limitar a 5 productos
                //order: [['vendidos', 'DESC']] // Ordenar por los más vendidos
            }]
        });
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error del servidor');
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).send('Error del servidor');
    }
});

// Agregar nuevo producto
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoriaId, imageUrl } = req.body;
        
        // Verificar que la categoría exista
        const categoria = await Category.findByPk(categoriaId);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const nuevoProducto = await Product.create({
            nombre,
            descripcion,
            precio,
            stock,
            categoriaId,
            imageUrl
        });
        
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear producto');
    }
});


// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Verificar si el producto existe en la base de datos
        const product = await Product.findByPk(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Eliminar el producto
        await product.destroy();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error del servidor');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { nombre, descripcion, precio, stock, categoriaId, imageUrl } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await product.update({ nombre, descripcion, precio, stock, categoriaId, imageUrl });
        res.status(200).json({ message: 'Producto actualizado correctamente', product });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error del servidor');
    }
});


module.exports = router;

