jQuery(function($){

//初始化
var wrapper = document.querySelector(".wrapper");
var DMer; //弹幕插件保存变量

var iscroll = new IScroll(".scroll-wrapper",{
	mouseWheel : true,
	scrollbars : true,
	fadeScrollbars : true
});

var video = document.getElementById("video");

$('.control-settings').on("click",'a',function(e){

	e.preventDefault();
	e.stopPropagation();

	var set = $(this).attr("data-set") || "normal";

	$('.control-settings').find('li').removeClass("active");

	$(this).parent().addClass("active");

	tabChange(set);

});


//切换选项卡
function tabChange(set){

	var $tabs = $('.scroll').find(".panel");

	$tabs.hide();

	$('.scroll').find(".panel[data-setting='"+set+"']").show();

	iscroll.refresh();

}

tabChange("normal");

$('.dropdown-menu').on("click","a",function(e){

	var val = $(this).attr("data-val");

	$(this).parents(".btn-group").attr("data-val",val).find("button").html(val+' <span class="caret"></span>');

});

/***************************************************************************************************/

//普通弹幕提交
var normal = [],
	index = 0;

$('#normal-submit-btn').on("click",function(e){

	//弹幕数
	var num = $("#normal-danmu-num").val() || 0;
	//弹幕文本
	var text = $("#normal-danmu-text").val() || "";
	//弹幕方向
	var direc = $('#normal-danmu-direc').attr("data-val") || "rtol";
	//弹幕时间曲线
	var timing = $('#normal-danmu-timing').attr("data-val") || "linear";

	var types = ["slide","top","bottom"];

	for( var i = 0; i < num; i++ ){

		var rand = Math.random() * 220 >> 0;

		normal.push({
			text : text,
			type : types[ ( Math.random() * 3 >> 0 ) % 3],
			change : false,
			fontSize : "24px",
			color : "#ffcc44",
			time : rand
		});

	}

	normal.sort(function(a,b){
		return a.time - b.time;
	});

	DMer.direction(direc);
	DMer.timing(timing);

	video.play();

	DMer.start();

});

video.ontimeupdate = function(e){
	var t = video.currentTime << 0;
	for( var i = index,dm; dm = normal[i++]; ){
		if( dm.time > t ) break;
		index = i;
		DMer.inputData(dm);
	}
};

//初始化弹幕插件
video.ondurationchange = function(e){
	DMer = DanMuer(wrapper,{});
};

/***************************************************************************************************/

//高级弹幕设置

var effect_data = {
	"type" : "text",
	"currentIndex" : 0,
	"hide" : false,
	"steps" : []
};

$('.inner-select').on("click","a",function(e){

	var $val = $(this).attr("data-val");

	$('.owner-box').removeClass("o-active");

	$('.owner-box[data-val="'+$val+'"]').addClass("o-active");

	effect_data.type = $val;

	iscroll.refresh();

});

var saving = false;

$("#effect-save-btn").on("click",function(e){

	if(saving) return false;

	saving = true;

	//保存步骤

	//文本
	var $text = $("#effect-danmu-text").val() || "",
		$fsize = ( $("#effect-danmu-size").val() || 24 ) + "px",
		$fweight = $("#effect-danmu-weight").val() || "normal",
		$fstyle = $("#effect-danmu-style").val() || "normal";

	//方形
	var $w = $("#effect-danmu-rect-width").val() * 1 || 100,
		$h = $("#effect-danmu-rect-height").val() * 1 || 100;

	//圆形
	var $r = $("#effect-danmu-radius").val() * 1 || 10;

	//多边形
	var $pointstr = $("#effect-danmu-points").val().replace(/\(|\)/g,""),
		$points = $pointstr ? $pointstr.split(",") : [],
		$dx = $("#effect-danmu-distX").val() * 1 || 0,
		$dy = $("#effect-danmu-distY").val() * 1 || 0;

	var $points_array = [];

	for( var i = 0, l = $points.length; i < l; i+=2 ){

		var $a = $points[i],
			$b = $points[i+1] || "";

		var o = {
			x : isNaN($a) ? 0 : $a * 1,
			y : isNaN($b) ? 0 : $b * 1
		};

		$points_array.push(o);

	}

	//图片
	var $img = $("#chooseImage")[0].files[0],
		$iw = $('#effect-danmu-image-width').val() * 1 || 0,
		$ih = $("#effect-danmu-image-height").val() * 1 || 0;

	//通用
	var $trans_sx = $("#effect-danmu-translate-sx").val() * 1 || 0,
		$trans_sy = $("#effect-danmu-translate-sy").val() * 1 || 0,
		$trans_ex = $("#effect-danmu-translate-ex").val() * 1 || 0,
		$trans_ey = $("#effect-danmu-translate-ey").val() * 1 || 0,
		$trans_timing = $("#effect-danmu-translate-timing").val() || "linear";

	var $rotate_start = $("#effect-danmu-rotate-sa").val() * 1 || 0,
		$rotate_end = $("#effect-danmu-rotate-ea").val() * 1 || 0,
		$rotate_timing = $("#effect-danmu-rotate-timing").val() || "linear";

	var $scale_sx = $("#effect-danmu-scale-sx").val() * 1 || 1,
		$scale_sy = $("#effect-danmu-scale-sy").val() * 1 || 1,
		$scale_ex = $("#effect-danmu-scale-ex").val() * 1 || 1,
		$scale_ey = $("#effect-danmu-scale-ey").val() * 1 || 1,
		$scale_timing = $("#effect-danmu-scale-timing").val() || "linear";

	var $skew_sx = $("#effect-danmu-skew-sx").val() * 1 || 0,
		$skew_sy = $("#effect-danmu-skew-sy").val() * 1 || 0,
		$skew_ex = $("#effect-danmu-skew-ex").val() * 1 || 0,
		$skew_ey = $("#effect-danmu-skew-ey").val() * 1 || 0,
		$skew_timing = $("#effect-danmu-skew-timing").val() || "linear";

	var $opacity_start = $("#effect-danmu-opacity-start").val() * 1 || 1,
		$opacity_end = $("#effect-danmu-opacity-end").val() * 1 || 1,
		$opacity_timing = $("#effect-danmu-opacity-timing").val() || "linear";

	var $duration = $("#effect-danmu-duration").val() * 1 || 3000,
		$type = $("#effect-danmu-type").val() || "quad",
		$fill = $("#effect-danmu-fill").val() || "#66ccff",
		$stroke = $("#effect-danmu-stroke").val() || "#ffffff";

	var typeset = effect_data.type;

	var reader = new FileReader(),
		img = document.createElement("img");

	reader.onload = function(e){
		img.src = e.target.result;

		saveData(img);
	};

	if($img)
	reader.readAsDataURL($img);
	else
	saveData(img);

	function saveData(img){
		var obj = {
			text : $text,
			fontWeight : $fweight,
			fontFamily : "Microsoft Yahei",
			fontStyle : $fstyle,
			fontSize : $fsize,
			width : typeset == "rect" ? $w : ( $iw || img.natrualWidth ),
			height : typeset == "rect" ? $h : ( $ih || img.natrualHeight ),
			points : $points_array,
			distX : $dx,
			distY : $dy,
			radius : $r,
			img : img,
			duration : $duration,
			fillStyle : $fill,
			strokeStyle : "#cccccc",
			pastTime : 0,
			type : "quad",
			translate : {
				startX : $trans_sx,
				startY : $trans_sy,
				endX : $trans_ex,
				endY : $trans_ey,
				timing : $trans_timing
			},
			scale : {
				startX : $scale_sx,
				startY : $scale_sy,
				endX : $scale_ex,
				endY : $scale_ey,
				timing : $scale_timing
			},
			rotate : {
				start : $rotate_start,
				end : $rotate_end,
				timing : $rotate_timing
			},
			skew : {
				startX : $skew_sx,
				startY : $skew_sy,
				endX : $skew_ex,
				endY : $skew_ey,
				timing : $skew_timing
			},
			opacity : {
				start : $opacity_start,
				end : $opacity_end,
				timing : $opacity_timing
			}
		};

		effect_data.steps.push(obj);
		
		$("#effect-save-btn").find("strong").html(effect_data.steps.length+1);

		saving = false;
	}

});

$("#effect-submit").on("click",function(e){

	var data = clone(effect_data);

	$("#effect-save-btn").find("strong").html(1);

	DMer.inputEffect(data);

	$(".panel[data-setting='effect']").find("input").val("");

	effect_data.steps = [];

});

/***************************************************************************************************/

//修改过滤设置

$('#filter-add-btn').on("click",function(e){

	var $key = $("#filter-danmu-add-key").val(),
		$val = $("#filter-danmu-add-val").val();

	if(!$key || !$val) return false;

	DMer.addFilter($key,$val);

});

$('#filter-remove-btn').on("click",function(e){

	var $key = $("#filter-danmu-remove-key").val(),
		$val = $("#filter-danmu-remove-val").val();

	if(!$key) return false;

	DMer.removeFilter($key,$val);

});

/***************************************************************************************************/

//修改全局样式

$("#normal-change-btn").on("click",function(e){

	var fontSize = ( $("#normal-danmu-size").val() * 1 || 20 ) + "px",
		fontStyle = $('#normal-danmu-fontStyle').attr("data-val"),
		fontWeight = $('#normal-danmu-fontWeight').attr("data-val"),
		color = $("#normal-danmu-color").val() || "#FFFFFF",
		opacity = $("#normal-danmu-opacity").val() / 100 || 1,
		family = $("#normal-danmu-family").attr("data-val"),
		graType = $("#normal-danmu-gradient-type").attr("data-val"),
		graSX = $("#normal-danmu-gradient-startX").val() * 1,
		graSY = $("#normal-danmu-gradient-startY").val() * 1,
		graEX = $("#normal-danmu-gradient-endX").val() * 1,
		graEY = $("#normal-danmu-gradient-endY").val() * 1,
		graSColor = $("#normal-danmu-gradient-startColor").val() || "#FFFFFF",
		graEColor = $("#normal-danmu-gradient-endColor").val() || "#FFFFFF",
		checked = $("#use-gradient")[0].checked;

	DMer.changeStyle({
		fontSize : fontSize,
		fontFamily : family,
		fontStyle : fontStyle,
		fontWeight : fontWeight,
		fontColor : color,
		opacity : opacity
	});

	if( !checked ) return false;

	DMer.addGradient(graType,{
		startX : graSX,
		startY : graSY,
		endX : graEX,
		endY : graEY,
		colorStops : [{
			"point" : 0,
			"color" : graSColor
		},{
			"point" : 1,
			"color" : graEColor
		}]
	});

});

/***************************************************************************************************/

//修改全局样式

$("#filter-add-btn").on("click",function(e){

	var key = $("#filter-danmu-add-key").val();

	if(!key) return false;

	var val = $("#filter-danmu-add-val").val() || "";

});

/***************************************************************************************************/

//其他控制选项

//启动
$("#all-start").on("click",function(e){

	DMer.start();

	video.play();

});
//停止
$("#all-stop").on("click",function(e){

	DMer.stop();

});
//运行
$("#all-play").on("click",function(e){

	DMer.run();

	video.play();

});
//暂停
$("#all-pause").on("click",function(e){

	DMer.pause();

	video.pause();

});
//清除
$("#all-clear").on("click",function(e){

	DMer.clear();

});
//重置
$("#all-reset").on("click",function(e){

	DMer.reset(0);

});
//禁用
$("#all-disable").on("click",function(e){

	DMer.disableEffect();

});
//启用
$("#all-disable").on("click",function(e){

	DMer.enableEffect();

});
//FPS
var timer,
	$msg = $(".showMsg");
$("#all-fps").on("click",function(e){

	clearInterval(timer);
	timer = setInterval(function(){
		$msg.html(DMer.getFPS());
	},500);

});
//设置大小
$("#all-resize").on("click",function(){

	var $w = $("#canvas-danmu-width").val() * 1,
		$h = $("#canvas-danmu-height").val() * 1;

	DMer.setSize($w,$h);

});

});


function clone(obj){

	var result = obj;

	if( Object.prototype.toString.call(obj) == "[object Array]" ){
		result = [];
		for( var i = 0, l = obj.length; i < l; i++ ){
			result[i] = clone(obj[i]);
		}
	}

	if( Object.prototype.toString.call(obj) == "[object Object]" ){
		result = {};
		for( var key in obj ){
			result[key] = clone(obj[key]);
		}
	}

	return result;
}