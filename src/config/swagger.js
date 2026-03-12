import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Spirulina Sensors API',
            version: '1.0.0',
            description: 'Tài liệu API quản lý hệ thống dữ liệu thiết bị Spirulina.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    // Trỏ đến tất cả file trong folder routes để swagger JSdoc quét các Comment
    apis: ['./src/routes/*.js', './src/models/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
