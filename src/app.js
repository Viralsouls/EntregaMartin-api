import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
import ProductManager from './managers/ProductManager.js';
const productManager = new ProductManager();

io.on('connection', async socket => {
  console.log('🟢 Cliente conectado');

  const products = await productManager.getAll();
  socket.emit('productList', products);

  socket.on('addProduct', async product => {
    await productManager.addProduct(product);
    const updated = await productManager.getAll();
    io.emit('productList', updated);
  });

  socket.on('deleteProduct', async productId => {
    await productManager.deleteProduct(productId);
    const updated = await productManager.getAll();
    io.emit('productList', updated);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});