# 🛒 Segunda Entrega - API de Productos y Carritos (con Websockets + Handlebars)

Este proyecto es la **Segunda Entrega** del curso de Backend, desarrollado por **Juan Martin**.  
Se trata de una API RESTful construida con **Node.js** y **Express**, con persistencia local en archivos `.json`, motor de plantillas **Handlebars**, y actualizaciones en tiempo real mediante **Socket.IO**.

---

## 🚀 Características principales

- Gestión completa de productos (CRUD).
- Gestión de carritos de compra.
- Persistencia de datos en archivos JSON (`products.json`, `carts.json`).
- Vista dinámica de productos usando **Handlebars** (`home.handlebars`).
- Vista en tiempo real de productos con **WebSockets** (`realTimeProducts.handlebars`).
- Estilo limpio y moderno con CSS personalizado.
- Sistema de **notificaciones tipo toast** y validación de formularios en frontend.

---

## 📁 Estructura del Proyecto

```
primerEntregaMartin-api/
├── src/
│   ├── data/
│   │   ├── products.json
│   │   └── carts.json
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── realtime.js
│   ├── routes/
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── views/
│   │   ├── home.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   └── layouts/
│   │       └── main.handlebars
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

---

## ⚙️ Instalación y ejecución

```bash
git clone https://github.com/Viralsouls/primerEntregaMartin-api.git
cd primerEntregaMartin-api
npm install
npm run dev
```

📡 El servidor escucha en el puerto `8080`

---

## 🧪 Endpoints HTTP

### 🔹 Productos: `/api/products`

| Método | Ruta  | Descripción                   |
| ------ | ----- | ----------------------------- |
| GET    | /     | Obtener todos los productos   |
| GET    | /:pid | Obtener un producto por ID    |
| POST   | /     | Crear un nuevo producto       |
| PUT    | /:pid | Actualizar un producto por ID |
| DELETE | /:pid | Eliminar un producto por ID   |

#### 📥 Ejemplo JSON para `POST /api/products`:

```json
{
  "title": "Camiseta",
  "description": "Camiseta deportiva",
  "code": "CAM001",
  "price": 25.99,
  "status": true,
  "stock": 100,
  "category": "Ropa",
  "thumbnails": ["img1.jpg", "img2.jpg"]
}
```

---

### 🔹 Carritos: `/api/carts`

| Método | Ruta               | Descripción                                  |
| ------ | ------------------ | -------------------------------------------- |
| POST   | /                  | Crear un nuevo carrito                       |
| GET    | /:cid              | Obtener los productos de un carrito por ID   |
| POST   | /:cid/product/:pid | Agregar un producto al carrito (aumenta qty) |

---

## 🖥️ Vistas con Handlebars

### 📍 [`http://localhost:8080/`](http://localhost:8080/)

- Muestra los productos cargados de forma estática usando `home.handlebars`.

### 📍 [`http://localhost:8080/realtimeproducts`](http://localhost:8080/realtimeproducts)

- Vista dinámica con WebSocket para crear y eliminar productos en tiempo real.
- Al agregar o eliminar un producto, la lista se actualiza automáticamente.
- Validación de campos y sistema de feedback visual con **toasts**.
- Si no hay productos cargados, muestra un mensaje amigable.

---

## 📄 Notas técnicas

- IDs generados automáticamente.
- Persistencia en archivos locales `.json`.
- Estructura modular y organizada.
- Estilo profesional y experiencia de usuario mejorada.

---

## 🧑‍💻 Autor

**Juan Martin**  
GitHub: [@Viralsouls](https://github.com/Viralsouls)
