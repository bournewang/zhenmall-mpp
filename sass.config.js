// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//删除多余js
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const path = require('path');
const entry = require('webpack-glob-entry')

// console.log(entry(filePath => path.join(filePath).replace('.scss',''), './pages/**/*.scss'))
module.exports = {
  mode: 'production',
  entry: entry(filePath => path.join(filePath).replace('.scss', ''), './pages/**/*.scss'),
  output: {
    path: path.resolve(__dirname),
    // filename: '[name].wxss',
  },
  resolve: {
    extensions: ['.scss'],
  },

  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: './[name].wxss'
    })
    // new CleanWebpackPlugin(),
  ],


}
