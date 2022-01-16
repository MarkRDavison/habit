import express from 'express';
import createHealthRoutes from './healthRoutes';
import config from './config';
import cors from 'cors';
import session from 'express-session';
import connectRedis from 'connect-redis';
import redis from 'redis';
import {
    Auth,
    AuthTokens,
    AuthRoutesConfig
} from '@mark.davison/zeno-common-server';
import { OpenidConfig } from '@mark.davison/zeno-common-server/dist/util/open-id-config';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

let authState: AuthTokens = {
    access_token: '',
    refresh_token: ''
};

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

const useApiAuthMiddleWare = (app: express.Application, apiConfig: OpenidConfig, API_CLIENT_ID: string, API_CLIENT_SECRET: string): void => {
    app.use(async (req, res, next) => {
        try {
            if (authState.access_token !== '' && authState.refresh_token !== '') {
                // We have an access token, check if it is still valid
                if (await Auth.isTokenRefreshNeeded(apiConfig, authState.access_token, 30, API_CLIENT_ID, API_CLIENT_SECRET)) {
                    const tokens = await Auth.refreshToken(apiConfig, authState, API_CLIENT_ID, API_CLIENT_SECRET);
                    authState.access_token = tokens.access_token;
                    authState.refresh_token = tokens.refresh_token;
                }
            } else {
                // We don't have an access token, we need to get one
                const headers =  {
                    'Content-type': 'application/x-www-form-urlencoded'
                };
                const response = await axios.post(apiConfig.token_endpoint,
                    `scope=${'zeno'}&` +
                    `grant_type=${'client_credentials'}&` +
                    `client_id=${API_CLIENT_ID}&` +
                    `client_secret=${API_CLIENT_SECRET}`, {
                    headers: headers,
                    withCredentials: true
                });
                
                const { access_token, refresh_token } = response.data as AuthTokens;
              
                authState.access_token = access_token;
                authState.refresh_token = refresh_token;
            }
        }
        catch (e) {
            console.error('There was an error trying to update the auth state for the api');
            console.error(e);
            authState.access_token = '';
            authState.refresh_token = '';
        }
        next();
    });
}
const useApiProxyMiddleware = (app: express.Application): void => {
    app.use(config.API_ROUTE, createProxyMiddleware({
        target: config.API_ROOT,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            let expressReq = req as express.Request;
            
            console.log(`BEGIN - BFF Proxying request: ${req.method} - ${req.url}`);

            if (!!authState.access_token) {
                proxyReq.setHeader('Authorization', `bearer ${authState.access_token}`);
            }

            if (!!expressReq.session.user) {
                proxyReq.setHeader('sub', expressReq.session.user.sub);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            if (!proxyRes){
                return;
            }

            if (!!proxyRes.headers['www-authenticate']){
                console.log('www-authenticate: ', proxyRes.headers['www-authenticate']);
            }

            console.log(`END - BFF Proxied request: ${req.method} - ${req.url} - ${proxyRes.statusCode}`);

            if ((proxyRes.statusCode || 0) >= 400 && 499 <= (proxyRes.statusCode || 0)) {                
                authState.access_token = '';
                authState.refresh_token = '';
            }
        }
    }));
}

export const createApp = async (): Promise<express.Application> => {
    const app = express();

    app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));

    const openidConnectConfigBff = await Auth.initOpenIdConfig(`${config.AUTH_ROOT}/realms/${config.BFF_REALM}/.well-known/openid-configuration`);
    const openidConnectConfigApi = await Auth.initOpenIdConfig(`${config.AUTH_ROOT}/realms/${config.API_REALM}/.well-known/openid-configuration`);

    useSessionMiddleware(app);
    useApiAuthMiddleWare(app, openidConnectConfigApi, config.API_CLIENT_ID, config.API_CLIENT_SECRET);
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