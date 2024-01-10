const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 打包前清除dist目录
const TerserJSPlugin = require('terser-webpack-plugin'); // 压缩js
const jsconfigJson = require('./jsconfig.json');

/**
 * 
 * "paths": {
      "@enum/*": ["src/enum/*"],
      "@src/*": ["src/*"]
    }
 */

const aliasPathMap = jsconfigJson.compilerOptions.paths;
const formatAlias = {};
for(const key in aliasPathMap){
  formatAlias[key.replace(/\/\*/g, '')] =  path.resolve(__dirname, './'+aliasPathMap[key][0].replace(/\/\*/g, ''));
}
console.log('formatAlias:', formatAlias);

module.exports = (env, argv) => {
    const nodeEnv = argv.mode || 'production'; //development | production
    console.log('nodeEnv and env:', nodeEnv, env);

    const config = {
      mode: nodeEnv,
      entry: {
        "main": path.join(__dirname, './src/main.js')
      },
      output: {
        path: path.join(__dirname, './webpack-result'),
        filename: '[name].js',
        publicPath: './'
      },
      // output: {
      //   path: path.join(__dirname, './webpack-result'),
      //   filename: '[name].js',
      //   library: 'XxxName',
      //   libraryTarget: 'umd',
      //   libraryExport: "default",
      //   umdNamedDefine: true
      // },
      resolve: {
        alias: formatAlias,
        extensions: ['.js', '.json']
      },
      target: 'web',
      module: {
        rules: [
            // {
            //     test: /\.css$/i,
            //     use: ['style-loader', 'css-loader'],
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                'useBuiltIns': 'usage',
                                'corejs': 3,
                            },
                        ],
                    ],
                    sourceType: 'unambiguous', //解决import 导入默认异常问题（不同打包规范导致的） //sourceType: 表明代码应该解析的模式。可以是 "script"，"module" 或者 "unambiguous" 中任意一个。默认为 “script”。"unambiguous"将使得Babylon 尝试根据ES6的import 或者export 声明来进行推测。具有 ES6 import和export 的文件被认为是 "module"，否则被认为是 "script"。
                    'plugins': [
                        ['@babel/plugin-transform-runtime', {'corejs': 3}],
                    ],
                },
            },
        ]
      },
      plugins: [
        new CleanWebpackPlugin()
      ],
      optimization: {
        minimizer: [new TerserJSPlugin({
            terserOptions: {
                output: {
                    comments: false,
                },
            },
        })],
      },
      externals: [],
      performance: {
        hints: false
      },
      devtool: nodeEnv === 'development' ? 'source-map' : false
    };

    return config;
};
