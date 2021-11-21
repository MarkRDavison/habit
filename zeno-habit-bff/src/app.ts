import express from 'express';
import createHealthRoutes from './healthRoutes';
import config from './config';
import cors from 'cors';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import {
    Auth,
    AuthRoutesConfig
} from '@mark.davison/zeno-common-server';

const useSessionMiddleware = (app: express.Application): void => {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD || undefined
    });
    redisClient.on('error', (err) => {
        console.log('Could not establish a connection with redis', err);
    });
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        name: config.SESSION_NAME,
        cookie: {
            signed: true,
            secure: config.NODE_ENV === 'prod',
            httpOnly: true,
            maxAge: config.SESSION_TIMEOUT
        }
    }))
}

const useApiProxyMiddleware = (app: express.Application): void => {
    
}

export const createApp = async (): Promise<express.Application> => {
    const app = express();

    app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));

    const openidConnectConfigBff = await Auth.initOpenIdConfig(`${config.AUTH_ROOT}/realms/${config.BFF_REALM}/.well-known/openid-configuration`);
    const openidConnectConfigApi = await Auth.initOpenIdConfig(`${config.AUTH_ROOT}/realms/${config.API_REALM}/.well-known/openid-configuration`);

    useSessionMiddleware(app);
    useApiProxyMiddleware(app);

    const authRouteConfig: AuthRoutesConfig = {
        client_id: config.BFF_CLIENT_ID,
        client_secret: config.BFF_CLIENT_SECRET,
        auth_root: config.AUTH_ROOT,
        code_challenge_type: config.CODE_CHALLENGE_TYPE,
        realm: config.BFF_REALM,
        response_type: config.RESPONSE_TYPE,
        root: config.BFF_ROOT,
        scope: config.SCOPE,
        web_origin: config.WEB_ORIGIN
    }

    app.use(express.json()); // This must be after the proxy
    app.set('trust proxy', true);

    app.use('/health', createHealthRoutes());
    app.use('/auth', Auth.createAuthRoutes('auth', openidConnectConfigBff, authRouteConfig));

    return app;
}