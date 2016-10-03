import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../config/webpack-development';

// configuration
const port = process.argv.length >= 3 ? process.argv[2] : 3000;
const compilerOptions = {
	publicPath: webpackConfig.output.publicPath,
	hot: true,
	historyApiFallback: true,
	noInfo: true,
};

// append port to dev server url
webpackConfig.entry[0] += `:${port}`;

// create compiler and server
const compiler = webpack(webpackConfig);
const webpackDevServer = new WebpackDevServer(compiler, compilerOptions);

// start the server
webpackDevServer.listen(port, '0.0.0.0', (error) => {
	if (error) {
		console.error(error);

		return;
	}

	console.log(`server running on port ${port}`);
});
