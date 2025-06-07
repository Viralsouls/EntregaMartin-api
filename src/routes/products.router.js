import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  res.json(await manager.getAll());
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getById(parseInt(req.params.pid));
  res.json(product ?? { error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const product = await manager.addProduct(req.body);
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(parseInt(req.params.pid), req.body);
  res.json(updated ?? { error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(parseInt(req.params.pid));
  res.status(204).send();
});

export default router;