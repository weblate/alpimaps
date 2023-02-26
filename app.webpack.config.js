const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
const { readFileSync, readdirSync } = require('fs');
const { dirname, join, relative, resolve } = require('path');
const nsWebpack = require('@nativescript/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const IgnoreNotFoundExportPlugin = require('./scripts/IgnoreNotFoundExportPlugin');
const Fontmin = require('@akylas/fontmin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

function fixedFromCharCode(codePt) {
    if (codePt > 0xffff) {
        codePt -= 0x10000;
        return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
    } else {
        return String.fromCharCode(codePt);
    }
}
module.exports = (env, params = {}) => {
    Object.keys(env).forEach((k) => {
        if (env[k] === 'false' || env[k] === '0') {
            env[k] = false;
        } else if (env[k] === 'true' || env[k] === '1') {
            env[k] = true;
        }
    });
    if (env.adhoc_sentry) {
        env = Object.assign(
            {},
            {
                production: true,
                sentry: true,
                uploadSentry: true,
                testlog: true,
                noconsole: false,
                sourceMap: true,
                uglify: true
            },
            env
        );
    } else if (env.adhoc) {
        env = Object.assign(
            {},
            {
                buildpeakfinder: true,
                buildstyle: true,
                production: true,
                noconsole: true,
                sentry: false,
                uploadSentry: false,
                apiKeys: true,
                sourceMap: false,
                uglify: true
            },
            env
        );
    } else if (env.timeline) {
        env = Object.assign(
            {},
            {
                buildpeakfinder: true,
                buildstyle: true,
                production: true,
                sentry: false,
                noconsole: false,
                uploadSentry: false,
                apiKeys: true,
                keep_classnames_functionnames: true,
                sourceMap: false,
                uglify: true
            },
            env
        );
    }
    const nconfig = require('./nativescript.config');
    const {
        appPath = nconfig.appPath,
        appResourcesPath = nconfig.appResourcesPath,
        production,
        sourceMap,
        hiddenSourceMap,
        inlineSourceMap,
        sentry,
        uploadSentry,
        uglify,
        profile,
        noconsole,
        timeline,
        cartoLicense = false,
        devlog,
        testlog,
        fork = true,
        buildpeakfinder,
        buildstyle,
        disableoffline = false,
        busSupport = true,
        apiKeys = true,
        keep_classnames_functionnames = false,
        locale = 'auto',
        theme = 'auto',
        adhoc
    } = env;
    console.log('env', env);
    env.appPath = appPath;
    env.appResourcesPath = appResourcesPath;
    env.appComponents = env.appComponents || [];
    env.appComponents.push('~/services/android/BgService', '~/services/android/BgServiceBinder');

    nsWebpack.chainWebpack((config, env) => {
        config.when(env.production, (config) => {
            config.module
                .rule('svelte')
                .use('string-replace-loader')
                .loader('string-replace-loader')
                .before('svelte-loader')
                .options({
                    search: 'createElementNS\\("https:\\/\\/svelte.dev\\/docs#template-syntax-svelte-options"',
                    replace: 'createElementNS(svN',
                    flags: 'gm'
                })
                .end();
        });

        return config;
    });
    const config = webpackConfig(env, params);
    // config.resolve.conditionNames.push('svelte');
    const mode = production ? 'production' : 'development';
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const projectRoot = params.projectRoot || __dirname;
    const dist = nsWebpack.Utils.platform.getDistPath();
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    if (profile) {
        const StatsPlugin = require('stats-webpack-plugin');

        config.plugins.unshift(
            new StatsPlugin(resolve(join(projectRoot, 'webpack.stats.json')), {
                preset: 'minimal',
                chunkModules: true,
                modules: true,
                usedExports: true
            })
        );
        // config.profile = true;
        // config.parallelism = 1;
        // config.stats = { preset: 'minimal', chunkModules: true, modules: true, usedExports: true };
    }

    // nsWebpack.chainWebpack((config, env) => {
    //     config.externals([
    //         '~/licenses.json',
    //         '~/osm_icons.json',
    //         function ({ context, request }, cb) {
    //             if (/i18n$/i.test(context)) {
    //                 return cb(null, './i18n/' + request);
    //             }
    //             cb();
    //         }
    //     ]);
    //     config.resolve.modules.clear().add('node_modules');
    //     config.resolve.alias({
    //         '@nativescript/core': `${coreModulesPackageName}`,
    //         'svelte-native': '@akylas/svelte-native',
    //         'tns-core-modules': `${coreModulesPackageName}`,
    //         '@nativescript/core/accessibility$': '~/acessibilityShim',
    //         '../../../accessibility$': '~/acessibilityShim',
    //         '../../accessibility$': '~/acessibilityShim',
    //         [`${coreModulesPackageName}/accessibility$`]: '~/acessibilityShim'
    //     });
    //     const APP_STORE_ID = process.env.IOS_APP_ID;
    //     const CUSTOM_URL_SCHEME = 'alpimaps';
    //     const locales = readdirSync(join(projectRoot, appPath, 'i18n'))
    //         .filter((s) => s.endsWith('.json'))
    //         .map((s) => s.replace('.json', ''));
    //     config.plugin('DefinePlugin').tap((options) => {
    //         Object.assign(options, {
    //             PRODUCTION: !!production,
    //             'gVars.platform': `"${platform}"`,
    //             __UI_USE_EXTERNAL_RENDERER__: true,
    //             __UI_USE_XML_PARSER__: false,
    //             'global.__AUTO_REGISTER_UI_MODULES__': false,
    //             '__IOS__': isIOS,
    //             '__ANDROID__': isAndroid,
    //             'global.autoLoadPolyfills': false,
    //             'gVars.internalApp': false,
    //             TNS_ENV: JSON.stringify(mode),
    //             SUPPORTED_LOCALES: JSON.stringify(locales),
    //             'SENTRY_ENABLED': !!sentry,
    //             NO_CONSOLE: noconsole,
    //             SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
    //             SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
    //             GIT_URL: `"${package.repository}"`,
    //             SUPPORT_URL: `"${package.bugs.url}"`,
    //             CUSTOM_URL_SCHEME: `"${CUSTOM_URL_SCHEME}"`,
    //             STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${nconfig.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
    //             STORE_REVIEW_LINK: `"${
    //                 isIOS
    //                     ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
    //                     : `market://details?id=${nconfig.id}`
    //             }"`,
    //             DEV_LOG: !!devlog,
    //             TEST_LOG: !!adhoc || !production
    //         });
    //         const keys = require(resolve(__dirname, 'API_KEYS')).keys;
    //         Object.keys(keys).forEach((s) => {
    //             if (s === 'ios' || s === 'android') {
    //                 if (s === platform) {
    //                     Object.keys(keys[s]).forEach((s2) => {
    //                         options[`gVars.${s2}`] = apiKeys ? `'${keys[s][s2]}'` : 'undefined';
    //                     });
    //                 }
    //             } else {
    //                 options[`gVars.${s}`] = apiKeys ? `'${keys[s]}'` : 'undefined';
    //             }
    //         });
    //         return options;
    //     });

    //     const symbolsParser = require('scss-symbols-parser');
    //     const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    //     const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);
    //     const appSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'css/variables.scss')).toString());
    //     const appIcons = {};
    //     appSymbols.variables
    //         .filter((v) => v.name.startsWith('$icon-'))
    //         .forEach((v) => {
    //             appIcons[v.name.replace('$icon-', '')] = String.fromCharCode(parseInt(v.value.slice(2), 16));
    //         });

    //     const scssPrepend = `$alpimaps-fontFamily: alpimaps;
    // $mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};
    // `;
    //     config.module
    //         .rule('scss')
    //         .exclude('.module.scss$')
    //         .use('css2json-loader')
    //         .tap((options) => Object.assign(options, { useForImports: true }))
    //         .end()
    //         .use('postcss-loader')
    //         .tap((options) =>
    //             Object.assign(options, {
    //                 postcssOptions: {
    //                     plugins: [
    //                         'postcss-import',
    //                         [
    //                             'cssnano',
    //                             {
    //                                 preset: 'advanced'
    //                             }
    //                         ],
    //                         ['postcss-combine-duplicated-selectors', { removeDuplicatedProperties: true }]
    //                     ]
    //                 }
    //             })
    //         )
    //         .end()
    //         .use('sass-loader')
    //         .tap((options) =>
    //             Object.assign(options, {
    //                 sourceMap: false,
    //                 additionalData: scssPrepend
    //             })
    //         );
    //     config.module.rule('module.scss').use('css-loader').loader('css-loader').options({ url: false }).end().use('sass-loader').loader('sass-loader').options({
    //         sourceMap: false,
    //         additionalData: scssPrepend
    //     });

    //     const usedMDIICons = [];
    //     config.module
    //         .rule('font-icons')
    //         .use('mdi-icons')
    //         .loader('string-replace-loader')
    //         .options({
    //             search: 'mdi-([a-z0-9-_]+)',
    //             replace: (match, p1, offset, str) => {
    //                 if (mdiIcons[p1]) {
    //                     const unicodeHex = mdiIcons[p1];
    //                     const numericValue = parseInt(unicodeHex, 16);
    //                     const character = fixedFromCharCode(numericValue);
    //                     usedMDIICons.push(numericValue);
    //                     return character;
    //                 }
    //                 return match;
    //             },
    //             flags: 'g'
    //         })
    //         .end()
    //         .use('app-icons')
    //         .loader('string-replace-loader')
    //         .options({
    //             search: 'alpimaps-([a-z0-9-_]+)',
    //             replace: (match, p1, offset, str) => {
    //                 if (appIcons[p1]) {
    //                     return appIcons[p1];
    //                 }
    //                 return match;
    //             },
    //             flags: 'g'
    //         })
    //         .end();

    //     config.when(env.production, (config) => {
    //         config.module
    //             .rule('clean-profile')
    //             .test([/\.js$/])
    //             .use('string-replace-loader')
    //             .loader('string-replace-loader')
    //             .options({
    //                 search: '__decorate\\(\\[((.|\n)*?)profile,((.|\n)*?)\\],.*?,.*?,.*?\\);?',
    //                 replace: (match, p1, offset, string) => '',
    //                 flags: 'g'
    //             })
    //             .end();
    //         config.module.rule('clean-profile').test([/\.ts$/]).use('string-replace-loader').loader('string-replace-loader').options({
    //             search: 'if\\s*\\(\\s*Trace.isEnabled\\(\\)\\s*\\)',
    //             replace: 'if (false)',
    //             flags: 'g'
    //         });
    //     });
    // });
    config.externals.push('~/licenses.json');
    config.externals.push('~/osm_icons.json');
    config.externals.push(function ({ context, request }, cb) {
        if (/i18n$/i.test(context)) {
            return cb(null, './i18n/' + request);
        }
        cb();
    });

    const coreModulesPackageName = fork ? '@akylas/nativescript' : '@nativescript/core';
    if (fork) {
        config.resolve.modules = [resolve(__dirname, `node_modules/${coreModulesPackageName}`), resolve(__dirname, 'node_modules'), `node_modules/${coreModulesPackageName}`, 'node_modules'];
        Object.assign(config.resolve.alias, {
            '@nativescript/core': `${coreModulesPackageName}`,
            'tns-core-modules': `${coreModulesPackageName}`
        });
    }
    let appVersion;
    let buildNumber;
    if (platform === 'android') {
        const gradlePath = resolve(projectRoot, appResourcesPath, 'Android/app.gradle');
        const gradleData = readFileSync(gradlePath, 'utf8');
        appVersion = gradleData.match(/versionName "((?:[0-9]+\.?)+)"/)[1];
        buildNumber = gradleData.match(/versionCode ([0-9]+)/)[1];
    } else if (platform === 'ios') {
        const plistPath = resolve(projectRoot, appResourcesPath, 'iOS/Info.plist');
        const plistData = readFileSync(plistPath, 'utf8');
        appVersion = plistData.match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
        buildNumber = plistData.match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
    }

    const package = require('./package.json');
    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const APP_STORE_ID = process.env.IOS_APP_ID;
    const CUSTOM_URL_SCHEME = 'alpimaps';
    const supportedLocales = readdirSync(join(projectRoot, appPath, 'i18n'))
        .filter((s) => s.endsWith('.json'))
        .map((s) => s.replace('.json', ''));
    const defines = {
        PRODUCTION: !!production,
        process: 'global.process',
        'global.TNS_WEBPACK': 'true',
        'gVars.platform': `"${platform}"`,
        __UI_USE_EXTERNAL_RENDERER__: true,
        __UI_USE_XML_PARSER__: false,
        'global.__AUTO_REGISTER_UI_MODULES__': false,
        __IOS__: isIOS,
        __ANDROID__: isAndroid,
        'global.autoLoadPolyfills': false,
        'gVars.internalApp': false,
        TNS_ENV: JSON.stringify(mode),
        __APP_ID__: `"${nconfig.id}"`,
        __APP_VERSION__: `"${appVersion}"`,
        __APP_BUILD_NUMBER__: `"${buildNumber}"`,
        __DISABLE_OFFLINE__: disableoffline,
        SUPPORTED_LOCALES: JSON.stringify(supportedLocales),
        DEFAULT_LOCALE: `"${locale}"`,
        WITH_BUS_SUPPORT: busSupport,
        DEFAULT_THEME: `"${theme}"`,
        SENTRY_ENABLED: !!sentry,
        NO_CONSOLE: noconsole,
        SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
        SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
        GIT_URL: `"${package.repository}"`,
        SUPPORT_URL: `"${package.bugs.url}"`,
        CUSTOM_URL_SCHEME: `"${CUSTOM_URL_SCHEME}"`,
        STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${nconfig.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
        STORE_REVIEW_LINK: `"${
            isIOS
                ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
                : `market://details?id=${nconfig.id}`
        }"`,
        DEV_LOG: !!devlog,
        TEST_LOG: !!devlog || !!testlog
    };
    try {
        const keys = require(resolve(__dirname, 'API_KEYS')).keys;
        Object.keys(keys).forEach((s) => {
            if (s === 'ios' || s === 'android') {
                if (s === platform) {
                    Object.keys(keys[s]).forEach((s2) => {
                        defines[`gVars.${s2}`] = apiKeys ? `'${keys[s][s2]}'` : 'undefined';
                    });
                }
            } else {
                defines[`gVars.${s}`] = apiKeys ? `'${keys[s]}'` : 'undefined';
            }
        });
    } catch (error) {
        console.error('could not access API_KEYS.js');
    }
    Object.assign(config.plugins.find((p) => p.constructor.name === 'DefinePlugin').definitions, defines);

    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);
    const appSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'css/variables.scss')).toString());
    const appIcons = {};
    appSymbols.variables
        .filter((v) => v.name.startsWith('$icon-'))
        .forEach((v) => {
            appIcons[v.name.replace('$icon-', '')] = String.fromCharCode(parseInt(v.value.slice(2), 16));
        });

    const scssPrepend = `$alpimaps-fontFamily: alpimaps;
    $mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};
    `;
    const scssLoaderRuleIndex = config.module.rules.findIndex((r) => r.test && r.test.toString().indexOf('scss') !== -1);
    config.module.rules.splice(
        scssLoaderRuleIndex,
        1,
        {
            test: /app\.scss$/,
            use: [
                { loader: 'apply-css-loader' },
                {
                    loader: 'css2json-loader',
                    options: { useForImports: true }
                }
            ]
                .concat(
                    !!production
                        ? [
                              {
                                  loader: 'postcss-loader',
                                  options: {
                                      postcssOptions: {
                                          plugins: [
                                              [
                                                  'cssnano',
                                                  {
                                                      preset: 'advanced'
                                                  }
                                              ],
                                              ['postcss-combine-duplicated-selectors', { removeDuplicatedProperties: true }]
                                          ]
                                      }
                                  }
                              }
                          ]
                        : []
                )
                .concat([
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            additionalData: scssPrepend
                        }
                    }
                ])
        },
        {
            test: /\.module\.scss$/,
            use: [
                { loader: 'css-loader', options: { url: false } },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        }
    );

    const usedMDIICons = [];
    config.module.rules.push({
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|svelte)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z0-9-_]+)',
                    replace: (match, p1, offset, str) => {
                        if (mdiIcons[p1]) {
                            const unicodeHex = mdiIcons[p1];
                            const numericValue = parseInt(unicodeHex, 16);
                            const character = fixedFromCharCode(numericValue);
                            usedMDIICons.push(numericValue);
                            return character;
                        }
                        return match;
                    },
                    flags: 'g'
                }
            },
            {
                loader: 'string-replace-loader',
                options: {
                    search: '__PACKAGE__',
                    replace: nconfig.id,
                    flags: 'g'
                }
            },
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'alpimaps-([a-z0-9-_]+)',
                    replace: (match, p1, offset, str) => {
                        if (appIcons[p1]) {
                            return appIcons[p1];
                        }
                        return match;
                    },
                    flags: 'g'
                }
            }
        ]
    });
    // we remove default rules
    config.plugins = config.plugins.filter((p) => ['CopyPlugin', 'ForkTsCheckerWebpackPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    const globOptions = { dot: false, ignore: [`**/${relative(appPath, appResourcesFullPath)}/**`] };

    const context = nsWebpack.Utils.platform.getEntryDirPath();
    const copyPatterns = [
        { context, from: 'fonts/!(ios|android)/**/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: 'fonts/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: `fonts/${platform}/**/*`, to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.jpg', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.png', noErrorOnMissing: true, globOptions },
        { context, from: 'assets/**/*', noErrorOnMissing: true, globOptions },
        { context, from: 'i18n/**/*', globOptions },
        {
            from: 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
            to: 'fonts',
            globOptions,
            transform: !!production
                ? {
                      transformer(content, path) {
                          return new Promise((resolve, reject) => {
                              new Fontmin()
                                  .src(content)
                                  .use(Fontmin.glyph({ subset: usedMDIICons }))
                                  .run(function (err, files) {
                                      if (err) {
                                          reject(err);
                                      } else {
                                          resolve(files[0].contents);
                                      }
                                  });
                          });
                      }
                  }
                : undefined
        },
        {
            from: 'css/osm.scss',
            to: 'osm_icons.json',
            globOptions,
            transform: {
                cache: !production,
                transformer(manifestBuffer, path) {
                    const osmSymbols = symbolsParser.parseSymbols(manifestBuffer.toString());
                    const osmIcons = osmSymbols.variables.reduce(function (acc, value) {
                        if (value.name.startsWith('$osm-')) {
                            acc[value.name.slice(5)] = String.fromCharCode(parseInt(value.value.slice(2, -1), 16));
                        }
                        return acc;
                    }, {});
                    return Buffer.from(JSON.stringify(osmIcons));
                }
            }
        }
    ];
    if (!production) {
        copyPatterns.push({ context: 'dev_assets', from: '**/*', to: 'assets', globOptions });
    }
    config.plugins.unshift(new CopyPlugin({ patterns: copyPatterns }));

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            svN: '~/svelteNamespace'
        })
    );

    config.plugins.push(new SpeedMeasurePlugin());

    config.plugins.unshift(
        new webpack.ProvidePlugin({
            setTimeout: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'setTimeout'],
            clearTimeout: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'clearTimeout'],
            setInterval: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'setInterval'],
            clearInterval: [require.resolve(coreModulesPackageName + '/timer/index.' + platform), 'clearInterval'],
            // FormData: [require.resolve(coreModulesPackageName + '/polyfills/formdata'), 'FormData'],
            requestAnimationFrame: [require.resolve(coreModulesPackageName + '/animation-frame'), 'requestAnimationFrame'],
            cancelAnimationFrame: [require.resolve(coreModulesPackageName + '/animation-frame'), 'cancelAnimationFrame']
        })
    );
    config.plugins.push(new webpack.ContextReplacementPlugin(/dayjs[\/\\]locale$/, new RegExp(`(${supportedLocales.join('|')}).\js`)));

    config.optimization.splitChunks.cacheGroups.defaultVendor.test = /[\\/](node_modules|ui-carto|ui-chart|NativeScript[\\/]dist[\\/]packages[\\/]core)[\\/]/;
    config.plugins.push(new IgnoreNotFoundExportPlugin());

    const nativescriptReplace = '(NativeScript[\\/]dist[\\/]packages[\\/]core|@nativescript/core)';
    config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/http$/, (resource) => {
            if (resource.context.match(nativescriptReplace) || resource.request === '@nativescript/core/http') {
                resource.request = '@nativescript-community/https';
            }
        })
    );
    if (fork) {
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/accessibility$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/accessibility';
                }
            })
        );
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/action-bar$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/action-bar';
                }
            })
        );
    }
    // save as long as we dont use calc in css
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /reduce-css-calc$/ }));
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /punnycode$/ }));
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^url$/ }));

    if (!!production && !timeline) {
        console.log('removing N profiling');
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/profiling$/, (resource) => {
                if (resource.context.match(nativescriptReplace)) {
                    resource.request = '~/shims/profile';
                }
            })
        );
        if (!sentry) {
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(/trace$/, (resource) => {
                    if (resource.context.match(nativescriptReplace)) {
                        resource.request = '~/shims/trace';
                    }
                })
            );
        }
        config.module.rules.push(
            {
                // rules to replace mdi icons and not use nativescript-font-icon
                test: /\.(js)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: /__decorate\(\[((\s|\t|\n)*?)([a-zA-Z]+\.)?profile((\s|\t|\n)*?)\],.*?,.*?,.*?\);?/gm,
                            replace: (match, p1, offset, str) => '',
                            flags: 'gm'
                        }
                    }
                ]
            },
            {
                // rules to replace mdi icons and not use nativescript-font-icon
                test: /\.(ts)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '@profile',
                            replace: (match, p1, offset, str) => '',
                            flags: ''
                        }
                    }
                ]
            },
            // rules to clean up all Trace in production
            // we must run it for all files even node_modules
            {
                test: /\.(ts|js)$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: /if\s*\(\s*Trace.isEnabled\(\)\s*\)/gm,
                            replace: (match, p1, offset, str) => 'if (false)',
                            flags: 'g'
                        }
                    }
                ]
            }
        );
    }
    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                async: false
            })
        );
    }

    if (buildstyle) {
        const css2xmlBin = `css2xml_${process.platform}`;
        config.plugins.unshift(
            new WebpackShellPluginNext({
                onBuildStart: {
                    scripts: [
                        `./${css2xmlBin} dev_assets/styles/osm/streets.json dev_assets/styles/osmxml_cleaned/streets.xml`,
                        `./${css2xmlBin} dev_assets/styles/osm/osm.json dev_assets/styles/osmxml_cleaned/osm.xml`,
                        `./${css2xmlBin} dev_assets/styles/osm/outdoors.json dev_assets/styles/osmxml_cleaned/outdoors.xml`,
                        'cd ./dev_assets/styles/osmxml_cleaned && zip -r ../../../app/assets/styles/osm.zip ./* && cd -',
                        `./${css2xmlBin} dev_assets/internal_styles/inner/voyager.json dev_assets/internal_styles/inner_cleaned/voyager.xml`,
                        'cd ./dev_assets/internal_styles/inner_cleaned && zip -r ../../../app/assets/internal_styles/inner.zip ./* && cd -'
                    ],
                    blocking: true,
                    parallel: false
                }
            })
        );
    }

    if (hiddenSourceMap || sourceMap) {
        if (!!sentry && !!uploadSentry) {
            config.devtool = false;
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    append: `\n//# sourceMappingURL=${process.env.SENTRY_PREFIX}[name].js.map`,
                    filename: join(process.env.SOURCEMAP_REL_DIR, '[name].js.map')
                })
            );
            config.plugins.push(
                new SentryCliPlugin({
                    release: appVersion,
                    urlPrefix: 'app:///',
                    rewrite: true,
                    release: `${nconfig.id}@${appVersion}+${buildNumber}`,
                    dist: `${buildNumber}.${platform}`,
                    ignoreFile: '.sentrycliignore',
                    include: [dist, join(dist, process.env.SOURCEMAP_REL_DIR)]
                })
            );
        } else {
            config.devtool = 'inline-nosources-cheap-module-source-map';
        }
    } else {
        config.devtool = false;
    }
    config.externalsPresets = { node: false };
    config.resolve.fallback = config.resolve.fallback || {};
    config.optimization.minimize = uglify !== undefined ? !!uglify : production;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap || !!inlineSourceMap;
    const actual_keep_classnames_functionnames = keep_classnames_functionnames || platform !== 'android';
    config.optimization.usedExports = true;
    config.optimization.minimizer = [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: isAndroid ? 2020 : 2020,
                module: true,
                toplevel: false,
                keep_classnames: actual_keep_classnames_functionnames,
                keep_fnames: actual_keep_classnames_functionnames,
                output: {
                    comments: false,
                    semicolons: !isAnySourceMapEnabled
                },
                mangle: {
                    properties: {
                        reserved: ['__metadata'],
                        regex: /^(m[A-Z])/
                    }
                },
                compress: {
                    booleans_as_integers: false,
                    // The Android SBG has problems parsing the output
                    // when these options are enabled
                    collapse_vars: platform !== 'android',
                    sequences: platform !== 'android',
                    passes: 3,
                    drop_console: production && noconsole
                }
            }
        })
    ];
    if (buildpeakfinder) {
        return [require('./peakfinder.webpack.config.js')(env, params), config];
    } else {
        return config;
    }
};
