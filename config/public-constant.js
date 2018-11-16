/**
 * Created by chengyezheng on 2017/7/28.
 * @fileOverview 常用常量
 * @author chengyezheng
 */
var PublicConstant = {
	baseUrl: "http://192.168.1.13:9001/cgi-bin/",
    RefreshChart: 3000,
    RefreshAlarm: 30 * 1000,
    RefreshTable:6 * 30 * 1000,
    fnValidator: function() {
        var formParam = {
            errorElement: 'div',
            errorClass: 'errorValidate',
            rules: {},
            messages: {},
            onfocusout: function(element) { $(element).valid(); },
            errorPlacement: function(error, element) {
                error.appendTo(element.closest('.control-group').find(".controls"));
            },

            highlight: function(element) {
                $(element).closest('.control-group').addClass('error');
            },
            unhighlight: function(element) {
                $(element).closest('.control-group').removeClass('error');
            },

        };
        return formParam;
    },
    Table_Default_Options: {
        "aLengthMenu": [
            [10, 30, 60,80,100],
            [10, 30, 60,80,100]
        ],
        "aSorting":false,
        "iDisplayLength": 10,
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        // "stripeClasses": ['odd', 'even '],
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": " _MENU_ 条每页",
            "sInfo": "显示第 _START_ 到 _END_ 条记录,总计 <label id='table_total'>&nbsp;_TOTAL_&nbsp;</label>条记录",
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
        "fnDrawCallback":function () {
            $("input").uniform();
        }
    },
     opts :{
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '65%', // Top position relative to parent in px
        left: '65%' // Left position relative to parent in px
    },
    Ajax_Option:{
        url: "",
        type: 'post',
        async: true,
        // data: "{}",
        timeout: "",
        dataType: 'json',
        cache:false,
        beforeSend: function (xhr) {
        },
        success: function (data, textStatus, jqXHR) {
        },
        error: function (xhr, textStatus, error) {
        },
        complete: function (xhr, status) {
        }

    },
    controlNo:{
        serviceAddr:"10503",
        update:"10501",
        updateClear:"10502",
        updateStatus:"10500",
        updateConfig:"10504",
    },
    DeviceClass:function (DevId,DevName,DevCode,ComAddr,DtName,GroupId,DevTypeId) {
        this.DevId=DevId;
        this.DevName = DevName;
        this.DevCode = DevCode;
        this.ComAddr = ComAddr;
        this.DtName = DtName;
        this.GroupId = GroupId;
        this.DevTypeId = DevTypeId;
    },
    GroupClass:function (groupId,groupName,area,capacity) {
        this.groupId=groupId;
        this.groupName = groupName;
        this.area = area;
        this.capacity = capacity;
    },
    NetWorkConfigClass:function (networkId,linkMode,pwd,encrypt,proxy,ipAquire,ip,gateway,netmask,dns1,dns2) {
        this.networkId=networkId;
        this.linkMode = linkMode;
        this.pwd = pwd;
        this.encrypt = encrypt;
        this.proxy = proxy;
        this.ipAquire = ipAquire;
        this.ip = ip;
        this.gateway = gateway;
        this.netmask = netmask;
        this.dns1 = dns1;
        this.dns2 = dns2;
    },
    EnergyClass:function (enabled,se_mode,l_temp,h_temp,p_temp,t_begin,t_end) {
        this.enabled=enabled;
        this.se_mode = se_mode;
        this.l_temp = l_temp;
        this.h_temp = h_temp;
        this.p_temp = p_temp;
        this.t_begin = t_begin;
        this.t_end = t_end;
    },
    SpaceClass:function (ele_price,area,capacity,desc) {
        this.ele_price=ele_price;
        this.area = area;
        this.capacity = capacity;
        this.desc = desc;
    },
    SaveEnergyClass:function (ele_price) {
        this.ele_price=ele_price;
    },
    DeviceForm:function (data) {
        var form  = [
            [
                {"name":"设备名称:","val":data[0],"type":"text","textName":"devName","id":"devName","required":true},
                {"name":"设备编码:","val":data[1],"type":"text","textName":"devNo","id":"devNo","required":true},
            ],
            [
                {"name":"设备类型:","val":"","type":"select","textName":"devType","id":"devType","required":true},
                {"name":"所属组:","val":"","type":"select","textName":"group","id":"group","required":true},
            ],
            [
                {"name":"通信地址:"+"<a href='javascript:;' id='onComAddr'>(范围)</a>","val":data[2],"type":"text","textName":"comAddr","id":"comAddr","required":true}
            ],

        ];

        return form;
    },
    TempClass:function (h_temp,l_temp,h_humd,l_humd) {
        this.h_temp = h_temp;
        this.l_temp = l_temp;
        this.h_humd = h_humd;
        this.l_humd = l_humd;
    },
    AirClass:function (type,power,priority) {
        this.type = type;
        this.power = power;
        this.priority = priority;
    },
    IpCameraClass:function (account,pwd) {
        this.account = account;
        this.pwd = pwd;
    },
    RedClass:function (mode,t_begin,t_end) {
        this.mode = mode;
        this.t_begin = t_begin;
        this.t_end = t_end;
    },
    Default_Temp: {
        "h_temp" : 50,
        "l_temp" : 10,
        "h_humd" : 80,
        "l_humd" : 10
    },
    Default_Red:{
        "mode" : 1,
        "t_begin" : ["08:00:00"],
        "t_end" : ["12:00:00"]
    },
    Default_Air:{
        "type" : [],
        "power" : [],
        "priority" : [],
        "h_temp" : 50,
        "l_temp" : 10,
        "h_humd" : 80,
        "l_humd" : 10
    },
    Default_IpCamera:{
        "account" : "admin",
        "pwd" : "admin"
    }



}