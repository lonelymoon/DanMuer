const path = require("path");

const normal = {
	context : path.resolve(__dirname,'./src'),
	entry : './DanMuer.output.js',
	output : {
		filename : "DanMuer-webpack.js",
		path : path.resolve(__dirname,'./dist/webpackOutput')
	}
};

module.exports = [normal];