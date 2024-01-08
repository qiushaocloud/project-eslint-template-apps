const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
require('jsonminify');
const fs = require('fs');
const tsconfigJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, './tsconfig.json'), 'utf8')));
const aliasPathMap = tsconfigJson.compilerOptions.paths;
const formatAlias = {};
for(const key in aliasPathMap){
  formatAlias[key.replace(/\/\*/g, '')] =  path.resolve(__dirname, './'+aliasPathMap[key][0].replace(/\/\*/g, ''));
}

module.exports = (env, argv) => {
    const nodeEnv = argv.mode || 'production'; //development | production

    const config = {
      mode: nodeEnv,
      entry: {
        "main": path.join(__dirname, './src/main.ts')
      },
      output: {
        path: path.join(__dirname, './webpack-result'),
        filename: '[name].js',
        publicPath: './'
      },
      resolve: {
        alias: formatAlias,
        extensions: ['.js', '.ts', '.json']
      },
      target: 'node',
      node:{
        // console: true,
        global: true,
        // process: true,
        // Buffer: true,
        // setImmediate: true,
        __dirname: true,
        __filename: true
      },
      module: {
        rules: [{
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
              },
            ]
        }]
      },
      plugins: [new CleanWebpackPlugin()],
      externals: [
        nodeExternals()
      ],
      devtool: nodeEnv === 'development' ? 'source-map' : false
    };

    return config;
};
