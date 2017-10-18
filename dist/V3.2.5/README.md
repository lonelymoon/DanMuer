# DanMuer V3.2.5
本插件是一个弹幕发生器，利用HTML5 canvas + ES6来实现普通弹幕和高级弹幕发送。目前版本将从3.0.0开始。

相较于前两版来说，第三版性能更好，而且实现了播放器模块和弹幕模块的解耦，也就是说相比第二版，第三版 可以适用但不限于播放器，可用性更高，而且实现了高级弹幕的发送，未来将慢慢补齐更多的功能和代码重构，希望大家遇到什么BUG或者是某些合理的需求，请在issues中反馈，或者请将反馈提交到本邮箱：454236029@qq.com || z454236029@gmail.com

# 兼容性
所有现代浏览器,IE10+ ~~（IE除外），后面将会考虑写个IE用的兼容ES5版本~~

# DEMO测试方法

所有已发布功能项可以通过下拉框进行切换，目前包括“添加普通弹幕”，“添加高级弹幕”，“过滤”，“添加全局样式”，“控制项”

演示地址： [demo](http://lonelymoon.linux2.jiuhost.com/DMv3/)

1. 添加普通弹幕和添加高级弹幕都只是添加数据而已，不会运行插件，你需要跳到“控制项”点击启动，然后等弹幕出来即可
2. 高级弹幕的动画是属于排队动画，你要先将修改后的数据“保存为第n步”（n至少为1）后点击确定添加才可以
3. 过滤功能的话，最简单的“type”：“slide”，表示过滤所有滚动型的弹幕，或者“text”：“string”表示过滤包含string的所有弹幕
4. 你可以先启动然后添加弹幕，也是一样的，操作顺序没太高要求

# 调用方法
调用接口非常的简单，通过调用一个函数接口。本插件还集成了requireJS和nodeJS的接口，如果需要也可以直接当成一个模块引用。

```
var DMer = DanMuer( wrapper, options);
```
wrapper（必选 HTMLnode）：容器元素

options（可选 Object）：配置选项

options提供的参数：

1. auto ： ( Boolean ) 是否自动运行，默认false
2. callback ：( Function ) 鼠标右键触发后的回调函数，将返回一个被捕获的字幕对象
3. direction : ( String ) 弹幕显示的方向，默认为从右到左,拥有两个值,"ltor"左到右和"rtol"右到左
4. duration : ( Number ) 滚动型弹幕的持续时间(ms)，默认为 9000
5. enableEvent ：( Boolean ) 是否开启鼠标右键的点击事件，默认false
6. enable ：( Boolean ) 是否启用高级弹幕，默认true
7. leftTime ：( Number ) 静止型弹幕默认的生存时间(ms)，默认为 2000
8. fontSize ：( String ) 普通弹幕全局的字体大小，默认为 “26px”
9. fontWeight ：( String ) 普通弹幕全局的字体粗细，默认为 “normal”
10. fontFamily ：( String ) 普通弹幕全局的字体，默认为 “微软雅黑”
11. fontStyle ：( String ) 普通弹幕全局的文本样式，默认为 “normal”
12. fontColor ：( String ) 普通弹幕全局的文本填充颜色，默认为 “#FFFFFF”
13. opacity ：( Number ) 透明度，默认为 1
14. space ：( Number ) 普通弹幕之间的行距，默认为 10
15. type : ( String ) 普通弹幕调用Tween类时选择的曲线类型，默认是“quad”（二次方），目前还有"cubic","quart","quint"三种
16. timing : ( String ) Tween时间曲线函数类型，默认是"linear",还有"easeIn","easeOut","easeInOut"

后续如果新接口也将会在这里陆续更新。

# 数据格式

由于高级弹幕和普通弹幕是在两个不同的canvas绘制的，所以全文提到的“全局”仅仅适用在普通弹幕上

### 1. 普通弹幕


```
{
    "text" : "string", //必须，文本内容
    "type" : "string", //必须，弹幕类型,包括（"slide","top","bottom"）三种类型的弹幕，其中后两种为静止型弹幕
    "change" : boolean, //可选，表示本条弹幕有不同于全局样式的设定，这里做了限制，只有颜色和fontsize可以修改
    "fontSize" :"string", //可选，必须change为true的时候才可以使用
    "color" : "string" //可选，必须change为true的时候才可以使用
}

```
### 2. 高级弹幕


```
{
    "type" : "", //必须，高级弹幕的类型，目前有四种类型（"text","rect","polygon","circle"）
    "currentIndex" : 0,//必须，表示目前弹幕正在运行的步骤，默认为0就行，不用更改此值
    "hide" : false,//必须，默认为false，不用更改此值，表示是否显示该弹幕
    "steps" : [] //必须，表示该弹幕一共有几个步骤，用于排队动画的实现，与currentIndex配合使用
}
```
高级弹幕中steps里面的值比较复杂，根据type的不同，参数也会有所差异，下面我们先介绍共用的参数

```
{
    //以下参数除颜色和type外都为Number类型，不带单位
    duration : 3000, //生存时间ms
    fillStyle : "#66ccff", //填充颜色
    strokeStyle : "#cccccc", //描边颜色
    pastTime : 0, //不用设置，默认为0
    type : "quad", //Tween时间曲线的类型,默认为"quad(二次方)",目前还有"cubic","quart","quint"三种
    //translate
    translate : {
        startX : 0, //起点x
        startY : 0, //起点y
        endX : 0, //终点x
        endY : 0, //终点y
        timing : "linear" //动画时间曲线，默认为linear，还有“easeIn”,“easeOut”,“easeInOut”
    },
    //scale
    scale : {
        startX : 1, //起始x轴缩放倍数
        startY : 1, //起始y轴缩放倍数
        endX : 1, //终点x轴缩放倍数
        endY : 1, //终点y轴缩放倍数
        timing : "linear"
    },
	//rotate
    rotate : {
        start : 0, //起始旋转角度
        end : 0, //终点旋转角度
        timing : "linear"
    },
    //skew
    skew : {
        startX : 0, //起始x斜切角度
        startY : 0, //起始y斜切角度
        endX : 0, //终点x斜切角度
        endY : 0, //终点y斜切角度
        timing : "linear"
    },
    //opacity
    opacity : {
        start : 1, //初始透明度
        end : 1, //终点透明度
        timing : "linear"
    }
}
```
下面是文本类型的特有属性：

```
{
    fontStyle:"",
    fontWeight:"",
    fontSize:"",
    fontFamily:"",
    text:""
}
```
下面是方形的特有属性：

```
{
    width : 100,
    height : 100
}
```
下面是多边形的特有属性：

```
//多边形比较特殊，相比上面的形状来说，多边形不用填写startX，startY等，计算是通过points和distX
，distY的值进行计算的
{
    points : [{x:0,y:0},{x:0,y:0}],
    distX : 0,
    distY : 0
}
```
下面是圆形的特有属性：

```
//角度什么的暂时没写，画出来的都是整圆
{
    radius : 0
}
```

下面是图片弹幕的特有属性：

```
{
    img : img Element,
    width : 0, //在canvas中显示的宽度
    height : 0, //在canvas中显示的高度
}
```


# API

插件只选择性的暴露了一些接口，如果想了解更多，请去翻阅源码

1. start() ：启动插件，与上面options中的auto对应，如果初始化没有设置auto，可以通过start来启动
2. stop() ：停止运行，与start()对应的功能相反方法
3. pause() ：暂停运行，此时canvas上弹幕并不会被清除
4. run() ：继续运行，与上面pause()对应
5. changeStyle(options) ：修改全局文本样式，包括字体大小，样式，family，weight，color和opacity，与options的相关属性对应，参数类型为Object
6. addGradient(type,options) ：将全局颜色变为渐变颜色；type包括linear和radius两种，options为一个对象，对象里包含（startX，startY，endX，endY，colorStops）五个参数，前两个参数表示渐变的起点坐标，接下来的两个参数表示渐变的终点坐标，最后一个参数表示colorStop，为一个数组，元素格式为
```
{
	"point" : 0, //断点
	"color" : this.globalColor //对应颜色
}
```
7. setSize(width,height) ：更改canvas大小，width和height都是Number类型
8. getSize() ：获取当前的canvas大小，返回一个对象

9. inputData(obj) ：添加一个普通弹幕
10. inputEffect(obj) ：添加一个高级弹幕
11. clear() ：删除所有已添加的弹幕
12. reset(index) ：重新从index开始发送弹幕
13. addFilter(type,value) ：添加一条过滤规则
14. removeFilter(tyoe,value) : 删除一条过滤规则
15. disableEffect() ：禁用高级弹幕
16. enableEffect() ：启用高级弹幕
17. getFPS() ：获取FPS
18. timing(timing,type) : 改变普通弹幕的动画时间曲线，timing和type的值请参看上面的timing和type
19. direction(direc) : 改变普通弹幕的方向，目前有“ltor”和“rtol”，默认为“rtol”（从右往左）

# 其他一些小技巧

1. 在播放视频时，如果需要使用该插件，而且需要在对应的时间显示对应的弹幕，因为第三版相对第二版来讲已经将判别功能移到了插件外部，需要用户自己判断并添加，所以最好先对弹幕集合进行排序，下面给个完整的操作示例：

```
//首先随机生成一个弹幕集合，弹幕显示的时间随机生成,假设视频总时长为230秒
var save = [];
for( var i = 0; i < 10000; i++ ){
    save.push({
        "text" : text,
    	"time" : (Math.random() * 228 + 2 ) >> 0, //这里是随机生成的时间
    	"type" : types[idx]
    });
}

//对于需要频繁操作的对象来说，为了保证性能的稳定我们需要尽可能的优化操作，排序也是为了后面的优化做准备
save.sort(function(a,b){
    return a.time - b.time; //按时间从小到大排列
});

//接下来是当视频播放进行中的时候进行遍历
var start = 0, //循环的初始下标，简化循环用
    doing = false; //保证功能的执行顺序
video.ontimeupdate = function(e){
    var time = this.currentTime >> 0;

    if(doing) return false; //保证一次调用只运行一次循环
    doing = true;
    for( var i = start,obj; obj = save[i++]; ){
    	if( obj.time == time ){ //当处于相同时间点的时候
    		DMer.inputData(obj);//插入数据
    		start = i; //更改下标
    	}
    	if( obj.time > time ){
    		break; //这里就体现上面排序的好处了，因为我们已经可以确定后面弹幕的时间都会比现在的时间大，所以可以直接略过，节省资源
    	}
    }
    doing = false;  
};
```
对于直播类型的来说就更简单，在取到数据后直接插入数据即可，相比上面这种，直播类型的更容易操作。

2. 由于插件很多职责外的功能都分离出去了，所以使用起来相对比较自由，因为本插件也不仅仅只限于视频播放，只要有容器可以放置即可。

3. 对于插件中某些接口的调用，如渐变，在移动设备上是非常吃性能的，所以在使用的时候请尽量审慎。

4. 对于高级弹幕，由于与普通弹幕是分处于两个不同的canvas，所以针对普通弹幕的操作是不会影响到高级弹幕的。当然，分开后做针对操作也更容易点。

5. 至于高级弹幕的自动跟随实现起来也比较容易，直接将上一步的结果填写到对应的下一步的起始位置即可，如：

```
{
    //第一步
    startX : 0,
    endX : 100
}
//第二步
{
    startX : 100,
    endX : ???
}
//这样便可以实现跟随
```
# 最后的话

其实这东西写三版对我来说也是感触良多，从最开始的性能问题到耦合模块的分离，从es5语法到现在用的es6语法，感觉自己成长了许多。后续的版本将会陆续完善一些其他的功能或者会将目前缺失的部分功能补充完整，如果大家有什么问题和bug欢迎联系，如果觉得本插件对你有用欢迎给个星，谢谢。


