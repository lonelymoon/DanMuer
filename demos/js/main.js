(function(window,Math,undefined){

var sel = document.querySelector("#setting"),
	esel = document.querySelector("#effect-sel"),
	content = document.querySelector('.setting-content'),
	status = document.querySelector(".status"),
	video = document.getElementById("video"),
	saveBtn = document.getElementById("save-btn"),
	DMer = DanMuer(document.querySelector(".wrapper"),{
		enableEvent : true
	});

sel.onchange = function(e){
	e = e || event;
	var val = e.target.value;
	hideList(".setting-list");
	!!show[val] && show[val]();
};

var nowEfc = {
	"type" : "text",
	"currentIndex" : 0,
	"hide" : false,
	"steps" : []
};

esel.onchange = function(e){
	e = e || event;
	var  val = e.target.value;
	hideList(".effect-list");

	resetEfc(val);

	!!showEffect[val] && showEffect[val]();
};

saveBtn.onclick = function(e){
	var val = saveBtn.querySelector("em").innerHTML;
	val = val * 1 + 1;
	saveBtn.querySelector("em").innerHTML = val;

	status.innerHTML = "高级弹幕添加了一个动作";

	var obj = getStep();
	nowEfc.steps.push(obj);
};

getEle("#effect-btn").onclick = function(e){
	var obj = deepClone(nowEfc);

	if(nowEfc.steps.length > 0)
	DMer.inputEffect(obj);

	resetEfc();
};

var save = [],
	types = ["slide","top","bottom"];

getEle("#normal-btn").onclick = function(e){
	var text = getEle("#normal-text").value,
		num = getEle("#normal-num").value * 1,
		direc = getEle("#direc").value,
		timing = getEle("#timing").value;

	for( var i = 0; i < num; i++ ){
		var idx = (Math.random() * 2.9) >> 0;
		save.push({
			"text" : text,
			"idx" : i,
			"time" : (Math.random() * 228 + 2 ) >> 0,
			"type" : types[idx]
		});
	}

	save.sort(function(a,b){
		return a.time - b.time;
	});
	
	DMer.timing(timing);
	DMer.direction(direc);

	getEle("#normal-num").value = 0;
	status.innerHTML = "添加"+num+"条弹幕";
};

getEle("#changeStyle-btn").onclick = function(e){
	var fsize = getEle("#gfsize").value,
		fweight = getEle("#gfweight").value,
		fcolor = getEle("#gfcolor").value,
		fopa = getEle("#gfopa").value,
		checked = getEle("#useGradient").checked;

	DMer.changeStyle({
		fontSize : fsize,
		fontWeight : fweight,
		fontColor : fcolor,
		opacity : fopa
	});

	if(checked){
		var type = getEle("#gradientType").value,
			sc = getEle("#gscolor").value,
			ec = getEle("#gecolor").value;

		DMer.addGradient(type,{
			colorStops : [{
				point : 0,
				color : sc
			},{
				point : 1,
				color : ec
			}]
		});
	}

};

getEle("#filter-btn").onclick = function(e){
	var prop = getEle("#filter-prop").value,
		val = getEle("#filter-val").value;

	DMer.addFilter(prop,val);
	status.innerHTML = "添加一个过滤";
};

getEle("#filter-del-btn").onclick = function(e){
	var prop = getEle("#filter-del-prop").value,
		val = getEle("#filter-del-val").value;

	DMer.removeFilter(prop,val);
	status.innerHTML = "删除一个过滤";
};

getEle("#start").onclick = function(e){
	video.play();
	DMer.start();
};

getEle("#stop").onclick = function(e){
	video.pause();
	DMer.stop();
};

getEle("#run").onclick = function(e){
	video.play();
	DMer.run();
};

getEle("#pause").onclick = function(e){
	video.pause();
	DMer.pause();
};

getEle("#clear").onclick = function(e){
	DMer.clear();
};

getEle("#full").onclick = function(e){
	DMer.setSize( document.body.clientWidth, document.body.clientHeight );
};

getEle("#small").onclick = function(e){
	DMer.setSize( 800, 450 );
};

getEle("#disable").onclick = function(e){
	DMer.disableEffect();
};

getEle("#enable").onclick = function(e){
	DMer.enableEffect();
};

getEle("#getsize").onclick = function(e){
	status.innerHTML = JSON.stringify(DMer.getSize());
};

var start = 0,
	doing = false;
video.ontimeupdate = function(e){
	var time = this.currentTime >> 0;

	if(doing) return false;
	doing = true;
	for( var i = start,obj; obj = save[i++]; ){
		if( obj.time == time ){
			DMer.inputData(obj);
			start = i;
		}
		if( obj.time > time ){
			break;
		}
	}
	doing = false;
};

var show = {
	"normal" : function(){
		document.querySelector(".addNormal").setAttribute("data-status","show");
	},
	"effect" : function(){
		document.querySelector(".addEffect").setAttribute("data-status","show");
	},
	"filter" : function(){
		document.querySelector(".addFilter").setAttribute("data-status","show");
	},
	"change" : function(){
		document.querySelector(".addStyle").setAttribute("data-status","show");
	},
	"control" : function(){
		document.querySelector(".addControl").setAttribute("data-status","show");
	}
};

var showEffect = {
	"text" : function(){
		document.querySelector(".effectText").setAttribute("data-status","show");
	},
	"rect" : function(){
		document.querySelector(".effectRect").setAttribute("data-status","show");
	},
	"circle" : function(){
		document.querySelector(".effectCircle").setAttribute("data-status","show");
	}
};

function hideList(selector){
	var lists = content.querySelectorAll(selector);
	for( var i = 0,list; list = lists[i++]; ){
		list.setAttribute("data-status","hide");
	}
}

function getEle(selector){
	return document.querySelector(selector);
}

function getStep(){
	var obj = {},
		type = getEle("#effect-sel").value;

	if( type == "text" ){
		obj.text = getEle("#effect-text").value;
		obj.fontSize = getEle("#fsize").value;
		obj.fontWeight = getEle("#fweight").value;
	} else if( type == "rect" ){
		obj.width = getEle("#rw").value * 1;
		obj.height = getEle("#rh").value * 1;
	} else if( type == "circle" ){
		obj.radius = getEle("#radius").value * 1;
	}

	obj.startX = getEle("#sx").value * 1;
	obj.startY = getEle("#sy").value * 1;
	obj.endX = getEle("#ex").value * 1;
	obj.endY = getEle("#ey").value * 1;
	obj.scaleStartX = getEle("#scaleSX").value * 1;
	obj.scaleStartY = getEle("#scaleSY").value * 1;
	obj.scaleEndX = getEle("#scaleEX").value * 1;
	obj.scaleEndY = getEle("#scaleEY").value * 1;
	obj.rotateStart = getEle("#sr").value * 1;
	obj.rotateEnd = getEle("#er").value * 1;
	obj.skewStartX = getEle("#skewSX").value * 1;
	obj.skewStartY = getEle("#skewSY").value * 1;
	obj.skewEndX = getEle("#skewEX").value * 1;
	obj.skewEndY = getEle("#skewEY").value * 1;
	obj.duration = getEle("#dur").value * 1;
	obj.opacityStart = getEle("#so").value * 1;
	obj.opacityEnd = getEle("#eo").value * 1;
	obj.fillStyle = getEle("#fcolor").value;
	obj.strokeStyle = getEle("#scolor").value;
	obj.pastTime = 0;

	return obj;
}

function resetEfc(val){
	nowEfc.type = val || nowEfc.type || "text";
	nowEfc.currentIndex = 0;
	nowEfc.hide = false;
	nowEfc.steps = [];
	saveBtn.querySelector("em").innerHTML = 1;
}

function deepClone(obj){
	if( typeof obj != "object" ) return obj;
	if( Object.prototype.toString.call(obj) == "[object Array]" ) return obj.concat([]);
	var tempObj = {};
	for( var key in obj ){
		tempObj[key] = deepClone(obj[key]);
	}
	return tempObj;
}

}(window,Math));