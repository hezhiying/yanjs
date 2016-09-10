
    var reqjs = {};
    reqjs.history = {};
    reqjs.config = {
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

    /**
     * 依赖加载方法
     * @param files array|json|string  文件别名或URL(如果配制文件没有对应的文件则当成全路径URL加载)
     * 1:requirejs('jquery',function(){}); 或 requirejs('jquery|jquery-plugin',function(){}); | 意思为这几个文件要按照顺序加载下雷同
     * 2:requirejs(['vue','jquery','iscroll-zoom|photoClip'],function(){});
     * 3:requirejs({vue:function(){},jquery:function(){},'iscroll-zoom|photoClip':function(){}});
     * @param callback object    回调方法 在文件列表最后一个加完成时才进行回调,所以把要先加载插件写在前面
     */
    function requirejs( files, callback ) {
        //剩余加载数量
        var load_count = 0;
        //是否开启最后加载, 开启后要等所有文件加载完成,才触发回调,必免依赖出错
        var last_load = false;
        /**
         * 执行回调
         * @param callback
         */
        var loadCallback = function ( callback ) {
            //如果开启最后加载, 文件未加载完不触发回调
            if(last_load && load_count){
                return;
            }
            //如果回调是一个函数直触发,并且延时0秒,避免顺序错误
            if(typeof callback == "function"){
                setTimeout(function(){
                    callback.call();
                },0);
            }
        };

        /**
         * 动态加载js文件
         * @param file string
         * string  单个文件  或是|分隔的多个文件,|分隔的强制指点加载顺序,只加载完最后一个文件直回调
         * @param callback function
         */
        var loadjs = function (file, callback) {
            var url = typeof reqjs.config[file] == "string" ? reqjs.config[file] : file;

            //如果文件格式为|分隔,则按照顺序加载,只有前一个加载完成后再会加下个直到全部加载完成才会调用回调方法
            var file_list = file.split("|");
            if(file_list.length > 1){
                loadjs(file_list[0],function(){
                    file_list.splice(0,1);
                    loadjs(file_list.join("|"), callback);
                });
                return;
            }
            //已加载过,不重复加载 单页应用时
            if(reqjs.history[url] == true){
                load_count--;
                loadCallback(callback,file);
            }else{
                // console.log(['url',url]);
                //动态加载js文件,开启缓存
                jQuery.ajax({url: url, dataType: "script", cache: true })
                    .done(function() {
                        load_count--;
                        // console.log(['url',url]);
                        reqjs.history[url] = true;
                        loadCallback(callback,file);
                    });
            }
        };

        //判断文件格式支持string | array | json
        if(typeof files == "string"){
            load_count = 1;
            loadjs(files, callback);
        }else if(files instanceof Array){
            last_load = true;
            load_count = files.length;
            $.each(files, function (i, file) {
                loadjs(file, callback);
            });
        }else if(files instanceof Object){
            $.each(files, function (file, callback) {
                load_count =1;
                loadjs(file, callback);
            });
        }

    }