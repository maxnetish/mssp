module.exports = function (grunt) {

    var preBuildDir = 'prebuild';
    var buildDir = 'build';
    var srcDir = 'src';
    var webpack = require('webpack');
    var webpackCommonOptions = require('./webpack.config.js');
    var path = require('path');

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: [
            buildDir,
            preBuildDir
        ],

        copy: {
            html2Build: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: false,
                        cwd: srcDir + '/',
                        src: ['**/*.html*'],
                        dest: buildDir
                    }
                ]
            },
            img2Build: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: srcDir + '/static-images',
                        src: ['**/*.png', '**/*.jpg'],
                        dest: buildDir + '/assets/img'
                    }
                ]
            },
            fonts2Build: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: true,
                        cwd: srcDir + '/fonts',
                        src: ['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff'],
                        dest: buildDir + '/assets/css'
                    }
                ]
            },
            templates2Prebuild: {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: false,
                        cwd: srcDir + '/',
                        src: ['**/*.tpl.html*', '**/*.tpl.jade', '**/*.tpl.pug'],
                        dest: preBuildDir
                    }
                ]
            }
        },

        pug: {
            dev: {
                options: {
                    pretty: true,
                    data: function (dest, src) {
                        // Return an object of data to pass to templates
                        return require('./' + srcDir + '/html-data.json');
                    }
                },
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        flatten: false,
                        cwd: srcDir + '/',
                        src: ['*.jade', '*.pug'],
                        dest: buildDir,
                        ext: '.html'
                    }
                ]
            }
        },

        babel: {
            'dev': {
                options: {
                    sourceMap: true,
                    presets: ['es2015'],
                    // plugins: ['transform-es2015-modules-commonjs'],
                    // auxiliaryCommentBefore: 'Babel jsx transform:',
                    // auxiliaryCommentAfter: 'end of jsx transform',
                    ast: false
                },
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: srcDir + '/',
                        src: ['**/*.js'],
                        dest: preBuildDir + '/'
                    }
                ]
            },
            'prod': {
                options: {
                    sourceMap: false,
                    presets: ['es2015'],
                    // uglify2JS doesn't support es6
                    // plugins: [
                    //     'transform-es2015-modules-commonjs',
                    //     'transform-es2015-template-literals'
                    // ],
                    ast: false
                },
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: preBuildDir + '/'
                    }
                ]
            }
        },

        webpack: {
            options: webpackCommonOptions,
            dev: {
                devtool: "sourcemap",
                debug: true
            },
            prod: {
                plugins: webpackCommonOptions.plugins.concat([
                    new webpack.DefinePlugin({
                        "process.env": {
                            // This has effect on the react lib size
                            "NODE_ENV": JSON.stringify("production")
                        }
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin()
                ])
            }
        },

        less: {
            dev: {
                files: [{
                    src: 'src/main.less',
                    dest: buildDir + '/assets/css/bundle.css'
                }],
                options: {
                    sourceMap: true,
                    outputSourceFiles: true,
                    plugins: [
                        new (require('less-plugin-npm-import'))
                    ]
                }
            },
            prod: {
                files: [{
                    src: 'src/main.less',
                    dest: buildDir + '/assets/css/bundle.css'
                }],
                options: {
                    sourceMap: false,
                    plugins: [
                        new (require('less-plugin-npm-import'))
                    ]
                }
            }
        }

        // 'webpack-dev-server': {
        //     options: {
        //         webpack: webpackCommonOptions,
        //         publicPath: '/' + webpackCommonOptions.output.publicPath
        //     },
        //     start: {
        //         keepAlive: true,
        //         webpack: {
        //             devtool: 'eval',
        //             debug: true
        //         }
        //     }
        // }

        //     delta: {
        //         options: {
        //             livereload: false
        //         },
        //
        //         /**
        //          * When our JavaScript source files change, we want to browserify
        //          * but uglifying really not needed
        //          */
        //         'js-files': {
        //             files: [srcDir + '/**/*.js*'],
        //             tasks: ['babel:dev', 'webpack:dev']
        //         },
        //         'html-files': {
        //             files: [srcDir + '/**/*.html'],
        //             tasks: ['copy:index2Build']
        //         }
        //
        //         /**
        //          * When the LESS files change, we need to compile them.
        //          * but not minify
        //          */
        //         // less: {
        //         //     files: ['webapps/less/**/*.less', 'webapps/admin/components/**/*.less', 'webapps/public/components/**/*.less', 'webapps/common/components/**/*.less'],
        //         //     tasks: ['less:admin', 'less:public']
        //         // }
        //     }
    });

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    // grunt.renameTask('watch', 'delta');

    grunt.registerTask('dev', ['clean', 'pug:dev', 'copy:img2Build', 'copy:fonts2Build', 'less:dev', 'babel:dev', 'copy:templates2Prebuild', 'webpack:dev']);
    grunt.registerTask('prod', ['clean', 'pug:dev', 'copy:img2Build', 'copy:fonts2Build', 'less:prod', 'babel:prod', 'copy:templates2Prebuild', 'webpack:prod']);
};