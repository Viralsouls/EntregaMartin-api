import express from 'express';
import { engine } from 'express-handlebars';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

// Import de Rutas y Modelos
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { ProductModel } from './models/product.model.js';
import { CartModel } from './models/cart.model.js';

// --- CONFIGURACIÓN INICIAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DE LA SESIÓN ---
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 14 * 24 * 60 * 60
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// --- MIDDLEWARE PARA CREAR CARRITO SI NO EXISTE ---
app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        try {
            const newCart = await CartModel.create({ products: [] });
            req.session.cartId = newCart._id.toString();
        } catch (error) {
            console.error('Error creando carrito para la sesión:', error);
            // Si hay un error, igual continuamos para no bloquear la app
        }
    }
    next();
});
//Test
// --- HANDLEBARS ---
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// --- RUTAS ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// --- LÓGICA DE WEBSOCKETS ---
io.on('connection', async socket => {
  console.log('🟢 Cliente conectado');

  try {
    const products = await ProductModel.find().lean();
    socket.emit('productList', products);
  } catch (error) {
    console.error('Error al obtener productos para WebSocket:', error);
  }

  socket.on('addProduct', async product => {
    try {
      await ProductModel.create(product);
      const updatedProducts = await ProductModel.find().lean();
      io.emit('productList', updatedProducts);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  socket.on('deleteProduct', async productId => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      const updatedProducts = await ProductModel.find().lean();
      io.emit('productList', updatedProducts);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado');
  });
});

// --- INICIO DEL SERVIDOR Y CONEXIÓN A DB ---
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a la base de datos');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("❌ Error de conexión a la base de datos:", error);
  });