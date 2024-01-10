const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
require('jsonminify');
const fs = require('fs');
const { execSync } = require('child_process');
const WebpackDtsBundlePlugin = require('@qiushaocloud/webpack-dts-bundle-plugin');

const packageJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8')));
const tsconfigJson = JSON.parse(JSON.minify(fs.readFileSync(path.resolve(__dirname, './tsconfig.json'), 'utf8')));
const aliasPathMap = tsconfigJson.compilerOptions.paths;
const formatAlias = {};
for(const key in aliasPathMap){
  formatAlias[key.replace(/\/\*/g, '')] =  path.resolve(__dirname, './'+aliasPathMap[key][0].replace(/\/\*/g, ''));
}

// console.log('packageJson:', packageJson);
console.log('formatAlias:', formatAlias);

const readDirAllFileSync = (dirName) => {
  if (!fs.existsSync(dirName)) return [];
  const fileOrDirArr = fs.readdirSync(dirName);
  const allFileArr = [];

  for (const fileOrDir of fileOrDirArr) {
    const pathName = `${dirName}/${fileOrDir}`;
    const stat = fs.lstatSync(pathName);
    if (stat.isDirectory()) {
      allFileArr.push(...readDirAllFileSync(pathName));
      continue;
    }
       
    allFileArr.push(pathName);
  }

  return allFileArr;
}

const dtsBundleBeforeHandler = () => {
  // Add the command you want to execute here
  const command = 'npx tsc-alias --project tsconfig.json';

  console.log('dtsBundleBeforeHandler => Executing command:', command);

  try {
    const result = execSync(command, { stdio: 'inherit' });
    console.log('dtsBundleBeforeHandler => Command output:', result);
  } catch (error) {
    console.error('dtsBundleBeforeHandler => Error during command execution:', error);
  }
}

const dtsBundleAfterHandler  = () => {
  try {
    console.log('dtsBundleAfterHandler => start copyFileSync brower.d.ts and object.d.ts');
    !fs.existsSync(path.join(__dirname, './webpack-result/typings')) && fs.mkdirSync(path.join(__dirname, './webpack-result/typings'), { recursive: true });
    const typingsFilePaths = readDirAllFileSync('./typings');
    for (const typingsFilePath of typingsFilePaths) {
      const destFilePath = typingsFilePath.replace('/typings/', '/webpack-result/typings/');
      !fs.existsSync(path.dirname(destFilePath)) && fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
      fs.copyFileSync(typingsFilePath, destFilePath);
    }

    console.log('dtsBundleAfterHandler => end copyFileSync brower.d.ts and object.d.ts, exists main.d.ts:', fs.existsSync(path.join(__dirname, './webpack-result/main.d.ts')));
    if (fs.existsSync(path.join(__dirname, './webpack-result/main.d.ts'))) {
      console.log('readFileSync main.d.ts');
      let fileContent = fs.readFileSync(path.join(__dirname, './webpack-result/main.d.ts'), {encoding: 'utf-8'});
      console.log('main.d.ts replace fileContent');

      let replaceValue = '';
      for (let i =0, len = typingsFilePaths.length; i < len; i++) {
        const typingsFilePath = typingsFilePaths[i];
        replaceValue += `${i === 0 ? '' : '\n'}/// <reference path='${typingsFilePath}' />`;
      }
      replaceValue && (replaceValue += `\ndeclare module '${packageJson.name}' {`);

      console.log('dtsBundleAfterHandler => replaceValue:', replaceValue);
      if (replaceValue) {
        fileContent = fileContent.replace(
          `declare module '${packageJson.name}' {`,
          replaceValue
        );
        console.log('main.d.ts write fileContent');
        fs.writeFileSync(path.join(__dirname, './webpack-result/main.d.ts'), fileContent);
      }
    }
  } catch (error) {
    console.error('dtsBundleAfterHandler => Error during copyFileSync brower.d.ts and object.d.ts execution:', error);
  }
}

module.exports = (env, argv) => {
    const nodeEnv = argv.mode || 'production'; //development | production
    console.log('nodeEnv and env:', nodeEnv, env);

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
      plugins: [
        new CleanWebpackPlugin(),
        new WebpackDtsBundlePlugin({
          name: packageJson.name,
          main: path.resolve(__dirname, './dist-dts/main.d.ts'),
          out: path.resolve(__dirname, './webpack-result/main.d.ts'),
          externals: false,
        }, dtsBundleBeforeHandler, dtsBundleAfterHandler)
      ],
      externals: [
        nodeExternals()
      ],
      devtool: nodeEnv === 'development' ? 'source-map' : false
    };

    return config;
};
