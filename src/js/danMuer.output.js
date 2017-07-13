(function(window){

const DMer = require("./DanMuer.main");

let DanMuer = function(wrapper,opts){
	let proxyDMer = new Proxy( new DMer(wrapper,opts), {
		get : function(target,key){
			if(typeof target[key] == "function")
			return target[key].bind(target);
			return target[key];
		}
	});

	let DM = proxyDMer;

	return {
		pause : DM.pause, //暂停
		run : DM.run, //继续
		start : DM.start, //运行
		stop : DM.stop,	//停止
		changeStyle : DM.changeStyle, //修改普通弹幕全局样式
		addGradient : DM.addGradient, //普通弹幕渐变
		setSize : DM.setSize, //修改宽高
		inputData : DM.inputData, //向普通弹幕插入数据
		inputEffect : DM.inputEffect, //向高级弹幕插入数据
		clear : DM.clear, //清除所有弹幕
		reset : DM.reset, //重新从某个弹幕开始
		addFilter : DM.addFilter, //添加过滤
		removeFilter : DM.removeFilter, //删除过滤
		disableEffect : DM.disableEffect, //不启用高级弹幕
		enableEffect : DM.enableEffect, //启用高级弹幕
		getSize : DM.getSize, //获取宽高,
		timing : DM.changeTiming, //修改timing
		direction : DM.changeDirection, //修改弹幕方向
		getFPS : DM.getFPS //获取fps
	};
};

window.DanMuer = DanMuer;

if( typeof module != 'undefined' && module.exports ){
	module.exports = DanMuer;
} else if( typeof define === "function" && define.amd ){
	define(function(){ return window.DanMuer;});
}

}(window));