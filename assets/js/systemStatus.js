var SystemStatus = function () {
//	var baseUrl = PublicConstant.baseUrl;
//  var machineUrl = baseUrl+"machine.action"
//  var energyStrategyUrl =machineUrl+"?operator=strategy";
    var modeData,SessionId; 
    var baseUrl,machineUrl,energyStrategyUrl;
    var fnInit = function () {
    	SessionId = $.cookie("xw_terminal_SessionId");
    	baseUrl = $.cookie("xw_terminal_baseUrl");
    	if(baseUrl ==undefined || SessionId ==undefined){
    		window.location.href ='../views/login.html';
    	}
       machineUrl = baseUrl+"machine.action"
       energyStrategyUrl =machineUrl+"?operator=strategy";
        fnInitEvent();
        fnInitSystemStatus();

    };

    //节能策略
    var fnInitSystemStatus = function () {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: energyStrategyUrl+"&SessionId="+SessionId,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    if (data.code === 0 && data.data !=null) {
                        var pData = data.data;
                        modeData = data.data;
                        var mode = pData.se_mode;
                        var enabled = pData.enabled;
                        var t_begin = pData.t_begin;
                        var t_end = pData.t_end;

                        $("#glSholdContent").find("input:radio[name='glSetting'][value='"+enabled+"']").prop("checked",true);
                        $("#glModeForm").find("input:radio[name='modeStyle'][value='"+mode+"']").prop("checked",true);
                        $("input").uniform();
                        $("#goodTempText").val(pData.p_temp);
                        $("#maxTempText").val(pData.h_temp);
                        $("#minTempText").val(pData.l_temp);
                        $("#addGlTimeContent").empty();

                        $.each(t_begin,function (index,map) {
                            fnSetTimeContent(index,t_begin[index],t_end[index]);
                        });
                        fnChangeSaveEnergy();
                        var form = $("#tempForm");
                        fnInitValid.fnInitEnergyValid(form);
                    }else if(data.code === 5){
                    	window.location.href = "login.html";
                    }
                }
            },
            error: function (xhr, textStatus, error) {
                CommonJS.fnMessageError(error);
            },
        });
        $.ajax(ajaxParam);
    };

    //设置时间段dom
    var fnSetTimeContent = function (index,start,end){
        var hwStr = doT.template($("#GlInputTimeTemplate").text());
        $("#addGlTimeContent").append(hwStr);
        $("input").uniform();
        $(".addStartTime").addClass("addStartTime"+index).removeClass("addStartTime");

        $('.addStartTime'+index).val(start);
        $('.addStartTime'+index).timepicker({
            defaultTime:start,
            minuteStep: 1,
            secondStep:1,
            showSeconds: true,
            showMeridian: false
        });

        $(".endStartTime").addClass("endStartTime"+index).removeClass("endStartTime");

        $('.endStartTime'+index).val(end);
        $('.endStartTime'+index).timepicker({
            defaultTime:end,
            minuteStep: 1,
            secondStep:1,
            showSeconds: true,
            showMeridian: false
        });
    };

    var fnChangeSaveEnergy = function () {
        var value = $("input[name='glSetting']:checked").val();
        if(value ==0 ){
            $("input[type=text]").attr("disabled",true);
            $(".form-view").addClass("grey");
            $("#addGlTime").attr("disabled",true);
            $("#addGlTimeContent").find("button").attr("disabled",true);
            $("#addGlTimeContent").find(".timeTitle").addClass("grey");
            $("#glModeForm").addClass("grey").find("input[type=radio]").attr("disabled",true);
            $("#addGlTimeContent").find(".delHwTime").attr("disabled",true).addClass("grey-info").removeClass("badge-info");
            // $("#saveStatus").attr("disabled",true);
            // $("#cellStatus").attr("disabled",true);
        }else if(value ==1){
            $("input[type=text]").attr("disabled",false);
            $(".form-view").removeClass("grey");
            $("#addGlTime").attr("disabled",false);
            $("#addGlTimeContent").find("button").attr("disabled",false);
            $("#addGlTimeContent").find(".timeTitle").removeClass("grey");
            $("#glModeForm").removeClass("grey").find("input[type=radio]").attr("disabled",false);
            $("#addGlTimeContent").find(".delHwTime").attr("disabled",false);
            $("#addGlTimeContent").find(".delHwTime").attr("disabled",false).addClass("badge-info").removeClass("grey-info");
            // $("#saveStatus").attr("disabled",false);
            // $("#cellStatus").attr("disabled",false);

        }
    }

    var fnSaveStatus = function () {
        var enabled = $("input[name='glSetting']:checked").val();
        var se_mode = $("input[name='modeStyle']:checked").val();
        var p_temp = $("#goodTempText").val();
        var l_temp = $("#minTempText").val();
        var h_temp = $("#maxTempText").val();
        var begins = $("#addGlTimeContent").find(".startTime");
        var ends = $("#addGlTimeContent").find(".endTime");
//      var t_begin = "",t_end='';
		var t_begin = [],t_end=[];
        $.each(begins,function (key ,map) {
            var begin = $(map).val();
            t_begin.push(begin)
//          t_begin=begin+","+t_begin;
        });
        $.each(ends,function (key ,map) {
            var end = $(map).val();
            t_end.push(end)
//          t_end=end+","+t_end;
        });
        var energyClass = new PublicConstant.EnergyClass();
        energyClass.enabled = enabled;
        energyClass.se_mode = se_mode;
        energyClass.l_temp = l_temp;
        energyClass.h_temp = h_temp;
        energyClass.p_temp = p_temp;
        energyClass.t_begin = t_begin;
        energyClass.t_end = t_end;

        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'post',
            url: machineUrl,
            data:{
                "operator":"strategy",
                "data":JSON.stringify(energyClass),
                "SessionId":SessionId
            },
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    if (data.code === 0) {
                        CommonJS.fnMessageSuccess("策略修改成功");
                    }else if(data.code === 5){
	                	window.location.href = "login.html";
	                }else{
                        CommonJS.fnMessageError("策略修改失败");
                    }
                }
            },
            error: function (xhr, textStatus, error) {
                CommonJS.fnMessageError("策略修改失败");
            },
        });
        $.ajax(ajaxParam);
    }

    var fnInitValid = function () {
        return{
            fnInitEnergyValid:function (form) {
                var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
                    rules: {
                        maxTempText: {
                            required: true,
                            number:true,
                        },
                        minTempText: {
                            required: true,
                            number:true,
                        },
                        goodTempText: {
                            required: true,
                            number:true,
                        }
                    },
                    messages: {
                        maxTempText: {
                            required: "请输入最高温度",
                            number:"请输入数字",
                        },
                        minTempText: {
                            required: "请输入最低温度",
                            number:"请输入数字",
                        },
                        goodTempText: {
                            required: "请输入适宜温度",
                            number:"请输入数字",
                        }
                    },
                });
                form.validate(formParam);
            }
        }
    }();

    var fnInitEvent = function () {
        $("#saveStatus").on("click",function () {
            var form = $("#tempForm");
            var valid = form.valid();
            if(valid){
                fnSaveStatus();
            }
        });

        $("#cellStatus").on("click",function () {
            fnInitSystemStatus();
        });

        $("body").delegate("#glSholdContent .radio", "click", function(e) {
            fnChangeSaveEnergy();
        });

        var flagMap = 1;
        $("body").delegate("#addGlTime", "click", function(e) {
            var hwStr = doT.template($("#GlInputTimeTemplate").text());
            $("#addGlTimeContent").prepend(hwStr);
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

        //删除红外自定义时间样式
        $("body").delegate(".delHwTime", "click", function(e) {
            $(this).closest(".icon-btn").remove();
        });

    };


    return{
        fnInit:fnInit,
    }

}();