import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const basePath = path.join(__dirname, '..');
const distributionPath = path.join(basePath, 'dist');

export default {
	devtool: 'source-map',
	entry: [
		'./app',
	],
	output: {
		path: distributionPath,
		publicPath: '/',
		filename: 'static/bundle.js',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: ['babel'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract(
				'style-loader',
				'css-loader?sourceMap!sass-loader?sourceMap!import-glob'
			),
			// loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
			exclude: /node_modules/,
			include: basePath,
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg|jpeg|jpg)$/,
			loader: 'url-loader?limit=1000000',
		}],
	},
	plugins: [
		new ExtractTextPlugin('gfx/main.css', {
			allChunks: true,
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.template.html',
		}),
	],
};
