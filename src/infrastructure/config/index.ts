import { loadEnv } from "./loadEnv";
loadEnv();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'internal_office',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
    },
    setting: {
        allowOrigin: process.env.ALLOW_ORIGIN || 'http://localhost:3000',
    },
};
