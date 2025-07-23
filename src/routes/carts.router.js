import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';

const router = Router();

// --- RUTA POST PARA AGREGAR PRODUCTOS ---
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products = cart.products.filter(item => item.product !== null);
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        const updatedCart = await CartModel.findById(cid).populate('products.product');
        res.status(200).json({ status: 'success', payload: updatedCart });

    } catch (error) {
        console.error('Error agregando producto al carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// --- OTRAS RUTAS DEL CARRITO ---
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

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        if (!Array.isArray(products)) return res.status(400).json({ status: 'error', message: 'Formato de productos inválido' });

        const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

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

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        let cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product && item.product.toString() !== pid);
        await cart.save();
        
        const updatedCart = await CartModel.findById(cid).populate('products.product');
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

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