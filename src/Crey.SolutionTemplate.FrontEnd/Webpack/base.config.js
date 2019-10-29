// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require("path");
const fs = require('fs');
const webpack = require("webpack");

const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, '../src/theme.less'), 'utf8'));
themeVariables["@icon-url"] = "'/fonts/iconfonts/iconfont'";

module.exports = function (env) {
    var appEnv = env.ENVIRONMENT || "dev";
    return {
        mode: 'production',
        entry: {
            app: ["./src/App.tsx"],
        },

        output: {
            chunkFilename: "[name].js",
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "../www/dist/"),
            publicPath: "/dist/"
        },

        // Currently we need to add '.ts' to the resolve.extensions array.
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],

            // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
            modules: ['src', 'node_modules'],
        },

        node: {
            fs: 'empty'
        },

        // Add the loader for .ts files.
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                },
                {
                    loader: "css-loader"
                },
                {
                    loader: "less-loader",
                    options: {
                        modifyVars: themeVariables,
                        javascriptEnabled: true
                    }
                }
                ]
            },
            ]
        },

        plugins: [
            new CheckerPlugin(),
            new webpack.NormalModuleReplacementPlugin(
                /(.*)-APP_TARGET(\.*)/,
                function (resource) {
                    resource.request = resource.request.replace(/-APP_TARGET/, `-${appTarget}`);
                }),
            new webpack.IgnorePlugin(/^electron$/)
        ]
    };
};