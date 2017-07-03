//main
const loop = Symbol("loop");
const init = Symbol("init"); 		//初始化
const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

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

		//status
		this.drawing = opts.auto || false;
		this.startTime = new Date().getTime();

		//fn
		this[init]();
		this[loop]();
	}

	[init](){
		this.canvas.style.cssText = "position:absolute;z-index:100;top:0px;left:0px;";
		this.canvas2.style.cssText = "position:absolute;z-index:101;top:0px;left:0px;";
		this.setSize();
		this.wrapper.appendChild(this.canvas);
		this.wrapper.appendChild(this.canvas2);
	}

	//loop
	[loop](normal = this.normal,effect = this.effect,prev = this.startTime){
		
		let now = new Date().getTime();

		if(!this.drawing){
			normal.clearRect();
			effect.clearRect();
			return false;
		} else {
			let [w,h,time] = [this.width,this.height,now - prev];
			normal.update(w,h,time);
			effect.update(w,h,time);
		}

		requestAnimationFrame( () => { this[loop](normal,effect,now); } );
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
	reset(i){
		this.normal.reset(i);
		this.effect.reset(i);
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

}