import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';

const router = Router();

// --- RUTA POST QUE FALTA PARA AGREGAR PRODUCTOS ---
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex > -1) {
            // Si el producto ya existe, incrementa la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si no existe, lo agrega al array con cantidad 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        // Devuelve una respuesta JSON válida
        res.status(200).json({ status: 'success', payload: cart });

    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});


// --- RUTAS QUE YA TENÍAS ---
// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findOne({ _id: req.params.cid }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        if (!Array.isArray(products)) return res.status(400).json({ status: 'error', message: 'Formato de productos inválido' });

        const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'La cantidad es inválida' });
        }
        
        const cart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).populate('products.product');

        if (!cart) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;