// src/seed.js
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { ProductModel } from './models/product.model.js';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const MONGO_URL = 'mongodb+srv://ecommerceUser:ecommercePass123@cluster0.gmc2mli.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'; // Reemplaza con tu URL de conexión

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

// --- SCRIPT ---
const seedDatabase = async () => {
    try {
        // 1. Conectar a la base de datos
        await mongoose.connect(MONGO_URL);
        console.log('✅ Conectado a MongoDB');

        // 2. Limpiar la colección de productos para evitar duplicados
        await ProductModel.deleteMany({});
        console.log('🗑️ Colección de productos limpiada');

        // 3. Leer el archivo JSON
        const productsData = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(productsData);
        console.log(`📦 ${products.length} productos leídos del archivo JSON`);

        // 4. Insertar los productos en la base de datos
        await ProductModel.insertMany(products);
        console.log('🌱 Productos insertados en la base de datos correctamente');

    } catch (error) {
        console.error('❌ Error durante el proceso de seeding:', error);
    } finally {
        // 5. Desconectar de la base de datos
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
};

seedDatabase();