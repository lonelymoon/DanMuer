(function(window){

let DanMuer = require("./dist/DanMuer-es5.min.js");

window.DanMuer = DanMuer;

if( typeof module != 'undefined' && module.exports ){
	module.exports = DanMuer;
} else if( typeof define === "function" && define.amd ){
	define(function(){ return DanMuer;});
}

}(window));