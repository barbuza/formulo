var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './demo.jsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx?harmony&es5'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file'
    }]
  },
  devtool: 'eval',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: 'index.tmpl.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
  delete module.exports.devtool;
}
