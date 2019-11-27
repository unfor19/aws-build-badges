const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    entry: './src/controller.ts',
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
        ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
