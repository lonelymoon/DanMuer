"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, Math, undefined) {

	var loop = Symbol("loop");
	var init = Symbol("init"); //初始化
	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	//es6

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
			this.filters = [];

			this.leftTime = opts.leftTime || 2000; //头部、底部静止型弹幕的是显示时长
			this.space = opts.space || 10; //弹幕的行距
			this.unitHeight = 0; //弹幕的高度
			this.rowNum = 0; //通道行数


			this.startIndex = 0; //循环时的初始下标
			this.looped = false; //是否已经经历过一次循环

			this.fps = document.querySelector(".fps");

			this.changeStyle(opts);
		}

		//添加弹幕


		_createClass(normalDM, [{
			key: "add",
			value: function add(obj) {
				if (!obj) return;

				//如果已经可以计算文本宽度，则直接进行计算
				if (this.looped) this.countWidth([obj]);

				this.filter(obj);

				this.save.push(obj);
			}

			//清除所有弹幕

		}, {
			key: "clear",
			value: function clear() {
				this.save = [];
				this.startIndex = 0;
			}

			//暂停

		}, {
			key: "pause",
			value: function pause() {
				this.paused = true;
			}

			//播放

		}, {
			key: "run",
			value: function run() {
				this.paused = false;
			}

			//添加过滤

		}, {
			key: "addFilter",
			value: function addFilter(key, val) {
				if (!key || !val) return false;

				this.filters.push({
					"key": key,
					"value": val
				});
			}

			//过滤

		}, {
			key: "filter",
			value: function filter(obj) {
				var filters = this.filters;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var res = _step.value;

						if (obj[res.key].includes(res.value)) {
							obj.hide = true;
							return false;
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			//清屏

		}, {
			key: "clearRect",
			value: function clearRect() {
				this.cxt.clearRect(0, 0, this.width, this.height);
			}

			//合并字体

		}, {
			key: "font",
			value: function font() {
				this.globalFont = this.globalStyle + " " + this.globalWeight + " " + this.globalSize + " " + this.globalFamily;
			}

			//改变全局样式

		}, {
			key: "changeStyle",
			value: function changeStyle() {
				var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


				//文本属性保存
				this.globalSize = opts.fontSize || this.globalSize || "24px"; //字体大小
				this.globalFamily = opts.fontFamily || this.globalFamily || "微软雅黑"; //字体
				this.globalStyle = opts.fontStyle || this.globalStyle || "normal"; //字体样式
				this.globalWeight = opts.fontWeight || this.globalWeight || "normal"; //字体粗细
				this.globalColor = opts.fontColor || this.globalColor || "#66ccff"; //字体颜色

				//表示进行过一次全局样式变化
				this.globalChanged = true;
			}

			//启用全局样式

		}, {
			key: "initStyle",
			value: function initStyle(cxt) {

				this.globalChanged = false;

				//合并font属性
				this.font();

				//更新全局样式
				cxt.font = this.globalFont;
				cxt.textBaseline = "middle";
				cxt.fillStyle = this.globalColor;
			}

			//循环

		}, {
			key: "update",
			value: function update(w, h, time) {
				this.fps.innerHTML = 1000 / time >> 0;

				var _ref = [this.save, this.cxt],
				    items = _ref[0],
				    cxt = _ref[1];


				this.globalChanged && this.initStyle(cxt); //初始化全局样式

				!this.looped && this.countWidth(items); //计算文本宽度以及初始化位置（只执行一次）

				if (this.paused) return false; //暂停

				this.refresh(items); //更新初始下标startIndex

				var _ref2 = [this.startIndex],
				    i = _ref2[0],
				    item = _ref2[1];


				cxt.clearRect(0, 0, w, h);

				for (; item = items[i++];) {
					this.step(item, time);
					this.draw(item, cxt);
					this.recovery(item, w);
				}
			}

			//重置弹幕

		}, {
			key: "reset",
			value: function reset() {
				var resetIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


				//resetIndex表示想要开始重置的弹幕的下标，系统想重置该值以后的弹幕
				var _ref3 = [this.save, this.width, this.leftTime, resetIndex],
				    items = _ref3[0],
				    w = _ref3[1],
				    leftTime = _ref3[2],
				    i = _ref3[3],
				    item = _ref3[4];


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
			}

			//更新canvas size

		}, {
			key: "getSize",
			value: function getSize() {

				this.width = this.canvas.width;
				this.height = this.canvas.height;

				this.speedScale = this.width / 600;

				this.deleteRow();
				this.countRows();

				this.globalChanged = true;
			}

			//消除item的row

		}, {
			key: "deleteRow",
			value: function deleteRow() {
				var _ref4 = [this.save, 0],
				    items = _ref4[0],
				    i = _ref4[1],
				    item = _ref4[2];

				for (; item = items[i++];) {
					item.row = null;
				}
			}

			//生成通道行

		}, {
			key: "countRows",
			value: function countRows() {

				//保存临时变量
				var unitHeight = parseInt(this.globalSize) + this.space;
				var _ref5 = [(this.height - 20) / unitHeight >> 0, this.rows],
				    rowNum = _ref5[0],
				    rows = _ref5[1];

				//重置通道

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Object.keys(rows)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var key = _step2.value;

						rows[key] = [];
					}

					//重新生成通道
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				for (var i = 0; i < rowNum; i++) {
					var obj = {
						y: unitHeight * i + 20
					};
					rows.slide.push(obj);

					i >= rowNum / 2 ? rows.bottom.push(obj) : rows.top.push(obj);
				}

				//更新实例属性
				this.unitHeight = unitHeight;
				this.rowNum = rowNum;
			}

			//获取通道

		}, {
			key: "getRow",
			value: function getRow(item) {

				//如果该弹幕正在显示中，则返回其现有通道
				if (item.row) return item.row;

				//获取新通道
				var _ref6 = [this.rows, item.type],
				    rows = _ref6[0],
				    type = _ref6[1];

				var row = type != "bottom" ? rows[type].shift() : rows[type].pop();
				//生成临时通道
				var tempRow = this["getRow_" + type]();

				//返回分配的通道
				return row || tempRow;
			}
		}, {
			key: "getRow_bottom",
			value: function getRow_bottom() {
				return {
					y: 20 + this.unitHeight * (Math.random() * this.rowNum / 2 + this.rowNum / 2 << 0),
					speedChange: false,
					tempItem: true
				};
			}
		}, {
			key: "getRow_slide",
			value: function getRow_slide() {
				return {
					y: 20 + this.unitHeight * (Math.random() * this.rowNum << 0),
					speedChange: true,
					tempItem: true
				};
			}
		}, {
			key: "getRow_top",
			value: function getRow_top() {
				return {
					y: 20 + this.unitHeight * (Math.random() * this.rowNum / 2 << 0),
					speedChange: false,
					tempItem: true
				};
			}

			//计算宽度

		}, {
			key: "countWidth",
			value: function countWidth(items) {
				var cxt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.cxt;


				this.looped = true;

				var _ref7 = [this.width, 0],
				    cw = _ref7[0],
				    i = _ref7[1],
				    item = _ref7[2];


				for (; item = items[i++];) {
					var w = cxt.measureText(item.text).width >> 0;
					item.width = w;
					//更新初始 x
					item.x = cw + (Math.random() * 30 >> 0);
					item.speed = 2;
					if (item.type != "slide") {
						item.x = (cw - w) / 2;
						item.leftTime = this.leftTime;
						item.speed = 0;
					}
				}
			}

			//更新每个弹幕的单独样式

		}, {
			key: "updateStyle",
			value: function updateStyle(item, cxt) {
				cxt.font = this.globalStyle + " " + this.globalWeight + " " + item.globalSize + " " + this.globalFamily;
				cxt.fillStyle = item.color || this.globalColor;
			}

			//计算

		}, {
			key: "step",
			value: function step(item, time) {

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
			}

			//绘制

		}, {
			key: "draw",
			value: function draw(item, cxt) {
				//如果已经显示完成，则不显示
				if (item.recovery || item.hide) return false;

				cxt.save();
				if (item.change) {
					this.updateStyle(item, cxt);
				}
				cxt.fillText(item.text, item.x, item.y);
				cxt.restore();
			}

			//回收弹幕和通道

		}, {
			key: "recovery",
			value: function recovery(item, w) {

				if (item.type == "slide") {
					item.recovery = this.recoverySlide(item, w);
					return false;
				}

				item.recovery = this.recoveryStatic(item);
			}
		}, {
			key: "recoverySlide",
			value: function recoverySlide(item, w) {

				//回收slide类型
				var _ref8 = [item.x, item.width],
				    x = _ref8[0],
				    iw = _ref8[1];


				if (!item.rowRid && x + iw < w && !item.row.tempItem) {
					this.rows[item.type].unshift(item.row);
					item.rowRid = true; //表明该行已被释放
				}

				if (x > -iw) return false;

				return true;
			}
		}, {
			key: "recoveryStatic",
			value: function recoveryStatic(item) {
				if (item.leftTime > 0) return false;

				var type = item.type;

				if (!item.row.tempItem) {
					this.rows[type].unshift(item.row);
					item.row = null;
				}

				return true;
			}

			//更新下标

		}, {
			key: "refresh",
			value: function refresh(items) {
				var _ref9 = [this.startIndex,, this.rows],
				    i = _ref9[0],
				    item = _ref9[1],
				    rows = _ref9[2];
				//通道排序

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Object.keys(rows)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var key = _step3.value;

						rows[key].sort(function (a, b) {
							return a.y - b.y;
						});
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				for (; item = items[i++];) {
					if (!item.recovery) return false;
					this.startIndex = i;
					item.row = null;
				}
			}
		}]);

		return normalDM;
	}();

	//特效弹幕


	var effectDM = function () {
		function effectDM(cv) {
			var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, effectDM);

			this.canvas = cv;
			this.cxt = cv.getContext("2d");
			this.enable = opts.enable || true;

			this.startIndex = 0;

			this.save = [];
		}

		//添加数据


		_createClass(effectDM, [{
			key: "add",
			value: function add(data) {
				if (!data || (typeof data === "undefined" ? "undefined" : _typeof(data)) != "object") return false;

				var _ref10 = [data.steps, 0],
				    steps = _ref10[0],
				    i = _ref10[1],
				    step = _ref10[2];


				for (; step = steps[i++];) {
					this.initStep(step); //初始化参数
				}

				this.save.push(data);
			}

			//清除数据

		}, {
			key: "clear",
			value: function clear() {
				this.save = [];
				this.startIndex = 0;
			}

			//重置弹幕

		}, {
			key: "reset",
			value: function reset(i) {
				var _ref11 = [this.save],
				    items = _ref11[0],
				    item = _ref11[1];

				for (; item = items[i++];) {
					item.hide = false;
				}
			}

			//暂停

		}, {
			key: "pause",
			value: function pause() {
				this.paused = true;
			}

			//继续

		}, {
			key: "run",
			value: function run() {
				this.paused = false;
			}

			//启用

		}, {
			key: "enableEffect",
			value: function enableEffect() {
				this.enable = true;
			}

			//停用

		}, {
			key: "disableEffect",
			value: function disableEffect() {
				this.enable = false;
			}

			//初始化参数

		}, {
			key: "initStep",
			value: function initStep(step) {
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
				step.duration = step.duration || 0;
				step.scaleDistX = step.scaleEndX - step.scaleStartX;
				step.scaleDistY = step.scaleEndY - step.scaleStartY;
				step.rotateDist = step.rotateEnd - step.rotateStart;
				//判断多边形
				step.distX = step.points ? step.distX || 0 : step.endX - step.startX;
				step.distY = step.points ? step.distY || 0 : step.endY - step.startY;
				step.skewDistX = step.skewEndX - step.skewStartX;
				step.skewDistY = step.skewEndY - step.skewStartY;
			}

			//更新canvas尺寸

		}, {
			key: "getSize",
			value: function getSize() {

				this.width = this.canvas.width;
				this.height = this.canvas.height;
			}

			//清除画布

		}, {
			key: "clearRect",
			value: function clearRect() {
				this.cxt.clearRect(0, 0, this.width, this.height);
			}

			//动画循环

		}, {
			key: "update",
			value: function update(w, h, time) {

				if (this.paused) //如果暂停，return
					return false;

				var _ref12 = [this.canvas, this.cxt],
				    canvas = _ref12[0],
				    cxt = _ref12[1];

				cxt.clearRect(0, 0, w, h);

				if (!this.enable) //如果不启用, return
					return false;

				var _ref13 = [this.startIndex, this.save],
				    i = _ref13[0],
				    items = _ref13[1],
				    item = _ref13[2];


				for (; item = items[i++];) {
					if (item.hide) continue;

					var steps = item.steps;
					var stepItem = steps[item.currentIndex];
					this.step(item, stepItem, time);
					this.draw(item, stepItem, cxt);
					this.recovery(item, stepItem);
				}
			}
		}, {
			key: "step",
			value: function step(item, stepItem, time) {

				stepItem.pastTime += time;

				var _ref14 = [stepItem.type || "linear", stepItem.pastTime, stepItem.duration],
				    type = _ref14[0],
				    past = _ref14[1],
				    duration = _ref14[2];

				//多边形特殊处理

				if (item.type == "polygon") this.stepCheckPolygon(stepItem, item);

				stepItem.x = this.Tween(type, past, stepItem.startX, stepItem.distX, duration);
				stepItem.y = this.Tween(type, past, stepItem.startY, stepItem.distY, duration);
				stepItem.scaleX = this.Tween(type, past, stepItem.scaleStartX, stepItem.scaleDistX, duration);
				stepItem.scaleY = this.Tween(type, past, stepItem.scaleStartY, stepItem.scaleDistY, duration);
				stepItem.rotate = this.Tween(type, past, stepItem.rotateStart, stepItem.rotateDist, duration);
				stepItem.skewX = this.Tween(type, past, stepItem.skewStartX, stepItem.skewDistX, duration);
				stepItem.skewY = this.Tween(type, past, stepItem.skewStartY, stepItem.skewDistY, duration);
			}
			//多边形特殊设置

		}, {
			key: "stepCheckPolygon",
			value: function stepCheckPolygon(stepItem, item) {
				var currentIndex = item.currentIndex;

				//初始化进行计算
				if (currentIndex == 0) {
					var tempX = 0,
					    tempY = 0,
					    points = stepItem.points.concat([]) || [],
					    len = 0;
					var _ref15 = [0],
					    i = _ref15[0],
					    point = _ref15[1];

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
			}
		}, {
			key: "draw",
			value: function draw(item, stepItem, cxt) {
				cxt.save();
				//根据type调用
				!!this[item.type] && this[item.type](stepItem, cxt, Math, Math.PI / 180);
				cxt.restore();
			}
		}, {
			key: "rect",
			value: function rect(stepItem, cxt, Math, rotUnit) {
				var _ref16 = [stepItem.x, stepItem.y, stepItem.width, stepItem.height],
				    x = _ref16[0],
				    y = _ref16[1],
				    w = _ref16[2],
				    h = _ref16[3];
				var _ref17 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
				    tx = _ref17[0],
				    ty = _ref17[1];

				cxt.beginPath();
				cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x + w / 2, y + h / 2);
				cxt.rotate(stepItem.rotate * Math.PI / 180);
				cxt.rect(-w / 2, -h / 2, w, h);
				cxt.closePath();
				cxt.fillStyle = stepItem.fillStyle;
				cxt.strokeStyle = stepItem.strokeStyle;
				cxt.fill();
				cxt.stroke();
			}
		}, {
			key: "text",
			value: function text(stepItem, cxt, Math, rotUnit) {
				var fstyle = stepItem.fontStyle || "normal",
				    fweight = stepItem.fontWeight || "normal",
				    fsize = stepItem.fontSize || "24px",
				    ffamily = stepItem.fontFamily || "微软雅黑",
				    text = stepItem.text || "";

				cxt.font = fstyle + " " + fweight + " " + fsize + " " + ffamily;
				var _ref18 = [stepItem.x, stepItem.y, cxt.measureText(text).width, parseInt(fsize)],
				    x = _ref18[0],
				    y = _ref18[1],
				    w = _ref18[2],
				    h = _ref18[3];
				var _ref19 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
				    tx = _ref19[0],
				    ty = _ref19[1];

				cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x + w / 2, y + h / 2);
				cxt.rotate(stepItem.rotate * Math.PI / 180);
				cxt.fillStyle = stepItem.fillStyle;
				cxt.strokeStyle = stepItem.strokeStyle;
				cxt.fillText(text, -w / 2, -h / 2);
				cxt.strokeText(text, -w / 2, -h / 2);
			}
		}, {
			key: "polygon",
			value: function polygon(stepItem, cxt, Math, rotUnit) {
				var points = stepItem.points;
				var _ref20 = [stepItem.x, stepItem.y, stepItem.firstPoint],
				    x = _ref20[0],
				    y = _ref20[1],
				    firstPoint = _ref20[2];
				var _ref21 = [Math.tan(stepItem.skewX * rotUnit), Math.tan(stepItem.skewY * rotUnit)],
				    tx = _ref21[0],
				    ty = _ref21[1];


				cxt.beginPath();
				cxt.transform(stepItem.scaleX, tx, ty, stepItem.scaleY, x, y);
				cxt.rotate(stepItem.rotate * Math.PI / 180);
				cxt.fillStyle = stepItem.fillStyle;
				cxt.strokeStyle = stepItem.strokeStyle;

				cxt.moveTo(firstPoint.x - x, firstPoint.y - y);

				var _ref22 = [0],
				    i = _ref22[0],
				    point = _ref22[1];


				for (; point = points[i++];) {
					cxt.lineTo(point.x - x, point.y - y);
				}
				cxt.closePath();
				cxt.fill();
				cxt.stroke();
			}

			//回收已经完成的弹幕

		}, {
			key: "recovery",
			value: function recovery(item, stepItem) {
				if (stepItem.pastTime >= stepItem.duration) {
					item.currentIndex++;
					stepItem.pastTime = 0;
				}

				if (!item.steps[item.currentIndex]) {
					item.hide = true;
					item.currentIndex = 0;
				}
			}

			//运动时间曲线

		}, {
			key: "Tween",
			value: function Tween(type) {

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
			}
		}]);

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

			//status
			this.drawing = opts.auto || false;
			this.startTime = new Date().getTime();

			//fn
			this[init]();
			this[loop]();
		}

		_createClass(DMer, [{
			key: init,
			value: function value() {
				this.canvas.style.cssText = "position:absolute;z-index:100;top:0px;left:0px;";
				this.canvas2.style.cssText = "position:absolute;z-index:101;top:0px;left:0px;";
				this.setSize();
				this.wrapper.appendChild(this.canvas);
				this.wrapper.appendChild(this.canvas2);
			}

			//loop

		}, {
			key: loop,
			value: function value() {
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
					var _ref23 = [this.width, this.height, now - prev],
					    w = _ref23[0],
					    h = _ref23[1],
					    time = _ref23[2];

					normal.update(w, h, time);
					effect.update(w, h, time);
				}

				requestAnimationFrame(function () {
					_this[loop](normal, effect, now);
				});
			}

			// API 

			//添加数据

		}, {
			key: "inputData",
			value: function inputData() {
				var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object" || !obj.type) {
					return false;
				}
				this.normal.add(obj);
			}

			//添加高级弹幕

		}, {
			key: "inputEffect",
			value: function inputEffect() {
				var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object" || !obj.type || !obj.steps) {
					return false;
				}

				this.effect.add(obj);
			}

			//清除所有弹幕

		}, {
			key: "clear",
			value: function clear() {
				this.normal.clear();
				this.effect.clear();
			}

			//重置

		}, {
			key: "reset",
			value: function reset(i) {
				this.normal.reset(i);
				this.effect.reset(i);
			}

			//暂停

		}, {
			key: "pause",
			value: function pause() {
				this.normal.pause();
				this.effect.pause();
			}

			//继续

		}, {
			key: "run",
			value: function run() {
				this.normal.run();
				this.effect.run();
			}

			//添加过滤

		}, {
			key: "addFilter",
			value: function addFilter(key, val) {
				this.normal.addFilter(key, val);
			}

			//禁用高级弹幕

		}, {
			key: "disableEffect",
			value: function disableEffect() {
				this.effect.disableEffect();
			}

			//启用高级弹幕

		}, {
			key: "enableEffect",
			value: function enableEffect() {
				this.effect.enableEffect();
			}

			//设置宽高

		}, {
			key: "setSize",
			value: function setSize() {
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
			}

			//获取宽高

		}, {
			key: "getSize",
			value: function getSize() {
				return {
					width: this.width,
					height: this.height
				};
			}

			//改变全局样式

		}, {
			key: "changeStyle",
			value: function changeStyle() {
				var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				this.normal.changeStyle(opts);
			}

			//启用

		}, {
			key: "start",
			value: function start() {
				if (this.drawing) return false;

				this.drawing = true;
				this[loop]();
			}

			//停止

		}, {
			key: "stop",
			value: function stop() {
				this.drawing = false;
			}
		}]);

		return DMer;
	}();

	var DMOutput = function DMOutput(wrapper, opts) {
		var DM = new DMer(wrapper, opts);

		return {
			start: DM.start.bind(DM),
			stop: DM.stop.bind(DM),
			changeStyle: DM.changeStyle.bind(DM),
			setSize: DM.setSize.bind(DM),
			inputData: DM.inputData.bind(DM),
			inputEffect: DM.inputEffect.bind(DM),
			clear: DM.clear.bind(DM),
			reset: DM.reset.bind(DM),
			pause: DM.pause.bind(DM),
			run: DM.run.bind(DM),
			addFilter: DM.addFilter.bind(DM),
			disableEffect: DM.disableEffect.bind(DM),
			enableEffect: DM.enableEffect.bind(DM),
			getSize: DM.getSize.bind(DM)
		};
	};

	if (typeof module != 'undefined' && module.exports) {
		module.exports = DMOutput;
	} else if (typeof define == "function" && define.amd) {
		define(function () {
			return DMOutput;
		});
	} else {
		window.DanMuer = DMOutput;
	}
})(window, Math);