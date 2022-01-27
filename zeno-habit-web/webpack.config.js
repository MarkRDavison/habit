const cssnano = require('cssnano');

var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

const IS_DEV = true;

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead';

module.exports = {
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'inline-source-map' : false,
    devtool: "source-map",
    entry: ['./src/index.tsx'],
    devServer: {
      historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, nodeModulesPath],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/env', { modules: false, targets }], '@babel/react', '@babel/typescript'],
                        plugins: [
                            '@babel/proposal-numeric-separator',
                            '@babel/plugin-transform-runtime',
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread',
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localsConvention: 'camelCase',
                            sourceMap: IS_DEV,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: IS_DEV,
                            plugins: IS_DEV ? [cssnano()] : [],
                        },
                    },
                ],
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
                use: 'url-loader?limit=10000',
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', ".tsx"]
    },
    output: {
        filename: "bundle.js",
        hashFunction: "xxhash64", // ERR_OSSL_EVP_UNSUPPORTED
        publicPath: '/'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            hash: true, // This is useful for cache busting
            filename: 'index.html',
            favicon: "./public/favicon.ico"
        })
    ]
}