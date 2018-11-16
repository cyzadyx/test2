/**
 * Created by chengyezheng on 2017/7/27.
 */
var CommonJS = function () {
    var login_outUrl = "";
    var userUrl = "";
    var menuUrl = "";
    var devicesUrl = "";
    var devAlarmUrl = "";
    var userName,userId;
    var fnInitShowPage = function () {
        userName = $.cookie("xw_terminal_userName");
        SessionId = $.cookie("xw_terminal_SessionId");
        if(SessionId ==null || SessionId =="null"){
//          window.location.href="login.html";
        }
        $("#xw_username").text(userName);
    };

    var fnInitEventPage = function () {
        $("body").delegate("#province","change",function (key,value) {
            var val = $("#province").find(":selected").val();
            var loc	= new Location();
            loc.fillOption("city",val);
        });

        $("body").delegate("#exit_system","click",function (e) {
            fnQuitLogin();
            $("#exit_system").get(0).href = "../login.html";

        });
        
         $("body").delegate("#exit_system_mobile","click",function (e) {
            fnQuitLogin();
            $("#exit_system_mobile").get(0).href = "login.html";

        });

        $("body").delegate("#id_navigator .sidebar-toggler","click",function (e) {
            if($("table").DataTable !=null){
                var tableLen= $(".table-full-width").length;
                if(tableLen !=0 && $("#roomRelateSnmTable").length ==0 && $("#roomRelateDevTable").length ==0){
                    var historyDataTable= $("#historyDataTable").length;
                    if(historyDataTable != 1){
                        $("table").DataTable().draw(false);
                    }
                    var historyDataTable_wrapper = $("#historyDataTable_wrapper").length;
                    if(historyDataTable_wrapper != 0){
                        $("table").DataTable().draw(false);
                    }
                }

            }
        });
        // $("body").delegate("#id_navigator ul","click",function (e) {
        //     // var tag = $(this).find("li");
        //     // alert(tag)
        // });
    };

    //设置当前登录用户
    var SetSysUser = function (userObj) {
        var json_userObj = JSON.stringify(userObj);
        $.cookie("authorityUser", json_userObj, {
            expires: 7
        });
    }

    //获得当前登录用户
    var GetSysUser = function () {
        var jsonUser = $.cookie("authorityUser");
        if (null != jsonUser) {
            return JSON.parse(jsonUser);
        }
    }


    var fnLocationShow =function () {
        /*省市联动*/
        var loc	= new Location();
        loc.fillOption("province","0");
    }

    //菜单获取信息--ajax方法
    var fnNavBar = function (pageNow,pageSub) {

        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: menuUrl+"?operator=menu&userid="+userId,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    fnGetData_CallBack(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

        function fnGetData_CallBack(paramArray) {
            if (paramArray.code === 0) {
                var data = paramArray.data;
                fnShowNav(data,pageNow,pageSub);
            }
        }

    }

    //展示菜单信息--数据处理
    var fnShowNav = function (data,pageNow,pageSub) {

        var htmlJson = {"data":data.sons,"pageNow":pageNow,"pageSub":pageSub};
        var htmlStr = doT.template($("#NavBarTemplate").text());
        var html = htmlStr(htmlJson);
        $("#id_navigator").append(html);
        fnShowAlertMessagePage();
    }

    var $DataTable = function(tableParam,tableId,title){
        //公共方法
        var $dataTable = $('#'+tableId);
        var $tableParam = $dataTable.DataTable(tableParam);
        var Str = doT.template($("#ActionsTemplate").text());
        $('#' + tableId + '_filter label').append(Str(title));
        fndoTableVisbleColumn(tableId,$tableParam);
        $("input").uniform();
        $('#' + tableId + '_wrapper .dataTables_filter input').addClass("m-wrap small");
        $('#' + tableId + '_wrapper .dataTables_length select').addClass("m-wrap small");
        return $tableParam;
    };

    var fnGetTableSelected = function ($table) {
        var nTrs = $table.context[0].aoData;
        var trData ;
        for(var i = 0; i < nTrs.length; i++){
            if($(nTrs[i].nTr).hasClass('trselected')){
                trData= nTrs[i]._aData;
            }
        }
        return trData;
    }

    var fndoTableVisbleColumn = function(tableId, $tableParam) {
        /**增加表格下拉列属性的手动选择显示列项 */
        var fnGetTableVisibleColumnNumber = function() {
            var nVisibleColumnNumber = 0;
            $('#' + tableId + '_filter input[type="checkbox"]').each(function() {
                var iCol = parseInt($(this).attr("data-column"));
                var bVisible =$tableParam.columns([iCol]).visible;
                // var bVisible =$tableParam.fnSettings().aoColumns[iCol].bVisible;
                if (bVisible[0] !=0) {
                    nVisibleColumnNumber++;
                }
            });
            return nVisibleColumnNumber;
        };
        /* 增加減少列数 */
        $('#' + tableId + '_filter input[type="checkbox"]').change(function() {
            var iCol = parseInt($(this).attr("data-column"));
            var bVis =$tableParam.columns([iCol]).visible();
            // var bVis = $tableParam.fnSettings().aoColumns[iCol].bVisible;
            // 去掉列需判断是否是最后一个
            if (bVis[0] !=0) {
                var nVisibleColumnNumber = fnGetTableVisibleColumnNumber();
                if (nVisibleColumnNumber === 1) {
                    $(this).attr("checked", true);
                    $(this).uniform();
                    return;
                }
                $tableParam.columns( [iCol] ).visible(false);
            }else{
                $tableParam.columns( [iCol] ).visible(true);
            }
            // $tableParam.fnSetColumnVis(iCol, (bVis ? false : true));
        });
    };

    var Map = function () {
        this._entrys = new Array();

        this.put = function (key, value) {
            if (key == null || key == undefined) {
                return;
            }
            var index = this._getIndex(key);
            if (index == -1) {
                var entry = new Object();
                entry.key = key;
                entry.value = value;
                this._entrys[this._entrys.length] = entry;
            } else {
                this._entrys[index].value = value;
            }
        };
        this.get = function (key) {
            var index = this._getIndex(key);
            return (index != -1) ? this._entrys[index].value : null;
        };
        this.remove = function (key) {
            var index = this._getIndex(key);
            if (index != -1) {
                this._entrys.splice(index, 1);
            }
        };
        this.clear = function () {
            this._entrys.length = 0;;
        };
        this.contains = function (key) {
            var index = this._getIndex(key);
            return (index != -1) ? true : false;
        };
        this.getCount = function () {
            return this._entrys.length;
        };
        this.getEntrys = function () {
            return this._entrys;
        };
        this.getIndex = function (index) {
            return (index > -1 && index < this._entrys.length) ? this._entrys[index].value : null;
        };
        this._getIndex = function (key) {
            if (key == null || key == undefined) {
                return -1;
            }
            var _length = this._entrys.length;
            for (var i = 0; i < _length; i++) {
                var entry = this._entrys[i];
                if (entry == null || entry == undefined) {
                    continue;
                }
                if (entry.key === key) { //equal
                    return i;
                }
            }
            return -1;
        };
    };

    var StartRefreshPlan =function (refreshMap) {
        var entries = refreshMap.getEntrys();
        for (var i = 0; i < entries.length; ++i)
            window.setInterval(entries[i].key, entries[i].value);
    };

    var fnMessageSuccess = function (text) {
        /*消息提示--公共方法*/
        $.gritter.add({
            title: "提示",
            text: text,
            time: 3000,
            class_name: 'message-info'
        });
    };

    var fnMessageAlert = function (text) {
        $.gritter.add({
            title: "提示",
            text: text,
            time: 3000,
            class_name: 'message-alert'
        });
    }

    var fnMessageError = function (text) {
        $.gritter.add({
            title: "提示",
            text: text,
            time: 3000,
            class_name: 'message-error'
        });
    };

    var fnAppendOption = function (el_id,data) {
        var el	= $('#'+el_id);
        el.empty();
        el.append("<option value='select' name='--请选择--'>--请选择--</option>");
        var htmlStr = doT.template($("#OptionTemplate").text());
        el.append(htmlStr(data));
        el.chosen({search_contains: true,no_results_text:"搜索不存在"});
        el.trigger("liszt:updated");
        // el.select2({
        //     noResults:function(){return"搜索不存在..."}
        // });
    };

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var getNowFormatDate = function (isTody) {
        var date = new Date();
        var strDate = null;
        if (isTody == 0) {
            strDate = date.getDate();
        } else if (isTody == -1) {
            date.setTime(date.getTime() - 24*60*60*1000);
            strDate = date.getDate();

        }
        var year = date.getFullYear();
        var month = date.getMonth()+1;

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + "-" + month + "-" + strDate;

        return currentdate;
    };

    var handleTableEvent = function() {
        /**
         * 表格事件处理。
         */
        /* 当鼠标选中一行时，当前一行背景变色 */
        $("table").on("click", "tr", function(e) {
            var rTr = $(this);
            fnClickTableTr(rTr, e.target);

        });

        /* 表格页面发生变化时的事件处理 */
        $("table").on("page.dt", function() {
            var rCurTable = $(this);
            rCurTable.find(".group-checkable").attr("checked", false);
            rCurTable.find(".checkboxes").attr("checked", false);
            rCurTable.find("tr").removeClass("trselected");
            rCurTable.find("td").removeClass("trselected");
        });
    }

    var fnClickTableTr = function(rTr, target) {
        /**
     * 鼠标点击表格事件处理
     *
     * @param {Object} rTr		鼠标点击所在行
     * @param {Object} target	鼠标点击时的目标对象
     */
        /* 如果是全选按钮 */
        var rCheckAll = rTr.find(".group-checkable")[0];
        if (target == rCheckAll) {
            var checked = $(rCheckAll).attr("checked");
            var trList = rTr.parent().siblings("tbody").children("tr");
            $(trList).each(function() {
                var rCheckBox = $(this).find(".checkboxes");
                if (checked) {
                    rCheckBox.attr("checked", true);
                    $(this).addClass("trselected");
                    $(this).find("td").addClass("trselected");
                } else {
                    rCheckBox.attr("checked", false);
                    $(this).removeClass("trselected");
                    $(this).find("td").removeClass("trselected");
                }
            });
            $.uniform.update();
            return;
        }

        /* 如果选择了表头勾选框以外的地方，不做响应*/
        var rThSize = rTr.find("th").length;
        if (rThSize > 0) {
            return;
        }

        /* 如果选择了一行的checkBox */
        var rCheckBox = rTr.find(".checkboxes")[0];
        rCheckAll = rTr.parent().siblings("thead").find(".group-checkable")[0];
        if (target == rCheckBox) {
            var checked = $(rCheckBox).attr("checked");
            if (checked) {
                rTr.addClass("trselected");
                rTr.find("td").addClass("trselected");

                /* 如果没有全选按钮，这种情况出现在一个表格只能勾选一行的情况。 */
                if (!rCheckAll) {
                    // rTr.siblings().removeClass("trselected");
                    // rTr.siblings().find("td").removeClass("trselected");
                    // rTr.siblings().find(".checkboxes").attr("checked", false);
                } else {
                    /* 判断是否需要让全选按钮勾选 */
                    var nChecked = rTr.parent().find(".checked").size();
                    var nTrCount = rTr.parent().find("tr").size();
                    if (nChecked == nTrCount) {
                        $(rCheckAll).attr("checked", true);
                    }
                }
            } else {
                rTr.removeClass("trselected");
                rTr.find("td").removeClass("trselected");
                $(rCheckAll).attr("checked", false);
            }
            $.uniform.update();
            return;
        }

        /* 如果选择了一行勾选框的空白处 */
        var rFistTd = rTr.find("td").first()[0];
        if (rCheckBox && (target == rFistTd)) {
            return;
        }

        rTr.siblings().removeClass("trselected");
        rTr.siblings().find("td").removeClass("trselected");
        rTr.addClass("trselected");
        rTr.find("td").addClass("trselected");
        if (rCheckBox) {
            rTr.siblings().find(".checkboxes").attr("checked", false);
            /*如果整个表格只有一行数据，全选选中，否则全选不选中 */
            if (rTr.parent().find("tr").size() == 1) {
                $(rCheckAll).attr("checked", true);
            } else {
                $(rCheckAll).attr("checked", false);
            }
            $(rCheckBox).attr("checked", true);
            $.uniform.update();
        }
    };

    //设备信息--数据
    var fnGetDevData = function (devId,Img) {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: devicesUrl+"?operator=specdev&devId="+devId,
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    fnGetData_CallBack(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

        function fnGetData_CallBack(paramArray) {
            if (paramArray.code === 0) {
                var data = paramArray.data;
                if(data.length !=0){
                    var isAllocated = "未分配";
                    if(data.isAllocated){
                        isAllocated="已分配";
                    }
                    var devData=[
                        [
                            {"name":"设备名称:","displayName":data.devName},
                            {"name":"设备类型:","displayName":data.devType}],
                        [
                            {"name":"设备编码:","displayName":data.devNo},
                            {"name":"分配状态:","displayName":isAllocated}],
                        [
                            {"name":"所属机房:","displayName":data.dataRoom},
                            {"name":"所属接入间:","displayName":data.accRoom},
                        ],
                        [
                            {"name":"所属SNM模块:","displayName":data.snmModule},
                        ],
                        [
                            {"name":"通信地址:","displayName":data.comAddr},
                            {"name":"IP地址:","displayName":data.snmpIp}
                        ],
                        [
                            {"name":"上次通信时间:","displayName":data.lastContactTime},
                            {"name":"投入时间:","displayName":data.startTime},
                        ],
                    ];
                    var htmlJson = {"data":devData};
                    var htmlStr = doT.template($("#FormInfoTemplate").text());
                    $("#devInfo").html(htmlStr(htmlJson));
                    $("#snmNo").text(data.snmModule);

                    if(Img =="img"){
                        var src = PublicConstant.fnGetImgByType(data.devCatetoryId,data.devTypeId,false);
                        var img = "<img class='card-img lazy' src="+src+" style='display: inline;max-height: 236px'>";
                        $("#imgContent").html(img);
                    }
                }
            }
        }
    }

    //告警信息--数据
    var fnGetAlarmData = function (devCatetoryId,devTypeId,devId,flag) {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: devAlarmUrl+"?operator=device_alarm_detail&devId="+devId,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    fnGetData_CallBack(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);
        function fnGetData_CallBack(paramArray) {
            if(paramArray.code===0){
                var alarmInfos = paramArray.data.alarmInfos;
                var img = PublicConstant.fnGetImgByType(devCatetoryId,devTypeId,flag);
                var htmlJson = {"alarm":alarmInfos.length,"img":img};
                var htmlStr = doT.template($("#DevAlarmTemplate").text());
                $("#alarmMessage").html(htmlStr(htmlJson));
            }
        }
    }

    /*初始化模拟量选择类型以及时间*/
    var fnGetMonitorSide = function (devCatetoryId,devTypeId) {
        var selectMonitorJson = PublicConstant.fnGetTypeMonitorSide(devCatetoryId,devTypeId);
        var selectMonitorStr = doT.template($("#SelectTemplate").text());
        $("#monitorSide").html(selectMonitorStr(selectMonitorJson));

        var selectTimeJson = PublicConstant.fnGetMonitorTime();
        var selectTimeStr = doT.template($("#SelectTemplate").text());
        $("#activeTime").html(selectTimeStr(selectTimeJson));
    };


    var fnShowAlertMessagePage = function () {
        //相关设备信息
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'get',
            url: devAlarmUrl+"?operator=device_alarm_point&userId="+userId,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    showAlertData_Callback(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

        function showAlertData_Callback(paramArray) {
            if(paramArray.code===0){
                $("#id_navigator").find("a[href=alarm_manage] .alarm-badge").remove();
                var hasDevWarning = paramArray.data.hasDevWarning;
                var playAudio = paramArray.data.playAudio;
                if(hasDevWarning){
                    var htmlStr = "<span class='alarm-badge'>&nbsp;</span>";
                    $("#id_navigator").find("a[href=alarm_manage]").append(htmlStr);

                }else{
                    $("#id_navigator").find("a[href=alarm_manage] .alarm-badge").remove();
                }
                if(playAudio){
                    alarmAudo();
                }

            }
        }
    };

    function alarmAudo() {
        var borswer = window.navigator.userAgent.toLowerCase();
        if ( borswer.indexOf( "ie" ) >= 0 )
        {
            //IE内核浏览器
            var strEmbed = '<embed name="embedPlay" src="./static/my/image/audo/alarm.mp3" autostart="true" hidden="true" loop="false"></embed>';
            if ( $( "body" ).find( "embed" ).length <= 0 )
                $( "body" ).append( strEmbed );
            var embed = document.embedPlay;

            //浏览器不支持 audion，则使用 embed 播放
            embed.volume = 100;
            // embed.play();//这个不需要
        } else
        {
            //非IE内核浏览器
            var strAudio = "<audio id='audioPlay' src='./static/my/image/audo/alarm.mp3' hidden='true'>";
            if ( $( "body" ).find( "audio" ).length <= 0 )
                $( "body" ).append( strAudio );
            var audio = document.getElementById( "audioPlay" );

            //浏览器支持 audion
            audio.play();
        }
    }
    
    function getParamsFromUrl(url) {
        var paramMap = new Map();
        try {
            if (null != url && "" != url) {
                var startPos = url.indexOf("?");
                var strParameters = decodeURI(url.substr(startPos + 1, url.length - startPos));
                var pairArray = strParameters.split("&");
                for (var i = 0; i < pairArray.length; ++i) {
                    var item = pairArray[i];
                    var midPos = item.indexOf("=");
                    if (-1 != midPos) {
                        var key = item.substr(0, midPos);
                        var val = item.substr(midPos + 1, item.length - midPos);
                        paramMap.put(key, val);
                    }

                }
            }
        } catch (err) {
            throw err;
        }
        return paramMap;
    }

    $("#id_a_quit").on("click",function () {
        fnQuitLogin();
        $("#id_a_quit").get(0).href = "login";

    });

    //退出当前登录
    var fnQuitLogin = function () {
        var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
            type: 'post',
            url: login_outUrl,
            data:{
                "operator":"login_out",
            },
            processData: true,
            success: function (data, textStatus, jqXHR) {
                if(textStatus==="success"){
                    fnGetData_CallBack(data);
                }
            },
            error: function (xhr, textStatus, error) {

            },
        });
        $.ajax(ajaxParam);

        $.cookie("authorityUserName",null);
        $.cookie("authorityUserId",null);
        $.cookie("modulus",null);
        $.cookie("authorityUser",null);
        $.cookie("public_exponent",null);
    }

    var fnErrorAjaxTable = function ($table,mess) {
        var title =  [{ "sTitle": "","mData":"noData","bVisible":true}];
        var data = [{"noData":mess}];
        var dataParam = $.extend(true,{},PublicConstant.Table_Default_Options,{
            "aaData":data,
            "aoColumns":title,
            "scrollX": true,
            "oLanguage": {
                "sLengthMenu": " _MENU_ 条记录每页",
                "sInfo": "显示第 0 到 0 条记录,总计 <label id='table_total'>&nbsp;0&nbsp;</label>条记录",
                "sSearch": "搜索",
                "sInfoEmpty": "无数据记录",
                "sLoadingRecords": "载入中...",
                "sInfoFiltered": "（从 _MAX_ 行数据筛选）",
                "emptyTable": "<div class='table-empty-class'>&nbsp;</div>",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "<",
                    "sNext": ">",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有相关记录！"
            },
        });
        $DataTable(dataParam ,$table,title);
    }








    return{
          fnInit:function () {
              fnInitShowPage();
              fnInitEventPage();
              handleTableEvent();
          },
          fnLocationShow:fnLocationShow,
          $DataTable:$DataTable,
          StartRefreshPlan:StartRefreshPlan,
          Map:Map,
          fnMessageError:fnMessageError,
          fnMessageAlert:fnMessageAlert,
          fnMessageSuccess:fnMessageSuccess,
          fnAppendOption:fnAppendOption,
          getNowFormatDate:getNowFormatDate,
          fnGetDevData:fnGetDevData,
          fnGetAlarmData:fnGetAlarmData,
          fnGetMonitorSide:fnGetMonitorSide,
          fnShowAlertMessagePage:fnShowAlertMessagePage,
          getParamsFromUrl:getParamsFromUrl,
          SetSysUser:SetSysUser,
          GetSysUser:GetSysUser,
          fnNavBar:fnNavBar,
          fnQuitLogin:fnQuitLogin,
          fnGetTableSelected:fnGetTableSelected,
          fnErrorAjaxTable:fnErrorAjaxTable,
    }

}();