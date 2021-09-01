const { path } = require("vfile");
const webpack = require("webpack");

module.exports = {
    entry: './assets/js/wrapper.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
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
            'jquery': __dirname + '/assets/js/jquery.min.js',
            'breakpoints': __dirname + '/assets/js/breakpoints.min.js'
        }
    },
    plugins: [
        // Provides jQuery for other JS bundled with Webpack 
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new webpack.ProvidePlugin({
            breakpoints: 'breakpoints'
        })
      ]
}