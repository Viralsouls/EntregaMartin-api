import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// Helper: validar producto (para POST y PUT)
function validateProduct(data, isUpdate = false) {
  const { title, description, code, price, status, stock, category, thumbnails } = data;

  if (!isUpdate) { // POST requiere todos los campos
    if (
      !title || typeof title !== 'string' ||
      !description || typeof description !== 'string' ||
      !code || typeof code !== 'string' ||
      typeof price !== 'number' ||
      typeof status !== 'boolean' ||
      typeof stock !== 'number' ||
      !category || typeof category !== 'string' ||
      !Array.isArray(thumbnails) || !thumbnails.every(t => typeof t === 'string')
    ) {
      return false;
    }
  } else { // PUT permite actualizar solo campos válidos
    const allowedFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    for (const key in data) {
      if (!allowedFields.includes(key)) return false;

      const val = data[key];
      switch(key) {
        case 'title':
        case 'description':
        case 'code':
        case 'category':
          if (typeof val !== 'string') return false;
          break;
        case 'price':
        case 'stock':
          if (typeof val !== 'number') return false;
          break;
        case 'status':
          if (typeof val !== 'boolean') return false;
          break;
        case 'thumbnails':
          if (!Array.isArray(val) || !val.every(t => typeof t === 'string')) return false;
          break;
      }
    }
  }
  return true;
}

// GET /api/products/
router.get('/', async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await productManager.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// POST /api/products/
router.post('/', async (req, res) => {
  const productData = req.body;
  if (!validateProduct(productData)) {
    return res.status(400).json({ error: 'Datos de producto inválidos o incompletos' });
  }

  try {
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
  console.error('Error creando producto:', error.message);
  res.status(500).json({ error: 'Error al crear producto', detail: error.message });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const updates = req.body;

  if ('id' in updates) return res.status(400).json({ error: 'No se puede modificar el id del producto' });
  if (!validateProduct(updates, true)) return res.status(400).json({ error: 'Datos inválidos para actualizar' });

  const product = await productManager.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  try {
    const updatedProduct = await productManager.updateProduct(pid, updates);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await productManager.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  try {
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;