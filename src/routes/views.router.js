import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = { page: parseInt(page), limit: parseInt(limit), lean: true };
        if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };
        const searchQuery = query ? { category: query } : {};
        const result = await ProductModel.paginate(searchQuery, options);

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null,
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de productos");
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).lean();
        if (!cart) return res.status(404).send("Carrito no encontrado");
        
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send("Error al cargar la vista del carrito");
    }
});

export default router;