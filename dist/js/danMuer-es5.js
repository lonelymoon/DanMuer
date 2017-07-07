"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, Math, undefined) {

	var loop = Symbol("loop");
	var init = Symbol("init"); //初始化
	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	//es6

	//普通弹幕

	var normalDM = function () {
		function normalDM(cv) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, normalDM);

			this.save = [];
			this.canvas = cv;
			this.cxt = cv.getContext('2d');

			this.width = 0;
			this.height = 0;

			this.rows = {
				slide: [],
				top: [],
				bottom: []
			}; //存放不同类型弹幕的通道数
			this.filters = {}; //过滤

			this.leftTime = opts.leftTime || 2000; //头部、底部静止型弹幕的显示时长
			this.space = opts.space || 10; //弹幕的行距
			this.unitHeight = 0; //弹幕的高度
			this.rowNum = 0; //通道行数
			this.baseSpeed = opts.baseSpeed || 2; //弹幕基础速度
			this.baseWidth = opts.baseWidth || 800; //与实际大小设置并无关系，用于当canvas宽高调整时，速度变化的被除数，如 将canvas从800px增大到1600px，则速度增快 1600/this.baseWidth倍


			this.startIndex = 0; //循环时的初始下标
			this.looped = false; //是否已经经历过一次循环

			this.changeStyle(opts);
		}

		//添加弹幕


		normalDM.prototype.add = function add(obj) {
			if (!obj) return;

			//如果已经可以计算文本宽度，则直接进行计算
			if (this.looped) this.countWidth([obj]);

			this.filter(obj);

			this.save.push(obj);
		};

		//清除所有弹幕


		normalDM.prototype.clear = function clear() {
			this.save = [];
			this.startIndex = 0;
		};

		//暂停


		normalDM.prototype.pause = function pause() {
			this.paused = true;
		};

		//播放


		normalDM.prototype.run = function run() {
			this.paused = false;
		};

		//添加过滤


		normalDM.prototype.addFilter = function addFilter(key, val) {
			if (!key || !val) return false;

			var _ref = [this.filters],
			    filters = _ref[0];


			if (!filters[key]) filters[key] = [];

			if (!filters[key].find(function (v) {
				return val === v;
			})) filters[key].push(val);

			this.doFilter();
		};

		//过滤


		normalDM.prototype.filter = function filter(obj) {
			var filters = this.filters;
			//遍历属性
			for (var _iterator = Object.keys(filters), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref2 = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref2 = _i.value;
				}

				var res = _ref2;

				var resArr = filters[res];
				var _ref3 = [0, resArr.length],
				    i = _ref3[0],
				    len = _ref3[1];
				//遍历属性对应的数组

				for (; i < len; i++) {
					//是否包含对应的值
					if (!obj[res].includes(resArr[i])) {
						obj.hide = false;
						continue;
					}
					obj.hide = true;
					return false;
				}
			}
		};

		//进行过滤


		normalDM.prototype.doFilter = function doFilter() {
			var _ref4 = [0, this.save],
			    i = _ref4[0],
			    items = _ref4[1],
			    item = _ref4[2];

			for (; item = items[i++];) {
				this.filter(item);
			}
		};

		//移除过滤


		normalDM.prototype.removeFilter = function removeFilter(key, val) {
			if (!key) return false;

			var _ref5 = [this.filters],
			    filters = _ref5[0],
			    fltArr = _ref5[1];


			fltArr = filters[key];

			if (!fltArr) return false;

			if (!val) {
				delete filters[key];
			} else {
				var _ref6 = [0, fltArr],
				    i = _ref6[0],
				    items = _ref6[1],
				    item = _ref6[2];

				for (; item = items[i++];) {
					if (item === val) {
						filters[key].splice(i - 1, 1);
						break;
					}
				}
			}

			this.doFilter();
		};

		//清屏


		normalDM.prototype.clearRect = function clearRect() {
			this.cxt.clearRect(0, 0, this.width, this.height);
		};

		//合并字体


		normalDM.prototype.font = function font() {
			this.globalFont = this.globalStyle + " " + this.globalWeight + " " + this.globalSize + " " + this.globalFamily;
		};

		//添加渐变


		normalDM.prototype.addGradient = function addGradient(type) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


			if (!type || typeof type != "string") return false;

			var result = null;

			if (type == "radial") {
				result = this.addRadialGradient(opts);
			} else if (type == "linear") {
				result = this.addLinearGradient(opts);
			} else {
				return false;
			}

			this.changeStyle({
				fontColor: result
			});
		};

		//线性渐变


		normalDM.prototype.addLinearGradient = function addLinearGradient(opts) {
			var sx = opts.startX || 0,
			    sy = opts.startY || 0,
			    ex = opts.endX || this.width,
			    ey = opts.endY || this.height,
			    stops = opts.colorStops || [{
				"point": 0,
				"color": this.globalColor
			}, {
				"point": 1,
				"color": this.globalColor
			}];


			var linear = this.cxt.createLinearGradient(sx, sy, ex, ey);

			for (var _iterator2 = stops, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref7;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref7 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref7 = _i2.value;
				}

				var stop = _ref7;

				linear.addColorStop(stop.point, stop.color);
			}

			return linear;
		};

		//圆形渐变


		normalDM.prototype.addRadialGradient = function addRadialGradient(opts) {
			var sx = opts.startX || this.width / 2,
			    sy = opts.startY || this.height / 2,
			    sr = opts.startR || 0,
			    ex = opts.endX || this.width / 2,
			    ey = opts.endY || this.height / 2,
			    er = opts.endR || this.width,
			    stops = opts.colorStops || [{
				"point": 0,
				"color": this.globalColor
			}, {
				"point": 1,
				"color": this.globalColor
			}];


			var radial = this.cxt.createRadialGradient(sx, sy, sr, ex, ey, er);

			for (var _iterator3 = stops, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref8;

				if (_isArray3) {
					if (_i3 >= _iterator3.length) break;
					_ref8 = _iterator3[_i3++];
				} else {
					_i3 = _iterator3.next();
					if (_i3.done) break;
					_ref8 = _i3.value;
				}

				var stop = _ref8;

				radial.addColorStop(stop.point, stop.color);
			}

			return radial;
		};

		//改变全局样式


		normalDM.prototype.changeStyle = function changeStyle() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


			//文本属性保存
			this.globalSize = opts.fontSize || this.globalSize || "24px"; //字体大小
			this.globalFamily = opts.fontFamily || this.globalFamily || "微软雅黑"; //字体
			this.globalStyle = opts.fontStyle || this.globalStyle || "normal"; //字体样式
			this.globalWeight = opts.fontWeight || this.globalWeight || "normal"; //字体粗细
			this.globalColor = opts.fontColor || this.globalColor || "#ffffff"; //字体颜色
			this.opacity = opts.opacity || this.opacity || 1; //透明程度

			//表示进行过一次全局样式变化
			this.globalChanged = true;
		};

		//启用全局样式


		normalDM.prototype.initStyle = function initStyle(cxt) {

			this.globalChanged = false;

			//合并font属性
			this.font();

			//更新全局样式
			cxt.font = this.globalFont;
			cxt.textBaseline = "middle";
			cxt.fillStyle = this.globalColor;
			cxt.globalAlpha = this.opacity;
		};

		//循环


		normalDM.prototype.update = function update(w, h, time) {
			var _ref9 = [this.save, this.cxt],
			    items = _ref9[0],
			    cxt = _ref9[1];


			this.globalChanged && this.initStyle(cxt); //初始化全局样式

			!this.looped && this.countWidth(items); //计算文本宽度以及初始化位置（只执行一次）

			if (this.paused) return false; //暂停

			this.refresh(items); //更新初始下标startIndex

			var _ref10 = [this.startIndex],
			    i = _ref10[0],
			    item = _ref10[1];


			cxt.clearRect(0, 0, w, h);

			for (; item = items[i++];) {
				this.step(item, time);
				this.draw(item, cxt);
				this.recovery(item, w);
			}
		};

		//重置弹幕


		normalDM.prototype.reset = function reset() {
			var resetIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


			//resetIndex表示想要开始重置的弹幕的下标，系统想重置该值以后的弹幕
			var _ref11 = [this.save, this.width, this.leftTime, resetIndex],
			    items = _ref11[0],
			    w = _ref11[1],
			    leftTime = _ref11[2],
			    i = _ref11[3],
			    item = _ref11[4];


			for (; item = items[i++];) {
				if (item.type == "slide") {
					item.x = w;
					item.rowRid = false;
				} else {
					item.leftTime = leftTime;
				}
				item.recovery = false;
			}
			this.startIndex = resetIndex;
		};

		//更新canvas size


		normalDM.prototype.getSize = function getSize() {

			this.width = this.canvas.width;
			this.height = this.canvas.height;

			this.speedScale = Math.max(this.width / this.baseWidth, 0.7);

			this.deleteRow();
			this.countRows();

			this.globalChanged = true;
		};

		//消除item的row


		normalDM.prototype.deleteRow = function deleteRow() {
			var _ref12 = [this.save, 0],
			    items = _ref12[0],
			    i = _ref12[1],
			    item = _ref12[2];

			for (; item = items[i++];) {
				item.row = null;
			}
		};

		//生成通道行


		normalDM.prototype.countRows = function countRows() {

			//保存临时变量
			var unitHeight = parseInt(this.globalSize) + this.space;
			var _ref13 = [(this.height - 20) / unitHeight >> 0, this.rows],
			    rowNum = _ref13[0],
			    rows = _ref13[1];

			//重置通道

			for (var _iterator4 = Object.keys(rows), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
				var _ref14;

				if (_isArray4) {
					if (_i4 >= _iterator4.length) break;
					_ref14 = _iterator4[_i4++];
				} else {
					_i4 = _iterator4.next();
					if (_i4.done) break;
					_ref14 = _i4.value;
				}

				var key = _ref14;

				rows[key] = [];
			}

			//重新生成通道
			for (var i = 0; i < rowNum; i++) {
				var obj = {
					idx: i,
					y: unitHeight * i + 20
				};
				rows.slide.push(obj);

				i >= rowNum / 2 ? rows.bottom.push(obj) : rows.top.push(obj);
			}

			//更新实例属性
			this.unitHeight = unitHeight;
			this.rowNum = rowNum;
		};

		//获取通道


		normalDM.prototype.getRow = function getRow(item) {

			//如果该弹幕正在显示中，则返回其现有通道
			if (item.row) return item.row;

			//获取新通道
			var _ref15 = [this.rows, item.type],
			    rows = _ref15[0],
			    type = _ref15[1];

			var row = type != "bottom" ? rows[type].shift() : rows[type].pop();
			//生成临时通道
			var tempRow = this["getRow_" + type]();

			if (row && item.type == "slide") {
				item.x += row.idx * 8;
				item.speed += row.idx / 3;
			}

			//返回分配的通道
			return row || tempRow;
		};

		normalDM.prototype.getRow_bottom = function getRow_bottom() {
			return {
				y: 20 + this.unitHeight * (Math.random() * this.rowNum / 2 + this.rowNum / 2 << 0),
				speedChange: false,
				tempItem: true
			};
		};

		normalDM.prototype.getRow_slide = function getRow_slide() {
			return {
				y: 20 + this.unitHeight * (Math.random() * this.rowNum << 0),
				speedChange: true,
				tempItem: true
			};
		};

		normalDM.prototype.getRow_top = function getRow_top() {
			return {
				y: 20 + this.unitHeight * (Math.random() * this.rowNum / 2 << 0),
				speedChange: false,
				tempItem: true
			};
		};

		//计算宽度


		normalDM.prototype.countWidth = function countWidth(items) {
			var cxt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.cxt;


			this.looped = true;

			var _ref16 = [this.width, 0],
			    cw = _ref16[0],
			    i = _ref16[1],
			    item = _ref16[2];


			for (; item = items[i++];) {
				var w = cxt.measureText(item.text).width >> 0;
				item.width = w;
				item.height = parseInt(this.globalSize);
				//更新初始 x
				item.x = cw;
				item.speed = this.baseSpeed;
				if (item.type != "slide") {
					item.x = (cw - w) / 2;
					item.leftTime = this.leftTime;
					item.speed = 0;
				}
			}
		};

		//更新每个弹幕的单独样式


		normalDM.prototype.updateStyle = function updateStyle(item, cxt) {
			cxt.font = this.globalStyle + " " + this.globalWeight + " " + item.fontSize + " " + this.globalFamily;
			cxt.fillStyle = item.color || this.globalColor;
		};

		//计算


		normalDM.prototype.step = function step(item, time) {

			var row = this.getRow(item); //取得通道

			//如果通道已满，则新弹幕变更速度防止弹幕重叠
			if (row.speedChange) {
				row.speedChange = false;
				item.speed += Math.random() * 2 + 1 >> 0;
			}

			var speed = item.speed * this.speedScale * time / 16 >> 0;

			//更新参数
			item.leftTime ? item.leftTime -= time : "";
			item.x -= speed;
			item.y = item.y || row.y;
			item.row = row;
		};

		//绘制


		normalDM.prototype.draw = function draw(item, cxt) {
			//如果已经显示完成，则不显示
			if (item.recovery || item.hide) return false;

			cxt.save();
			if (item.change) {
				this.updateStyle(item, cxt);
			}
			cxt.fillText(item.text, item.x, item.y);
			cxt.restore();
		};

		//回收弹幕和通道


		normalDM.prototype.recovery = function recovery(item, w) {

			if (item.type == "slide") {
				item.recovery = this.recoverySlide(item, w);
				return false;
			}

			item.recovery = this.recoveryStatic(item);
		};

		normalDM.prototype.recoverySlide = function recoverySlide(item, w) {

			//回收slide类型
			var _ref17 = [item.x, item.width],
			    x = _ref17[0],
			    iw = _ref17[1];


			if (!item.rowRid && x + iw < w && !item.row.tempItem) {
				this.rows[item.type].unshift(item.row);
				item.rowRid = true; //表明该行已被释放
			}

			if (x > -iw) return false;

			return true;
		};

		normalDM.prototype.recoveryStatic = function recoveryStatic(item) {
			if (item.leftTime > 0) return false;

			var type = item.type;

			if (!item.row.tempItem) {
				this.rows[type].unshift(item.row);
				item.row = null;
			}

			return true;
		};

		//更新下标


		normalDM.prototype.refresh = function refresh(items) {
			var _ref18 = [this.startIndex,, this.rows],
			    i = _ref18[0],
			    item = _ref18[1],
			    rows = _ref18[2];
			//通道排序

			for (var _iterator5 = Object.keys(rows), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
				var _ref19;

				if (_isArray5) {
					if (_i5 >= _iterator5.length) break;
					_ref19 = _iterator5[_i5++];
				} else {
					_i5 = _iterator5.next();
					if (_i5.done) break;
					_ref19 = _i5.value;
				}

				var key = _ref19;

				rows[key].sort(function (a, b) {
					return a.y - b.y;
				});
			}

			for (; item = items[i++];) {
				if (!item.recovery) return false;
				//更新下标并清除row
				this.startIndex = i;
				item.row = null;
			}
		};

		return normalDM;
	}();

	//特效弹幕


	var effectDM = function () {
		function effectDM(cv) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, effectDM);

			this.canvas = cv;
			this.cxt = cv.getContext("2d");
			this.enable = opts.enable === false ? false : true;

			this.startIndex = 0;

			this.save = [];
		}

		//添加数据


		effectDM.prototype.add = function add(data) {
			if (!data || (typeof data === "undefined" ? "undefined" : _typeof(data)) != "object") return false;

			var _ref20 = [data.steps, 0],
			    steps = _ref20[0],
			    i = _ref20[1],
			    step = _ref20[2];


			for (; step = steps[i++];) {
				this.initStep(step); //初始化参数
			}

			this.save.push(data);
		};

		//清除数据


		effectDM.prototype.clear = function clear() {
			this.save = [];
			this.startIndex = 0;
		};

		//重置弹幕


		effectDM.prototype.reset = function reset(i) {
			var _ref21 = [this.save],
			    items = _ref21[0],
			    item = _ref21[1];

			for (; item = items[i++];) {
				item.hide = false;
			}
		};

		//暂停


		effectDM.prototype.pause = function pause() {
			this.paused = true;
		};

		//继续


		effectDM.prototype.run = function run() {
			this.paused = false;
		};

		//启用


		effectDM.prototype.enableEffect = function enableEffect() {
			this.enable = true;
		};

		//停用


		effectDM.prototype.disableEffect = function disableEffect() {
			this.enable = false;
		};

		//初始化参数


		effectDM.prototype.initStep = function initStep(step) {

			step.type = step.type || "linear";
			step.scaleStartX = step.scaleStartX || 1;
			step.scaleStartY = step.scaleStartY || 1;
			step.scaleEndX = step.scaleEndX || 1;
			step.scaleEndY = step.scaleEndY || 1;
			step.rotateEnd = step.rotateEnd || 0;
			step.rotateStart = step.rotateStart || 0;
			step.endX = step.endX || 0;
			step.startX = step.startX || 0;
			step.endY = step.endY || 0;
			step.startY = step.startY || 0;
			step.skewStartX = step.skewStartX || 0;
			step.skewStartY = step.skewStartY || 0;
			step.skewEndX = step.skewEndX || 0;
			step.skewEndY = step.skewEndY || 0;
			step.pastTime = step.pastTime || 0;
			step.duration = step.duration || 3000;
			step.scaleDistX = step.scaleEndX - step.scaleStartX;
			step.scaleDistY = step.scaleEndY - step.scaleStartY;
			step.rotateDist = step.rotateEnd - step.rotateStart;
			step.opacity = step.opacity || 1;
			step.fillStyle = step.fillStyle || "#ffffff";
			step.strokeStyle = step.strokeStyle || "#ffffff";
			//圆形
			step.radius = step.radius || 10;
			//判断多边形
			step.distX = step.points ? step.distX || 0 : step.endX - step.startX;
			step.distY = step.points ? step.distY || 0 : step.endY - step.startY;
			step.skewDistX = step.skewEndX - step.skewStartX;
			step.skewDistY = step.skewEndY - step.skewStartY;
		};

		//更新canvas尺寸


		effectDM.prototype.getSize = function getSize() {

			this.width = this.canvas.width;
			this.height = this.canvas.height;
		};

		//清除画布


		effectDM.prototype.clearRect = function clearRect() {
			this.cxt.clearRect(0, 0, this.width, this.height);
		};

		//动画循环


		effectDM.prototype.update = function update(w, h, time) {

			if (this.paused) //如果暂停，return
				return false;

			var _ref22 = [this.canvas, this.cxt],
			    canvas = _ref22[0],
			    cxt = _ref22[1];

			cxt.clearRect(0, 0, w, h);

			if (!this.enable) //如果不启用, return
				return false;

			var _ref23 = [this.startIndex, this.save],
			    i = _ref23[0],
			    items = _ref23[1],
			    item = _ref23[2];


			for (; item = items[i++];) {
				if (item.hide) continue;

				var steps = item.steps;
				var stepItem = steps[item.currentIndex];
				this.step(item, stepItem, time);
				this.draw(item, stepItem, cxt);
				this.recovery(item, stepItem);
			}
		};

		effectDM.prototype.step = function step(item, stepItem, time) {

			stepItem.pastTime += time;

			var _ref24 = [stepItem.type || "linear", stepItem.pastTime, stepItem.duration],
			    type = _ref24[0],
			    past = _ref24[1],
			    duration = _ref24[2];

			//多边形特殊处理

			if (item.type == "polygon") this.stepCheckPolygon(stepItem, item);

			stepItem.x = this.Tween(type, past, stepItem.startX, stepItem.distX, duration);
			stepItem.y = this.Tween(type, past, stepItem.startY, stepItem.distY, duration);
			stepItem.scaleX = this.Tween(type, past, stepItem.scaleStartX, stepItem.scaleDistX, duration);
			stepItem.scaleY = this.Tween(type, past, stepItem.scaleStartY, stepItem.scaleDistY, duration);
			stepItem.rotate = this.Tween(type, past, stepItem.rotateStart, stepItem.rotateDist, duration);
			stepItem.skewX = this.Tween(type, past, stepItem.skewStartX, stepItem.skewDistX, duration);
			stepItem.skewY = this.Tween(type, past, stepItem.skewStartY, stepItem.skewDistY, duration);
		};
		//多边形特殊设置


		effectDM.prototype.stepCheckPolygon = function stepCheckPolygon(stepItem, item) {
			var currentIndex = item.currentIndex;

			//初始化进行计算
			if (currentIndex == 0) {
				var tempX = 0,
				    tempY = 0,
				    points = stepItem.points.concat([]) || [],
				    len = 0;
				var _ref25 = [0],
				    i = _ref25[0],
				    point = _ref25[1];

				for (; point = points[i++];) {
					tempX += point.x;
					tempY += point.y;
					len++;
				}
				if (len <= 0) return false;
				stepItem.startX = tempX / len; //计算中心点
				stepItem.startY = tempY / len;
				stepItem.firstPoint = stepItem.points.concat([]).shift(); //获取moveTo的第一个点
			} else if (!stepItem.points) {
				//调用上一步的数据
				var prevStep = item.steps[currentIndex - 1];
				stepItem.startX = prevStep.x;
				stepItem.startY = prevStep.y;
				stepItem.points = prevStep.points;
				stepItem.firstPoint = prevStep.firstPoint;
			}
		};

		effectDM.prototype.draw = function draw(item, stepItem, cxt) {
			cxt.save();
			//根据type调用
			!!this[item.type] && this[item.type](stepItem, cxt, Math, Math.PI / 180);
			cxt.restore();
		};

		effectDM.prototype.rect = function rect(stepItem, cxt, Math, rotUnit) {
			var _ref26 = [stepItem.x, stepItem.y, stepItem.width, stepItem.height],
			    x = _ref26[0],
			    y = _ref26[1],
			    w = _ref26[2],
			    h = _ref26[3];
			var _ref27 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
			    tx = _ref27[0],
			    ty = _ref27[1];

			cxt.beginPath();
			cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x + w / 2, y + h / 2);
			cxt.rotate(stepItem.rotate * Math.PI / 180);
			cxt.globalAlpha = stepItem.opacity;
			cxt.rect(-w / 2, -h / 2, w, h);
			cxt.closePath();
			cxt.fillStyle = stepItem.fillStyle;
			cxt.strokeStyle = stepItem.strokeStyle;
			cxt.fill();
			cxt.stroke();
		};

		effectDM.prototype.text = function text(stepItem, cxt, Math, rotUnit) {
			var fstyle = stepItem.fontStyle || "normal",
			    fweight = stepItem.fontWeight || "normal",
			    fsize = stepItem.fontSize || "24px",
			    ffamily = stepItem.fontFamily || "微软雅黑",
			    text = stepItem.text || "";

			cxt.font = fstyle + " " + fweight + " " + fsize + " " + ffamily;
			var _ref28 = [stepItem.x, stepItem.y, cxt.measureText(text).width, parseInt(fsize)],
			    x = _ref28[0],
			    y = _ref28[1],
			    w = _ref28[2],
			    h = _ref28[3];
			var _ref29 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
			    tx = _ref29[0],
			    ty = _ref29[1];

			cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x + w / 2, y + h / 2);
			cxt.rotate(stepItem.rotate * Math.PI / 180);
			cxt.globalAlpha = stepItem.opacity;
			cxt.fillStyle = stepItem.fillStyle;
			cxt.strokeStyle = stepItem.strokeStyle;
			cxt.fillText(text, -w / 2, -h / 2);
			cxt.strokeText(text, -w / 2, -h / 2);
		};

		effectDM.prototype.polygon = function polygon(stepItem, cxt, Math, rotUnit) {
			var points = stepItem.points;
			var _ref30 = [stepItem.x, stepItem.y, stepItem.firstPoint],
			    x = _ref30[0],
			    y = _ref30[1],
			    firstPoint = _ref30[2];
			var _ref31 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
			    tx = _ref31[0],
			    ty = _ref31[1];


			cxt.beginPath();
			cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x, y);
			cxt.rotate(stepItem.rotate * Math.PI / 180);
			cxt.globalAlpha = stepItem.opacity;
			cxt.fillStyle = stepItem.fillStyle;
			cxt.strokeStyle = stepItem.strokeStyle;

			cxt.moveTo(firstPoint.x - x, firstPoint.y - y);

			var _ref32 = [0],
			    i = _ref32[0],
			    point = _ref32[1];


			for (; point = points[i++];) {
				cxt.lineTo(point.x - x, point.y - y);
			}
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
		};

		effectDM.prototype.circle = function circle(stepItem, cxt, Math, rotUnit) {
			var _ref33 = [stepItem.x, stepItem.y, stepItem.radius],
			    x = _ref33[0],
			    y = _ref33[1],
			    r = _ref33[2];
			var _ref34 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
			    tx = _ref34[0],
			    ty = _ref34[1];

			cxt.beginPath();
			cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x + r, y + r);
			cxt.rotate(stepItem.rotate * Math.PI / 180);
			cxt.globalAlpha = stepItem.opacity;
			cxt.fillStyle = stepItem.fillStyle;
			cxt.strokeStyle = stepItem.strokeStyle;
			cxt.arc(0, 0, r, 0, Math.PI * 2, false);
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
		};

		//回收已经完成的弹幕


		effectDM.prototype.recovery = function recovery(item, stepItem) {
			if (stepItem.pastTime >= stepItem.duration) {
				item.currentIndex++;
				stepItem.pastTime = 0;
			}

			if (!item.steps[item.currentIndex]) {
				item.hide = true;
				item.currentIndex = 0;
			}
		};

		//运动时间曲线


		effectDM.prototype.Tween = function Tween(type) {

			var trail = {

				linear: function linear(t, b, c, d) {
					return c * t / d + b;
				},

				easeIn: function easeIn(t, b, c, d) {
					return c * (t /= d) * t + b;
				},

				easeOut: function easeOut(t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				},

				easeInOut: function easeInOut(t, b, c, d) {
					if ((t /= d / 2) < 1) return c / 2 * t * t + b;
					return -c / 2 * (--t * (t - 2) - 1) + b;
				}

			};

			for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				data[_key - 1] = arguments[_key];
			}

			return !!trail[type] && trail[type].apply(trail, data);
		};

		return effectDM;
	}();

	//main


	var DMer = function () {
		//初始化
		function DMer(wrap) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, DMer);

			if (!wrap) {
				throw new Error("没有设置正确的wrapper");
			}

			//datas
			this.wrapper = wrap;
			this.width = wrap.clientWidth;
			this.height = wrap.clientHeight;
			this.canvas = document.createElement("canvas");
			this.canvas2 = document.createElement("canvas");

			this.normal = new normalDM(this.canvas, opts);
			this.effect = new effectDM(this.canvas2, opts);

			this.name = opts.name || "";
			this.fps = 0;

			//status
			this.drawing = opts.auto || false;
			this.startTime = new Date().getTime();

			//fn
			this[init]();
			this[loop]();
			if (opts.enableEvent) this.initEvent(opts);
		}

		DMer.prototype[init] = function () {
			this.canvas.style.cssText = "position:absolute;z-index:100;top:0px;left:0px;";
			this.canvas2.style.cssText = "position:absolute;z-index:101;top:0px;left:0px;";
			this.setSize();
			this.wrapper.appendChild(this.canvas);
			this.wrapper.appendChild(this.canvas2);
		};

		//loop


		DMer.prototype[loop] = function () {
			var normal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.normal;

			var _this = this;

			var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.effect;
			var prev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.startTime;


			var now = new Date().getTime();

			if (!this.drawing) {
				normal.clearRect();
				effect.clearRect();
				return false;
			} else {
				var _ref35 = [this.width, this.height, now - prev],
				    w = _ref35[0],
				    h = _ref35[1],
				    time = _ref35[2];

				this.fps = 1000 / time >> 0;
				normal.update(w, h, time);
				effect.update(w, h, time);
			}

			requestAnimationFrame(function () {
				_this[loop](normal, effect, now);
			});
		};

		DMer.prototype.initEvent = function initEvent(opts) {
			var _ref36 = [this.canvas2, this.normal, false],
			    el = _ref36[0],
			    normal = _ref36[1],
			    searching = _ref36[2];


			el.onmouseup = function (e) {
				e = e || event;

				if (searching) return false;
				searching = true;

				if (e.button == 2) {
					var _ref37 = [e.target.getBoundingClientRect(), ""],
					    pos = _ref37[0],
					    result = _ref37[1];
					var _ref38 = [e.clientX - pos.left, e.clientY - pos.top, 0, normal.save],
					    x = _ref38[0],
					    y = _ref38[1],
					    i = _ref38[2],
					    items = _ref38[3],
					    item = _ref38[4];

					for (; item = items[i++];) {
						var _ref39 = [item.x, item.y, item.width + 10, item.height],
						    ix = _ref39[0],
						    iy = _ref39[1],
						    w = _ref39[2],
						    h = _ref39[3];


						if (x < ix || x > ix + w || y < iy - h / 2 || y > iy + h / 2 || item.hide || item.recovery) continue;

						result = item;
						break;
					}

					var callback = opts.callback || function () {};

					callback(result);

					searching = false;
				}
			};

			el.oncontextmenu = function (e) {
				e = e || event;
				e.preventDefault();
			};
		};

		// API 

		//添加数据


		DMer.prototype.inputData = function inputData() {
			var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object" || !obj.type) {
				return false;
			}
			this.normal.add(obj);
		};

		//添加高级弹幕


		DMer.prototype.inputEffect = function inputEffect() {
			var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object" || !obj.type || !obj.steps) {
				return false;
			}

			this.effect.add(obj);
		};

		//清除所有弹幕


		DMer.prototype.clear = function clear() {
			this.normal.clear();
			this.effect.clear();
		};

		//重置


		DMer.prototype.reset = function reset(i, j) {
			this.normal.reset(i);
			this.effect.reset(j);
		};

		//暂停


		DMer.prototype.pause = function pause() {
			this.normal.pause();
			this.effect.pause();
		};

		//继续


		DMer.prototype.run = function run() {
			this.normal.run();
			this.effect.run();
		};

		//添加过滤


		DMer.prototype.addFilter = function addFilter(key, val) {
			this.normal.addFilter(key, val);
		};

		//移除过滤


		DMer.prototype.removeFilter = function removeFilter(key, val) {
			this.normal.removeFilter(key, val);
		};

		//禁用高级弹幕


		DMer.prototype.disableEffect = function disableEffect() {
			this.effect.disableEffect();
		};

		//启用高级弹幕


		DMer.prototype.enableEffect = function enableEffect() {
			this.effect.enableEffect();
		};

		//设置宽高


		DMer.prototype.setSize = function setSize() {
			var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.width;
			var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.height;


			if (!Number.isInteger(w) || w < 0 || !Number.isInteger(h) || h < 0) return false;

			this.width = w;
			this.height = h;
			this.canvas.width = w;
			this.canvas.height = h;
			this.canvas2.width = w;
			this.canvas2.height = h;

			this.normal.getSize();
			this.effect.getSize();
		};

		//获取宽高


		DMer.prototype.getSize = function getSize() {
			return {
				width: this.width,
				height: this.height
			};
		};

		//改变全局样式


		DMer.prototype.changeStyle = function changeStyle() {
			var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.normal.changeStyle(opts);
		};

		//添加渐变


		DMer.prototype.addGradient = function addGradient(type, opts) {
			this.normal.addGradient(type, opts);
		};

		//启用


		DMer.prototype.start = function start() {
			if (this.drawing) return false;

			this.drawing = true;
			this[loop]();
		};

		//停止


		DMer.prototype.stop = function stop() {
			this.drawing = false;
		};

		//fps


		DMer.prototype.getFPS = function getFPS() {
			return this.fps;
		};

		return DMer;
	}();

	var DanMuer = function DanMuer(wrapper, opts) {
		var proxyDMer = new Proxy(new DMer(wrapper, opts), {
			get: function get(target, key) {
				if (typeof target[key] == "function") return target[key].bind(target);
				return target[key];
			}
		});

		var DM = proxyDMer;

		return {
			pause: DM.pause, //暂停
			run: DM.run, //继续
			start: DM.start, //运行
			stop: DM.stop, //停止
			changeStyle: DM.changeStyle, //修改普通弹幕全局样式
			addGradient: DM.addGradient, //普通弹幕渐变
			setSize: DM.setSize, //修改宽高
			inputData: DM.inputData, //向普通弹幕插入数据
			inputEffect: DM.inputEffect, //向高级弹幕插入数据
			clear: DM.clear, //清除所有弹幕
			reset: DM.reset, //重新从某个弹幕开始
			addFilter: DM.addFilter, //添加过滤
			removeFilter: DM.removeFilter, //删除过滤
			disableEffect: DM.disableEffect, //不启用高级弹幕
			enableEffect: DM.enableEffect, //启用高级弹幕
			getSize: DM.getSize, //获取宽高,
			getFPS: DM.getFPS //获取fps
		};
	};

	if (typeof module != 'undefined' && module.exports) {
		module.exports = DanMuer;
	} else if (typeof define == "function" && define.amd) {
		define(function () {
			return DanMuer;
		});
	} else {
		window.DanMuer = DanMuer;
	}
})(window, Math);