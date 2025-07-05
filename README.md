# Proyecto Final - Geronimo Tortosa - Backend 3

## 🧪 Descripción General

Este proyecto es una API construida con **Node.js**, **Express**, diseñada para gestionar usuarios, mascotas y registros de adopciones.
Incluye funcionalidades de autenticacion (registro e inicio de sesion), generacion de datos de pruebas (mocks) y una parte completa
de test con supertest/jest y artillery para asegurar la calidad y el rendimineto del codigo. La documentacion interactiva de la API
con todas sus respectivas rutas esta disponible a traves de Swagger. 

---

## ✨ Caracteristicas principales

- Gestion de usuarios: Registro , inicio de sesion y gestion de perfiles de usuarios.
- Gestion de mascotas: Creacion ( con o sin imagen ), consultas , actualizacion y eliminacion de registro de mascotas.
- Gestion de adopciones: Registro de adopciones.
- API Mock: Generacion de datos de usuarios y mascotas falsos.
- Autenticacion JWT : Seguridad a traves de JSON Web Token.
- Pruebas exhaustivas: 
  - Unitarias y de integracion: Uso de Jest y Supertest para asegurar la correcta funcionalidad de cada endpoint y componente.
  - Pruebas de carga: Implementacion de Artillery para evaluar el rendimiento de la API bajo diferentes escenarios de carga.
- Documentacion interactiva: acceso a la dumentacion completa de la API a traves de Swagger UI.   

---

## 📁 Estructura de rutas

### ⚠️ Nota importante: 
  - La documentacion de Swagger para probar todos los endpoints esta en `/api-doc`
  - Durante la ejecucion de los tests, la base de datos se limpia, por lo que para probar algunas rutas que requieren datos existentes (como usuarios, mascotas o adopciones), es necesario crear esos datos previamente. Esto puede hacerse mediante las rutas de creación (POST).

#### Users

- `/api/users/`: (GET) Devuelve una lista de todos los usuarios.
- `/api/users/{uid}`: (GET) Devuelve el usuario por id.
- `/api/users/{uid}`: (PUT) Actualiza usuarios por id.
- `/api/users/{uid}`: (DELETE) Elimina un usuario por id. 

#### Pets

- `/api/pets/`: (GET) Devuelve una lista de todas las mascotas.
- `/api/pets/`: (POST) Crea una mascota nueva (sin imagen).
- `/api/pets/withimage`: (POST) Crea una mascota nueva con imagen.
- `/api/pets/{pid}`: (PUT) Actualiza mascotas por id.
- `/api/pets/{pid}`: (DELETE) Elimina una mascota por id. 

#### Adopciones

- `/api/adoptions/` : (GET) Devuelve todas las adopciones.
- `/api/adoptions/{aid}` : (GET) Devuelve adopcion por id.
- `/api/adoptions/{uid}/{pid}` : Registra adopcion de una mascota por usuario.

#### Sessions

- `/api/sessions/register` : (POST) Registra un nuevo usuario.
- `/api/sessions/login` : (POST) Iniciar sesion (protegida con cookie segura).
- `/api/sessions/current` : (GET) Obtener el usuario actual desde cookie protegida.
- `/api/sessions/unprotectedLogin` : (POST) Iniciar sesion (sin seguridad adicional)
- `/api/sessions/unprotectedCurrent` : (GET) Obtener el usuario actual desde cookie sin proteccion

#### Mocks

- `/api/mocks/mockingpets`: (GET) Devuelve una lista de mascotas mockeadas.
- `/api/mocks/mockingusers`: (GET) Genera 50 usuarios con datos falsos y contraseña encriptada.
- `/api/mocks/generateData`: (POST) Inserta usuarios y mascotas en la base de datos según parámetros.

---

## 💻 Tecnologias usadas: 

- Frameworks y librerias:
 - Express.js: Framework web para Node.js 
 - Mongoose: MongoDB
 - JWT (Jason Web Token): Para autenticacion
 - Bcrypt: Para cifrado de contraseñas
 - Faker: Generacion de datos de prueba
 - Multer: Manejo de carga de archivos
 - Cookie-parser: Para el manejo de cookies
 - Dotenv: Gestion de variables de entorno
 - Winston: Para logging
 - Swagger UI Express: Para la documentacion de API
- Base de datos: 
 - MongoDb
- Herramientas adicionales:
 - Docker: Para facilitar su despliegue y ejecucion
 - Nodemon: Para desarrollo con reinicio automatico  

--- 


## 🔧 Scripts

- npm start     # Inicia el servidor con Node.js
- npm run dev   # Inicia el servidor con nodemon
- npm run test  # Hace test de todos los archivos en archivo test
- npm run test:users  # Test de la carpeta users.test.js
- npm run test:pets  # Test de la carpeta pets.test.js
- npm run test:mocks  # Test de la carpeta mocks.test.js
- npm run test:sessions  # Test de la carpeta sessions.test.js
- npm run test:adoptions  # Test de la carpeta adoptions.test.js
- npm run test:load:pets  # Test con artillery de pets
- npm run test:load:users  # Test con artillery de users
- npm run test:load:mocks  # Test con artillery de mocks
- npm run test:load:adoptions  # Test con artillery de adopciones

--- 

## 📦 Instalacion 

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

- git clone https://github.com/Gero0202/Back3-coder.git
- cd nombre-del-proyecto
- npm install
- Crea un archivo .env en la raíz del proyecto y pega lo siguiente:
   - PORT = 8080
   - MONGO_URL = "mongodb+srv://backendcoder:hola1234@cluster0.swh72.mongodb.net/backend3petscoder"

---

## 🐳 Instalacion Docker

- Ver imagen en docker : https://hub.docker.com/r/gerotortosa/proyecto-final-backend/tags

- Correr proyecto desde docker:
   - docker pull gerotortosa/proyecto-final-backend
   - docker run -p 8080:8080 gerotortosa/proyecto-final-backend



## 📌 Autor
Geronimo Tortosa 
