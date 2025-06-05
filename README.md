# Preentrega 1 - Backend 3

## 🧪 Descripción General

Esta primera entrega implementa funcionalidades de mocking y generación de datos para pruebas en una API REST construida con **Node.js**, **Express**, **MongoDB** y **faker.js**.

---

## 📁 Estructura de rutas

- `/api/mocks/mockingpets`: Devuelve una lista de mascotas mockeadas.
- `/api/mocks/mockingusers`: Genera 50 usuarios con datos falsos y contraseña encriptada.
- `/api/mocks/generateData`: Inserta usuarios y mascotas en la base de datos según parámetros.

---

## 🔧 Scripts

- npm run dev   # Inicia el servidor con nodemon
- npm start     # Inicia el servidor con Node.js

--- 


## 📦 Instalación

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

- git clone <repo-url>
- cd nombre-del-proyecto
- npm install
- Crea un archivo .env en la raíz del proyecto y pega lo siguiente:
   - PORT = 8080
   - MONGO_URL = "mongodb+srv://backendcoder:hola1234@cluster0.swh72.mongodb.net/backend3petscoder"

---

## 🧪 Pruebas de los Endpoints

Puedes probar los siguientes endpoints para interactuar con la API:

- GET /api/mocks/mockingpets
Devuelve una lista simulada de mascotas (generada con faker).

- GET /api/mocks/mockingusers
  -Genera 50 usuarios con la siguiente estructura:
    1. first_name, 
    2. last_name, 
    3. email
    4. password: siempre encriptada (hash de "coder123")
    5. role: aleatorio entre "user" y "admin"
    6. pets: array vacío
    7. Formato simulado de Mongo

- POST /api/mocks/generateData
   -Genera e inserta datos en la base de datos.
   Body de ejemplo:
 
   JSON

  {
    "users": 10,
    "pets": 5
  }

Verificación:
Puedes verificar la inserción accediendo a:

GET /api/users
GET /api/pets


## ✅ Checklist del Desafío
- Este desafío cubre los siguientes puntos:

  - Router /api/mocks creado y funcionando.
  - Endpoint /mockingpets migrado correctamente.
  - Módulo de generación de usuarios mockeados.
  - GET /mockingusers implementado.
  - GET /mockingpets implementado.
  - POST /generateData insertando en Mongo.
  - Verificación mediante GET de users y pets.

## 📌 Autor
Geronimo Tortosa - Pre-Entrega n1 
