/**
 * Created by Mars on 2018/9/3.
 */
var MyInfo = function () {
	var baseUrl = PublicConstant.baseUrl;
    var machineUrl = baseUrl+"machine.action?";
    var machineHardUrl = machineUrl+"operator=hardware";
    var machineSoftUrl = machineUrl+"operator=software";
    var energyParamUrl = machineUrl+"operator=param";
    
    var timeInterval,SessionId,userName;
    var baseUrl,machineUrl,machineHardUrl,machineSoftUrl,energyParamUrl;
    var fnInit = function () {
    	SessionId = $.cookie("xw_terminal_SessionId");
    	baseUrl = $.cookie("xw_terminal_baseUrl");
    	if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
    	userName = $.cookie("xw_terminal_userName");
//  	baseUrl = PublicConstant.baseUrl;
       machineUrl = baseUrl+"machine.action?";
       machineHardUrl = machineUrl+"operator=hardware";
       machineSoftUrl = machineUrl+"operator=software";
       energyParamUrl = machineUrl+"operator=param";
        fnInitEvent();
        fnInitPage.fnInitEnergy();
        fnInitPage.fnInitHostHard();
        fnInitPage.fnInitHostSoft();
    };

    var fnInitPage = function () {
        return{
            //查询节能参数
            fnInitEnergy : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: energyParamUrl+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            var ele_price = pData.ele_price;                        
                            $("#ele_price").text(ele_price);
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
            //查询硬件版本
            fnInitHostHard : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: machineSoftUrl+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            var serialNo = pData.serialNo;
                            var vb_master = pData.vb_master;
                            var vb_slaver = pData.vb_slaver;
                            $("#hostNo").text(serialNo);
                            $("#corePanel").text(vb_master);
                            $("#loadPanel").text(vb_slaver);
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
            //查询软件版本
            fnInitHostSoft : function () {
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'get',
                    url: machineHardUrl+"&SessionId="+SessionId,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                            var pData = data.data;
                            var v_sdcs = pData.v_sdcs;
                            var v_hdcs = pData.v_hdcs;
                            var vb_slaver = pData.vb_slaver;
                            var v_media = pData.v_media;
                            var v_dsyn = pData.v_dsyn;
                            var v_db = pData.v_db;

                            $("#v_sdcs").text(v_sdcs);
                            $("#v_hdcs").text(v_hdcs);
                            $("#loadPanel").text(vb_slaver);
                            $("#v_media").text(v_media);
                            $("#v_dsyn").text(v_dsyn);
                            $("#v_db").text(v_db);
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
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

    var fnInit_Operator = function () {
        return{
            //修改密码
            fnMdfPass : function () {
                var pwd = $("#newPass").val();
                layer.closeAll();
                var hexPwd = hex_md5(pwd);
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url:baseUrl+ "login.action",
                    data:{
                        "operator":"mdf_pwd",
                        "username":userName,
                        "password":hexPwd
                    },
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                        	window.location.href = "login.html";
                            CommonJS.fnMessageSuccess("密码修改成功");
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }else {
                            CommonJS.fnMessageError("密码修改失败");
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("密码修改失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            //修改节能参数
            fnMdfEnergy : function () {
                var spaceClass =  new PublicConstant.SaveEnergyClass();
                spaceClass.ele_price = $("#un_price").val();
                layer.closeAll();
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    data:{
                        "operator":"param",
                        "data":JSON.stringify(spaceClass),
                        "SessionId":SessionId
                    },
                    url: machineUrl,
                    success: function (data, textStatus, jqXHR) {
                        if(data.code===0) {
                        	fnInitPage.fnInitEnergy();
                            CommonJS.fnMessageSuccess("节能参数修改成功");
                        }else if(data.code === 5){
	                    	window.location.href = "login.html";
	                    }else {
                            CommonJS.fnMessageError("节能参数修改失败");
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        CommonJS.fnMessageError("节能参数修改失败");
                    },
                });
                $.ajax(ajaxParam);
            },
            //远程升级--ajax方法
            fnRemoteUpgradeOperator : function () {
                var cmdId = PublicConstant.controlNo.update;
                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                    type: 'post',
                    url: machineUrl,
                    data:{
                        "operator":"upgrade",
                    },
                    processData: true,
                    success: function (data, textStatus, jqXHR) {
                        if(textStatus==="success"){
                            fnUpgrade_CallBack(data);
                        }
                    },
                    error: function (xhr, textStatus, error) {
                        $('#id_btn_dlgclose').attr("disabled", false);
                        $('#id_btn_dlgclose').css("color", "green");
                    },
                });
                $.ajax(ajaxParam);

                function fnUpgrade_CallBack(paramArray) {
                    timeInterval = setIntervalTime();
                    setTimeout(function () {
                        stopIntervalTime(timeInterval);
                    },1800000);
                }

                var setIntervalTime = function () {
                    var time = setInterval(function () {
                        poolingSystem();
                    },3000);
                    return time;
                }

                var stopIntervalTime = function (time) {
                    clearInterval(time);
                }

                var poolingSystem = function () {

                    var cmdId = PublicConstant.controlNo.updateStatus;
                    var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
                        type: 'GET',
                        url: paramSet+"?snmNo="+trData.snmNo+"&cmdId="+cmdId,
                        processData: true,
                        success: function (data, textStatus, jqXHR) {
                            if(textStatus==="success"){
                                fnPoolingSystem(data);
                            }
                        },
                    });
                    $.ajax(ajaxParam);

                    function fnPoolingSystem(paramArray) {
                        var status = "";
                        var code = paramArray.code;
                        var data = paramArray.data;
                        if(data === undefined || data ===null){
                            status = "升级失败";
                            stopIntervalTime(timeInterval);
                            // updateProgress(50);
                            controlBar.reach(0);
                            $("#updateStatus").text(status);
                            return;
                        }
                        var frameNumber = data.frameNumber;
                        var curFrame = data.curFrame;
                        var percentComplete = ((curFrame/frameNumber)* 100).toFixed(0);
                        console.info("当前帧....."+curFrame)
                        console.info("总帧....."+frameNumber)
                        if(frameNumber === null || frameNumber <=0){
                            $("#updateSubmit").css("display","inline");
                            status = "升级失败";
                            stopIntervalTime(timeInterval);
                            // updateProgress(0);
                            controlBar.reach(0);
                            $("#updateStatus").text(status);
                            return;
                        }
                        if(curFrame === null || curFrame <0){
                            $("#updateSubmit").css("display","inline");
                            status = "升级失败";
                            stopIntervalTime(timeInterval);
                            // updateProgress(0);
                            controlBar.reach(0);
                            $("#updateStatus").text(status);
                            return;
                        }
                        if(curFrame > frameNumber){
                            $("#updateSubmit").css("display","inline");
                            status = "升级失败";
                            stopIntervalTime(timeInterval);
                            // updateProgress(0);
                            controlBar.reach(0);
                            $("#updateStatus").text(status);
                            return;
                        }
                        // updateProgress(percentComplete);
                        controlBar.reach(percentComplete);
                        if (code==-2){
                            $("#updateSubmit").css("display","inline");
                            status = "升级失败";
                            stopIntervalTime(timeInterval);
                        }else if (code==-4){
                            $("#updateSubmit").css("display","inline");
                            stopIntervalTime(timeInterval);
                            status = "等待超时";
                        }else if (code==-1){
                            $("#updateSubmit").css("display","inline");
                            stopIntervalTime(timeInterval);
                            status = "设备正忙";
                        }else if (code==0){
                            $("#updateSubmit").css("display","none");
                            stopIntervalTime(timeInterval);
                            status = "升级成功";
                        }else if (code==1){
                            $("#updateSubmit").css("display","none");
                            status = "正在升级";
                        }else if (code==2){
                            $("#updateSubmit").css("display","none");
                            status = "请求升级";
                        }else if (code==3){
                            status = "请求解锁";
                            stopIntervalTime(timeInterval);
                        }else if (code==4){
                            status = "解锁成功";
                            stopIntervalTime(timeInterval);
                        }else {
                            status = "未知";
                            stopIntervalTime(timeInterval);
                        }
                        $("#updateStatus").text(status);
                    }


                }
            },
        }
    }();

    var fnInitValid = function () {
        return{
            fnMdfPassValid : function () {
                var $form = $("#mdfPassForm");
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
//                      oldPass: {
//                          required: true,
//                          maxlength:18,
//                          minlength:2,
//                      },
                        newPass: {
                            required: true,
                            maxlength:18,
                            minlength:2,
                        },
                        okPass: {
                            required: true,
                            equalTo:"#newPass",
                            maxlength:18,
                            minlength:2,
                        },
                    },
                    messages: {
//                      oldPass: {
//                          required: "旧密码不能为空",
//                          maxlength:"密码最多18个字符",
//                          minlength:"密码不能少于2个字符"
//                      },
                        newPass: {
                            required: "新密码不能为空",
                            maxlength:"密码最多18个字符",
                            minlength:"密码不能少于2个字符"
                        },
                        okPass: {
                            required: "确认密码不能为空",
                            equalTo:"两次密码不一致",
                            maxlength:"密码最多18个字符",
                            minlength:"密码不能少于2个字符"
                        },
                    },
                });
                $form.validate(formParam);

            },
            fnEnergyParamValid:function () {
                var $form = $("#energyParam");
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
                        un_price: {
                            required: true,
                            number:true,
                        }
                    },
                    messages: {                       
                        un_price: {
                            required: "请输入价格",
                            number:"请输入数字",
                        },
                    },
                });
                $form.validate(formParam);
            }
        }
    }();

    var fnInitEvent = function () {
        $("#mdfPass").on("click",function () {
            var pass =$("#passWordTemplate").text();
            layer.open({
                title: ["修改密码"],
                content: pass,
                btn: ['修改', '取消'],
                yes: function(){
                    var valid = $("#mdfPassForm").valid();
                    if(valid){
                        fnInit_Operator.fnMdfPass();
                    }
                }
            });
            fnInitValid.fnMdfPassValid();
        });

        $("#setEnergy").on("click",function () {
            var energyParam =$("#energyParamTemplate").text();
            layer.open({
                title: ["设置节能参数"],
                content: energyParam,
                btn: ['连接', '取消'],
                yes: function(){
                    var valid = $("#energyParam").valid();
                    if(valid){
                        fnInit_Operator.fnMdfEnergy();
                    }
                }
            });
            var ele_price = $("#ele_price").text();
            console.info("ele_price="+ele_price)
            $("#un_price").val(ele_price);
            fnInitValid.fnEnergyParamValid();
        });

        $("#remoteUpgrade").on("click",function () {
            $("#updateModal").modal("show");

            fnInit_Operator.fnRemoteUpgradeOperator();
        });

        $("#updateModal").on("hide.bs.modal",function () {
            // progressJs("#updateProgress").end();
            $("#updateStatus").text("");
            $("#updateSubmit").css("display","none");
        });

        $("#updateModal").on("shown.bs.modal",function () {
            controlBar = $('#updateModal .number-pb').NumberProgressBar({
                // duration: 12000,
                percentage: 0

            });
        });

        $("#updateSubmit").on("click",function () {
            fnRemoteUpgrade_OpenClose();
        });
    }
    
    return{
        fnInit:function () {
            fnInit();
        }
    }
}();