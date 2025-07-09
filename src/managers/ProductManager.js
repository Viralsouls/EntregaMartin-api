import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'products.json');

export default class ProductManager {
  async getAll() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo productos:', error.message);
      return [];
    }
  }

  async saveAll(data) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error guardando productos:', error.message);
      throw error;
    }
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
    await this.saveAll(products);
    return newProduct;
    console.log('Agregando producto:', newProduct);
  }

  async updateProduct(id, updates) {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    await this.saveAll(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getAll();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    await this.saveAll(filtered);
    return true;
  }
}