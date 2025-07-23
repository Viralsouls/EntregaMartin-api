# **🛒 Proyecto Final \- Backend de E-commerce**

Este proyecto es la Entrega Final del curso de Backend, desarrollado por Juan Martin.  
Se trata de una API RESTful construida con Node.js y Express, con persistencia de datos en MongoDB, motor de plantillas Handlebars, y un flujo de compra completo.

## **🚀 Características principales**

* **API RESTful Completa:** Endpoints para la gestión de productos y carritos (CRUD).  
* **Persistencia en MongoDB:** Uso de **Mongoose** para modelar y gestionar los datos en una base de datos NoSQL.  
* **Consultas Avanzadas:** La API de productos soporta **paginación**, **filtrado** por categoría y **ordenamiento** por precio.  
* **Gestión de Sesiones:** Carritos de compra persistentes para cada visitante usando express-session y connect-mongo.  
* **Lógica de Compra Completa:** Flujo para finalizar una compra que genera un **ticket**, actualiza el **stock** y gestiona productos sin disponibilidad.  
* **Vistas Dinámicas:** Interfaz renderizada en el servidor con **Handlebars** para visualizar productos, detalles y carritos.  
* **Seguridad:** Manejo de variables de entorno con **Dotenv** para proteger credenciales de la base de datos.

## **📁 Estructura del Proyecto**

EntregaFinalMartin/  
├── src/  
│   ├── data/  
│   │   └── products.json  (Para el seeding inicial)  
│   ├── models/  
│   │   ├── product.model.js  
│   │   ├── cart.model.js  
│   │   └── ticket.model.js  
│   ├── public/  
│   ├── routes/  
│   │   ├── products.router.js  
│   │   ├── carts.router.js  
│   │   └── views.router.js  
│   ├── views/  
│   │   ├── products.handlebars  
│   │   ├── product-detail.handlebars  
│   │   ├── cart.handlebars  
│   │   ├── error.handlebars  
│   │   └── layouts/  
│   │       └── main.handlebars  
│   ├── app.js  
│   └── seed.js  
├── .env  
├── .gitignore  
├── package.json  
└── README.md

## **⚙️ Instalación y ejecución**

\# 1\. Clonar el repositorio  
git clone \[https://github.com/Viralsouls/EntregaFinalMartin.git\](https://github.com/Viralsouls/EntregaFinalMartin.git)  
cd EntregaFinalMartin

\# 2\. Instalar dependencias  
npm install

\# 3\. Configurar el archivo .env (usar .env.example como guía)

\# 4\. Poblar la base de datos con datos de ejemplo  
npm run seed

\# 5\. Iniciar el servidor en modo desarrollo  
npm run dev

📡 El servidor escucha en el puerto 8080\.

## **🧪 Endpoints HTTP**

### **🔹 Productos: /api/products**

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| GET | / | Obtener una lista paginada de productos. Acepta limit, page, sort, query. |
| GET | /:pid | Obtener un producto específico por su ID. |
| POST | / | Crear un nuevo producto. |
| PUT | /:pid | Actualizar un producto por su ID. |
| DELETE | /:pid | Eliminar un producto por su ID. |

### **🔹 Carritos: /api/carts**

| Método | Ruta | Descripción |
| :---- | :---- | :---- |
| POST | /:cid/products/:pid | Agregar un producto al carrito (o incrementar su cantidad). |
| POST | /:cid/purchase | Finalizar el proceso de compra para un carrito. |
| GET | /:cid | Obtener los productos de un carrito por su ID. |
| PUT | /:cid/products/:pid | Actualizar la cantidad de un producto en el carrito. |
| DELETE | /:cid/products/:pid | Eliminar un producto específico del carrito. |
| DELETE | /:cid | Eliminar todos los productos del carrito. |

## **🖥️ Vistas con Handlebars**

### **📍 [http://localhost:8080/products](https://www.google.com/search?q=http://localhost:8080/products)**

* Muestra la lista de productos paginada. Permite agregar productos al carrito.

### **📍 http://localhost:8080/products/:pid**

* Muestra la vista de detalle de un producto específico.

### **📍 [http://localhost:8080/carts/:cid](https://www.google.com/search?q=http://localhost:8080/carts/:cid)**

* Muestra el contenido de un carrito de compras y permite finalizar la compra.

## **📄 Notas técnicas**

* IDs de MongoDB generados automáticamente.  
* Persistencia de datos robusta con MongoDB.  
* Estructura modular y organizada para facilitar el mantenimiento.  
* Experiencia de usuario mejorada con notificaciones "toast" y navegación clara.

## **🧑‍💻 Autor**

Juan Martin  
GitHub: @Viralsouls