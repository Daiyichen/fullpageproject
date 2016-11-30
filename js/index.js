/**
 * Created by daib on 2016/11/28.
 */
$(document).ready(function () {

    var downloadUrl = {
        android:"http://api.kfsq.cn/daidaixiong.apk",
        ios:"https://itunes.apple.com/us/app/dai-dai-xiong/id1176375629?mt=8"
    }
    var browser= {};
    //页面相关布局
    var layout={
        timer:null,
        isMobile:false,
        mobile_os:'',
        isWeixin:false,
        tmpSection:''
    };
    /*
    初始化section
     */
    layout.drawSection = function () {

        $('#fullpage').fullpage({
            isResponsive:true,
            sectionsColor : ['#6dc9ff', '#fff', '#444656'],
            slidesNavigation:true,//slide滑块的切换按钮
            verticalCentered: false, //这里如果不设置false, 会有bug,首屏页面第一次动画不显示，动态在slide模拟居中
            afterLoad: function(anchorLink, index){
                if(2 == index) {
                    //清除setInterval
                    clearInterval(layout.timer);
                    //重新计算
                    layout.timer = setInterval(function () {
                        $.fn.fullpage.moveSlideRight();
                    }, 4000);

                }
            }
        });
    }

    /*
    初始化页面
     */
    layout.init = function () {
        layout.getUserAgent();
        var w = $(window).width();
        //在不是手机的模式下，判断浏览器的分辨率
        if(!layout.isMobile && w < 768){
            layout.isMobile = true;
        }else{

        }

        if(layout.isMobile){
            //隐藏关于我们，显示第一屏内容
            if('' == layout.tmpSection){
                layout.tmpSection = $("#section3").clone();
                $("#section3").remove();
            }
            layout.drawMoibleScreen();
            layout.bindEvent();
        }else{
            layout.drawPCScreen();
            if($("#section3").length  < 1){
                $("#fullpage").append(layout.tmpSection);
                layout.tmpSection = '';
            }
           /* if("none" == $("#section3").css("display")){
                $("#section3").show();
            }*/
        }
    }

    /*
    判断手机、微信、及PC平台
     */
    layout.getUserAgent = function () {
       browser= {
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {         //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    isWeixin:u.toLowerCase().match(/MicroMessenger/i)=='micromessenger'
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if (browser.versions.iPhone)
        {
            //browser.versions.iPad||browser.versions.iPod   这里和产品定了pad不识别成手机
            //如果是ios系統，直接跳轉至appstore該應用首頁，傳遞参數为該應用在appstroe的id號
            layout.mobile_os="ios";
            layout.isMobile = true;
        }
        else if(browser.versions.android)
        {
            //window.location.href = androidURL;
            layout.mobile_os="android";
            layout.isMobile = true;
        }else if(browser.versions.isWeixin){
            layout.isWeixin = true;
        }else{
            layout.isMobile = false;
        }
    }

    /*
    手机页面的处理
     */
    layout.drawMoibleScreen = function () {
        $("#section1 .download").hide();

        //根据不同类型的手机，赋予不同的下载地址
        var downloadURL = browser.versions.ios ? downloadUrl.ios : downloadUrl.android;
        $("#download_mobile_btn").show();
        $("#download_mobile_btn a").attr("href", downloadURL);
    };
    /*
    PC页面的处理
     */
    layout.drawPCScreen = function () {
        $("#section1 .download").show();
        $("#section1 .downloadMoblie").hide();
    }

    /*
    * 显示微信里在浏览器打开的提示
    * */
    layout.showWeixinGuid = function () {
        $("#layer").show();
        $("#guide").show();
    }

    /*
     * 隐藏微信里在浏览器打开的提示
     * */
    layout.hideWeixinGuid = function () {
        $("#layer").hide();
        $("#guide").hide();
    }

    /*
     * 绑定事件
     * */
    layout.bindEvent = function () {

        //手机端'立即下载'的处理
        $("#download_mobile_btn").unbind("click").click(function(e){
            if(browser.versions.isWeixin){
                //提示跳转到浏览器进行下载
                layout.showWeixinGuid();
                return false;
            }else{
                layout.hideWeixinGuid();
                return true;
            }
        });
    }

    //调用
    layout.drawSection();
    layout.init();

    window.onresize = function () {
        layout.init();
    }


});
