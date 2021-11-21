import dotenv from 'dotenv';

export interface Config {
    PORT: number
    AUTH_ROOT: string
    BFF_REALM: string
    API_REALM: string
    BFF_ROOT: string
    API_ROOT: string
    API_ROUTE: string
    SESSION_TIMEOUT: number
    SESSION_SECRET: string
    SESSION_NAME: string
    BFF_CLIENT_ID: string
    BFF_CLIENT_SECRET: string
    API_CLIENT_ID: string
    API_CLIENT_SECRET: string
    CODE_CHALLENGE_TYPE: string
    REDIS_PORT: number
    REDIS_HOST: string
    REDIS_PASSWORD: string
    NODE_ENV: 'dev' | 'prod' | 'test'
    RESPONSE_TYPE: string
    SCOPE: string
    WEB_ORIGIN: string
}

const parseNodeEnv = (str: string | undefined): 'dev' | 'prod' | 'test' => {
    if (str !== 'prod' &&
        str !== 'test') {
        return 'dev';
    }
    return str;
}

dotenv.config();

const config: Config = {
    PORT: parseInt(process.env.PORT ?? '40000'),
    AUTH_ROOT: process.env.AUTH_ROOT as string,
    BFF_REALM: process.env.BFF_REALM as string,
    API_REALM: process.env.API_REALM as string,
    SESSION_TIMEOUT: 1000 * 60 * 60 * 24,
    CODE_CHALLENGE_TYPE: 'S256',
    RESPONSE_TYPE: 'code',
    SCOPE: 'openid profile email offline_access zeno',
    NODE_ENV: parseNodeEnv(process.env.NODE_ENV),
    REDIS_PORT: parseInt(process.env.REDIS_PORT as string),
    BFF_ROOT: process.env.BFF_ROOT as string,
    API_ROOT: process.env.API_ROOT as string,
    API_ROUTE: process.env.API_ROUTE as string,
    SESSION_NAME: process.env.SESSION_NAME as string,
    SESSION_SECRET: process.env.SESSION_SECRET as string,
    WEB_ORIGIN: process.env.WEB_ORIGIN as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    BFF_CLIENT_ID: process.env.BFF_CLIENT_ID as string,
    BFF_CLIENT_SECRET: process.env.BFF_CLIENT_SECRET as string,
    API_CLIENT_ID: process.env.API_CLIENT_ID as string,
    API_CLIENT_SECRET: process.env.API_CLIENT_SECRET as string
};
export default config;