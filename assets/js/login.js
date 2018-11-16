/**
 * Created by chengyezheng on 2018/10/12.
 */
var Login = function () {
//	var baseUrl = PublicConstant.baseUrl;
//	var loginUrl =baseUrl+"login.action";

    var loginFlag = true;
    var baseUrl,loginUrl;
    var fnInitShowPage = function () {
        $.cookie("CurPageUrl", '', {
            expires: -1
        });
        var opts = PublicConstant.opts;
        var target = document.getElementById('process_view');
        new Spinner(opts).spin(target);
        $("#process_view").hide();
		fnGetBaseUrl();

    };
    
    var fnGetBaseUrl = function(){
    	var protocol = window.location.protocol;
    	var host = window.location.host;
    	var base = protocol+"//"+host+"/cgi-bin/";
        $.cookie("xw_terminal_baseUrl", base, {
            expires: 1
        });
        baseUrl = base;
        loginUrl = baseUrl+"login.action";
//  	var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
//          type: 'get',
//          async: false,
//          url: '../json/baseUrl.json',
//          success: function (data, textStatus, jqXHR) {
//               var host = data.host;
//               var port = data.port;
//               var url = data.url;
//               base = base+host+":"+port+"/"+url;
//               $.cookie("xw_terminal_baseUrl", $.trim(base), {
//		            expires: 1
//		        });
//		        baseUrl = base;
//		        loginUrl = baseUrl+"login.action";
//          },
//          error: function (xhr, textStatus, error) {
//              CommonJS.fnMessageError(error);
//          },
//      });
//      $.ajax(ajaxParam);
   };

    var fnInitEventPage = function () {

        $("#loginIn").on("click",function () {
            if(loginFlag){
                $("#loginIn").attr('disabled', 'disabled');
                loginFlag = false;
                $("#process_view").show();
                loginValid();
            }
        });

        $(document).on("keydown",function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13){
                if(loginFlag){
                    $("#loginIn").attr('disabled', 'disabled');
                    loginFlag = false;
                    $("#process_view").show();
                    loginValid();
                }
            }
        });
    };

    //登录校验是否为空接口
    var loginValid = function () {
        var username = $('#username').val();
        var password = $('#password').val();

        if (username == "") {
            $("#loginIn").removeAttr('disabled');
            loginFlag = true;
            $("#process_view").hide();
            $('#tip').text('请输入用户名');
            return;
        }else if (password == "") {
            $("#loginIn").removeAttr('disabled');
            loginFlag = true;
            $("#process_view").hide();
            $('#tip').text('请输入密码');
            return;
        }else {
            $('#tip').empty();
     		login();
        }

    };

    //登录操作
    var login = function () {
    	var username = $('#username').val();
        var password = $('#password').val();
        var hexPwd = hex_md5(password);
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'post',
            url: loginUrl,
            async: false,
            dataType: 'text',
            data:{
                "operator":"login_in",
                "username":username,
                "password":hexPwd,
            },
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                	
                	var dataArray = data.split(";");
                	var dataJson = [];
                	if(dataArray.length ==1){
                		dataJson = "{"+dataArray[0].split("{")[1];
                	}else{
                		var SessionId = dataArray[0].split("=")[1];
	                	dataJson = "{"+dataArray[3].split("{")[1];
	//              	var cookieId = "SessionId="+SessionId+";"+dataArray[1]+";"+dataArray[2]+";"+dataArray[3].split("{")[0];
	                    SetSysUser(username,SessionId);
                	}

                    Callback_Login(dataJson);
                }
            },
            error: function (xhr, textStatus, error) {
                if (textStatus == "timeout") {
                    $("#loginIn").removeAttr('disabled');
                    loginFlag = true;

                    $('#tip').text('连接超时');
                    $("#process_view").hide();
                }
            },
        });
        $.ajax(ajaxParam);
    }

    //登录返回值
    var Callback_Login = function (paramArray) {
        $("#process_view").show();
        var data = JSON.parse(paramArray);
        if (0 == data.code) {
            $('#tip').css('color', '#ffffff');
            $('#tip').text('登录成功！');
            window.location.href = "systemStatus.html";
        } else{
            $("#loginIn").removeAttr('disabled');
            loginFlag = true;
            $('#tip').text('用户名或密码有误');
            $("#process_view").hide();
        }
    }

    //设置当前登录用户
    var SetSysUser = function (nickName,SessionId) {
        $.cookie("xw_terminal_userName", $.trim(nickName), {
            expires: 1
        });
        $.cookie("xw_terminal_SessionId", $.trim(SessionId), {
            expires: 1
        });
    }


    return{
        fnInit:function () {
            fnInitShowPage();
            fnInitEventPage();
        }
    }
}();