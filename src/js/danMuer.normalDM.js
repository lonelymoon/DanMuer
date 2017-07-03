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
		this.filters = [];

		this.leftTime = opts.leftTime || 2000;  //头部、底部静止型弹幕的是显示时长
		this.space = opts.space || 10;  		//弹幕的行距
		this.unitHeight = 0; 					//弹幕的高度
		this.rowNum = 0;						//通道行数


		this.startIndex = 0;		//循环时的初始下标
		this.looped = false;		//是否已经经历过一次循环

		this.fps = document.querySelector(".fps");

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
		
		this.filters.push({
			"key" : key,
			"value" : val
		});
	}

	//过滤
	filter(obj){
		let filters = this.filters;
		for( let res of filters ){
			if( obj[res.key].includes(res.value) ){
				obj.hide = true;
				return false;
			}
		}

	}

	//清屏
	clearRect(){
		this.cxt.clearRect(0,0,this.width,this.height);
	}

	//合并字体
	font(){
		this.globalFont = this.globalStyle + 
					" " + this.globalWeight + 
					" " + this.globalSize + 
					" " + this.globalFamily;
	}

	//改变全局样式
	changeStyle(opts = {}){
		
		//文本属性保存
		this.globalSize = opts.fontSize || this.globalSize || "24px";   //字体大小
		this.globalFamily = opts.fontFamily || this.globalFamily || "微软雅黑"; //字体
		this.globalStyle = opts.fontStyle || this.globalStyle || "normal"; //字体样式
		this.globalWeight = opts.fontWeight || this.globalWeight || "normal"; //字体粗细
		this.globalColor = opts.fontColor || this.globalColor || "#66ccff"; //字体颜色

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

	}

	//循环
	update(w,h,time){
		this.fps.innerHTML = 1000 / time >> 0;

		let [items,cxt] = [this.save,this.cxt];

		this.globalChanged && this.initStyle(cxt); //初始化全局样式

		!this.looped && this.countWidth(items); //计算文本宽度以及初始化位置（只执行一次）

		if( this.paused ) return false; //暂停

		this.refresh(items); //更新初始下标startIndex

		let [i,item] = [this.startIndex];

		cxt.clearRect(0,0,w,h);

		for(  ; item = items[i++]; ){
			this.step(item,time);
			this.draw(item,cxt);
			this.recovery(item,w);
		}

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
			item.recovery = false;
		}
		this.startIndex = resetIndex;
	}

	//更新canvas size
	getSize(){

		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.speedScale = this.width / 600;

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
			//更新初始 x
			item.x = cw + (Math.random() * 30 >> 0);
			item.speed = 2;
			if(item.type != "slide"){
				item.x = (cw - w ) / 2;
				item.leftTime = this.leftTime;
				item.speed = 0;
			}
			
		}

	}

	//更新每个弹幕的单独样式
	updateStyle(item,cxt){
		cxt.font = this.globalStyle + 
					" " + this.globalWeight + 
					" " + item.globalSize + 
					" " + this.globalFamily;
		cxt.fillStyle = item.color || this.globalColor;
	}

	//计算
	step(item,time){

		let row = this.getRow(item); //取得通道

		//如果通道已满，则新弹幕变更速度防止弹幕重叠
		if(row.speedChange){
			row.speedChange = false;
			item.speed += ( ( Math.random() * 2 + 1 ) >> 0 );
		}

		let speed = (( item.speed * this.speedScale * time / 16 ) >> 0);

		//更新参数
		item.leftTime ? item.leftTime -= time : "";
		item.x -= speed;
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
		cxt.fillText(item.text,item.x,item.y);
		cxt.restore();

	}

	//回收弹幕和通道
	recovery(item,w){
		
		if( item.type == "slide" ){
			item.recovery = this.recoverySlide(item,w);
			return false;
		}
		
		item.recovery = this.recoveryStatic(item);
	}

	recoverySlide(item,w){

		//回收slide类型
		let [x,iw] = [item.x, item.width];

		if( !item.rowRid && x + iw < w && !item.row.tempItem){
			this.rows[item.type].unshift(item.row);
			item.rowRid = true; //表明该行已被释放
		}

		if( x > - iw)
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
			this.startIndex = i;
			item.row = null;
		}
	}

}