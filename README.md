# 🛒 Primera Entrega - API de Productos y Carritos

Este proyecto es la **Primera Entrega** del curso de Backend, desarrollado por **Juan Martin**. Se trata de una API RESTful construida con **Node.js** y **Express**, con persistencia de datos mediante archivos `.json`.

---

## 🚀 Características principales

- Gestión completa de productos (crear, leer, actualizar y eliminar).
- Gestión de carritos de compra.
- Persistencia en archivos locales (`products.json` y `carts.json`).
- Rutas bien estructuradas usando `express.Router`.
- Código limpio, modular e intuitivo.

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
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── app.js
├── package.json
└── README.md
```

---

## 📦 Instalación y ejecución

```bash
git clone https://github.com/Viralsouls/primerEntregaMartin-api.git
cd primerEntregaMartin-api
npm install
npm run dev
```

> El servidor escucha en el puerto **8080**

---

## 🧪 Rutas disponibles

### 🔹 Productos: `/api/products`

| Método | Ruta              | Descripción                                  |
|--------|-------------------|----------------------------------------------|
| GET    | `/`               | Obtener todos los productos                  |
| GET    | `/:pid`           | Obtener un producto por ID                   |
| POST   | `/`               | Crear un nuevo producto                      |
| PUT    | `/:pid`           | Actualizar un producto por ID                |
| DELETE | `/:pid`           | Eliminar un producto por ID                  |

#### 📝 Campos requeridos al crear producto (POST):

```json
{
  "title": "Producto Ejemplo",
  "description": "Descripción del producto",
  "code": "ABC123",
  "price": 99.99,
  "status": true,
  "stock": 10,
  "category": "Categoría",
  "thumbnails": ["ruta1.jpg", "ruta2.jpg"]
}
```

---

### 🔹 Carritos: `/api/carts`

| Método | Ruta                                  | Descripción                                        |
|--------|---------------------------------------|----------------------------------------------------|
| POST   | `/`                                   | Crear un nuevo carrito                             |
| GET    | `/:cid`                               | Obtener los productos de un carrito por ID         |
| POST   | `/:cid/product/:pid`                  | Agregar un producto al carrito (aumenta cantidad)  |

---

## 📄 Notas técnicas

- Los IDs se generan automáticamente.
- Los datos se guardan en formato JSON.
- Se manejan errores en caso de rutas incorrectas o datos inválidos.

---

## 🧑‍💻 Autor

**Juan Martin**  
[GitHub: Viralsouls](https://github.com/Viralsouls)