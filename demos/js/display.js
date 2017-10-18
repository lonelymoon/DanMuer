jQuery(function($){

	var video = $("#video")[0],
		types = ["slide","top","bottom"],
		wrapper = $(".wrapper")[0],
		DMer;

	video.onloadedmetadata = function(e){
		DMer = DanMuer(wrapper,{});
	};

	$(".start").on("click",function(e){
		$(this).hide();

		if(!DMer) DMer = DanMuer(wrapper,{});

		DMer.start();

		video.play();

		init();

	});

	function init(){

		video.ontimeupdate = function(e){

			var r = Math.random() * 20 >> 0;

			initNormal(r);
			initEffect(r, video.currentTime >> 0);
			initStyle(r);
		};

	};

	function initNormal(r){

		for( var key in normal ){
			normal[key](r);
		}

	};

	function addDM(text,nr,type){
		for( var i = 0; i < nr; i++ ){
			DMer.inputData({
				"text" : text,
				"type" : type,
				"change" : false,
				"fontSize" : "24px",
				"color" : "#fff"
			});
		}
	}

	var normal = {

		sentense_1 : function(r){
			var nr = Math.random() * r >> 0,
				ty = types[nr % 3];
			addDM("66666",nr,ty);
		},

		sentense_2 : function(r){
			var nr = Math.random() * r >> 0,
				ty = types[nr % 3];
			addDM("苟富贵，还有诗和远方",nr,ty);
		},

		sentense_3 : function(r){
			var nr = Math.random() * r >> 0,
				ty = types[nr % 3];
			addDM("瞧瞧我发现了什么？",nr,ty);
		}

	};

	//////////////////////////////////
	var familyArr = ["Microsoft Yahei","SimHei","Microsoft JhengHei","SimSun"];
	function initStyle(r){

		if( r % 10 != 0 ) return false;

		var color = getRandomColor();

		DMer.changeStyle({
			fontWeight : "bolder",
			opacity : 1
		});

		DMer.addGradient("linear",{
			startY : DMer.getSize().height / 2,
			endY : DMer.getSize().height / 2,
			colorStops : [{
				"point" : 0,
				"color" : getRandomColor()
			},{
				"point" : 1,
				"color" : color
			}]
		});

	}


	//////////////////////////////////
	var textCountLength = 0,
		rectCountLength = 0,
		imageCountLength = 0;

	function initEffect(r, curtime){
		
		initText(r, curtime);

		initRect(r, curtime);

		initImage(r, curtime);

	}

	function initText( r, curtime ){
		if( curtime < 1 || curtime % 20 != 0 || textCountLength >= 15 ) return false;

		createText();

		textCountLength++;
	}

	function initRect( r, curtime ){
		if( curtime < 1 || curtime % 14 != 0 || rectCountLength >= 18 ) return false;

		createRect();

		rectCountLength++;
	}

	var imgUpload = false;

	function initImage( r, curtime ){
		if( curtime < 1 || curtime % 18 != 0 || imageCountLength >= 10 || imgUpload ) return false;

		imgUpload = true;

		createImage(r);

		imageCountLength++;
	}

	var createText = function(){

		var sx = Math.random() * 100 >> 0,
			sy = Math.random() * 100 >> 0,
			ex = Math.random() * 600 >> 0,
			ey = Math.random() * 400 >> 0;

		var data = {
			dur : [3000,5000],
			rot : [{ start : 0, end : 120 }, { start : 120, end : Math.random() * 180 >> 0 }],
			scale : [{ start : 1, end : 2 }, { start : 2, end : 1.5 }],
			skew : [{ start : 0, end : 15 }, { start : 15, end : 30 }],
			trans : [
				{ 
					x : sx, 
					y : sy 
				},
				{ 
					x : ex, 
					y : ey 
				},
				{ 
					x : ex, 
					y : ey 
				},
				{ 
					x : ex, 
					y : ey 
				},
			]
		};

		var obj = {
			"type" : "text",
			"currentIndex" : 0,
			"hide" : false,
			"steps" : []
		};

		var dur = data.dur,
			rot = data.rot,
			scale = data.scale,
			trans = data.trans,
			skew = data.skew;

		for( var i = 0, l = dur.length; i < l; i++ ){
			obj.steps.push({
				fontStyle:"normal",
			    fontWeight:"bolder",
			    fontSize:"40px",
			    fontFamily:"Microsoft Yahei",
			    text:"我是一条高级弹幕",
				duration : dur[i],
				fillStyle : getRandomColor(),
				strokeStyle : "#231232",
				pastTime : 0,
				type : "quad",
				translate : {
					startX : trans[2 * i].x,
					startY : trans[2 * i].y,
					endX : trans[2 * i + 1].x,
					endY : trans[2 * i + 1].y,
					timing : "easeOut"
				},
				scale : {
					startX : scale[i].start,
					startY : scale[i].start,
					endX : scale[i].end,
					endY : scale[i].end,
					timing : "linear"
				},
				rotate : {
					start : rot[i].start,
					end : rot[i].end,
					timing : "easeInOut"
				},
				skew : {
					startX : skew[i].start,
					startY : skew[i].start,
					endX : skew[i].end,
					endY : skew[i].end,
					timing : "easeIn"
				},
				opacity : {
					start : 1,
					end : 1,
					timing : "linear"
				}
			});
		}

		DMer.inputEffect(obj);

	};

	var createRect = function(){
		var sx = Math.random() * 100 >> 0,
			sy = Math.random() * 100 >> 0,
			ex = Math.random() * 600 >> 0,
			ey = Math.random() * 400 >> 0;

		var data = {
			dur : [6000,5000],
			rot : [{ start : 0, end : sx }, { start : sx, end : sy }],
			scale : [{ start : 1, end : 1.5 }, { start : 1.5, end : 1.5 + Math.random() }],
			skew : [{ start : 0, end : 10 }, { start : 10, end : 20 + Math.random() * 30 >> 0 }],
			trans : [
				{ 
					x : sx, 
					y : sy
				},
				{ 
					x : ex, 
					y : ey
				},
				{ 
					x : ex, 
					y : ey 
				},
				{ 
					x : ex, 
					y : ey 
				},
			]
		};

		var obj = {
			"type" : "rect",
			"currentIndex" : 0,
			"hide" : false,
			"steps" : []
		};

		var dur = data.dur,
			rot = data.rot,
			scale = data.scale,
			trans = data.trans,
			skew = data.skew;

		for( var i = 0, l = dur.length; i < l; i++ ){
			obj.steps.push({
				width : 100,
				height : 60,
				duration : dur[i],
				fillStyle : getRandomColor(),
				strokeStyle : "#231232",
				pastTime : 0,
				type : "quad",
				translate : {
					startX : trans[2 * i].x,
					startY : trans[2 * i].y,
					endX : trans[2 * i + 1].x,
					endY : trans[2 * i + 1].y,
					timing : "easeOut"
				},
				scale : {
					startX : scale[i].start,
					startY : scale[i].start,
					endX : scale[i].end,
					endY : scale[i].end,
					timing : "linear"
				},
				rotate : {
					start : rot[i].start,
					end : rot[i].end,
					timing : "easeInOut"
				},
				skew : {
					startX : skew[i].start,
					startY : skew[i].start,
					endX : skew[i].end,
					endY : skew[i].end,
					timing : "easeIn"
				},
				opacity : {
					start : 1,
					end : 1,
					timing : "linear"
				}
			});
		}

		DMer.inputEffect(obj);
	};

	var createImage = function(r){
		var sx = Math.random() * 100 >> 0,
			sy = Math.random() * 100 >> 0,
			ex = Math.random() * 600 >> 0,
			ey = Math.random() * 400 >> 0,
			images = ["images/16.png","images/25.png","images/30.png","images/33.png"],
			img = document.createElement("img");

		var data = {
			dur : [5000,5000],
			rot : [{ start : 0, end : 720 }, { start : 720, end : 720 }],
			scale : [{ start : 1, end : 1 }, { start : 1, end : 1 }],
			skew : [{ start : 0, end : 10 }, { start : 10, end : 30 }],
			trans : [
				{ 
					x : sx, 
					y : sy
				},
				{ 
					x : ex, 
					y : ey
				},
				{ 
					x : ex, 
					y : ey 
				},
				{ 
					x : ex, 
					y : ey 
				},
			]
		};

		var obj = {
			"type" : "image",
			"currentIndex" : 0,
			"hide" : false,
			"steps" : []
		};

		var dur = data.dur,
			rot = data.rot,
			scale = data.scale,
			trans = data.trans,
			skew = data.skew;

		img.onload = function(e){

			for( var i = 0, l = dur.length; i < l; i++ ){
				obj.steps.push({
					width : 44,
					height : 44,
					img : img,
					duration : dur[i],
					fillStyle : "#6622ff",
					strokeStyle : "#231232",
					pastTime : 0,
					type : "quad",
					translate : {
						startX : trans[2 * i].x,
						startY : trans[2 * i].y,
						endX : trans[2 * i + 1].x,
						endY : trans[2 * i + 1].y,
						timing : "easeOut"
					},
					scale : {
						startX : scale[i].start,
						startY : scale[i].start,
						endX : scale[i].end,
						endY : scale[i].end,
						timing : "linear"
					},
					rotate : {
						start : rot[i].start,
						end : rot[i].end,
						timing : "easeInOut"
					},
					skew : {
						startX : skew[i].start,
						startY : skew[i].start,
						endX : skew[i].end,
						endY : skew[i].end,
						timing : "easeIn"
					},
					opacity : {
						start : 1,
						end : 1,
						timing : "linear"
					}
				});
			}

			DMer.inputEffect(obj);

			imgUpload = false;
		};

		img.src = images[r % 4];
	};

	////////////////////////////////////
	function getRandomColor(){  
	　　var colorStr=Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase();  
	　　return"#"+("000000".substring(0,6-colorStr.length))+colorStr;  
	} 

});