#!/usr/bin/env node
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
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
