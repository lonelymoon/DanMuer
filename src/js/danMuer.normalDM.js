(function(window){

const Tween = require("./DanMuer.tween");

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
		this.globalFamily = opts.fontFamily || this.globalFamily || "Microsoft JhengHei"; //字体
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

		let [text,x,y] = [item.text,item.x,item.y];
		cxt.save();
		if( item.change ) {
			this.updateStyle(item,cxt);
		}

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
} else if( typeof define == "function" && define.amd ){
	define(function(){ return normalDM;});
}

}(window));