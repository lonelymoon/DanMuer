const path = require("path");
const webpack = require("webpack");

const normal = {
	context : path.resolve(__dirname,'./src/js'),
	entry : './DanMuer.output.js',
	output : {
		filename : "DanMuer.webpack.js",
		path : path.resolve(__dirname,'./dist/webpackOutput')
	}
};

const es5 = {
	context : path.resolve(__dirname,'./src/js'),
	entry : ['babel-polyfill','proxy-polyfill','./DanMuer.output.js'],
	output : {
		filename : "DanMuer-es5.min.js",
		path : path.resolve(__dirname,'./dist/webpackOutput')
	},
	module: {
        rules : [
        	{
        		test : /\.js/,
        		use : [{
        			loader : "babel-loader",
        			options : {
        				presets : "es2015-loose"
        			}
        		}]
        	}
       	]
    },
    plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};

module.exports = [normal,es5];