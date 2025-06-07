import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartsPath = path.join(__dirname, '..', 'data', 'carts.json');

export default class CartManager {
  async getAll() {
    const data = await fs.readFile(cartsPath, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const carts = await this.getAll();
    return carts.find(c => c.id === id);
  }

  async createCart() {
    const carts = await this.getAll();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    return cart;
  }
}