var DeviceManage = function () {
//	var baseUrl = PublicConstant.baseUrl;
//  var deviceUrl = baseUrl+"device.action";
//  var segroupUrl=baseUrl+"segroup.action"; 
//  var hostDevDataUrl =deviceUrl+"?operator=devlist";
//  var groupDataUrl =segroupUrl+"?operator=query";
        
    var SessionId,userId,GroupAll,DeviceAll,DefaultDevInfo;
    var baseUrl,deviceUrl,segroupUrl,hostDevDataUrl,groupDataUrl;
    var fnInit = function () {
        SessionId = $.cookie("xw_terminal_SessionId");
        baseUrl = $.cookie("xw_terminal_baseUrl");
        if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
        deviceUrl = baseUrl+"device.action";
        segroupUrl=baseUrl+"segroup.action"; 
        hostDevDataUrl =deviceUrl+"?operator=devlist";
        groupDataUrl =segroupUrl+"?operator=query";
        fnInitEvent();
//      fnInitPage.fnInitOnlyGroup();
        fnInitPage.fnInitGroupInfo();
    };

    var fnInitPage = function () {
        return{
            fnInitOnlyGroup :function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: deviceUrl+"?operator=segroup&groupId=0&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            $(".page-content").css("opacity","1");
                            if(data !=null){
                                if(data.code===0){
                                    var groupInfo = data.data;
                                    if(groupInfo ==null){
                                    	groupInfo =[];
                                    }
                                    DefaultDevInfo = groupInfo;
                                    var map = {
                                        "DevTypeId": -1,
                                    };
                                    groupInfo.push(map);
                                    var lastSize= groupInfo.length - parseInt(groupInfo.length/3);
                                    var len = parseInt(groupInfo.length/3);
                                    var htmlJson = {"data":groupInfo,"len":len,"lastSize":lastSize};

                                    var htmlStr = doT.template($("#deviceListTemplate").text());
                                    $("#deviceList").html(htmlStr(htmlJson));
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }
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
            },
            fnInitGroupInfo : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: groupDataUrl+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            $(".page-content").css("opacity","1");
                            if(data !=null){
                                if(data.code===0){
                                    var groupInfo = data.data;
                                    if(groupInfo ==null){
                                    	$("#energyGroup").empty();
                                    }else{
                                    	GroupAll = groupInfo;
	                                    var htmlJson = {"data":groupInfo};
	                                    var htmlStr = doT.template($("#energyGroupTemplate").text());
	                                    $("#energyGroup").html(htmlStr(htmlJson));
	                                    
	                                    for(var i=0;i<groupInfo.length;i++){
	                                        var groupId = groupInfo[i].groupId;
	                                         fnInitPage.fnDevList(groupId);
	                                    }
                                    }
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }
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
            },
            fnDevList : function (groupId) {
	            var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
	                type: 'get',
	                url: deviceUrl+"?operator=segroup&groupId="+groupId+"&SessionId="+SessionId,
	                success: function (data, textStatus, jqXHR) {
	                    if(textStatus==="success"){
	                        $(".page-content").css("opacity","1");
	                        if(data !=null){
	                            if(data.code===0){
                                    var groupInfo = data.data;
                                    DeviceAll = groupInfo;
                                    if(groupInfo ==null){
                                    	groupInfo =[];
                                    }
                                    if(groupId !=0){                               
                                        var map = {
                                            "DevTypeId": -1,
                                        };
                                        groupInfo.push(map);
                                        var lastSize= groupInfo.length - parseInt(groupInfo.length/3);
                                        var len = parseInt(groupInfo.length/3);
                                        var htmlJson = {"data":groupInfo,"len":len,"lastSize":lastSize,"groupId":groupId};
										var htmlStr = doT.template($("#deviceListTemplate").text());
//                                      var htmlStr = doT.template($("#groupDeviceListTemplate").text());
                                        $("#group"+groupId).html(htmlStr(htmlJson));
                                    }
                                    
	                            }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }
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
	        }
        }
    }();

    var fnInitDevice = function () {
        return{
            fnAlloGroup:function (devId) {
                if(GroupAll !=undefined){
                    var htmlJson = {"data":GroupAll};
                    var htmlStr = doT.template($("#alloGroupTemplate").text());
                    layer.open({
                        title: ["设备分组"],
                        content: htmlStr(htmlJson),
                        btn: ['添加','取消'],
                        yes:function () {
                           var groupId = $("#alloGroupInfo").find("input[type=radio]:checked").val();
                           if(groupId == undefined || groupId == null){
                           	
                           }else{
                           	 	layer.closeAll();
	                            var data = devId+"-"+groupId;
	                            fnInitDevice_Operator.fnAlloGroup_ajax(data);
                           }
                           
                        }
                    });
                    $("input").uniform();
                    $(".scroller").slimScroll({
                        size: '7px',
                        color: '#a1b2bd',
                        position: 'right',
                        height: 280,
                        alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });
                }
            },
            fnDelDevInfo:function (devId) {
                layer.open({
                    title: ["提示"],
                    content: '<div style="text-align: center;min-height: 60px;">请确认是否删除设备？</div>'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.closeAll();
                        fnInitDevice_Operator.fnDelDev_ajax(devId);
                    }
                });
            },
        }
    }();

    var fnInitDevice_Operator = function () {
        return{
            fnDelDev_ajax:function (devId) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: deviceUrl,
                    data:{
                    	"operator":"delete",
                    	"devId":devId,
                    	"SessionId":SessionId
                    },
                    success: function (data, textStatus, jqXHR) {
//                  	fnInitPage.fnInitOnlyGroup();
                        if(textStatus==="success"){
                            if(data.code===0){
                            	fnRefresh();
                                CommonJS.fnMessageSuccess("设备删除成功,请确认信息.");
                            }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                }else{
                                CommonJS.fnMessageError("设备删除失败,请确认信息.");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备删除失败,请确认信息.");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnAlloGroup_ajax:function (data) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: baseUrl+"device.action",
                    data:{
                        "operator":"group",
                        "data":data,
                        "SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                	fnRefresh();
                                    CommonJS.fnMessageSuccess("设备分组成功");
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError("设备分组失败");
                                }
                            }else{
                                CommonJS.fnMessageError("设备分组失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备分组失败");
                    },
                });
                $.ajax(ajaxParam);
            }
        }
    }();

    var fnInitGroup = function () {
        return{
            fnAddGroup:function () {
                fnInitGroup_Operator.fnMdfGroup_ajax();
            },
            fnMdfGroup:function (groupId,groupName,area,capacity) {
                var htmlJson = {"group":groupName,'groupArea':area,"groupPeople":capacity};
                var htmlStr = doT.template($("#addGroupTemplate").text());
                layer.open({
                    title: ["修改节能组"],
                    content: htmlStr(htmlJson),
                    btn: ['修改','取消'],
                    yes:function () {
                        var valid = $("#addGroupForm").valid();
                        if(valid){
                            fnInitGroup_Operator.fnMdfGroup_ajax(groupId);
                        }
                    },
                });
                fnInitValid.fnMdfGroupValid(groupName);
            },
            fnDelGroup:function (groupId) {
                layer.open({
                    title: ["提示"],
                    content: '<div style="text-align: center;min-height: 60px;">若删除该组，相应的设备也会删除，请确定是否删除该组？</div>'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        layer.closeAll();
                        fnInitGroup_Operator.fnDelGroup_ajax(groupId);
                    }
                });
            },
            fnMoveDev:function (devId,groupId) {
                layer.open({
                    title: ["提示"],
                    content: '<div style="text-align: center;min-height: 60px;">请确认把设备从该组移除？</div>'
                    ,btn: ['确定', '取消']
                    ,yes: function(){
                        layer.closeAll();
                        fnInitGroup_Operator.fnMoveDev_ajax(devId,0);
                    }
                });
            },
            fnAddDevGroup:function (groupId) {
                if(DefaultDevInfo !=undefined){
                    var htmlJson = {"data":DefaultDevInfo};
                    var htmlStr = doT.template($("#addDevGroupTemplate").text());
                    layer.open({
                        title: ["组分配设备"],
                        content: htmlStr(htmlJson),
                        btn: ['添加','取消'],
                        yes:function () {
                            var checks = $("#addDevGroupInfo").find("input[type=checkbox]:checked");
                            var data = "";
                            $.each(checks,function (key,val) {
                                var devId  = $(val).val();
                                data = data+devId+"-"+groupId+";";
                            })
                            layer.closeAll();
                            fnInitGroup_Operator.fnAddDevGroup_ajax(data);

                        }
                    });
                    $("input").uniform();
                    $(".scroller").slimScroll({
                        size: '7px',
                        color: '#a1b2bd',
                        position: 'right',
                        height: 280,
                        alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });
                }

            },
        }
    }();

    var fnInitGroup_Operator = function () {
        return{
            fnMdfGroup_ajax:function (groupId) {
                var name = $("#groupName").val();
                var groupPeople = $("#groupPeople").val();
                var groupArea = $("#groupArea").val();
                var text = "组添加";
                var groupClass = new PublicConstant.GroupClass();
                if(groupId !=undefined){
                    groupClass.groupId = groupId;
                    text = "组修改";
                }
                groupClass.groupName = name;
                groupClass.capacity = groupPeople;
                groupClass.area = groupArea;
                layer.closeAll();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: segroupUrl,
                    data:{
                        "operator":"mdf",
                        "data":JSON.stringify(groupClass),
                        "SessionId":SessionId
                    },
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(data !=null){
                                if(data.code===0){
                                	fnRefresh();
                                    CommonJS.fnMessageSuccess(text+"成功");
                                }else if(data.code === 5){
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
            fnDelGroup_ajax:function (groupId) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: segroupUrl,
                    data:{
                    	"operator":"delete",
                    	"groupId":groupId,
                    	"SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                	fnRefresh();
                                    CommonJS.fnMessageSuccess("删除组成功");
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError("删除组失败");
                                }
                            }else{
                                CommonJS.fnMessageError(param.message);
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("删除组失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnMoveDev_ajax:function (devId,groupId) {
                var data = devId+"-"+groupId;
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: deviceUrl,
                    data:{
                        "operator":"group",
                        "data":data,
                        "SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                	fnRefresh();
                                    CommonJS.fnMessageSuccess("设备移除成功");
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError("设备移除失败");
                                }
                            }else{
                                CommonJS.fnMessageError("设备移除失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备移除失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            fnAddDevGroup_ajax:function (data) {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'POST',
                    url: deviceUrl,
                    data:{
                        "operator":"group",
                        "data":data,
                        "SessionId":SessionId
                    },
                    success: function (param, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            if(param !=null){
                                if(param.code===0){
                                	fnRefresh();
                                    CommonJS.fnMessageSuccess("设备添加到组成功");
                                }else if(data.code === 5){
			                    	window.location.href = "login.html";
			                    }else{
                                	CommonJS.fnMessageError("设备添加到组失败");
                                }
                            }else{
                                CommonJS.fnMessageError("设备添加到组失败");
                            }
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("设备添加到组失败");
                    },
                });
                $.ajax(ajaxParam);
            }
        }
    }();

    var fnInitValid = function () {
        return{
            fnGroupValid : function () {
            	jQuery.validator.addMethod("sampleName", function(b, a) {
				    var flag = true;
				    if(GroupAll !=undefined){
				    	for(var i=0;i<GroupAll.length;i++){
				    		if(b == GroupAll[i].groupName){
				    			flag = false;
				    		}
				    	}
				    }
				    return flag;
				}, "");
                var $form = $("#addGroupForm");
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
                        groupName: {
                            required: true,
                            sampleName:true,
                            maxlength:16,
                            minlength:2
                        },
                        groupPeople: {
                            required: true,
                            digits:true,
                        },
                        groupArea: {
                            required: true,
                            number:true,
                        },
                    },
                    messages: {
                        groupName: {
                            required: "请输入名称",
                            sampleName:"名称已经存在",
                            maxlength:'请输入最多16个字符',
                            minlength:'请输入最少2个字符'
                        },
                        groupPeople: {
                            required: "请输入容纳人数",
                            digits:'请输入整数',
                        },
                        groupArea: {
                            required: "请输入面积",
                            number:'请输入数字',
                        }
                    },
                });
                $form.validate(formParam);
            },
            fnMdfGroupValid : function (groupName) {
            	jQuery.validator.addMethod("mdfSampleName", function(b, a) {
				    var flag = true;
				    if(GroupAll !=undefined && groupName !=b){
				    	for(var i=0;i<GroupAll.length;i++){
				    		if(b == GroupAll[i].groupName){
				    			flag = false;
				    		}
				    	}
				    }
				    return flag;
				}, "");
                var $form = $("#addGroupForm");
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
                        groupName: {
                            required: true,
                            mdfSampleName:true,
                            maxlength:16,
                            minlength:2
                        },
                    },
                    messages: {
                        groupName: {
                            required: "请输入名称",
                            mdfSampleName:"名称已经存在",
                            maxlength:'请输入最多16个字符',
                            minlength:'请输入最少2个字符'
                        }
                    },
                });
                $form.validate(formParam);
            },
        }

    }();

    var fnInitEvent = function () {

        $("#addGroup").on("click",function () {
            var htmlJson = {"group":'','groupArea':'',"groupPeople":''};
            var htmlStr = doT.template($("#addGroupTemplate").text());
            layer.open({
                title: ["添加节能组"],
                content: htmlStr(htmlJson),
                btn: ['添加','取消'],
                yes:function () {
                    var valid = $("#addGroupForm").valid();
                    if(valid){
                        fnInitGroup.fnAddGroup();
                    }
                }
            });
            fnInitValid.fnGroupValid();
        });
    };

    var fnGetDevInfo = function (devType,devId) {
        if(devType !=null || devType !=undefined){
            $.cookie("xw_host_devType",devType, {
                expires: 1
            });
            $.cookie("xw_host_devId",devId, {
                expires: 1
            });
        }
       window.location.href = "deviceInfo.html";
    };
	
	var fnRefresh = function(){
//		fnInitPage.fnInitOnlyGroup();
        fnInitPage.fnInitGroupInfo();
	}


    return{
        fnInit:fnInit,
        fnGetDevInfo:fnGetDevInfo,
        fnDelDevInfo:fnInitDevice.fnDelDevInfo,
        fnAlloGroup:fnInitDevice.fnAlloGroup,
        fnMoveDev:fnInitGroup.fnMoveDev,
        fnMdfGroup:fnInitGroup.fnMdfGroup,
        fnDelGroup:fnInitGroup.fnDelGroup,
        fnAddDevGroup:fnInitGroup.fnAddDevGroup
    }

}();