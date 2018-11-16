var DeviceInfo = function () {
//	var baseUrl = PublicConstant.baseUrl;
//	var deviceUrl = baseUrl+"device.action";
//	var segroupUrl=baseUrl+"segroup.action";
//	var groupDataUrl =segroupUrl+"?operator=query";
//	var devTypeUrl =deviceUrl+ "?operator=devtype";
	
//  var devDataUrl1 ="../json/devInfo.json";
//  var devTypeUrl1 = "../json/devType.json";
//  var groupDataUrl1 ="../json/groupInfo.json";
    
    var SessionId,userId,cookieDevType,cookieDevId,deviceData,devTypeData,GroupAll;
	var baseUrl,deviceUrl,segroupUrl,groupDataUrl,devTypeUrl;
    var fnInit = function () {
        SessionId = $.cookie("xw_terminal_SessionId");
        baseUrl = $.cookie("xw_terminal_baseUrl");
        if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
        cookieDevType = $.cookie("xw_host_devType");
        cookieDevId = $.cookie("xw_host_devId");
		deviceUrl = baseUrl+"device.action";
		segroupUrl=baseUrl+"segroup.action";
		groupDataUrl =segroupUrl+"?operator=query";
		devTypeUrl =deviceUrl+ "?operator=devtype";
        fnInitEvent();

        if(cookieDevId == -1){
            fnInitPage.fnAddDevInfo(cookieDevType);
            $("#devParam").hide();
        }else{
            fnInitPage.fnMdfDevInfo();
            fnInitParam.fnGetDevParam();
        }

    };

    //初始化页面
    var fnInitPage = function () {
        return{
            //添加设备时样式
            fnAddDevInfo:function (groupId) {
                var devData = ["","","",""];
                var data = PublicConstant.DeviceForm(devData);
                var Data = {"title":"","formId":"","submit":"","show":"false","data":data};
                var partText = doT.template($("#FormTemplate").text());

                $("#devContent").html("<form class='form-horizontal form-view' id='add_dev_form'>"+partText(Data)+"</form>");
                $("#paramFooter").html("<div class='form-actions' style='margin-top: -15px;'><a href='javascript:;' class='btn blue' id='addDevSub'>保存</a>" +
                    "<a href='javascript:;' class='btn'>取消</a></div>");
                fnInitDevice.fnSetDevType();
                fnInitDevice.fnInitGroupInfo(groupId);
                fnInitValid.addDevValid();
            },
            //修改设备时样式
            fnMdfDevInfo:function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: deviceUrl+"?operator=getInfo&devId="+cookieDevId+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data !=null){
                                if(data.code===0){
                                   deviceData = data.data.devdata;
                                	var confdata = data.data.confdata;
                                    if(deviceData.DevTypeId == cookieDevType){
                                        var devData = [deviceData.DevName,deviceData.DevCode,deviceData.ComAddr];
                                        var data = PublicConstant.DeviceForm(devData);
                                        var Data = {"title":"","formId":"","submit":"","show":"false","data":data};
                                        var partText = doT.template($("#FormTemplate").text());
                                        $("#devContent").html("<form class='form-horizontal form-view' id='mdf_dev_form' >"+partText(Data)+
                                            "<div class='form-actions' style='margin-top: 60px;'><a href='javascript:;' class='btn blue' id='mdfDevSub'>保存</a>" +
                                            "<a href='javascript:;' class='btn'>取消</a></div></form>");
                                        fnInitDevice.fnSetDevType(deviceData.DevTypeId);
                                        fnInitDevice.fnInitGroupInfo(deviceData.GroupId);
                                        fnInitValid.mdfDevValidate();                                        
                                        return ;
                                    }
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError(textStatus);
                            }
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

    //设备相关
    var fnInitDevice = function () {
        return{
            //设备类型--设置下拉框
            fnConfigDevType_setoption : function () {
                if(devTypeData !=undefined && devTypeData.length !=0){
                    for(var i=0;i<devTypeData.length;i++){
                        var devTypeId = devTypeData[i].devTypeId;
                        var devTypeName = devTypeData[i].devTypeName;
                        var comMode = devTypeData[i].comMode;
                        var html = "<option value='"+devTypeId+"' name='"+comMode+"'>"+devTypeName+"</option>";
                        $("#devType").append(html);
                    }

                }
                $("#devType").chosen({search_contains: true,no_results_text:"搜索不存在"});
                $("#devType").trigger("liszt:updated");
            },
            fnSetDevType : function (devTypeId) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: devTypeUrl+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data !=null){
                                if(data.code===0){
                                    devTypeData = data.data;
                                    fnInitDevice.fnConfigDevType_setoption();
                                    if(devTypeId !=undefined){
                                        $("#devType option[value="+devTypeId+"]").attr("selected","selected");
                                        $("#devType").attr("disabled","true");

                                    }
                                    $("#devType").chosen({search_contains: true,no_results_text:"搜索不存在"});
                                    $("#devType").trigger("liszt:updated");

                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }
                            }else{
                                CommonJS.fnMessageError(textStatus);
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            fnInitGroupInfo : function (groupId) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: groupDataUrl+"&SessionId="+SessionId,
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    var data = param.data;
                                    GroupAll = data;
//                                  var append = "<option value='0' >默认组</option>";
//                                  $("#group").append(append);
                                    if(data !=null){
                                    	
	                                    for(var i=0;i<data.length;i++){
	                                        var id = data[i].groupId;
	                                        var name = data[i].groupName;
	                                        var html = "<option value='"+id+"' >"+name+"</option>";
	                                        $("#group").append(html);
	                                    }
	                                    if(groupId !=undefined){
	                                        $("#group option[value="+groupId+"]").attr("selected","selected");
	                                    }
	                                    
                                    }
                                    $("#group").chosen({search_contains: true,no_results_text:"搜索不存在"});
	                                $("#group").trigger("liszt:updated");
                                    
                                }else if(param.code === 5){
//			                    	window.location.href = "login.html";
			                    }
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            }
        }
    }();

    //设备相关操作
    var fnInitDevice_Operator = function () {
        return{
            fnMdfDevice: function () {
                var deviceClass = new PublicConstant.DeviceClass();
                deviceClass.DevId=cookieDevId;
                deviceClass.DevName=$("#devName").val();
                deviceClass.DevCode=$("#devNo").val();
                deviceClass.DevTypeId=parseInt($("#devType").val());
                deviceClass.GroupId=parseInt($("#group").val());
                deviceClass.ComAddr=$("#comAddr").val();

                var data = JSON.stringify(deviceClass);
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: deviceUrl,
                    data:{
                        "data":data,
                        "operator":"mdfdev",
                        "SessionId":SessionId
                    },
                    processData: true,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data.code===0){
                            	$("#comAddr").parents(".controls").find("#comAddrError").remove();
                                CommonJS.fnMessageSuccess("设备修改成功,请确认信息.");
                            }else if(data.code === 5){
		                    	window.location.href = "login.html";
		                    }else{
                                CommonJS.fnMessageError("设备修改失败,请确认信息.");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备修改失败,请确认信息.");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnAddDevice:function (paramData) {
                var deviceClass = new PublicConstant.DeviceClass();
                deviceClass.DevName=$("#devName").val();
                deviceClass.DevCode=$("#devNo").val();
                deviceClass.DevTypeId=parseInt($("#devType").val());
                deviceClass.GroupId=parseInt($("#group").val());
                deviceClass.ComAddr=$("#comAddr").val();
				
				if(paramData ==null || paramData ==""){
					paramData="";
				}else{
					paramData = JSON.stringify(paramData);
				}
                var data = JSON.stringify(deviceClass);
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: deviceUrl,
                    data:{
                        "operator":"addev",
                        "devdata":data,
                        "confdata":paramData,
                        "SessionId":SessionId
                    },
                    processData: true,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data.code===0){
                                CommonJS.fnMessageSuccess("设备添加成功,请确认信息.");
                            	window.location.href = "deviceManage.html";
                            }else if(data.code === 5){
		                    	window.location.href = "login.html";
		                    }else{
                                CommonJS.fnMessageError("设备添加失败,请确认信息.");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备添加失败,请确认信息.");
                    },
                });
                $.ajax(ajaxParam);
            }
        }
    }();

    //添加设备相关事件
    var fnAddDev_event = function () {
        return{
            fnInit:function () {
                $("body").delegate("#addDevSub", "click", function(e) {
                    var devType =  $("#devType").val();
                    var data ='';
                    if(devType == 1){
                        data = fnInitParam_Operator.fnTempParam("get");
                    }else if(devType ==17 || devType ==18){
                        data = fnInitParam_Operator.fnAirRemote("get");
                    }else if(devType == 35){
                        data = fnInitParam_Operator.fnRedParam("get");
                    }else if(devType == 107){
                        data = fnInitParam_Operator.fnIpCamera("get");
                    }
                    var valid = $("#add_dev_form").valid();
                    if(valid){
                    	if(devType == 107){
	                        fnInitDevice_Operator.fnAddDevice(data);
	                    }else{
	                    	fnMdfDev_event.fnValidComAddrModify("add",data);
	                    }
                    }
                });
            }
        }
    }();

    //修改设备相关事件
    var fnMdfDev_event = function () {
        return{
            fnInit:function () {
                $.validator.addMethod("devVerify", function (a, b, c) {
                    var name = $("#devName").val();
                    var flag= true ;
                    if(deviceData !=null){
                        for(var i=0;i<deviceData.length;i++){
                            if(deviceData[i].devName==name && trData.devName !=name){
                                flag = false;
                                break;
                            }
                        }
                    }
                    return flag;
                });

                $.validator.addMethod("devNoVerify", function (a, b, c) {
                    var devNo = $("#devNo").val();
                    var flag= true ;
                    if(deviceData !=null){
                        for(var i=0;i<deviceData.length;i++){
                            if(deviceData[i].devNo==devNo && trData.devNo !=devNo){
                                flag = false;
                                break;
                            }
                        }
                    }
                    return flag;
                });

                $("body").delegate("#mdfDevSub", "click", function(e) {
					var devType =  $("#devType").val();
                    var valid = $("#mdf_dev_form").valid();
                    var comAddr = $("#comAddr").val();
                    if(valid){
//                  	 fnInitDevice_Operator.fnMdfDevice();
                        if(comAddr == deviceData.ComAddr){
                            fnInitDevice_Operator.fnMdfDevice();
                        }else{
                        	if(devType == 107){
		                        fnInitDevice_Operator.fnMdfDevice();
		                    }else{
		                    	fnMdfDev_event.fnValidComAddrModify();
		                    }
                            
                        }
                    }
                });
            },
            /* * 修改设备校验*/


            /*ajax 校验地址合法性*/
            fnValidComAddrModify:function (opt,json) {
                var devTypeId = $("#devType").val();
                var comAddr = $("#comAddr").val();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: deviceUrl+"?comAddr="+comAddr+"&operator=vrf_addr&SessionId="+SessionId+"&devTypeId="+devTypeId,
                    processData: true,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            fnGetAddCom_CallBack(data);
                        }
                    },
                    error: function (xhr, textStatus, error) {

                    },
                });
                $.ajax(ajaxParam);
                function fnGetAddCom_CallBack(paramArray) {
                    if (paramArray.code !== 0) {
                    	$("#comAddr").parents(".controls").find("#comAddrError").remove();
                        $("#comAddr").parents(".controls").append("<div id='comAddrError' style='color:#fd7700'>该地址已被占用</div>");
                    }else{
                        $("#comAddr").parents(".controls").find("#comAddrError").remove();
                        if(opt =='add'){
                        	fnInitDevice_Operator.fnAddDevice(json);
                        }else{
                        	fnInitDevice_Operator.fnMdfDevice();
                        }
//                      var valid = $("#mdf_dev_form").valid();
//                      if(valid){
//                          $("#mdfDeviceSubmit").addClass("disabled");
//                          fnInitDevice_Operator.fnMdfDevice();
//                      }
                    }
                }
            }
        }
    }();

    //配置相关
    var fnInitParam  = function () {
        return{
            //修改设备时参数
            fnGetDevParam :function () {
                if(cookieDevType == 1 || cookieDevType ==17 || cookieDevType ==18 || cookieDevType == 35 || cookieDevType == 107){

                }else {
                    $("#devParam").hide();
                    return;
                }
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: deviceUrl+"?operator=qryconf&devId="+cookieDevId+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data !=null){
                                if(data.code===0){
                                    var text = "";
                                    if(cookieDevType == 1){
                                        fnInitParam.fnTempDamp(data.data);
                                        text = "阈值";
                                    }else if(cookieDevType ==17 || cookieDevType ==18){
                                        fnInitParam.fnAirRemote(data.data);
                                        text = "参数";
                                    }else if(cookieDevType == 35){
                                        fnInitParam.fnHwInfo(data.data);
                                        text = "阈值";
                                    }else if(cookieDevType == 107){
                                        fnInitParam.fnIpCamera(data.data);
                                        text = "账号";
                                    }
                                    $("#paramFooter").html("<div class='form-actions' style='margin-top: -15px;'><a href='javascript:;' class='btn blue' id='mdfParam'>保存</a>" +
                                        "<a href='javascript:;' class='btn'>取消</a></div>");
                                    $("#devTitle").text(text);

                                }
                            }else{
                                CommonJS.fnMessageError(textStatus);
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(error);
                    },
                });
                $.ajax(ajaxParam);
            },
            //温湿度阈值--显示
            fnTempDamp : function (data) {
                var adata = {"data":data};
                var partText = doT.template($("#tempDampParam").text());
                $("#devAttr").html(partText(adata));
                var $form = $("#mdf_dev_param");
                fnInitValid.fnTempDampValid($form);

            },
            //修改空调遥控器阈值
            fnAirRemote : function (data) {
                var adata = {"data":data};
                var partText = doT.template($("#airRemoteTemplate").text());
                $("#devAttr").html(partText(adata));
                var $form = $('#mdf_dev_param');
                fnInitValid.fnAirRemoteValid($form);
            },
            //修改红外阈值
            fnHwInfo :function(data) {
                var  mode = data.mode;
                var  t_begin = data.t_begin;
                var t_end = data.t_end;

                var hwStr = doT.template($("#redParam").text());
                $("#devAttr").html(hwStr);
                $("#mdfHwSholdContent").find("input:radio[name='mdfHwSetting'][value='"+mode+"']").prop("checked",true);
                if(mode ==0){
                    $("#mdfAutoSetting").hide();
                    $("#mdfFirstSetting").show();
                    var hwStr = doT.template($("#MdfHwInputTimeTemplate").text());
                    $("#mdfHwTimeContent").append(hwStr);
                   
                    $('.startTimePicker').timepicker({
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });
                    $('.endTimePicker').timepicker({
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });
                }else if(mode ==1){
                    $("#mdfAutoSetting").show();
                    $("#mdfFirstSetting").hide();

					if(t_begin !=null){
						$.each(t_begin,function (index,map) {
	                        fnSetTimeContent(index,t_begin[index],t_end[index]);
	                    });
					}
                }
 				$("input").uniform();
                //设置红外时间段dom
                function fnSetTimeContent(index,start,end) {
                    var hwStr = doT.template($("#MdfHwInputTimeTemplate").text());
                    $("#mdfHwTimeContent").append(hwStr);
                    $("input").uniform();
                    $(".startTimePicker").addClass("startTimePicker"+index).removeClass("startTimePicker");

                    $('.startTimePicker'+index).timepicker({
                        defaultTime:start,
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });
                    $('.startTimePicker'+index).val(start);

                    $(".endTimePicker").addClass("endTimePicker"+index).removeClass("endTimePicker");

                    $('.endTimePicker'+index).val(end);
                    $('.endTimePicker'+index).timepicker({
                        defaultTime:end,
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });
                }

            },
            //修改IpCamera阈值
            fnIpCamera : function (data) {
                var account = data.account;
                var pwd = data.pwd;
                var adata = {"account":account,"pwd":pwd};
                var partText = doT.template($("#ipCameraParam").text());
                $("#devAttr").html(partText(adata));
                var $form = $("#mdf_dev_param");
                fnInitValid.fnIpCameraValid($form);
            },
        }
    }();

    //配置相关事件
    var fnParam_event = function () {
        return{
            fnInit:function () {
                $("body").delegate("#add_dev_form #devType", "change", function(e) {
                    var devType =  $(this).val();
                    var text = "";
                    if(devType == 1){
                        $("#devParam").show();
                        var tempDefault = PublicConstant.Default_Temp;
                        fnInitParam.fnTempDamp(tempDefault);
                        text = "阈值";
                    }else if(devType ==17 || devType ==18){
                        $("#devParam").show();
                        var airDefault = PublicConstant.Default_Air;
                        fnInitParam.fnAirRemote(airDefault);
                        text = "参数";
                    }else if(devType == 35){
                        $("#devParam").show();
                        var redDefault = PublicConstant.Default_Red;
                        fnInitParam.fnHwInfo(redDefault);
                        text = "阈值";
                    }else if(devType == 107){
                        $("#devParam").show();
                        var ipDefault = PublicConstant.Default_IpCamera;
                        fnInitParam.fnIpCamera(ipDefault);
                        text = "账号";
                    }else {
                        $("#devParam").hide();
                    }
                    $("#devTitle").text(text);
                });

                $("body").delegate("#mdfParam", "click", function(e) {
                    var valid = $("#mdf_dev_param").valid();
                    if(cookieDevType == 1){
                        if(valid){
                            fnInitParam_Operator.fnTempParam();
                        }

                    }else if(cookieDevType ==17 || cookieDevType ==18){
                        if(valid){
                            fnInitParam_Operator.fnAirRemote();
                        }
                    }else if(cookieDevType ==35){
                        fnInitParam_Operator.fnRedParam();
                    }else if(cookieDevType ==107){
                        if(valid){
                            fnInitParam_Operator.fnIpCamera();
                        }
                    }
                });

                //添加格力组自定义属性样式
                var flagGl = 1;
                $("body").delegate("#mdfGlTime", "click", function(e) {
                    var DataS = {"remark":"","properties":""};
                    var glStr = doT.template($("#MdfGlInputTimeTemplate").text());
                    $("#mdfGlTimeContent").append(glStr(DataS));
                    $("input").uniform();
                    $(".mdfGlTypeInput").addClass("mdfAddGlTypeInput"+flagGl).removeClass("mdfGlTypeInput").attr("name","mdfAddGlTypeInput"+flagGl);
                    $(".mdfGlPowerInput").addClass("mdfAddGlPowerInput"+flagGl).removeClass("mdfGlPowerInput").attr("name","mdfAddGlPowerInput"+flagGl);
                    flagGl++;

                    var len = $("#mdfGlSholdContent").find(".row-fluid");
                    if(len !=undefined){
                        if(len.length < 2){
                            $("#mdfGlTime").attr("disabled",false);
                        }else {
                            $("#mdfGlTime").attr("disabled",true);
                        }
                    }
                });

                //删除红外自定义时间样式
                $("body").delegate(".delGlTime", "click", function(e) {
                    $(this).closest(".row-fluid").remove();
                    var len = $("#mdfGlSholdContent").find(".row-fluid");
                    if(len !=undefined){
                        if(len.length < 2){
                            $("#mdfGlTime").attr("disabled",false);
                        }else {
                            $("#mdfGlTime").attr("disabled",true);
                        }
                    }
                });
            },
            fnHw_event : function () {
                //删除红外自定义时间样式
                $("body").delegate(".delHwTime", "click", function(e) {
                    $(this).closest(".row-fluid").remove();
                });

                //红外radio点击事件
                $("body").delegate("#mdfHwSholdContent .radio", "click", function(e) {
                    var value = $("input[name='mdfHwSetting']:checked").val();
                    if(value ==0 ){
                        $("#mdfFirstSetting").show();
                        $("#mdfAutoSetting").hide();
                    }else if(value ==1){
                        $("#mdfAutoSetting").show();
                        $("#mdfFirstSetting").hide();
                    }
                });

                //添加红外自定义时间样式
                var flagMap = 1;
                $("body").delegate("#mdfHwTime", "click", function(e) {
                    var hwStr = doT.template($("#HwInputTimeTemplate").text());
                    $("#mdfHwTimeContent").prepend(hwStr);
                    $("input").uniform();
                    $(".addStartTime").addClass("addStartTime"+flagMap).removeClass("addStartTime");
                    $('.addStartTime'+flagMap).timepicker({
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });

                    $(".endStartTime").addClass("endStartTime"+flagMap).removeClass("endStartTime");
                    $('.endStartTime'+flagMap).timepicker({
                        minuteStep: 1,
                         secondStep:1,
                        showSeconds: true,
                        disableFocus: true,
                        showMeridian: false
                    });
                    flagMap++;
                });
            }
        }
    }();

    //配置相关操作
    var fnInitParam_Operator = function () {
        return{
            fnCommonParam:function (data,text) {
            	var jsonData = {
                        	"devId":cookieDevId,
                        	"dtId":cookieDevType,
                        	"confdata":data
                        }  ;
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: deviceUrl,
                    data:{
                        "operator":"mdfconf",
                        "data":JSON.stringify(jsonData),
                        "SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                    CommonJS.fnMessageSuccess(text+"设置成功");
                                }else if(param.code ==5){
                                	window.location.href = "login.html";
                                }
                            }else{
                                CommonJS.fnMessageError(text+"设置失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError(text+"设置失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnTempParam:function (method) {
                var paramClass = new PublicConstant.TempClass();
                paramClass.l_temp = $("#l_temp").val();
                paramClass.h_temp = $("#h_temp").val();
                paramClass.l_humd = $("#l_humd").val();
                paramClass.h_humd = $("#h_humd").val();
                if(method ==undefined){
                    fnInitParam_Operator.fnCommonParam(paramClass,"温湿度阈值");
                }
                return paramClass;
            },
            fnRedParam:function (method) {
                var paramClass = new PublicConstant.RedClass();
                var mode = $("input[name='mdfHwSetting']:checked").val();
                var t_begin,t_end;
                if(mode ==1){
                    var begins = $("#mdfHwTimeContent").find(".startTime");
                    var ends = $("#mdfHwTimeContent").find(".endTime");
                    var t_begin = [],t_end=[];
                    $.each(begins,function (key ,map) {
                    	t_begin.push($(map).val())
//                      var begin = $(map).val();
//                      t_begin=begin+","+t_begin;
                    });
                    $.each(ends,function (key ,map) {
                    	t_end.push($(map).val())
//                      var end = $(map).val();
//                      t_end=end+","+t_end;
                    });
                }
                paramClass.mode = mode;
                paramClass.t_begin = t_begin;
                paramClass.t_end = t_end;
                if(method ==undefined){
                    fnInitParam_Operator.fnCommonParam(paramClass,"红外阈值");
                }
                return paramClass;
            },
            fnIpCamera:function (method) {
                var paramClass = new PublicConstant.IpCameraClass();
                paramClass.account = $("#account").val();
                paramClass.pwd = $("#password").val();
//              var data = JSON.stringify(paramClass);
                if(method ==undefined){
                    fnInitParam_Operator.fnCommonParam(paramClass,"摄像头账号");
                }
                return paramClass;
            },
            fnAirRemote:function (method) {
                var form = $('#mdf_dev_param').serializeArray();
                var saveType = [];
                var savePower = [];
                if(form.length !=0){
                    for(var i=0;i<form.length;i=i+2){
//                      saveType=saveType+form[i].value+",";
//                      savePower=savePower+form[i+1].value+",";
                        saveType.push(form[i].value);
                        savePower.push(form[i+1].value);
                    }
                }
                var paramClass = new PublicConstant.AirClass();
                paramClass.type = saveType;
                paramClass.power = savePower;
                if(method ==undefined){
                    fnInitParam_Operator.fnCommonParam(paramClass,"阈值");
                }
                return paramClass;
            }
        }

    }();

    //初始化校验
    var fnInitValid = function () {
        return{
            fnTempDampValid:function (form) {
            	
            	jQuery.validator.addMethod("h_temp", function(b, a) {
				    var flag = true;
				    var h_temp = parseInt($("#h_temp").val());
				    if(b >=h_temp){
				        flag = false;
				    }
				    return flag;
				}, "");
				jQuery.validator.addMethod("l_temp", function(b, a) {
				    var flag = true;
				    var l_temp = parseInt($("#l_temp").val());
				    if(b <=l_temp){
				        flag = false;
				    }
				    return flag;
				}, "");
				jQuery.validator.addMethod("h_humd", function(b, a) {
				    var flag = true;
				    var h_humd = parseInt($("#h_humd").val());
				    if(b >=h_humd){
				        flag = false;
				    }
				    return flag;
				}, "");
				jQuery.validator.addMethod("l_humd", function(b, a) {
				    var flag = true;
				    var l_humd = parseInt($("#l_humd").val());
				    if(b <=l_humd){
				        flag = false;
				    }
				    return flag;
				}, "");
                var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
                    rules: {
                        l_temp: {
                            required: true,
                            number:true,
                            h_temp:true
                        },
                        h_temp: {
                            required: true,
                            number:true,
                            l_temp:true
                        },
                        l_humd: {
                            required: true,
                            number:true,
                            h_humd:true
                        },
                        h_humd: {
                            required: true,
                            number:true,
                            l_humd:true
                        }
                    },
                    messages: {
                        l_temp: {
                            required: "请输入最低温度",
                            number:"请输入数字",
                            h_temp:"请输入小于最高温度值"
                        },
                        h_temp: {
                            required: "请输入最高温度",
                            number:"请输入数字",
                            l_temp:"请输入大于最低温度值"
                        },
                        l_humd: {
                            required: "请输入最低湿度",
                            number:"请输入数字",
                            h_humd:"请输入小于最高湿度值"
                        },
                        h_humd: {
                            required: "请输入最高湿度",
                            number:"请输入数字",
                             l_humd:"请输入大于最低湿度值"
                        }
                    },
                });
                form.validate(formParam);
            },
            fnIpCameraValid:function (form) {
                var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
                    rules: {
                        account: {
                            required: true,
                        },
                        password: {
                            required: true,
                        },
                    },
                    messages: {
                        account: {
                            required: "请输入账号",
                        },
                        password: {
                            required: "请输入密码",
                        },
                    },
                });
                form.validate(formParam);
            },
            fnAirRemoteValid:function ($form) {
                var form = $form.serializeArray();
                var param = {};
                var messages = {};
                if(form.length !=0){
                    for(var i=0;i<form.length;i=i+2){
                        var xpMap = {
                            required: true,
                        }
                        var xmMap = {
                            required: "请输入型号",
                        }

                        var gpMap = {
                            required: true,
                            min:0
                        }
                        var gmMap = {
                            required: "请输入功率",
                            min:"功率不能小于0"
                        }
                        param[form[i].name]=xpMap;
                        messages[form[i].name]=xmMap;

                        param[form[i+1].name]=gpMap;
                        messages[form[i+1].name]=gmMap;
                    }
                }

                var formParam = $.extend(true,{}, PublicConstant.fnValidator($form), {
                    errorPlacement: function(error, element) {
                        error.appendTo(element.closest('.control-group').find(".control-label"));
                    },
                    rules: param,
                    messages: messages,
                });
                $form.validate(formParam);
            },
            addDevValid:function () {
                var form = $('#add_dev_form');
                $.validator.addMethod("comAddrValid", function (a, element) {
                    var flag= true ;
                    var devTypeId = $("#devType").find("option:checked").val();
                    $("#comAddr").parents(".controls").find("#comAddrError").remove();
                    if(devTypeId !=null){
                        if(devTypeId ==33 || devTypeId==34 || devTypeId ==35){//DI DO
                            flag = /^[1-4]{1}$/.test(a);
                            $(element).data('error-msg','有效范围 1-4');
                        }                       
                        if(devTypeId == 1 || devTypeId==3 || devTypeId==4 || devTypeId==5 || devTypeId==17 || devTypeId==18){
                            flag = /^([1-9]\d{0,1}|100)$/.test(a);
                            $(element).data('error-msg','有效范围 1-100');
                        }
                        if(devTypeId == 107){
                            flag = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])$/.test(a);
                            $(element).data('error-msg','有效格式为相关IP地址');
                        }

                    }
                    return flag;
                }, function(params, element) {
                    return $(element).data('error-msg');
                });
                var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
                    rules: {
                        devName: {
                            required: true,
                            // devVerify:true,
                            maxlength:18,
                            minlength:2,
                        },
                        devNo: {
                            required: true,
                            // devNoVerify:true,
                            maxlength:18,
                            minlength:2,
                        },
                        comAddr: {
                            required: true,
                            comAddrValid:true
                        },
                        group:{
		                    required:true,
		                    minlength:1
			            },
		                devType:{
		                    required:true,
		                    minlength:1
		                }
                    },
                    messages: {
                        devName: {
                            required: "请输入设备名称",
                            // devVerify:"设备已存在",
                            maxlength:"设备名称最多18个字符",
                            minlength:"设备名称不能少于2个字符"
                        },
                        devNo: {
                            required: "请输入设备编码",
                            // devNoVerify:"设备编码已存在",
                            maxlength:"设备编码最多18个字符",
                            minlength:"设备编码不能少于2个字符"
                        },
                        comAddr: {
                            required: "请输入地址",
                        },
                        group:{
		                    required:"请选择节能组",
		                    minlength:'请选择节能组'
		                },
		                devType:{
		                    required:'请选择设备类型',
		                    minlength:'请选择设备类型'
		                },
                    },
                });
                form.validate(formParam);
            },
            mdfDevValidate:function (){
                var form = $('#mdf_dev_form');
                $.validator.addMethod("comAddrValid", function (a, element) {
                    var flag= true ;
                    $("#comAddr").parents(".controls").find("#comAddrError").remove();
                    if(cookieDevType !=null){
                        if(cookieDevType ==33 || cookieDevType==34 || cookieDevType ==35){//DI DO
                            flag = /^[1-4]{1}$/.test(a);
                            $(element).data('error-msg','有效范围 1-4');
                        }                       
                        if(cookieDevType == 1 || cookieDevType==3 || cookieDevType==4 || cookieDevType==5 || cookieDevType==17 || cookieDevType==18){
                            flag = /^([1-9]\d{0,1}|100)$/.test(a);
                            $(element).data('error-msg','有效范围 1-100');
                        }
                        if(cookieDevType == 107){
                            flag = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])$/.test(a);
                            $(element).data('error-msg','有效格式为相关IP地址');
                        }

                    }
                    return flag;
                }, function(params, element) {
                    return $(element).data('error-msg');
                });
                var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
                    rules: {
                        devName: {
                            required: true,
                            // devVerify:true,
                            maxlength:18,
                            minlength:2,
                        },
                        devNo: {
                            required: true,
                            // devNoVerify:true,
                            maxlength:18,
                            minlength:2,
                        },
                        comAddr: {
                            required: true,
                            comAddrValid:true
                        }
                    },
                    messages: {
                        devName: {
                            required: "请输入设备名称",
                            // devVerify:"设备已存在",
                            maxlength:"设备名称最多18个字符",
                            minlength:"设备名称不能少于2个字符"
                        },
                        devNo: {
                            required: "请输入设备编码",
                            // devNoVerify:"设备编码已存在",
                            maxlength:"设备编码最多18个字符",
                            minlength:"设备编码不能少于2个字符"
                        },
                        comAddr: {
                            required: "不能为空",
                        }
                    },
                });
                form.validate(formParam);
            },
        }
    }();
    
    /*添加和修改设备 通信地址校验提醒*/
    var fnAddComMessage = function () {
        var devTypeId = $("#devType").find("option:checked").val();
        if(devTypeId ==undefined || devTypeId==""){
            return 0;
        }
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: deviceUrl+"?operator=available_addr&devTypeId="+parseInt(devTypeId)+"&SessionId="+SessionId,
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    fnGetAddCom_CallBack(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);
        function fnGetAddCom_CallBack(paramArray) {
            if (paramArray.code === 0) {
                var data = paramArray.data;
                if(data ==""){
                    data="无可用通信地址";
                };
                layer.msg('通信地址可用范围为：<br>'+data, {
                    time: false,
                    btn: ['确定']
                });
            }
        }
    }
    
    var fnInitEvent = function () {
        fnMdfDev_event.fnInit();
        fnAddDev_event.fnInit();
        fnParam_event.fnInit();
        fnParam_event.fnHw_event();
        $("body").delegate("#onComAddr", "click", function(e) {
        	var devTypeId = $("#devType").find("option:checked").val();
	        if(devTypeId!="107"){
	           fnAddComMessage();
	        }else{
	        	layer.msg('通信地址为相应IP地址<br>', {
                    time: false,
                    btn: ['确定']
                });
	        }
        });
    };




    return{
        fnInit:fnInit,
    }

}();