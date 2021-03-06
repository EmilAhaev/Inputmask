'use strict';

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

function _path(p) {
    return path.join(__dirname, p);
}

function createBanner() {
    return "[name]\n" +
        "<%= pkg.homepage %>\n" +
        "Copyright (c) 2010 - <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        "Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)\n" +
        "Version: <%= pkg.version %>";
}

const rules = {
    sourceMap: {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
    },
    js: {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
            presets: [
                'env'
            ],
            passPerPreset: true,
        },
    },
    // ts: {
    //     test: /\.tsx?$/,
    //     loader: 'awesome-typescript-loader',
    //     exclude: /(node_modules)/
    // },
    styles: {
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: function () {
                        return [
                            require('postcss-cssnext')
                        ];
                    }
                }
            }
        ]
    }
}

module.exports = {
    entry: {
        "dist/inputmask": "./bundle.js",
        "dist/inputmask.min": "./bundle.js",
        "qunit/qunit": "./qunit/index.js"
    },
    output: {
        path: __dirname,
        filename: "[name].js",
        libraryTarget: "umd"
    },
    externals: {
        "jquery": "jQuery",
        "jqlite": "jqlite",
        "qunit": "QUnit"
    },
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin({
            include: /\.min\.js$/,
            uglifyOptions: {
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    keep_fnames: true
                },
                output: {
                    ascii_only: true,
                    beautify: false,
                    comments: /^!/
                }
            },
            extractComments: false
        }), new UglifyJsPlugin({
            exclude: /\.min\.js$/,
            uglifyOptions: {
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    keep_fnames: true
                },
                output: {
                    ascii_only: true,
                    beautify: true,
                    comments: /^!/
                }
            },
            extractComments: false
        })]
    },
    module: {
        rules: [
            rules.sourceMap,
            rules.js,
            // rules.ts,
            rules.styles
        ]
    },
    resolve: {
        alias: {
            // "./js/dependencyLibs/inputmask.dependencyLib": "./js/dependencyLibs/inputmask.dependencyLib.jquery",
            // "./dependencyLibs/inputmask.dependencyLib": "./dependencyLibs/inputmask.dependencyLib.jquery"
            // "./js/dependencyLibs/inputmask.dependencyLib": "./js/dependencyLibs/inputmask.dependencyLib.jqlite",
            // "./dependencyLibs/inputmask.dependencyLib": "./dependencyLibs/inputmask.dependencyLib.jqlite"
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            // file and reference
            filename: '[file].map',
            // sources naming
            moduleFilenameTemplate: '[absolute-resource-path]',
            fallbackModuleFilenameTemplate: '[absolute-resource-path]',
            // }),
            // new webpack.LoaderOptionsPlugin({
            //     debug: true
        }),
        new webpack.BannerPlugin({
            banner: createBanner(),
            entryOnly: true
        })
    ],
    bail: true,
    mode: "none"
    // devServer: {
    // 	publicPath: '/',
    // 	stats: {
    // 		colors: true
    // 	},
    // 	host: '0.0.0.0',
    // 	inline: true,
    // 	port: '8080',
    // 	quiet: false,
    // 	noInfo: false,
    // },
};
