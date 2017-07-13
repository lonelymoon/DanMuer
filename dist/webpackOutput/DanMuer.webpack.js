/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(window){

//Tween运动时间曲线
class Tween{
	constructor(){

	}

	linear(t, b, c, d){
		return c * t/d + b;
	}

	quad(type,...data){

		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn : ( t, b, c, d ) => c * ( t /= d ) * t + b,

			easeOut : ( t, b, c, d ) => -c *( t/=d )*( t - 2 ) + b,

			easeInOut : ( t, b, c, d ) => {
				if ( ( t/=d/2 ) < 1 ) return c/2 * t * t + b;
            	return -c/2 * ( (--t) * (t-2) - 1 ) + b;
			}

		}

		return !!trail[type] && trail[type](...data);
	}

	cubic(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t + b,

	        easeOut: ( t, b, c, d ) => c * ( ( t = t/d - 1 ) * t * t + 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t + b;
	            return c/2*((t-=2)*t*t + 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

	quart(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t * t + b,

	        easeOut: ( t, b, c, d ) => -c * ( ( t = t/d - 1 ) * t * t * t - 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	            return -c/2*((t-=2)*t*t*t - 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

	quint(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t * t * t + b,

	        easeOut: ( t, b, c, d ) => c * ( ( t = t/d - 1 ) * t * t * t * t + 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	            return c/2*((t-=2)*t*t*t*t + 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

}

if( typeof module != 'undefined' && module.exports ){
	module.exports = Tween;
} else if( true ){
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){ return Tween;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

}(window));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(window){

const DMer = __webpack_require__(2);

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
} else if( true ){
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){ return window.DanMuer;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

}(window));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(window){

const normalDM = __webpack_require__(3);
const effectDM = __webpack_require__(4);

const loop = Symbol("loop");
const init = Symbol("init"); 		//初始化
const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

//main
class DMer {
	//初始化
	constructor(wrap,opts = {}){

		if(!wrap){
			throw new Error("没有设置正确的wrapper");
		}

		//datas
		this.wrapper = wrap;
		this.width = wrap.clientWidth;
		this.height = wrap.clientHeight;
		this.canvas = document.createElement("canvas");
		this.canvas2 = document.createElement("canvas");

		this.normal = new normalDM(this.canvas,opts);
		this.effect = new effectDM(this.canvas2,opts);

		this.name = opts.name || "";
		this.fps = 0;

		//status
		this.drawing = opts.auto || false;

		//fn
		this[init]();
		this[loop]();
		if(opts.enableEvent)
		this.initEvent(opts);
	}

	[init](){
		this.canvas.style.cssText = "position:absolute;z-index:100;top:0px;left:0px;";
		this.canvas2.style.cssText = "position:absolute;z-index:101;top:0px;left:0px;";
		this.setSize();
		this.wrapper.appendChild(this.canvas);
		this.wrapper.appendChild(this.canvas2);
	}

	//loop
	[loop](normal = this.normal,effect = this.effect,prev = new Date().getTime()){
		
		let now = new Date().getTime();

		if(!this.drawing){
			normal.clearRect();
			effect.clearRect();
			return false;
		} else {
			let [w,h,time] = [this.width,this.height,now - prev];
			this.fps = 1000 / time >> 0;
			normal.update(w,h,time);
			effect.update(w,h,time);
		}

		requestAnimationFrame( () => { this[loop](normal,effect,now); } );
	}

	initEvent(opts){
		let [el,normal,searching] = [this.canvas2,this.normal,false];

		el.onmouseup = function(e){
			e = e || event;

			if( searching ) return false;
			searching = true;

			if( e.button == 2 ){
				let [pos,result] = [e.target.getBoundingClientRect(),""];
				let [x,y,i,items,item] = [ e.clientX - pos.left,
							  			   e.clientY - pos.top,
							  			   0, normal.save ];
				for( ; item = items[i++]; ){
					let [ix,iy,w,h] = [item.x, item.y, item.width + 10, item.height];

					if( x < ix  || x > ix + w || y < iy - h/2 || y > iy + h/2 || item.hide || item.recovery )
					continue;

					result = item;
					break;
				}
			
				let callback = opts.callback || function(){};

				callback(result);

				searching = false;
			}

		};

		el.oncontextmenu = function(e){
			e = e || event;
			e.preventDefault();
		};

	}

	// API 

	//添加数据
	inputData(obj = {}){
		if( typeof obj != "object" || !obj.type ){
			return false;
		}
		this.normal.add(obj);
	}

	//添加高级弹幕
	inputEffect(obj = {}){
		if( typeof obj != "object" || !obj.type || !obj.steps ){
			return false;
		}

		this.effect.add(obj);
	}

	//清除所有弹幕
	clear(){
		this.normal.clear();
		this.effect.clear();
	}

	//重置
	reset(i,j){
		this.normal.reset(i);
		this.effect.reset(j);
	}

	//暂停
	pause(){
		this.normal.pause();
		this.effect.pause();
	}

	//继续
	run(){
		this.normal.run();
		this.effect.run();
	}

	//添加过滤
	addFilter(key,val){
		this.normal.addFilter(key,val);
	}

	//移除过滤
	removeFilter(key,val){
		this.normal.removeFilter(key,val);
	}

	//禁用高级弹幕
	disableEffect(){
		this.effect.disableEffect();
	}

	//启用高级弹幕
	enableEffect(){
		this.effect.enableEffect();
	}

	//设置宽高
	setSize( w = this.width, h = this.height){

		if(!Number.isInteger(w) || w < 0 || !Number.isInteger(h) || h < 0) 
		return false;

		this.width = w;
		this.height = h;
		this.canvas.width = w;
		this.canvas.height = h;
		this.canvas2.width = w;
		this.canvas2.height = h;

		this.normal.getSize();
		this.effect.getSize();
	}
	
	//获取宽高
	getSize(){
		return {
			width : this.width,
			height : this.height
		};
	}

	//改变全局样式
	changeStyle(opts = {}){
		this.normal.changeStyle(opts);
	}

	//添加渐变
	addGradient(type, opts){
		this.normal.addGradient(type,opts);
	}

	//改变普通弹幕方向
	changeDirection(direction){
		this.normal.changeDirection(direction);
	}

	//改变动画时间曲线
	changeTiming(timing,type){
		this.normal.changeTiming(timing,type);
	}

	//启用
	start(){
		if(this.drawing)
		return false;

		this.drawing = true;
		this[loop]();
	}

	//停止
	stop(){
		this.drawing = false;
	}

	//fps
	getFPS(){
		return this.fps;
	}
}

if( typeof module != 'undefined' && module.exports ){
	module.exports = DMer;
} else if( true ){
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){ return DMer;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

}(window));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(window){

const Tween = __webpack_require__(0);

//普通弹幕
class normalDM{
	constructor(cv,opts = {}){

		this.save = [];
		this.canvas = cv;
		this.cxt = cv.getContext('2d');

		this.width = 0;
		this.height = 0;
		
		this.rows = {
			slide : [],
			top : [],
			bottom : []
		}; //存放不同类型弹幕的通道数
		this.filters = {}; //过滤

		this.Tween = new Proxy(new Tween(),{
			get : function(target,key){
				if( typeof target[key] == "function" )
				return target[key].bind(target);
				return target[key];
			}
		}); //Tween时间曲线

		this.leftTime = opts.leftTime || 2000;  //头部、底部静止型弹幕的显示时长
		this.space = opts.space || 10;  		//弹幕的行距
		this.unitHeight = 0; 					//弹幕的高度
		this.rowNum = 0;						//通道行数
		this.direction = opts.direction || "rtol"; //弹幕方向 ，默认从右往左
		this.duration = opts.duration || 9000; //弹幕运动时间
		this.type = opts.type || "quad"; 		//Tween算法种类，默认为quad（二次方）
		this.timing = opts.timing || "linear";	//Tween时间曲线

		this.startIndex = 0;		//循环时的初始下标
		this.looped = false;		//是否已经经历过一次循环

		this.changeStyle(opts);
	}

	//添加弹幕
	add(obj){
		if(!obj) return;

		//如果已经可以计算文本宽度，则直接进行计算
		if(this.looped)
		this.countWidth([obj]);

		this.filter(obj);

		this.save.push(obj);
	}

	//清除所有弹幕
	clear(){
		this.save = [];
		this.startIndex = 0;
	}

	//暂停
	pause(){
		this.paused = true;
	}

	//播放
	run(){
		this.paused = false;
	}

	//添加过滤
	addFilter(key,val){
		if(!key || !val) return false;
		
		let [filters] = [this.filters];

		if(!filters[key])
		filters[key] = [];
		
		if( !filters[key].find( v => val === v ) )
		filters[key].push(val);

		this.doFilter();
	}

	//过滤
	filter(obj){
		let filters = this.filters;
		//遍历属性
		for( let res of Object.keys(filters) ){
			let resArr = filters[res];
			let [i,len] = [0,resArr.length];
			//遍历属性对应的数组
			for( ; i < len; i++ ){
				//是否包含对应的值
				if( !obj[res].includes(resArr[i]) ){
					obj.hide = false;
					continue;
				}
				obj.hide = true;
				return false;
			}
		}

	}

	//进行过滤
	doFilter(){
		let [i,items,item] = [0,this.save];
		for( ; item = items[i++]; ){
			this.filter(item);
		}
	}

	//移除过滤
	removeFilter(key,val){
		if(!key) return false;

		let [filters,fltArr] = [this.filters];

		fltArr = filters[key];

		if(!fltArr) return false;

		if(!val){
			delete filters[key];
		} else {
			let [i,items,item] = [0,fltArr];
			for( ; item = items[i++]; ){
				if( item === val ){
					filters[key].splice(i-1,1);
					break;
				}
			}
		}

		this.doFilter();
	}

	//清屏
	clearRect(){
		this.cxt.clearRect(0,0,this.width,this.height);
	}

	//修改类型
	changeTiming(timing,type){
		this.type = type || "quad";
		this.timing = timing || "linear";
	}

	//修改方向
	changeDirection(direction){
		this.clear();
		this.direction = direction || "rtol";
	}

	//合并字体
	font(){
		this.globalFont = this.globalStyle + 
					" " + this.globalWeight + 
					" " + this.globalSize + 
					" " + this.globalFamily;
	}

	//添加渐变
	addGradient(type,opts = {}){

		if(!type || typeof type != "string" ) return false;

		let result = null;

		if( type == "radial" ){
			result = this.addRadialGradient(opts);
		} else if( type == "linear" ) {
			result = this.addLinearGradient(opts);
		} else {
			return false;
		}

		this.changeStyle({
			fontColor : result
		});

	}

	//线性渐变
	addLinearGradient(opts){
		let [sx,sy,ex,ey,stops] = [
			opts.startX || 0,
			opts.startY || 0,
			opts.endX || this.width,
			opts.endY || this.height,
			opts.colorStops || [{
				"point" : 0,
				"color" : this.globalColor
			},{
				"point" : 1,
				"color" : this.globalColor
			}] 
		];

		let linear = this.cxt.createLinearGradient(sx,sy,ex,ey);

		for( let stop of stops ){
			linear.addColorStop(stop.point,stop.color);
		}

		return linear;
	}

	//圆形渐变
	addRadialGradient(opts){
		let [sx,sy,sr,ex,ey,er,stops] = [
			opts.startX || this.width / 2,
			opts.startY || this.height / 2,
			opts.startR || 0,
			opts.endX || this.width / 2,
			opts.endY || this.height / 2,
			opts.endR || this.width,
			opts.colorStops || [{
				"point" : 0,
				"color" : this.globalColor
			},{
				"point" : 1,
				"color" : this.globalColor
			}] 
		];

		let radial = this.cxt.createRadialGradient(sx,sy,sr,ex,ey,er);

		for( let stop of stops ){
			radial.addColorStop(stop.point,stop.color);
		}

		return radial;
	}

	//改变全局样式
	changeStyle(opts = {}){
		
		//文本属性保存
		this.globalSize = opts.fontSize || this.globalSize || "24px";   //字体大小
		this.globalFamily = opts.fontFamily || this.globalFamily || "微软雅黑"; //字体
		this.globalStyle = opts.fontStyle || this.globalStyle || "normal"; //字体样式
		this.globalWeight = opts.fontWeight || this.globalWeight || "normal"; //字体粗细
		this.globalColor = opts.fontColor || this.globalColor || "#ffffff"; //字体颜色
		this.opacity = opts.opacity || this.opacity || 1; //透明程度

		//表示进行过一次全局样式变化
		this.globalChanged = true;
	}

	//启用全局样式
	initStyle(cxt){

		this.globalChanged = false;

		//合并font属性
		this.font();

		//更新全局样式
		cxt.font = this.globalFont;
		cxt.textBaseline = "middle";
		cxt.fillStyle = this.globalColor;
		cxt.strokeStyle = "rgba(0,0,0,0.3)";
		cxt.globalAlpha = this.opacity;
	}

	//重置弹幕
	reset(resetIndex = 0){

		//resetIndex表示想要开始重置的弹幕的下标，系统想重置该值以后的弹幕
		let [items, w, leftTime, i, item] = [this.save, this.width, this.leftTime, resetIndex];

		for( ; item = items[i++]; ){
			if(item.type == "slide"){
				item.x = w;
				item.rowRid = false;
			} else {
				item.leftTime = leftTime
			}
			item.pastTime = 0;
			item.recovery = false;
		}
		this.startIndex = resetIndex;
	}

	//更新canvas size
	getSize(){

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.deleteRow();
		this.countRows();

		this.globalChanged = true;
	}

	//消除item的row
	deleteRow(){
		let [items,i,item] = [this.save,0];
		for( ; item = items[i++]; ){
			item.row = null;
		}
	}

	//生成通道行
	countRows(){

		//保存临时变量
		let unitHeight = parseInt(this.globalSize) + this.space;
		let [rowNum , rows] = [
			( ( this.height - 20 ) / unitHeight ) >> 0,
			this.rows
		];

		//重置通道
		for( let key of Object.keys(rows) ){
			rows[key] = [];
		}

		//重新生成通道
		for( let i = 0 ; i < rowNum; i++ ){
			let obj = {
				idx : i,
				y : unitHeight * i + 20
			};
			rows.slide.push(obj);

			i >= rowNum / 2 ? rows.bottom.push(obj) : rows.top.push(obj);
		}

		//更新实例属性
		this.unitHeight = unitHeight;
		this.rowNum = rowNum;
	}

	//获取通道
	getRow(item){
		
		//如果该弹幕正在显示中，则返回其现有通道
		if( item.row ) 
		return item.row;

		//获取新通道
		const [rows,type] = [this.rows,item.type];
		const row = ( type != "bottom" ? rows[type].shift() : rows[type].pop() );
		//生成临时通道
		const tempRow = this["getRow_"+type]();

		if( row && item.type == "slide" ){
			item.duration -= ( row.idx * 150 ); //调整速度
		}

		//返回分配的通道
		return row || tempRow;

	}

	getRow_bottom(){
		return {
			y : 20 + this.unitHeight * ( ( Math.random() * this.rowNum / 2 + this.rowNum / 2 ) << 0 ),
			speedChange : false,
			tempItem : true
		};
	}

	getRow_slide(){
		return {
			y : 20 + this.unitHeight * ( ( Math.random() * this.rowNum ) << 0 ),
			speedChange : true,
			tempItem : true
		};
	}

	getRow_top(){
		return {
			y : 20 + this.unitHeight * ( ( Math.random() * this.rowNum / 2 ) << 0 ),
			speedChange : false,
			tempItem : true
		};
	}

	//计算宽度
	countWidth(items,cxt = this.cxt){

		this.looped = true;

		let [ cw , i , item ] = [this.width, 0];

		for( ; item = items[i++]; ){
			let w = cxt.measureText(item.text).width >> 0;
			item.width = w;
			item.height = parseInt(this.globalSize);
			//更新初始 x
			item.x = cw;
			item.duration = this.duration; //赋值持续时间
			item.pastTime = 0;
			if(item.type != "slide"){
				item.x = ( cw - w ) / 2;
				item.leftTime = this.leftTime;
			}
			
		}

	}

	//更新每个弹幕的单独样式
	updateStyle(item,cxt){
		cxt.font = this.globalStyle + 
					" " + this.globalWeight + 
					" " + item.fontSize + 
					" " + this.globalFamily;
		cxt.fillStyle = item.color || this.globalColor;
	}

	//循环
	update(w,h,time){

		let [items,cxt,Tween] = [this.save,this.cxt,this.Tween[this.type]];

		this.globalChanged && this.initStyle(cxt); //初始化全局样式

		!this.looped && this.countWidth(items); //计算文本宽度以及初始化位置（只执行一次）

		if( this.paused ) return false; //暂停

		this.refresh(items); //更新初始下标startIndex

		let [i,item] = [this.startIndex];

		cxt.clearRect(0,0,w,h);

		for(  ; item = items[i++]; ){
			let iw = item.width;
			let ds = this.getDiretionSettings(iw,w); //获取不同方向时的设置
			this.step(item,time,ds,Tween,this.timing);
			this.draw(item,cxt);
			this.recovery(item,ds);
		}

	}

	//计算
	step(item,time,ds,Tween,timing){

		let [row,iw] = [this.getRow(item), item.width]; //取得通道

		//如果通道已满，则新弹幕变更速度防止弹幕重叠
		if(row.speedChange){
			row.speedChange = false;
			item.duration -= ( ( Math.random() * 5000 ) >> 0 );
		}

		item.pastTime += time;
		
		//更新参数
		item.leftTime ? item.leftTime -= time : "";
		item.x = ( item.type == "slide" && Tween(timing,item.pastTime,ds.start,ds.dist,item.duration) ) || item.x;
		item.y = item.y || row.y;
		item.row = row;
	}

	//绘制
	draw(item,cxt){
		//如果已经显示完成，则不显示
		if(item.recovery || item.hide) 
		return false;

		cxt.save();
		if( item.change ) {
			this.updateStyle(item,cxt);
		}
		let [text,x,y] = [item.text,item.x,item.y];

		cxt.fillText(text,x,y);
		cxt.strokeText(text,x,y);
		cxt.restore();

	}

	//回收弹幕和通道
	recovery(item,ds){
		
		if( item.type == "slide" ){
			item.recovery = this.recoverySlide(item,ds);
			return false;
		}
		
		item.recovery = this.recoveryStatic(item);
	}

	recoverySlide(item,ds){

		//回收slide类型
		let x = item.x;

		if( !item.rowRid && ds.flag(x) && !item.row.tempItem){
			this.rows[item.type].unshift(item.row);
			item.rowRid = true; //表明该行已被释放
		}

		if( item.pastTime <= item.duration )
		return false;

		return true;
	}

	recoveryStatic(item){
		if(item.leftTime > 0 )
		return false;

		let type = item.type;

		if(!item.row.tempItem){
			this.rows[type].unshift(item.row);
			item.row = null;
		}

		return true;
	}

	//更新下标
	refresh(items){
		let [i,item,rows] = [this.startIndex,,this.rows];
		//通道排序
		for( let key of Object.keys(rows) ){
			rows[key].sort(function(a,b){
				return a.y - b.y;
			});
		}

		for( ; item = items[i++]; ){
			if(!item.recovery) return false;
			//更新下标并清除row
			this.startIndex = i;
			item.row = null;   
		}
	}

	//direction,不同方向的设定
	getDiretionSettings(iw,w){
		if( this.direction == "ltor" )
		return {
			start : -iw, //起点
			dist : iw + w, //位移
			flag : (x) => x >= iw //判断该弹幕是否显示完全
		};
		return {
			start : w,
			dist : -iw - w,
			flag : (x) => x < w - iw
		};
	}
}
if( typeof module != 'undefined' && module.exports ){
	module.exports = normalDM;
} else if( true ){
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){ return normalDM;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

}(window));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(window){

const Tween = __webpack_require__(0);

//特效弹幕
class effectDM{

	constructor( cv, opts = {}){

		this.canvas = cv;
		this.cxt = cv.getContext("2d");
		this.enable = opts.enable === false ? false : true;

		this.startIndex = 0;

		this.Tween = new Proxy(new Tween(),{
			get : function(target,key){
				if( typeof target[key] == "function" )
				return target[key].bind(target);
				return target[key];
			}
		}); //实例化Tween类

		this.save = [];
	}

	//添加数据
	add(data){
		if(!data || typeof data != "object" )
		return false;

		let [steps,i,step] = [data.steps,0]

		for( ; step = steps[i++]; ){
			this.initStep(step); //初始化参数
		}

		this.save.push(data);
	}

	//清除数据
	clear(){
		this.save = [];
		this.startIndex = 0;
	}

	//重置弹幕
	reset(i){
		let [items,item] = [this.save];
		for( ; item = items[i++]; ){
			item.hide = false;
		}
	}

	//暂停
	pause(){
		this.paused = true;
	}

	//继续
	run(){
		this.paused = false;
	}

	//启用
	enableEffect(){
		this.enable = true;
	}

	//停用
	disableEffect(){
		this.enable = false;
	}

	//初始化参数
	initStep(step){

		step.timing = step.timing || "linear";
		step.type = step.type || "quad";
		//scale
		step.scaleStartX = step.scaleStartX || 1;
		step.scaleStartY = step.scaleStartY || 1;
		step.scaleEndX = step.scaleEndX  || 1;
		step.scaleEndY = step.scaleEndY  || 1;
		//rotate
		step.rotateEnd = step.rotateEnd || 0;
		step.rotateStart = step.rotateStart || 0;
		//translate
		step.endX = step.endX || 0;
		step.startX = step.startX || 0;
		step.endY = step.endY || 0;
		step.startY = step.startY || 0;
		//skew
		step.skewStartX = step.skewStartX || 0;
		step.skewStartY = step.skewStartY || 0;
		step.skewEndX = step.skewEndX || 0;
		step.skewEndY = step.skewEndY || 0;
		//opacity
		step.opacityStart = step.opacityStart || 1;
		step.opacityEnd = step.opacityEnd || 1;
		//time
		step.pastTime = step.pastTime || 0;
		step.duration = step.duration || 3000;
		//style
		step.fillStyle = step.fillStyle || "#ffffff";
		step.strokeStyle = step.strokeStyle || "#ffffff";
		//圆形
		step.radius = step.radius || 10;
		//dist
		step.scaleDistX = step.scaleEndX - step.scaleStartX;
		step.scaleDistY = step.scaleEndY - step.scaleStartY;
		step.rotateDist = step.rotateEnd - step.rotateStart;
		step.opacityDist = step.opacityEnd - step.opacityStart;
		//判断多边形
		step.distX = step.points ? ( step.distX || 0 ) : step.endX - step.startX;
		step.distY = step.points ? ( step.distY || 0 ) : step.endY - step.startY;
		step.skewDistX = step.skewEndX - step.skewStartX;
		step.skewDistY = step.skewEndY - step.skewStartY;
	}

	//更新canvas尺寸
	getSize(){

		this.width = this.canvas.width;
		this.height = this.canvas.height;

	}

	//清除画布
	clearRect(){
		this.cxt.clearRect(0,0,this.width,this.height);
	}

	//动画循环
	update(w,h,time){

		if(this.paused) //如果暂停，return
		return false;
		
		let [canvas,cxt] = [this.canvas,this.cxt];
		cxt.clearRect(0,0,w,h);

		if(!this.enable) //如果不启用, return
		return false;

		let [i,items,item] = [this.startIndex,this.save];

		for( ; item = items[i++]; ){
			if( item.hide )
			continue;

			let steps = item.steps;
			let stepItem = steps[item.currentIndex];
			this.step(item,stepItem,time);
			this.draw(item,stepItem,cxt);
			this.recovery(item,stepItem);
		}

	}

	step(item,stepItem,time){

		stepItem.pastTime += time;

		let [timing,past,duration] = [stepItem.timing,stepItem.pastTime,stepItem.duration];
		let Tween = this.Tween[stepItem.type];
		//多边形特殊处理
		if(item.type == "polygon" )
		this.stepCheckPolygon(stepItem,item);

		stepItem.x = Tween(timing, past, stepItem.startX, stepItem.distX, duration);
		stepItem.y = Tween(timing, past, stepItem.startY, stepItem.distY, duration);
		stepItem.scaleX = Tween(timing, past, stepItem.scaleStartX, stepItem.scaleDistX, duration );
		stepItem.scaleY = Tween(timing, past, stepItem.scaleStartY, stepItem.scaleDistY, duration );
		stepItem.rotate = Tween(timing, past, stepItem.rotateStart, stepItem.rotateDist, duration );
		stepItem.skewX = Tween(timing, past, stepItem.skewStartX, stepItem.skewDistX, duration );
		stepItem.skewY = Tween(timing, past, stepItem.skewStartY, stepItem.skewDistY, duration);
		stepItem.opacity = Tween(timing, past, stepItem.opacityStart, stepItem.opacityDist, duration);
	}
	//多边形特殊设置
	stepCheckPolygon(stepItem,item){
		let currentIndex = item.currentIndex;

		//初始化进行计算
		if( currentIndex == 0){
			let [tempX,tempY,points,len] = [0, 0, stepItem.points.concat([]) || [],0];
			let [i,point] = [0];
			for( ; point = points[i++]; ){
				tempX += point.x;
				tempY += point.y;
				len++;
			}
			if(len <= 0) return false;
			stepItem.startX = tempX / len; //计算中心点
			stepItem.startY = tempY / len;
			stepItem.firstPoint = stepItem.points.concat([]).shift(); //获取moveTo的第一个点
		} else if( !stepItem.points ) {
			//调用上一步的数据
			let prevStep = item.steps[currentIndex - 1];
			stepItem.startX = prevStep.x;
			stepItem.startY = prevStep.y;
			stepItem.points = prevStep.points;
			stepItem.firstPoint = prevStep.firstPoint;
		}

	}

	draw(item,stepItem,cxt){
		cxt.save();
		//根据type调用
		!!this[item.type] && this[item.type](stepItem,cxt,Math, Math.PI / 180);
		cxt.restore();
	}

	rect( stepItem, cxt, Math , rotUnit ){
		let [x,y,w,h] = [stepItem.x,stepItem.y,stepItem.width,stepItem.height];
		let [tx,ty] = [Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];
		cxt.beginPath();
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY,x + w/2,y + h/2 );
		cxt.rotate( stepItem.rotate * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opacity;
		cxt.rect( - w / 2 , - h / 2 , w , h);
		cxt.closePath();
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;
		cxt.fill();
		cxt.stroke();
	}

	text( stepItem, cxt, Math , rotUnit ){
		let [fstyle,fweight,fsize,ffamily,text] = [
			stepItem.fontStyle || "normal",
			stepItem.fontWeight || "normal",
			stepItem.fontSize || "24px",
			stepItem.fontFamily || "微软雅黑",
			stepItem.text || ""
		];
		cxt.font = fstyle+" "+fweight+" "+fsize+" "+ffamily;
		let [x,y,w,h] = [stepItem.x,stepItem.y,cxt.measureText(text).width,parseInt(fsize)];
		let [tx,ty] = [Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY,x + w/2,y + h/2 );
		cxt.rotate( stepItem.rotate * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opacity;
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;
		cxt.fillText(text,-w/2,-h/2);
		cxt.strokeText(text,-w/2,-h/2);
	}

	polygon( stepItem, cxt, Math , rotUnit ){
		let points = stepItem.points;
		let [ x, y, firstPoint ] = [ stepItem.x, stepItem.y, stepItem.firstPoint ];
		let [tx,ty] = [ Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];

		cxt.beginPath();
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY, x, y);
		cxt.rotate( stepItem.rotate * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opacity;
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;

		cxt.moveTo( firstPoint.x - x, firstPoint.y - y );

		let [i,point] = [0];
		
		for( ; point = points[i++]; ){
			cxt.lineTo( point.x - x, point.y - y );
		}
		cxt.closePath();
		cxt.fill();
		cxt.stroke();
	}

	circle( stepItem, cxt, Math, rotUnit ){
		let [x,y,r] = [stepItem.x,stepItem.y,stepItem.radius];
		let [tx,ty] = [Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];
		cxt.beginPath();
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY,x + r,y + r );
		cxt.rotate( stepItem.rotate * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opacity;
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;
		cxt.arc( 0, 0, r, 0, Math.PI * 2, false );
		cxt.closePath();
		cxt.fill();
		cxt.stroke();
	}

	//回收已经完成的弹幕
	recovery( item, stepItem ){
		if( stepItem.pastTime >= stepItem.duration ){
			item.currentIndex++;
			stepItem.pastTime = 0;
		}

		if( !item.steps[item.currentIndex] ){
			item.hide = true;
			item.currentIndex = 0;
		}
	}

}
if( typeof module != 'undefined' && module.exports ){
	module.exports = effectDM;
} else if( true ){
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){ return effectDM;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

}(window));

/***/ })
/******/ ]);