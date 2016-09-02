import webpack from 'webpack';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import ncp from 'ncp';
import fs from 'fs';

import productionConfig from '../config/webpack-production';

function removeExistingDirectory(callback) {
	console.log('removing existing directory');

	rimraf('dist', (error) => {
		if (error) {
			console.error(`removing existing directory failed: ${error}`);

			return;
		}

		callback();
	});
}

function createPaths(callback) {
	console.log('creating paths');

	mkdirp('dist/static', (error) => {
		if (error) {
			console.error(`creating paths failed: ${error}`);

			return;
		}

		mkdirp('dist/gfx', (error2) => {
			if (error2) {
				console.error(`creating paths failed: ${error2}`);

				return;
			}

			callback();
		});
	});
}

function copyStaticAssets(callback) {
	console.log('copying static assets');

	ncp('./gfx/images', './dist/gfx/images', (error) => {
		if (error) {
			console.error(`copying static assets failed: ${error}`);

			return;
		}

		fs.createReadStream('./manifest.json').pipe(
			fs.createWriteStream('./dist/manifest.json')
		);

		callback();
	});
}

function runWebpack(callback) {
	console.log('webpack is doing its thing, please wait..');

	webpack(productionConfig, (error, stats) => {
		if (error) {
			console.error(`webpack completed with an error: ${error}`);

			return;
		}

		console.log('webpack completed successfully, check the "dist" folder');
		console.log(stats.toString({
			chunks: false, // Makes the build much quieter
			colors: true,
		}));

		callback();
	});
}

removeExistingDirectory(() => {
	createPaths(() => {
		copyStaticAssets(() => {
			runWebpack(() => {
				console.log('DONE');
			});
		});
	});
});
