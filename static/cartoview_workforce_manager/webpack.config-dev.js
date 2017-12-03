var webpack = require('webpack');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');
var plugins = [];
var filename = '[name].bundle.js';
module.exports = {
  entry: {
    config: path.join(APP_DIR, 'AppRender.jsx'),
    ReactClient: path.join(APP_DIR, 'view.jsx'),
  },
  output: {
    path: BUILD_DIR,
    filename: filename,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: "/static/cartoview_basic_viewer/dist/"
  },
  devtool: 'eval-cheap-module-source-map',
  node: {
    fs: "empty"
  },
  plugins: [],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.xml$/,
      loader: 'raw-loader'
    }, {
      test: /\.json$/,
      loader: "json-loader"
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }],
    noParse: [/dist\/ol\.js/, /dist\/jspdf.debug\.js/, /dist\/js\/tether\.js/]
  }
};
