(function(window){

const Tween = require("./DanMuer.tween");

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

		step.type = step.type || "quad";
		//scale
		step.scale = step.scale || {};
		let scale = step.scale;
		scale.startX = scale.startX || 1;
		scale.startY = scale.startY || 1;
		scale.endX = scale.endX || 1;
		scale.endY = scale.endY || 1;
		scale.distX = scale.endX - scale.startX;
		scale.distY = scale.endY - scale.startY;
		scale.timing = scale.timing || "linear";
		//rotate
		step.rotate = step.rotate || {};
		let rotate = step.rotate;
		rotate.start = rotate.start;
		rotate.end = rotate.end;
		rotate.dist = rotate.end - rotate.start;
		rotate.timing = rotate.timing || "linear";
		//translate
		step.translate = step.translate || {};
		let translate = step.translate;
		translate.endX = translate.endX || 0;
		translate.startX = translate.startX || 0;
		translate.endY = translate.endY || 0;
		translate.startY = translate.startY || 0;
		translate.distX = translate.endX - translate.startX;
		translate.distY = translate.endY - translate.startY;
		translate.timing = translate.timing || "linear";
		//skew
		step.skew = step.skew || {};
		let skew = step.skew;
		skew.startX = skew.startX || 0;
		skew.startY = skew.startY || 0;
		skew.endX = skew.endX || 0;
		skew.endY = skew.endY || 0;
		skew.distX = skew.endX - skew.startX;
		skew.distY = skew.endY - skew.startY;
		skew.timing = skew.timing || "linear";
		//opacity
		step.opacity = step.opacity || {};
		let opacity = step.opacity;
		opacity.start = opacity.start || 1;
		opacity.end = opacity.end || 1;
		opacity.dist = opacity.end - opacity.start;
		opacity.timing = opacity.timing || "linear";
		//time
		step.pastTime = step.pastTime || 0;
		step.duration = step.duration || 3000;
		//style
		step.fillStyle = step.fillStyle || "#ffffff";
		step.strokeStyle = step.strokeStyle || "#ffffff";
		//圆形
		step.radius = step.radius || 10;
		//判断多边形
		translate.distX = step.points ? ( step.distX || 0 ) : translate.distX;
		translate.distY = step.points ? ( step.distY || 0 ) : translate.distY;
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

		let [past,duration] = [stepItem.pastTime,stepItem.duration];
		let Tween = this.Tween[stepItem.type];

		let [translate,rotate,scale,skew,opacity] = [
			stepItem.translate,
			stepItem.rotate,
			stepItem.scale,
			stepItem.skew,
			stepItem.opacity
		];

		//多边形特殊处理
		if(item.type == "polygon" )
		this.stepCheckPolygon(stepItem,item);

		stepItem.x = Tween(translate.timing, past, translate.startX, translate.distX, duration);
		stepItem.y = Tween(translate.timing, past, translate.startY, translate.distY, duration);
		stepItem.scaleX = Tween(scale.timing, past, scale.startX, scale.distX, duration );
		stepItem.scaleY = Tween(scale.timing, past, scale.startY, scale.distY, duration );
		stepItem.rot = Tween(rotate.timing, past, rotate.start, rotate.dist, duration );
		stepItem.skewX = Tween(skew.timing, past, skew.startX, skew.distX, duration );
		stepItem.skewY = Tween(skew.timing, past, skew.startY, skew.distY, duration);
		stepItem.opa = Tween(opacity.timing, past, opacity.start, opacity.dist, duration);

	}
	//多边形特殊设置
	stepCheckPolygon(stepItem,item){
		let currentIndex = item.currentIndex;
		let translate = stepItem.translate;

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
			translate.startX = tempX / len; //计算中心点
			translate.startY = tempY / len;
			stepItem.firstPoint = stepItem.points.concat([]).shift(); //获取moveTo的第一个点
		} else if( !stepItem.points ) {
			//调用上一步的数据
			let prevStep = item.steps[currentIndex - 1];
			translate.startX = prevStep.x;
			translate.startY = prevStep.y;
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
		cxt.rotate( stepItem.rot * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opa;
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
			stepItem.fontFamily || "Microsoft JhengHei",
			stepItem.text || ""
		];
		cxt.font = fstyle+" "+fweight+" "+fsize+" "+ffamily;
		let [x,y,w,h] = [stepItem.x,stepItem.y,cxt.measureText(text).width,parseInt(fsize)];
		let [tx,ty] = [Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY,x + w/2,y + h/2 );
		cxt.rotate( stepItem.rot * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opa;
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;
		cxt.fillText(text,-w/2,-h/2);
		cxt.strokeText(text,-w/2,-h/2);
	}

	polygon( stepItem, cxt, Math , rotUnit ){
		let points = stepItem.points;
		let [ x, y, firstPoint ] = [ stepItem.x, stepItem.y, stepItem.firstPoint ];
		let [tx,ty] = [ Math.tan(stepItem.skewX * rotUnit),Math.tan(stepItem.skewY * rotUnit)];
		let [translate,cx = translate.startX, cy = translate.startY] = [stepItem.translate];
		cxt.beginPath();
		cxt.transform(stepItem.scaleX,tx,ty,stepItem.scaleY, x, y);
		cxt.rotate( stepItem.rot * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opa;
		cxt.fillStyle = stepItem.fillStyle;
		cxt.strokeStyle = stepItem.strokeStyle;

		cxt.moveTo( firstPoint.x - cx, firstPoint.y - cy );

		let [i,point] = [0];
		
		for( ; point = points[i++]; ){
			cxt.lineTo( point.x - cx, point.y - cy );
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
		cxt.rotate( stepItem.rot * Math.PI / 180 );
		cxt.globalAlpha = stepItem.opa;
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
} else if( typeof define == "function" && define.amd ){
	define(function(){ return effectDM;});
}

}(window));