import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '..', 'data', 'products.json');

export default class ProductManager {
  async getAll() {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getAll();
    const newProduct = {
      ...product,
      id: products.length ? products[products.length - 1].id + 1 : 1,
    };
    products.push(newProduct);
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.getAll();
    products = products.filter(p => p.id !== id);
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
  }
}