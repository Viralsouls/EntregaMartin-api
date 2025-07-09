import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.render('home', { title: 'Home - Productos', products });
});

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

export default router;