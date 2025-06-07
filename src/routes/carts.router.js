import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getById(parseInt(req.params.cid));
  res.json(cart ?? { error: 'Carrito no encontrado' });
});

router.post('/:cid/product/:pid', async (req, res) => {
  const updated = await manager.addProductToCart(
    parseInt(req.params.cid),
    parseInt(req.params.pid)
  );
  res.json(updated ?? { error: 'Carrito no encontrado' });
});

export default router;