import * as path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Eccomerce API",
            version: "1.0.0",
            description: "Documentacion de la API del ECCOMMERCE"
        },
    },
    apis: [
        path.resolve("./docs/**/*.yaml")
    ]
};

const spec = swaggerJSDoc(swaggerOptions);
export default spec;