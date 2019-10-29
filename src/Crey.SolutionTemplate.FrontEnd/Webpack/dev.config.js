const merge = require("webpack-merge");
const baseConfig = require("./base.config");

module.exports = function (env) {
    return merge(
        baseConfig(env),
        {
            mode: 'development',
            // Source maps support ('inline-source-map' also works)
            devtool: "inline-source-map",

            devServer: {
                port: "7844",
                historyApiFallback: {
                    disableDotRule: true
                }
            }
        });
};