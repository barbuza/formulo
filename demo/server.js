#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: './demo.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.[hash].js',
    publicPath: '/'
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
    })
  ]
};

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  watchDelay: 300,
  stats: {
    colors: true,
    assets: true,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: false
  }
}).listen(3000, '127.0.0.1', function (err) {
  if (err) {
    console.log(err);
  }
});
