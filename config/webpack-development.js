import path from 'path';
import webpack from 'webpack';

const basePath = path.join(__dirname, '..');
const outputPath = path.join(basePath, 'dev');

export default {
	devtool: 'source-map',
	entry: [
		'webpack-dev-server/client?http://10.220.20.140:3000',
		'webpack/hot/only-dev-server',
		'./app',
	],
	output: {
		path: outputPath,
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['react-hot', 'babel'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.scss$/,
			// loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'sass?sourceMap'),
			loaders: ['style', 'css?sourceMap', 'sass?sourceMap', 'import-glob'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg|jpeg|jpg)$/,
			loader: 'url-loader?limit=1000000',
		}],
	},
	sassLoader: {},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
};
