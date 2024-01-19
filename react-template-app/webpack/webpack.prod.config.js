const path = require('path');
const fs = require('fs');
const WebpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const baseWebpackConfig = require("./webpack.base.config");

const packageJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')));

// 使用 webpack-merge 合并基础配置和生产环境配置
module.exports = WebpackMerge.merge(baseWebpackConfig('production'), {
    // 指定构建环境为生产环境
    mode: "production",
    
    // 指定入口文件，即项目的主文件
    // entry: path.join(__dirname, '../src/index.jsx'),
    entry: path.join(__dirname, '../src/index.tsx'),

    // 输出位置配置
    output: {
        filename: "js/[name].bundle.js", // 输出的主文件名
        path: path.join(__dirname, '../dist'), // 输出的目录
        chunkFilename: "js/[chunkhash:8].js", // 输出的非主文件（chunk）名，带有 hash
        // publicPath: './'
    },
    
    // 插件配置
    plugins: [
        new ESLintWebpackPlugin({
            extensions: ['mjs', 'js', 'jsx', 'ts', 'tsx'],
            context: path.resolve(__dirname, '../src'),
            cache: true
        }),

        // 清理输出目录
        new CleanWebpackPlugin(),

        // 自动生成 HTML 文件，并注入打包后的资源
        new HtmlWebpackPlugin({
            title: `this is ${packageJson.name}@${packageJson.version} web test demo(production)`,
            filename: "index.html",  // 生成的 HTML 文件名
            template: "public/index.ejs",  // 使用的 HTML 模板文件
            inject: true,  // 将生成的 script 标签注入到 HTML 文件的 body 底部
            hash: true,    // 在打包的资源插入 HTML 时加上 hash
            minify: {
                removeComments: true,               // 去除注释
                collapseWhitespace: true,           // 压缩空格
                removeAttributeQuotes: true         // 去除属性引用的引号
            },
            __WPK_ENV_MODE__: "production",
            __PACK_NAME__: packageJson.name,
            __PACK_VERSION__: packageJson.version,
            __BUILD_TS__: Date.now(),
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

    // 优化配置
    optimization: {
        minimize: true,  // 启用代码压缩
        minimizer: [
        // 使用 TerserPlugin 进行代码压缩
        new TerserPlugin({
            extractComments: false,  // 不将注释提取到单独文件中
        })
        ]
    }
});
