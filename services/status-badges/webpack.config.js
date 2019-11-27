const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ZipPlugin = require('zip-webpack-plugin');
module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    entry: './src/index.ts',
    resolve: {
        extensions: ['.ts'],
        alias: {
            src: path.resolve('./src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.(svg)$/,
                use: ['file-loader'],
            },
        ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyWebpackPlugin([{ from: './src/badges', to: '.' }]),
        new WebpackCleanupPlugin(),
        new ZipPlugin({
            filename: 'dist_status_badges.zip',
        }),
    ],
};
