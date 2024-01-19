const path = require('path');
const fs = require('fs');
require('jsonminify');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 定义一个辅助函数 resolve，用于获取文件的绝对路径
const resolve = (link) => path.resolve(__dirname, link);

const tsconfigJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, '../tsconfig.json'), 'utf8')));
const aliasPathMap = tsconfigJson.compilerOptions.paths || {};
const formatAlias = {};
for(const key in aliasPathMap){
  formatAlias[key.replace(/\/\*/g, '')] =  path.resolve(__dirname, '../'+aliasPathMap[key][0].replace(/\/\*/g, ''));
}
console.log('formatAlias:', formatAlias);

// 导出 webpack 配置对象
module.exports = (nodeEnv, opts) => {
    // nodeEnv: development | production
    // opts: {useMiniCssExtractPlugin, coverConf, isPx2Rem, px2RemOptions}
    const isDevelopmentEnv = nodeEnv === 'development';

    const getPxToRemArr = () => {
      if (opts?.isPx2Rem) {
        return [{
          // 使用 webpack-px-to-rem-loader 处理 px 转 rem
          loader: 'webpack-px-to-rem',
          options: Object.assign({
            // 1rem=npx，默认为 10
            basePx: 100,
            // 只会转换大于min的px，默认为0
            // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示
            min: 1,
            // 转换后的rem值保留的小数点后位数，默认为3
            floatWidth: 3
          }, opts?.px2RemOptions || {}),
        }];
      }

      return [];
    }

    const getCssRuleUseArr = () => {
      return [
        // 根据开发环境选择使用 style-loader 或 MiniCssExtractPlugin.loader
        (!isDevelopmentEnv || opts?.useMiniCssExtractPlugin) ? {
          loader: MiniCssExtractPlugin.loader,
          // options: {
          //   // 指定提取出的 CSS 文件的公共路径
          //   publicPath: '../'
          // }
        } : 'style-loader',
        // 使用 css-loader 处理 CSS 文件
        `css-loader`,
        // 使用 postcss-loader 处理 CSS 文件，用于添加浏览器前缀等
        `postcss-loader`,
        ...getPxToRemArr()
      ]
    };

    const config = {      
      // 模块配置，定义对不同类型文件的处理规则
      module: {
        rules: [
          {
            // 匹配以.mjs、.js、.jsx、.ts、.tsx结尾的文件
            test: /\.(mjs|(j|t)sx?)$/,
            use: [
              {
                // 使用 babel-loader 处理以上文件类型
                loader: 'babel-loader',
              },
              ...getPxToRemArr()
            ],
            // 指定需要进行处理的文件目录
            include: [resolve('../src')],
            // 排除 node_modules 目录下的文件
            exclude: /node_modules/
          },
          {
            // 匹配以.css结尾的文件
            test: /\.css$/,
            use: [...getCssRuleUseArr()]
          },
          {
            // 匹配以.(sass|scss)结尾的文件
            test: /\.(sass|scss)$/,
            use: [
              ...getCssRuleUseArr(),
              'sass-loader'
            ]
          },
          {
            // 匹配以.less结尾的文件
            test: /\.less$/,
            use: [
              ...getCssRuleUseArr(),
              'less-loader'
            ]
          },
          {
            // 匹配以.png、.jpg、.jpeg、.gif或.svg结尾的文件
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            // webpack5 新增 Asset Modules 资源模块。
            // 资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。
            // 资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：
            //   1、asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
            //   2、asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
            //   3、asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
            //   4、asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
            // 使用 webpack5 asset 处理图片文件
            type: 'asset/resource',
            generator: {
              filename: 'assets/imgs/[name]_[hash:6][ext]',
            },
            // parser: { // 需要 type: 'asset',
            //   dataUrlCondition: {
            //     maxSize: 8 * 1024, // 小于 8KB 的文件使用 data URL
            //   },
            // }
          },
          {
            // 匹配以.woff、.woff2、.eot、.ttf或.otf结尾的文件
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            // 使用 webpack5 asset/resource 处理字体文件
            type: 'asset/resource',
            generator: {
              filename: 'assets/fonts/[name]_[hash:6][ext]',
            }
          }
        ]
      },
    
      // 解析模块的配置，用于指定模块的解析方式
      resolve: {
        // 配置别名
        alias: formatAlias,
        // 指定文件扩展名，以便在引入模块时可以省略文件扩展名
        extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      target: 'web',
      // performance 配置用于控制 webpack 在处理资源时输出性能提示的选项。
      // performance: {
      //   // hints 被设置为 false，这意味着关闭了性能提示。'warning': 输出警告信息，但仍然继续构建。'error': 输出错误信息，可能导致构建失败。
      //   hints: false
      // },
    }

    opts?.coverConf && Object.assign(config, opts.coverConf);

    return config;
}