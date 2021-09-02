const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const imageminMozjpeg = require("imagemin-mozjpeg");
const CopyWebPackPlugin = require("copy-webpack-plugin");
const ImageMinWebPackPlugin  = require("imagemin-webpack-plugin").default;


module.exports = {
    mode: "production",
    entry: "./src/js/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "js/[name].[contenthash].js"
    },
    module: {
        rules: [{
            // this is to lint the Javascript files, because the UI template used
            // leverages some basic jquery scripts which are already minified, we
            // want to include them as they are and not process them via eslint.
            enforce: "pre",
            test: /.js$/,
            exclude: /node_modules|\.min\.js$/,
            loader: "eslint-loader"
        },{
            // this is for processing the javascript files with the newer syntax
            // all the extensions .js and .mjs will go through babel.
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        },{
            // this is to ensure that the we can process the handlebars files and
            // generate the corresponding HTML based on the template. The options
            // needs to configure the location of any additional helper we may want
            // to use to produce the templates.
            test: /.hbs$|.handlebars$/,
            exclude: /node_modules/,
            loader: "handlebars-loader",
            options: {
                helperDirs: [ path.join(__dirname, "/src/helpers") ] 
            }
        },{
            // this is to ensure that the style files are properly processed
            // with the plugin before being packaged and copied in the distribution
            // directory. The loaders are processed from BOTTOM to TOP:
            // - first the transpilation from SASS to CSS
            // - then the post-processing to add browser prefixes
            // - then the base CSS loader
            // - the the minifier
            test: /\.(scss|css)$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader, 
                { 
                    loader: "css-loader", 
                    options: { } 
                },
                { 
                    loader: "postcss-loader",
                    options: {
                        postcssOptions : {
                            plugins: [ autoprefixer() ]
                        }
                    }
                },
                { 
                    loader: "sass-loader", 
                    options: {
                        // this is to enable source maps and allow to resolve
                        // the original CSS rule in the SASS file from the 
                        // transpiled CSS file.
                        sourceMap: true
                    }
                }
            ]
        }],
    },
    resolve: {
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
        alias: {
            "jquery": path.join(__dirname, "/src/js/jquery.min.js"),
            "breakpoints": path.join(__dirname, "/src/js/breakpoints.min.js")
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name]-styles.[contenthash].css",
            chunkFilename: "css/[id].[contenthash].css"
        }),
        new HtmlWebpackPlugin({
          hash: false,
          inject: "body",
          template: "./src/templates/index.hbs",
          templateParameters: require(path.join(__dirname, "/src/data/profile.json"))
        }),
        // Provides jQuery for other JS bundled with Webpack 
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            breakpoints: "breakpoints"
        }),
        new CopyWebPackPlugin({
            patterns: [
                { from: "src/images", to: "images" },
            ]
        }),
        new ImageMinWebPackPlugin({ 
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: ({ quality: "70-80" }),      
            plugins: [ imageminMozjpeg({ quality: 70 }) ]

        })

    ],
    // configuration for the development web server
    // we want it to run on port 3000.
    devServer: {
        port: 3000,
        open: true
    }
};