import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';
import { TicketModel } from '../models/ticket.model.js';

const router = Router();

// --- OBTENER UN CARRITO ESPECÍFICO ---
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

// --- AGREGAR UN PRODUCTO AL CARRITO ---
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

// --- FINALIZAR LA COMPRA ---
router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productsToPurchase = [];
        const productsToKeepInCart = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            if (!item.product) continue; // Salta si el producto es null
            
            if (item.product.stock >= item.quantity) {
                productsToPurchase.push(item);
                totalAmount += item.product.price * item.quantity;
                await ProductModel.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } });
            } else {
                productsToKeepInCart.push(item);
            }
        }

        if (productsToPurchase.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No hay productos con stock suficiente para realizar la compra.' });
        }

        const ticket = await TicketModel.create({
            amount: totalAmount,
            purchaser: 'user@example.com', // Esto vendría de req.session.user.email
        });

        cart.products = productsToKeepInCart;
        await cart.save();

        res.status(200).json({ 
            status: 'success', 
            message: 'Compra realizada con éxito!', 
            ticket: ticket,
            productsNotInStock: productsToKeepInCart.map(item => item.product._id)
        });

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
    }
});

// --- ACTUALIZAR UN CARRITO COMPLETO CON UN ARRAY DE PRODUCTOS ---
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

// --- ACTUALIZAR LA CANTIDAD DE UN SOLO PRODUCTO ---
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

// --- ELIMINAR UN PRODUCTO DEL CARRITO ---
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

// --- VACIAR EL CARRITO ---
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