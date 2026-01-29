import { loadEnv } from "./loadEnv";
loadEnv();

export const config = {
    port: parseInt(process.env.PORT || '8083', 10),
    database: {
        host: process.env.DB_HOST || 'switchback.proxy.rlwy.net',
        port: parseInt(process.env.DB_PORT || '14953', 10),
        name: process.env.DB_NAME || 'railway',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Q4NkdE-xszWlcXODWck13eWOYb_2I45v',
    },
    setting: {
        allowOrigin: process.env.ALLOW_ORIGIN || 'https://assetto.up.railway.app',
    },
};
