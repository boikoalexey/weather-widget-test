const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development'

  // Проверяем существование dev.html, если нет - используем index.html
  const devTemplate = path.resolve(__dirname, 'public/dev.html')
  const defaultTemplate = path.resolve(__dirname, 'public/index.html')
  const templateFile = fs.existsSync(devTemplate)
    ? devTemplate
    : defaultTemplate

  return {
    mode: argv.mode || 'production',
    entry: path.resolve(__dirname, 'src/main.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'weather-widget.js',
      clean: true,
      library: {
        name: 'WeatherWidget',
        type: 'umd',
        umdNamedDefine: true,
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                additionalData: `@use "@/styles/variables" as *;`,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      ...(isDevelopment
        ? [
            new HtmlWebpackPlugin({
              template: templateFile,
            }),
          ]
        : []),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      port: 8080,
      hot: true,
      open: true,
    },
    devtool: isDevelopment ? 'eval-source-map' : false,
  }
}
