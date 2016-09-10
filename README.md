# yanjs
一个超爽的依赖加载方法

最近用了一个sui.mobile 前端框架，不支持AMD之类的依赖加载规范，而且js文件必须放在最后，最坑爹的是这是单页应用（也可以普通链接但是没了好多效果），链接的其它文件的js必顺在首次页面中全部加载，像我们这样一个网站不知道得盗多少JS插件来用的人得写好长一排。。刚开始也想用requirejs seajs之类，折腾了好久，不是这里有毛病就是那里有毛病。七七八八的插件很难统一用这么高大上的依赖加载方法，除非你得很熟悉去修改那些不兼容的JS文件，刚开始也是走这条路，发现太难了，太难了，太难了，像我们这种随便用，自己也是随便写JS散人。。

最后决定自己动动手造一个轮子，目的很简单，就是在程序想要运行某个JS插件时可以动态的加载出JS文件。

#特点
1. 这里先讲下特点（自我感觉挺不错的）
2. 首先就是支持各种的加载方法支持：
3. URL，别名，数组，json对象
4. 不会重复加载，加载过的不会再加载
5. 可以强制顺序加载：如  a|b|c|  一定会按照a加完了再去加载b 这里不用使用同步模式，还是使用ajax的异步方法
6. 加载出来的都是全局，和你自己写script src=  是一个效果


#使用方法
###别名配制文件


```
	var reqjs = {};
	reqjs.history = {}; //这个是保存加载历史的，加载过的不会重复加载
    
    reqjs.config = {
    //修改这里
        'sm-city-picker':'/vendor/sui/sm-city-picker.js',
        'sm-store-picker':'/juhe/store-class.js',
        'zui-mobile-upload':'/assets/juhe/js/zui-mobile-upload.js',
        'cropper':'/vendor/jquery/plugins/crop/cropper.js',
        'vue':'/vendor/vue/vue.min.js',
        'iscroll-zoom':'/vendor/photo-clip/iscroll-zoom.js',
        'hammer':'/vendor/photo-clip/hammer.js',
        'lrz':'/vendor/photo-clip/lrz.all.bundle.js',
        'photoClip':'/vendor/photo-clip/PhotoClip.js',
    };
```

###情况1：依赖单一文件加载
```
yanjs('vue',function(){
  var vue = new Vue({
      el:"#app",
      data:{},
      methods:{}
  });
});

或：

yanjs('/js/vue/vue.min.js',function(){
  var vue = new Vue({
      el:"#app",
      data:{},
      methods:{}
  });
});

```

###情况2：js插件必须依赖另一个插件才能工作，而且加载顺序不能错。依赖单一文件加载
```
yanjs('vue|vue-comput',function(){
//这里面一定会是等到vue-comput加载完才会执行，而vue-comput一定也是在vue加载后面
  var vue = new Vue({
      el:"#app",
      data:{},
      methods:{}
  });
});

```


###其它应用场景1
```
yanjs(['a','b','c|d'],function(){
	//这里是你的Hello world
	//其中c|d是强制加载顺序的
});
```


###其它应用场景1
```
yanjs({
a:function(){},
b:function(){},
'c|d':function(){}
});
```


希望能帮到一些人。。

	-------2016-09-11 00:42
	------飞扬zine
