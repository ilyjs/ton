const path = require('path');

const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    mode: "development",

    entry: "./src/index.tsx",

    module: {

        rules: [
            {
                test: /\.wasm$/,
                loader: "file-loader",
                type: "javascript/auto", // Disable Webpack's built-in WASM loader

            },
            {
                test: /\.ttf$/,
                use: ["file-loader"]
            },
            {
                test: /\.json$/,
                type: 'json',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
                alias: {
                    'fs': 'memfs',
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],

    },
    output: {
        // filename: 'bundle.js',
        // path: path.resolve(__dirname, 'dist'),
        publicPath: "/"
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'our project',
            template: 'src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MonacoWebpackPlugin({languages: ["cpp", 'typescript', 'javascript']}),
        new NodePolyfillPlugin({
            excludeAliases: ['console']
        }),

    ],
    devtool: "inline-source-map",
    externals: ["fs"],
    devServer: {
        static: path.join(__dirname, "build"),
        historyApiFallback: true,
        port: 4000,
        open: true,
        hot: true
    },
};
