import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';

const router = Router();

// Redirección de la raíz a la vista de productos
router.get('/', (req, res) => {
    res.redirect('/products');
});

// Vista de productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };
        
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
        
        const searchQuery = query ? { category: query } : {};
        const result = await ProductModel.paginate(searchQuery, options);

        res.render('products', {
            title: 'Productos',
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null,
            user: {
                cartId: req.session.cartId 
            }
        });
    } catch (error) {
        console.error("Error al cargar la vista de productos:", error);
        res.status(500).send("Error interno al cargar la vista de productos");
    }
});

// --- RUTA PARA VER UN CARRITO ESPECÍFICO ---
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product').lean();
        
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        
        res.render('cart', { 
            title: 'Mi Carrito',
            cart 
        });
    } catch (error) {
        console.error("Error al cargar la vista del carrito:", error);
        res.status(500).render('error', { message: 'Error interno al cargar la vista del carrito' });
    }
});

// --- RUTA PARA VER EL DETALLE DE UN PRODUCTO ---
router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid).lean();

        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('product-detail', {
            title: product.title,
            product,
            user: {
                cartId: req.session.cartId
            }
        });
    } catch (error) {
        console.error("Error al cargar la vista de detalle del producto:", error);
        res.status(500).render('error', { message: 'Error interno al cargar la vista' });
    }
});

export default router;