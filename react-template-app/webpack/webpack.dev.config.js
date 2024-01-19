const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const baseWebpackConfig = require("./webpack.base.config");

const packageJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')));
const currentTarget = process.env.npm_lifecycle_event;
console.log('currentTarget:', currentTarget, ' ,process.env.NODE_ENV:', process.env.NODE_ENV);

const devWebpackConfig = {
    // 指定入口文件，即项目的主文件
    // entry: path.join(__dirname, '../src/index.jsx'),
    entry: path.join(__dirname, '../src/index.tsx'),

    // 指定构建环境为开发环境
    mode: "development",
};
const baseCfgOpts = {
    // useMiniCssExtractPlugin: false,
    // coverConf: undefined,
    isPx2Rem: false,
    // px2RemOptions: {}
};

if (currentTarget === 'serve') {
    Object.assign(devWebpackConfig, {
        // 插件配置
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"'
            }),

            new ESLintWebpackPlugin({
                extensions: ['mjs', 'js', 'jsx', 'ts', 'tsx'],
                context: path.resolve(__dirname, '../src'),
                cache: true
            }),

            // 配置输出的 HTML
            new HtmlWebpackPlugin({
                title: `this is ${packageJson.name}@${packageJson.version} web test demo(development)`,
                filename: "index.html",   // 生成的 HTML 文件名
                template: "public/index.ejs",  // 使用的 HTML 模板文件
                inject: true,  // 将生成的 script 标签注入到 HTML 文件中
                __WPK_ENV_MODE__: "development",
                __PACK_NAME__: packageJson.name,
                __PACK_VERSION__: packageJson.version,
                __BUILD_TS__: Date.now(),
                __WPK_NPM_LIFECYCLE_EVENT__: currentTarget
            }),
        ],

        // 开发环境配置
        // source-map 是一种独立的文件，它为每个生成的文件创建一个完整的 Sourcemap 文件。这样的 Sourcemap 文件通常以 .map 结尾，与生成的代码文件相对应。
        // eval-source-map 将 Source Map 作为 Data URL 嵌入到 bundle 中，而不是生成独立的文件。这样会增加构建速度，但可能使 bundle 文件变得较大。
        // 使用 'eval-source-map' 生成 source map，方便在浏览器中调试
        devtool: 'eval-source-map',

        // 开发服务器配置
        devServer: {
            host: 'localhost',  // 指定服务的主机，默认为 'localhost'
            port: 8089,         // 指定服务的端口，默认为 8089
            historyApiFallback: true, // 要求每次都返回 HTML，不配置会出现 "can not GET /" 错误
            hot: true,  // 启用模块热替换（Hot Module Replacement）
            // disableHostCheck: true, // 禁用主机检查，允许所有主机请求。在一些情况下，当你使用自定义域名或者代理服务器时，启用这个选项可能会很有用。
            // https: true,
            // key: './ssl/server.key',
            // cert: './ssl/server.crt',
            // open: true, // open: true 是 webpack-dev-server 的一个配置选项，用于在启动开发服务器时自动打开默认浏览器并访问项目的地址
        }
    });
  } else {
    baseCfgOpts.useMiniCssExtractPlugin = true;

    Object.assign(devWebpackConfig, {
        // 输出位置配置
        output: {
            filename: "js/[name].bundle.js", // 输出的主文件名
            path: path.join(__dirname, '../dist-dev'), // 输出的目录
            chunkFilename: "js/[chunkhash:8].js", // 输出的非主文件（chunk）名，带有 hash
            // publicPath: './'
        },

        // 开发环境配置
        // source-map 是一种独立的文件，它为每个生成的文件创建一个完整的 Sourcemap 文件。这样的 Sourcemap 文件通常以 .map 结尾，与生成的代码文件相对应。
        // eval-source-map 将 Source Map 作为 Data URL 嵌入到 bundle 中，而不是生成独立的文件。这样会增加构建速度，但可能使 bundle 文件变得较大。
        devtool: 'source-map',

        // 插件配置
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"'
            }),

            new ESLintWebpackPlugin({
                extensions: ['mjs', 'js', 'jsx', 'ts', 'tsx'],
                context: path.resolve(__dirname, '../src'),
                cache: true
              }),

            // 清理输出目录
            new CleanWebpackPlugin(),

            // 自动生成 HTML 文件，并注入打包后的资源
            new HtmlWebpackPlugin({
                title: `this is ${packageJson.name}@${packageJson.version} web test demo(development)`,
                filename: "index.html",  // 生成的 HTML 文件名
                template: "public/index.ejs",  // 使用的 HTML 模板文件
                inject: true,  // 将生成的 script 标签注入到 HTML 文件的 body 底部
                hash: true,    // 在打包的资源插入 HTML 时加上 hash
                __WPK_ENV_MODE__: "development",
                __PACK_NAME__: packageJson.name,
                __PACK_VERSION__: packageJson.version,
                __BUILD_TS__: Date.now(),
                __WPK_NPM_LIFECYCLE_EVENT__: currentTarget
            }),

            // 使用 MiniCssExtractPlugin 插件将 CSS 提取为单独的文件
            new MiniCssExtractPlugin({
                // 设置生成的主 CSS 文件的文件名
                filename: `css/[name].css`,
                // 设置生成的按需加载（通过 code splitting）的 CSS 文件的文件名
                chunkFilename: `css/[id].css`,
            }),

            new CopyWebpackPlugin({patterns: [
                {from: "public/favicon.ico",to: ""}
            ]}),
        ],
    });
}

// 使用 webpack-merge 合并基础配置和开发环境配置
module.exports = WebpackMerge.merge(baseWebpackConfig('development', baseCfgOpts), devWebpackConfig);