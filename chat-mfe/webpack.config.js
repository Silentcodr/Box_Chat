const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devServer: {
        port: 8081,
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
            name: "chat",
            filename: "remoteEntry.js",
            exposes: {
                "./ChatApp": "./src/ChatApp",
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
