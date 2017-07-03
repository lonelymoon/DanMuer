//选择对外暴露的接口
let DMOutput = function(wrapper,opts){
	let DM = new DMer(wrapper,opts);

	return {
		start : DM.start.bind(DM),
		stop : DM.stop.bind(DM),
		changeStyle : DM.changeStyle.bind(DM),
		setSize : DM.setSize.bind(DM),
		inputData : DM.inputData.bind(DM),
		inputEffect : DM.inputEffect.bind(DM),
		clear : DM.clear.bind(DM),
		reset : DM.reset.bind(DM),
		pause : DM.pause.bind(DM),
		run : DM.run.bind(DM),
		addFilter : DM.addFilter.bind(DM),
		disableEffect : DM.disableEffect.bind(DM),
		enableEffect : DM.enableEffect.bind(DM),
		getSize : DM.getSize.bind(DM)
	};
};

if( typeof module != 'undefined' && module.exports ){
	module.exports = DMOutput;
} else if( typeof define == "function" && define.amd ){
	define(function(){ return DMOutput;});
} else {
	window.DanMuer = DMOutput;
}