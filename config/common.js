/**
 * Created by chengyezheng on 2017/7/27.
 */
var CommonJS = function () {
    var userName,SessionId;
    var fnInitShowPage = function () {
        userName = $.cookie("xw_terminal_userName");
        SessionId = $.cookie("xw_terminal_SessionId");
        if(SessionId ==null || SessionId =="null"){
//          window.location.href="login.html";
        }
        $("#xw_username").text(userName);
    };

    var fnInitEventPage = function () {
        $(".dropdown-menu li").addClass("topClass");

        $(".modal").draggable();

        $("body").delegate("#exit_system","click",function (e) {
            fnQuitLogin();
            $("#exit_system").get(0).href = "login.html";

        });
        $("body").delegate("#exit_system_mobile","click",function (e) {
            fnQuitLogin();
            $("#exit_system_mobile").get(0).href = "login.html";

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

    //退出当前登录
    var fnQuitLogin = function () {
        $.cookie("xw_terminal_userName",null);
        $.cookie("xw_terminal_SessionId",null);
    };
	
	


    return{
        fnInit:function () {
          fnInitShowPage();
          fnInitEventPage();
        },
        StartRefreshPlan:StartRefreshPlan,
        Map:Map,
        fnMessageError:fnMessageError,
        fnMessageAlert:fnMessageAlert,
        fnMessageSuccess:fnMessageSuccess,
        fnAppendOption:fnAppendOption,
    }

}();