const path = require('path');
const webpack = require('webpack');
const preBuildDir = 'prebuild';
const buildDir = 'build';

module.exports = {
    cache: true,
    entry: {
        webapp: './' + preBuildDir + '/client.js',
        vendor: ['core-js/es6/promise', 'core-js/es6/map', 'whatwg-fetch', 'pug-runtime', 'urijs']
        // jquery: "./app/jquery",
        // bootstrap: ["!bootstrap-webpack!./app/bootstrap/bootstrap.config.js", "./app/bootstrap"],
        // react: "./app/react"
    },
    output: {
        path: buildDir + '/assets/js',
        filename: "[name].bundle.js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        })
    ],
    module: {
        loaders: [
            {
                test: /(\.tpl.html)$/,
                loader: 'lodash-template-webpack',
            },
            {
                test: /(\.tpl.jade|\.tpl.pug)$/,
                loader: 'pug-loader?compileDebug=false&pretty=false'
            }

            // // required to write "require('./style.css')"
            // { test: /\.css$/,    loader: "style-loader!css-loader" },
            //
            // // required for bootstrap icons
            // { test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
            // { test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
            // { test: /\.eot$/,    loader: "file-loader?prefix=font/" },
            // { test: /\.svg$/,    loader: "file-loader?prefix=font/" },

            // required for react jsx
            // { test: /\.js$/,    loader: "jsx-loader" },
            // { test: /\.jsx$/,   loader: "jsx-loader?insertPragma=React.DOM" },
        ]
    },
    lodashTemplateLoader: {
        // optional configuration...
        globalLodash: false,
        templateEscape: false
        // engine: 'lodash/template'
    }
    /*,
     resolve: {
     alias: {
     // Bind version of jquery
     jquery: "jquery-2.0.3",

     // Bind version of jquery-ui
     "jquery-ui": "jquery-ui-1.10.3",

     // jquery-ui doesn't contain a index file
     // bind module to the complete module
     "jquery-ui-1.10.3$": "jquery-ui-1.10.3/ui/jquery-ui.js",
     }
     },
     plugins: [
     new webpack.ProvidePlugin({
     // Automtically detect jQuery and $ as free var in modules
     // and inject the jquery library
     // This is required by many jquery plugins
     jQuery: "jquery",
     $: "jquery"
     })
     ]*/
};