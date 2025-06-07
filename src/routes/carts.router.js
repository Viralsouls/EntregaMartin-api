import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

// POST /api/carts/ => crea carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: 'Error creando carrito', detail: error.message });
  }
});

// GET /api/carts/:cid => listar productos del carrito
router.get('/:cid', async (req, res) => {
  const cid = Number(req.params.cid);
  const cart = await cartManager.getById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid => agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(updatedCart);
  } catch {
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

export default router;