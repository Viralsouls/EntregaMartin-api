
# 📦 Entrega Final: Backend Ecommerce

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-brightgreen.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-6.x-red.svg)](https://mongoosejs.com/)
[![Handlebars](https://img.shields.io/badge/Handlebars-Express-orange.svg)](https://handlebarsjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-blue.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)]()

---

## 📘 Descripción

Proyecto de **backend para un ecommerce**, desarrollado con Node.js, Express y MongoDB. Permite CRUD completo de productos y carritos, vistas dinámicas con Handlebars, sesión de usuario y WebSockets para actualizaciones en tiempo real.

Este proyecto cumple con los requisitos de entrega final del bootcamp de backend.

---

## 🚀 Tecnologías

- **Node.js** + **Express**
- **MongoDB Atlas** con **Mongoose** y paginación (`mongoose-paginate-v2`)
- **express-session** para sesión de usuario y carrito persistente
- **Handlebars** para vistas dinámicas en el frontend
- **Socket.io** para actualizaciones en tiempo real
- **dotenv** para manejo de variables de entorno

---

## 🛠 Características

- ✅ CRUD completo de **Productos** (`/api/products`)
  - Paginación, filtrado (`category` o `availability`), ordenamiento (precio asc/desc)
- ✅ CRUD completo de **Carritos** (`/api/carts`)
  - Agregar, eliminar, actualizar cantidades, vaciar carrito
- ✅ Persistencia con MongoDB y uso de _populate_ para incluir datos completos de productos en carritos
- ✅ Vistas:
  - 🏠 `/`: listado de productos
  - 📄 `/products/:pid`: detalle con botón “Agregar al carrito”
  - 🛒 `/carts/:cid`: carrito con tabla de productos y totales
- ✅ Websocket para notificaciones en tiempo real (opcional)

---

## ⚙️ Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Viralsouls/EntregaFinalMartin.git
   cd EntregaFinalMartin
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea archivo `.env` en la raíz con:
   ```
   PORT=8080
   MONGO_URL=<tu-string-de-conexión-de-mongodb-atlas>
   SESSION_SECRET=<clave-secreta>
   ```
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```
5. Abre el navegador en `http://localhost:8080`

---

## 🔧 Endpoints REST

### Productos
- `GET /api/products?limit=&page=&sort=&query=`
- `GET /api/products/:pid`
- `POST /api/products`
- `PUT /api/products/:pid`
- `DELETE /api/products/:pid`

### Carritos
- `POST /api/carts` → Crear nuevo carrito
- `GET /api/carts/:cid`
- `POST /api/carts/:cid/product/:pid`
- `PUT /api/carts/:cid`
- `PUT /api/carts/:cid/product/:pid` (actualiza cantidad)
- `DELETE /api/carts/:cid/product/:pid`
- `DELETE /api/carts/:cid` → Vaciar carrito

---

## 🧪 Vistas disponibles

- **/** – Listado de productos
- **/products/:pid** – Detalle del producto, con botón para agregar al carrito
- **/carts/:cid** – Ver el carrito completo con productos, cantidades y subtotal

---

## 🧑‍💻 Autor

**Juan Martín** (Viralsouls)  
Proyecto para la entrega final de Backend Coderhouse (Curso 77515)

---

### 🧾 Licencia

Licencia MIT
