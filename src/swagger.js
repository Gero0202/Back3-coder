import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'API del Proyecto Final - Geronimo Tortosa',
      version: '1.0.0',
      description: 'Documentación de todos los endpoints del proyecto',
    },
    servers: [
        {
            url: "http://localhost:8080",
            description: "Servidor local"
        }
    ]
  },
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJSDoc(swaggerOptions);

export const setUpSwagger = (app) =>{
    app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(specs))
}