/**
 * Created by chengyezheng on 2018/10/12.
 */
var WeChat = function () {
//	var baseUrl = PublicConstant.baseUrl;
//  var wechatUrl = baseUrl+"wechat.action";
//  var weChatDataUrl =wechatUrl+"?operator=users";
//  var weChatTicketUrl=wechatUrl+"?operator=ticket";
//  var weChatCheckUrl = wechatUrl+"?operator=subscribe";
    var Interval;
    var SessionId;
    var baseUrl,wechatUrl,weChatDataUrl,weChatTicketUrl,weChatCheckUrl;
    var fnInit = function () {
        SessionId = $.cookie("xw_terminal_SessionId");
        baseUrl = $.cookie("xw_terminal_baseUrl");
        if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
        wechatUrl = baseUrl+"wechat.action";
        weChatDataUrl =wechatUrl+"?operator=users";
        weChatTicketUrl=wechatUrl+"?operator=ticket";
        weChatCheckUrl = wechatUrl+"?operator=subscribe";
        fnInitEvent();
        fnWeChatInfo();
    };
    var fnWeChatInfo = function () {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: weChatDataUrl+"&SessionId="+SessionId,
            success: function (param, textStatus, jqXHR) {
                if(textStatus==="success"){
                    $(".page-content").css("opacity","1");
                    if(param !=null && param !="null"){
                        if(param.code===0){
                            var data = param.data;
                            if(data ==null){
                            	data =[];
                            }
                            var map = {
	                                "OpenId": -1,
	                            };
	                            data.push(map);
	                            var lastSize= data.length - parseInt(data.length/3);
	                            var len = parseInt(data.length/3);
	                            var htmlJson = {"data":data,"len":len,"lastSize":lastSize};
	                            var htmlStr = doT.template($("#weChatTemplate").text());
	                            $("#weChat").html(htmlStr(htmlJson));
                            
                        }else if(param.code === 5){
	                    	window.location.href = "login.html";
	                    }
                    }else if(data.code === 5){
                    	window.location.href = "login.html";
                    }else{
                        $("#process_view").hide();
                    }
                }
            },
            error: function (xhr, textStatus, error) {
                CommonJS.fnMessageError(error);
            },
        });
        $.ajax(ajaxParam);
    };

    var setIntervalTime = function () {
        var time = setInterval(function () {
            getWeChatQr(time);
        },5000);
        Interval = time;
        return time;
    };
    var stopIntervalTime = function (time) {
        clearInterval(time);
    }
    
    //定时获取关注的用户信息
    var  getWeChatQr = function (time) {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: weChatCheckUrl+"&SessionId="+SessionId,
            dataType: 'json',
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    if(data.code ==0){
		                stopIntervalTime(time);
//		                fnWeChat("refresh");
		                 $("#weChatModal").modal("hide");
		                 CommonJS.fnMessageSuccess("微信用户添加成功...");
		                 fnWeChatInfo();
		            }else if(data.code ==1){
		            	$("#weChatModal").modal("hide");
		            	CommonJS.fnMessageError("微信用户已存在...");
		            	fnWeChatInfo();
		            }else if(data.code === 5){
                    	window.location.href = "login.html";
                    }
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

    };

    var timestampToTime = function (timestamp) {
        var date = new Date(timestamp * 1000),
            Y = date.getFullYear() + '-',
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() + ':',
            s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
	
	//获取微信二维码
	var fnWeChat1 = function(_refresh){
		 $("#errorImg").hide();
        var src = baseUrl+"wechat.action?operator=showqrcode"+"&SessionId="+SessionId;
        $("#weChatImg").html("<img src='"+src+"' style='width: 50%;'>");
        if(_refresh ==undefined){
            var timeInterval = setIntervalTime();
            setTimeout(function () {
                stopIntervalTime(timeInterval);
                $("#errorImg").show();
                $("#weChatImg").html("<div id='refreshImg' style='margin-top: 60px;'><i style='font-size: 50px;' class='icon icon-refresh'></i></div>");
            },7200);
        }
        
	};
	
    /*微信处理*/
    var fnWeChat = function (_refresh) {
        $("#errorImg").hide();
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: weChatTicketUrl+"&SessionId="+SessionId,
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    getWeChatImg(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

        function getWeChatImg(paramArray) {
            if(paramArray.code==0 || paramArray.code==1){
                var data = paramArray.data;
                var ticket = data.ticket;
                var expire_seconds = data.expire_seconds;
                var wxUser = data.user;
                if(wxUser !=null){
                    if(wxUser.nickname !=""){
                        $("#subscribeImg").show();
                        $("#errorImg").hide();
                        $("#okImg").hide();
                        $("#wxName").text(wxUser.nickname);
                        $("#wxCity").text(wxUser.city);
                        $("#wxTime").text(timestampToTime(wxUser.subscribe_time));
                        // $("#wxType").text(wxUser.qr_scene);
                    }else{
                        $("#okImg").show();
                        $("#errorImg").hide();
                        $("#subscribeImg").hide();
                    }
                }else{
                    $("#okImg").show();
                    $("#errorImg").hide();
                    $("#subscribeImg").hide();
                }

                var src = baseUrl+"wechat.action?operator=showqrcode"+"&SessionId="+SessionId+"&ticket="+ticket;
                $("#weChatImg").html("<img src='"+src+"' style='width: 50%;'>");
                if(_refresh ==undefined){
                    var timeInterval = setIntervalTime();
                    setTimeout(function () {
                        stopIntervalTime(timeInterval);
                        $("#errorImg").show();
                        $("#weChatImg").html("<div id='refreshImg' style='margin-top: 60px;'><i style='font-size: 50px;' class='icon icon-refresh'></i></div>");
                    },expire_seconds);
                }

            }else if(data.code === 5){
            	window.location.href = "login.html";
            }

        }


    };

    var fnAddWeChat = function () {
        $("#weChatModal").modal("show");
        fnWeChat();
    };
    
    var fnDelWeChat = function (openId) {
        layer.open({
            title: ["提示"],
            content: '<div style="text-align: center;min-height: 60px;">请确认是否取消关联微信？</div>'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                layer.closeAll();
                fnDelWeChat_operator(openId);
            }
        });

    }

    var fnDelWeChat_operator = function (openId) {
        console.info("openId"+openId)
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'post',
            url: wechatUrl,
            data:{
            	"openId":openId,
            	"operator":"delete",
            	"SessionId":SessionId
            },
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                   CommonJS.fnMessageSuccess("关联微信号删除成功,请确认信息.");
                   fnWeChatInfo();
                }else{
                    CommonJS.fnMessageError("关联微信号删除失败,请确认信息.");
                }
            },
            error: function (xhr, textStatus, error) {
                CommonJS.fnMessageError("关联微信号删除失败,请确认信息.");
            },
        });
        $.ajax(ajaxParam);
    };

    var fnInitEvent = function () {
        $("body").delegate("#weChatModal","hide.bs.modal",function () {
            if (Interval !=null){
                clearInterval(Interval);
                $("#okImg").hide();
                $("#errorImg").hide();
                $("#subscribeImg").hide();
            }

        });
        $("body").delegate("#refreshImg", "click", function(e) {
            fnWeChat();
        });
    }

    
    return{
        fnInit:function () {
            fnInit();
        },
        fnAddWeChat:fnAddWeChat,
        fnDelWeChat:fnDelWeChat
    }
}();