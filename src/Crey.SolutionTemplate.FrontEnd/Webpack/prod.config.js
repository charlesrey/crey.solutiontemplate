const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const baseConfig = require("./base.config");
const webpack = require("webpack");

module.exports = function (env) {
    return merge(
        baseConfig(env),
        {
            devtool: false,
            optimization: {
                minimizer: [
                  new UglifyJSPlugin({
                    sourceMap: true,
                    uglifyOptions: {
                      compress: {
                        inline: false
                      }
                    }
                  })
                ],
                runtimeChunk: {
                    name: "manifest"
                },
                splitChunks: {
                  cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        priority: -20,
                        chunks: "all"
                    }
                  }
                }
              },
              plugins: [
                new webpack.EnvironmentPlugin({
                    NODE_ENV: 'production',
                    DEBUG: false
                  })
              ]
        });
};