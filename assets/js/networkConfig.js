var NetworkConfig = function () {
//	var baseUrl = PublicConstant.baseUrl;
//	var networkAdapterUrl = baseUrl+"networkadapter.action";
	
    var SessionId,baseUrl,networkAdapterUrl;
    var fnInit = function () {
    	SessionId = $.cookie("xw_terminal_SessionId");
    	baseUrl = $.cookie("xw_terminal_baseUrl");
    	if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
    	var opts = PublicConstant.spinOpts;
        var target = document.getElementById('process_view');
        new Spinner(opts).spin(target);
        $("#process_view").show();
        
    	networkAdapterUrl = baseUrl+"networkadapter.action";
        fnInitEvent();
        fnInitPage.fnInitNetStatus();
    };

    var fnInitPage = function () {
        return{
            //获取网卡模式（热点或者客户端模式）
            fnInitNetStatus : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=status&adapter=3&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            for(var i=0;i<pData.length;i++){
                                var adapter = pData[i].adapter;
                                var enable = pData[i].enable;
                                var status = pData[i].status;
                                var mode = pData[i].mode;                               
                                if(adapter ==1){//有线连接
									
                                    if(!enable){
                                        $("#startNet").removeClass("switch-on").addClass("switch-off");
                                        $("#netContent").hide();
                                    }else{
                                        $("#startNet").removeClass("switch-off").addClass("switch-on");
                                        $("#netContent").show();
                                        fnInitPage.fnGetBroadInfo();
                                    }
                                    if(status ==0){
                                        $("#netStatus").text("断开");
                                    }else{
                                        $("#netStatus").text("连接");
                                        fnInitPage.fnGetBroadInfo();
                                    }
                                    
                                }
                                if(adapter ==2){//无线连接
//                              	$("#wifi").empty();
                                	if(mode ==0){//无效模式
	                                	
	                                }else if(mode ==1){//客户端模式
	                                	if(!enable){
	                                        $("#wifi").removeClass("switch-on").addClass("switch-off");
	                                    }else{
	                                        $("#wifi").removeClass("switch-off").addClass("switch-on");
	                                        fnInitPage.fnGetWifiInfo();
	                                    }

	                                }else if(mode ==2){//热点模式
	                                	if(!enable){
	                                        $("#wifi").removeClass("switch-on").addClass("switch-off");
	                                    }else{
	                                        $("#wifi").removeClass("switch-off").addClass("switch-on");
	                                        var htmlStr = doT.template($("#HotPointInfoTemplate").text());

				                            $("#wifiInfo").html(htmlStr);
	                                    }

	                                }

                                }
                            }

                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }else{
                            CommonJS.fnMessageError(data.message);
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            //显示WiFi列表信息
            fnGetWifiInfo : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=wifilist&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                    	 $("#process_view").hide();
                        if(data.code===0) {
                            var pData = data.data;
                            if(pData !=null){
								for(var i=0;i<pData.length;i++){
									if(pData[i].status ==1){
										var htmlJson = {"data":pData[i]};
			                            var htmlStr = doT.template($("#wifiStatusTemplate").text());
			                            var html = htmlStr(htmlJson);
			                            $("#wifiStatusInfo").html(html);
			                           
									}
								}
								fnInitPage.fnGetWifiNewUrl();
                            	var htmlJson1 = {"data":pData};
	                            var htmlStr1 = doT.template($("#wifiTemplate").text());
	                            var html1 = htmlStr1(htmlJson1);
	                            $("#wifiInfo").html(html1);
                            }
                            
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            //显示宽带状态
            fnGetBroadInfo : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=conf&adapter=1&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            var ipAquire = pData.ipAquire;
                            var ip = pData.ip;
                            var gateway = pData.gateway;
                            var netmask = pData.netmask;
                            var dns1 = pData.dns1;
                            var dns2 = pData.dns2;
                            var proxy = pData.proxy;
                            var encrypt = pData.encrypt;
                            var pwd = pData.pwd;
                            var linkMode = pData.linkMode;
                            if(ipAquire ==1){
                                $("#netConn").find("input[name=ipName][value='0']").attr("checked","checked");
                                $("#netInfo").addClass("grey").find("input").attr("disabled",true);
                            }else{
                                $("#netConn").find("input[name=ipName][value='1']").attr("checked","checked");
                                $("#netInfo").removeClass("grey").find("input").attr("disabled",false);
                            }
                            $("#ipAddr").val(ip);
                            $("#subNet").val(netmask);
                            $("#gateway").val(gateway);
                            $("#firstDns").val(dns1);
                            $("#otherDns").val(dns2);
                            $("#proxy").val(proxy);
                            $("input").uniform();
                            fnInitPage.fnGetBroadNewUrl();
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            //网卡开启关闭
            fnNetOpenOrClose_ajax:function (adapter,status) {
                var text = '';
                if(adapter ==1){
                    text = "有线网卡";
                }else{
                    text = "无线网卡";
                }
                if(status ==0){
                    text=text+"关闭";
                }else{
                    text = text+"开启";
                }
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"status",
                        "adapter":adapter,
                        "status":status,
                        "SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                    	fnInitPage.fnInitNetStatus();
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess(text+"成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError(text+"失败");
                                }
                            }else{
                                CommonJS.fnMessageError(text+"失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(text+"失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnGetWifiNewUrl:function(){
            	var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=url&adapter=2&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            if(pData !=null){
								var url = pData[0].url;
								var status = pData[0].status;
								var networkId = pData[0].networkId;
								if(status == 0){
									$("#wifiNewUrl").hide();
								}else{
									$("#wifiNewUrl").show();
									$("#changeUrl").html("http://"+url);
								}
                            }
                            
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            fnGetBroadNewUrl:function(){
            	var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=url&adapter=1&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            if(pData !=null){
								var url = pData[0].url;
								var status = pData[0].status;
								var networkId = pData[0].networkId;
								if(status == 0){
									$("#broadNewUrl").hide();
								}else{
									$("#broadNewUrl").show();
									$("#changeBroadUrl").html("http://"+url);
								}
                            }
                            
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
        }
    }();

    var fnInitWifi = function () {
        return{
            fnConnectInfo: function (networkId) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: networkAdapterUrl+"?operator=conf&adapter=2&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            var htmlJson = {"data":pData};
                            var htmlStr = doT.template($("#wifiInfoTemplate").text());
                            var html = htmlStr(htmlJson);
                            layer.open({
                                title: [networkId,],
                                content: html,
                                btn: ['修改', '取消'],
                                yes:function () {
                                    var valid = $("#wifiInfoForm").valid();
                                    if(valid){
                                    	$("#process_view").show();
                                        fnInitWifi_Operator.fnConnect_ajax(data.data,networkId);
                                    }
                                }
                            });
                            fnInitValid.fnInitBroadValid($("#wifiInfoForm"));
                            MobileSwitch.init("#wifiIp");
                            var flag = $("#wifiIp").hasClass("switch-on");
                            if(flag){
                                $("#ipInfo").css("display","block");
                            }else{
                                $("#ipInfo").css("display","none");
                            }

                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }else{
                            CommonJS.fnMessageError(error);
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            fnUnConnectInfo: function (networkId,remembered) {
                var ipInfo =$("#IpInfoTemplate").html();
                var content = '';
                if(remembered ==0){
                    content = "<div><span style='color: #fd7700;' id='errorPass'></span><input type='password' id='wifi_pwd' name='wifi_pwd' placeholder='密码' style='width: 95%'></div>";
                    layer.open({
                        title: [networkId],
                        content: content+ipInfo,
                        btn: ['连接', '取消'],
                        yes:function () {

                            var pass = $("#wifi_pwd").val();
                            if( pass!="" && pass !=undefined){
                                $("#errorPass").text("");
                            }else{
                                $("#errorPass").text("请输入密码");
                                return;
                            }
                            var flag = $("#IpConn").hasClass("switch-on");
                            if(flag){
                                var valid = $form.valid();
                                if(valid){
                                	
                                    layer.open({
				                        title: ['提示'],
			                        	content: "<div style='min-height:100px;'>您将连接网络"+networkId+",若确定连接后,此页面将失效，请切换主机网络至热点模式，获取新的网络地址。</div>",
				                        btn: ['确定', '取消'],
				                        yes:function () {
				                        	$("#process_view").show();
				                           fnInitWifi_Operator.fnUnConnect_ajax(networkId);
				                        }
				                    });
                                }
                            }else{
                            	
                                layer.open({
			                        title: ['提示'],
			                        content: "<div style='min-height:100px;'>您将连接网络"+networkId+",若确定连接后，此页面将失效，请切换主机网络至热点模式，获取新的网络地址。</div>",
			                        btn: ['确定', '取消'],
			                        yes:function () {
			                        	$("#process_view").show();
			                           fnInitWifi_Operator.fnUnConnect_ajax(networkId);
			                        }
			                    });
                            }

                        }
                    });
                }else{
                    layer.open({
                        title: [networkId],
                        content: ipInfo+"</form>",
                        btn: ['连接', '取消'],
                        yes:function () {
                            var flag = $("#IpConn").hasClass("switch-on");
                            if(flag){
                                var valid = $form.valid();
                                if(valid){
                                	
                                	layer.open({
				                        title: ['提示'],
			                        	content: "<div style='min-height:100px;'>您将连接网络"+networkId+",若确定连接后，此页面将失效，请切换主机网络至热点模式，获取新的网络地址。</div>",
				                        btn: ['确定', '取消'],
				                        yes:function () {
				                        	$("#process_view").show();
				                           fnInitWifi_Operator.fnUnConnectRe_ajax(networkId);
				                        }
				                    });
                                    
                                }
                            }else{
                            	
                                layer.open({
			                        title: ['提示'],
			                        content: "<div style='min-height:100px;'>您将连接网络"+networkId+",若确定连接后，此页面将失效，请切换主机网络至热点模式，获取新的网络地址。</div>",
			                        btn: ['确定', '取消'],
			                        yes:function () {
			                        	$("#process_view").show();
			                           fnInitWifi_Operator.fnUnConnectRe_ajax(networkId);
			                        }
			                    });
                            }

                        }
                    });

                }
                var $form = $("#IpInfoForm");
                fnInitValid.fnInitBroadValid($form);
                MobileSwitch.init("#IpConn");
                var flag = $("#IpConn").hasClass("switch-on");
                if(flag){
                    $("#ipSet").css("display","block");
                }else{
                    $("#ipSet").css("display","none");
                }
            },
        }
    }();

    var fnInitWifi_Operator = function () {
        return{
        	fnHotConnect_ajax:function(){
                var netWorkClass = new PublicConstant.NetWorkConfigClass();
//              netWorkClass.linkMode = linkMode;
                netWorkClass.networkId = $("#hot_user").val();
                netWorkClass.pwd = $("#hot_pass").val();;
                netWorkClass.encrypt = $("#hot_wpa").find("option:selected").val();

                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"conf",
                        "adapter":2,
                        "confdata":JSON.stringify(netWorkClass),
                        'SessionId':SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess("网络配置成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError("网络配置失败");
                                }
                            }else{
                                CommonJS.fnMessageError("网络配置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("网络配置失败");
                    },
                });
                $.ajax(ajaxParam);

        	},
            //已经连接的设置
            fnConnect_ajax:function (data,networkId) {
                var netWorkClass = new PublicConstant.NetWorkConfigClass();
                if(data ==undefined) {
                    return;
                }
//              var pwd = data.pwd;
                var linkMode = 0;
//              var networkId = data.networkId;
                var encrypt = data.encrypt;
                var proxy = data.proxy;
                var ip = data.ip;
                var gateway = data.gateway;
                var netmask = data.netmask;
                var dns1 = data.dns1;
                var dns2 = data.dns2;

                netWorkClass.linkMode = linkMode;
                netWorkClass.networkId = networkId;
//              netWorkClass.pwd = pwd;
                netWorkClass.encrypt = encrypt;
                var flag = $("#wifiIp").hasClass("switch-on");
                if(!flag){
                    netWorkClass.ipAquire = 1;

                }else{
                    netWorkClass.ipAquire = 2;
                    proxy = $("#wifi_proxy").val();
                    ip = $("#wifi_ip").val();
                    gateway = $("#wifi_gateway").val();
                    netmask = $("#wifi_netmask").val();
                    dns1 = $("#wifi_dns1").val();
                    dns2 = $("#wifi_dns2").val();
                }
                netWorkClass.proxy = proxy;
                netWorkClass.ip = ip;
                netWorkClass.gateway = gateway;
                netWorkClass.netmask = netmask;
                netWorkClass.dns1 = dns1;
                netWorkClass.dns2 = dns2;
                layer.closeAll();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"conf",
                        "adapter":2,
                        "confdata":JSON.stringify(netWorkClass),
                        'SessionId':SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                    	$("#process_view").hide();
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess("网络配置成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError("网络配置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                    	$("#process_view").hide();
                        CommonJS.fnMessageError("网络配置失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            //记住密码的连接请求
            fnUnConnectRe_ajax:function (networkId) {
                var netWorkClass = new PublicConstant.NetWorkConfigClass();
                if(networkId ==undefined) {
                    return;
                }

                netWorkClass.linkMode = 0;
                netWorkClass.networkId = networkId;
                var flag = $("#IpConn").hasClass("switch-on");
                if(!flag){
                    netWorkClass.ipAquire = 1;

                }else{
                    netWorkClass.ipAquire = 2;
                    var proxy = $("#un_wifi_proxy").val();
                    var ip = $("#un_wifi_ip").val();
                    var gateway = $("#un_wifi_gateway").val();
                    var netmask = $("#un_wifi_netmask").val();
                    var dns1 = $("#un_wifi_dns1").val();
                    var dns2 = $("#un_wifi_dns2").val();
                    netWorkClass.proxy = proxy;
                    netWorkClass.ip = ip;
                    netWorkClass.gateway = gateway;
                    netWorkClass.netmask = netmask;
                    netWorkClass.dns1 = dns1;
                    netWorkClass.dns2 = dns2;
                }

                layer.closeAll();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"conf",
                        "adapter":2,
                        "confdata":JSON.stringify(netWorkClass),
                        'SessionId':SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                    	$("#process_view").hide();
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess("网络配置成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError("网络配置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                    	$("#process_view").hide();
                        CommonJS.fnMessageError("网络配置失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            //忘记密码的连接请求
            fnUnConnect_ajax:function (networkId) {
                var netWorkClass = new PublicConstant.NetWorkConfigClass();
                if(networkId ==undefined) {
                    return;
                }
                netWorkClass.linkMode = 1;
                netWorkClass.networkId = networkId;
                netWorkClass.pwd = $("#wifi_pwd").val();;
                var flag = $("#IpConn").hasClass("switch-on");
                if(!flag){
                    netWorkClass.ipAquire = 1;

                }else{
                    netWorkClass.ipAquire = 2;
                    var proxy = $("#un_wifi_proxy").val();
                    var ip = $("#un_wifi_ip").val();
                    var gateway = $("#un_wifi_gateway").val();
                    var netmask = $("#un_wifi_netmask").val();
                    var dns1 = $("#un_wifi_dns1").val();
                    var dns2 = $("#un_wifi_dns2").val();
                    netWorkClass.proxy = proxy;
                    netWorkClass.ip = ip;
                    netWorkClass.gateway = gateway;
                    netWorkClass.netmask = netmask;
                    netWorkClass.dns1 = dns1;
                    netWorkClass.dns2 = dns2;
                }

                layer.closeAll();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"conf",
                        "adapter":2,
                        "confdata":JSON.stringify(netWorkClass),
                        'SessionId':SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                    	$("#process_view").hide();
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess("网络配置成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError("网络配置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                    	$("#process_view").hide();
                        CommonJS.fnMessageError("网络配置失败");
                    },
                });
                $.ajax(ajaxParam);
            },

        }
    }();

    var fnInitBroad_Operator = function () {
        return{
            fnNetConnect_ajax:function () {
                var netWorkClass = new PublicConstant.NetWorkConfigClass();
                var autoConn = $("#netConn").find("input[name=ipName]:checked").val();
                if(autoConn ==0){
                	netWorkClass.ipAquire = 1;
                }else{
                	netWorkClass.ipAquire = 0;
                    var ip = $("#ipAddr").val();
                    var netmask = $("#subNet").val();
                    var gateway = $("#gateway").val();
                    var dns1 = $("#firstDns").val();
                    var dns2 = $("#otherDns").val();
                	var proxy = $("#proxy").val();
                    
                    netWorkClass.proxy = proxy;
	                netWorkClass.ip = ip;
	                netWorkClass.gateway = gateway;
	                netWorkClass.netmask = netmask;
	                netWorkClass.dns1 = dns1;
	                netWorkClass.dns2 = dns2;
                }                          
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: networkAdapterUrl,
                    data:{
                        "operator":"conf",
                        "adapter":1,
                        "confdata":JSON.stringify(netWorkClass),
                        'SessionId':SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess("网络配置成功");
                                }else if(param.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError("网络配置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("网络配置失败");
                    },
                });
                $.ajax(ajaxParam);
            },
        }
    }();

    var fnIpRadio = function () {
        var value = $("input[name='ipName']:checked").val();
        if(value ==1){
            $("#netConn").find("input[name=ipName][value='0']").attr("checked","checked");
            $("#netInfo").addClass("grey").find("input").attr("disabled",true);
        }else{
            $("#netConn").find("input[name=ipName][value='1']").attr("checked","checked");
            $("#netInfo").removeClass("grey").find("input").attr("disabled",false);
        }
        $("input").uniform();
    };

    var fnInitEvent = function () {
        $("body").delegate("#netConn .radio", "click", function(e) {
            fnIpRadio();
        });

        $("body").delegate("#wifiIp", "click", function(e) {
            var flag = $("#wifiIp").hasClass("switch-on");
            if(flag){
                $("#ipInfo").css("display","block");
            }else{
                $("#ipInfo").css("display","none");
            }
        });
        $("body").delegate("#IpConn", "click", function(e) {
            var flag = $("#IpConn").hasClass("switch-on");
            if(flag){
                $("#ipSet").css("display","block");
            }else{
                $("#ipSet").css("display","none");
            }
        });

        $("#netWorkBtn").on("click",function () {
            var $form = $("#netConn");
            fnInitValid.fnInitBroadValid($form);
            var valid = $form.valid();
            if(valid){
                fnInitBroad_Operator.fnNetConnect_ajax();
            }
        });
        $("body").delegate("#hotConn", "click", function(e) {

            fnInitWifi_Operator.fnHotConnect_ajax();
        });
        
        MobileSwitch.init("#wifi");
        switchEvent("#wifi",function(){
            fnInitPage.fnGetWifiInfo();
            fnInitPage.fnNetOpenOrClose_ajax(2,1);
        },function(){
            $(".wifiContent").empty();
            fnInitPage.fnNetOpenOrClose_ajax(2,0);
        });
        
        MobileSwitch.init("#startNet");
        switchEvent("#startNet",function(){
            $("#netContent").show();
            fnInitPage.fnGetBroadInfo();
            fnInitPage.fnNetOpenOrClose_ajax(1,1);
        },function(){
            $("#netContent").hide();
            fnInitPage.fnNetOpenOrClose_ajax(1,0);
        });
    };

    var fnInitValid = function () {
        return{
            fnInitBroadValid:function ($form) {

                var formParam = $.extend(true,{}, PublicConstant.fnValidator($form), {
                    errorPlacement: function(error, element) {
                        error.appendTo(element.closest('li'));
                    },

                    highlight: function(element) {
                        $(element).closest('.control-group').addClass('error');
                    },
                    unhighlight: function(element) {
                        $(element).closest('.control-group').removeClass('error');
                    },
                    rules: {
                        wifi_pwd:{
                            required: true,
                        },
                        ipAddr: {
                            required: true,
                        },
                        subNet: {
                            required: true,
                        },
                        gateway: {
                            required: true,
                        },
                        firstDns: {
                            required: true,
                        },
                        otherDns: {
                            // required: true,
                        },
                        proxy: {
                            // required: true,
                        },
                    },
                    messages: {
                        wifi_pwd:{
                            required: "请输入密码",
                        },
                        ipAddr: {
                            required: "请输入IP地址",
                        },
                        subNet: {
                            required: "请输入子网掩码",
                        },
                        gateway: {
                            required: "请输入网关",
                        },
                        firstDns: {
                            required: "请输入DNS服务器",
                        },
                        otherDns: {
                            // required: "请输入DNS服务器",
                        },
                        proxy: {
                            // required: "确认密码不能为空",
                        },
                    },
                });
                $form.validate(formParam);
            }
        }
    }();

    return{
        fnInit:fnInit,
        fnConnectInfo:fnInitWifi.fnConnectInfo,
        fnUnConnectInfo:fnInitWifi.fnUnConnectInfo,
    }

}();