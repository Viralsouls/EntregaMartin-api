import fs from 'fs/promises';
const path = './src/data/carts.json';

export default class CartManager {
  async getAll() {
    const data = await fs.readFile(path, 'utf-8');
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
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getAll();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const product = cart.products.find(p => p.product === pid);
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return cart;
  }
}