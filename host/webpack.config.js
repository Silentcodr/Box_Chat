const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devServer: {
        port: 8085,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "host",
            remotes: {
                chat: "chat@http://localhost:8081/remoteEntry.js",
                presence: "presence@http://localhost:8082/remoteEntry.js",
                notification: "notification@http://localhost:8083/remoteEntry.js",
            },
            shared: {
                react: { singleton: true, eager: true, requiredVersion: "^18.2.0" },
                "react-dom": { singleton: true, eager: true, requiredVersion: "^18.2.0" },
                "socket.io-client": { singleton: true, eager: true },
            },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};
