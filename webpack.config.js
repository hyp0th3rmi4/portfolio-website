const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: "./assets/js/wrapper.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            enforce: "pre",
            test: /.js$/,
            exclude: /node_modules|\.min\.js$/,
            loader: "eslint-loader"
        },{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        },{
            test: /.hbs$|.handlebars$/,
            exclude: /node_modules/,
            loader: "handlebars-loader",
            options: {
                helperDirs: [ path.join(__dirname, "/assets/helpers") ] 
            }
        }],
        // jQuery adds a global function $ and jQuery on which other scripts
        // rely upon to function. When bundling and loading the scripts via
        // webpack this function will not be set thus causing the other functions
        // to be broken. To enable this we need to force webpack to provide this
        // function in the javascript runtime. This is done via the ProvidePlugin
        // which maps $ and jQuery to the 'jquery' module. This module is then
        // aliased to the embedded source file `/assets/js/jquery.min.js` that
        // is located in the `assets/js` folder. 
        // 
        // NOTE: The aliasing is not necessary if we install jquery via npm.
        //
    },
    resolve: {
        alias: {
            "jquery": path.join(__dirname, "/assets/js/jquery.min.js"),
            "breakpoints": path.join(__dirname, "/assets/js/breakpoints.min.js")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
          hash: false,
          inject: false,
          template: "./index.hbs",
          templateParameters: require(path.join(__dirname, "/assets/data/profile.json"))
        }),
        // Provides jQuery for other JS bundled with Webpack 
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            breakpoints: "breakpoints"
        })
      ]
};