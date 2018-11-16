/**
 * Created by Mars on 2017/3/6.
 * @fileOverview 表单验证
 * @author chengyezheng
 */
jQuery.validator.addMethod("maxNum", function(b, a) {
    return this.optional(a) || /^[\w\W]{6,}$/.test(b)
}, "");
jQuery.validator.addMethod("minLen", function(b, a) {
    return this.optional(a) || /^[\w\W]{6,}$/.test(b)
}, "");
jQuery.validator.addMethod("snm", function(b, a) {
    return this.optional(a) || /^XW_([\w\W]{14})$/.test(b)
}, "");
jQuery.validator.addMethod("remoteServerAddr", function(b, a) {
    return this.optional(a) || /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]{1}\d{3}|65[0-4]{1}\d{2}|655[0-2]{1}\d{1}|6553[0-5]{1})$/.test(b)
}, "");
jQuery.validator.addMethod("snmpIp", function(b, a) {
    return this.optional(a) || /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])$/.test(b)
}, "");
jQuery.validator.addMethod("numberInt", function(b, a) {
    return this.optional(a) || /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(b)
}, "请输入大于0的数字");
jQuery.validator.addMethod("int", function(b, a) {
    return this.optional(a) || /^[1-9]\d*$/.test(b)
}, "");
jQuery.validator.addMethod("email", function(b, a) {
    return this.optional(a) || /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(b)
}, "");
jQuery.validator.addMethod("phone", function(b, a) {
    return this.optional(a) || /^1[3|4|5|7|8][0-9]{9}$/.test(b)
}, "请输入正确的手机号码");
jQuery.validator.addMethod("invalidValue", function(b, a) {
    var flag = true;
    if(b =="select"){
        flag = false;
    }
    return flag;
}, "");
$.extend($.validator.messages, {
    required: "字段不能为空",
    remote: "",
    email: "邮箱格式不正确",
    url: "url格式不正确",
    date: "日期格式不正确",
    dateISO: "时间格式为 (YYYY-MM-DD)",
    number: "字段必须为数字",
    digits: "必须输入整数",
    min: "字段必须为数字，且不能小于0"
});
var Validate = function () {


    /* * 添加设备校验*/
    var addDevValidate = function(){
        var form = $('#add_dev_form');
        $.validator.addMethod("comAddrValid", function (a, element) {
            $("#comAddr").parents(".control-group").find("span").text("*");
            var name = $("#devType").find("option:checked").attr("name");
            var flag= true ;
            if(name !=null && name !=undefined){
                if(name =="DO"){
                    flag = /^[7-8]{1}$/.test(a);
                    $(element).data('error-msg','有效范围 7-8');
                }
                if(name =="DI"){
                    flag = /^[1-4]{1}$/.test(a);
                    $(element).data('error-msg','有效范围 1-4');
                }
                if(name == "Modbus"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="YDN23"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="EATON_SLF"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="KSTAR_SLF"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
            }
            return flag;
        }, function(params, element) {
            return $(element).data('error-msg');
        });

        $.validator.addMethod("snmpIpValid", function (a, element) {
            var name = $("#devType").find("option:checked").attr("name");
            var flag= true ;
            if(name !=null && name !=undefined){
                if(name == "SNMP"){
                    flag = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])$/.test(a);
                    $(element).data('error-msg','有效格式为相关IP地址');
                }else if(name == "Stream"){
                    flag = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(a);
                    $(element).data('error-msg','有效格式为(IP:端口号)');
                }
            }
            return flag;
        }, function(params, element) {
            return $(element).data('error-msg');
        });

        var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
            onsubmit:false,
            onfocusout: function(element) { $(element).valid(); },
            rules: {
                devName: {
                    required: true,
                    devValid:true,
                    maxlength:18,
                    minlength:2,
                },
                devNo: {
                    required: true,
                    devNoValid:true,
                    maxlength:18,
                    minlength:2,
                },
                devType:{
                    required:true,
                    invalidValue:true,
                    minlength:1
                },
                comAddr: {
                    required: true,
                    comAddrValid:true
                },
                snmpIp:{
                    snmpIpValid:true,
                },
            },
            messages: {
                devName: {
                    required: "不能为空",
                    devValid:"设备已存在",
                    maxlength:"设备名称最多18个字符",
                    minlength:"设备名称不能少于2个字符"
                },
                devNo: {
                    required: "设备编码不能为空",
                    devNoValid:"设备编码已存在",
                    maxlength:"设备编码最多18个字符",
                    minlength:"设备编码不能少于2个字符"
                },
                devType:{
                    required:"请选择一项",
                    invalidValue:"请选择一项",
                    minlength:"请选择一项",
                },
                comAddr: {
                    required: "不能为空",
                },
                snmpIp:{
                    // snmpIp:"SNMP格式：(0~255).(0~255).(0~255).(0~255)"
                },
            },
        });
        form.validate(formParam);
    };

    /* * 添加设备时设置温湿度阈值校验*/
    var addDampValidate = function(){
        var form = $('#add_damp_form');
        var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
            rules: {
                minTemp:{
                    required:true,
                },
                maxTemp:{
                    required:true,
                },
                minDamp:{
                    required:true,
                },
                maxDamp:{
                    required:true,
                },
            },
            messages: {
                minTemp:{
                    required:"低温不能为空",
                },
                maxTemp:{
                    required: "高温不能为空",
                },
                minDamp:{
                    required: "低湿度不能为空",
                },
                maxDamp:{
                    required: "高湿度不能为空",
                },
            },
        });
        form.validate(formParam);
    };

    /* * 修改设备校验*/
    var mdfDevValidate = function(){
        var form = $('#mdf_dev_form');
        $.validator.addMethod("comAddrValid", function (a, element) {
            $("#comAddr").parents(".control-group").find("span").text("*");
            var name = $("#devType").find("option:checked").attr("name");
            var flag= true ;
            $("#comAddr").attr("disabled",false);
            if(name !=null){
                if(name =="DO"){
                    flag = /^[7-8]{1}$/.test(a);
                    $(element).data('error-msg','有效范围 7-8');
                }
                if(name =="DI"){
                    flag = /^[1-4]{1}$/.test(a);
                    $(element).data('error-msg','有效范围 1-4');
                }
                if(name == "Modbus"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="YDN23"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="EATON_SLF"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name =="KSTAR_SLF"){
                    flag = /^([1-9]\d{0,1}|100)$/.test(a);
                    $(element).data('error-msg','有效范围 1-100');
                }
                if(name == "SNMP"){
                    $("#comAddr").val("").attr("disabled",true);
                    // flag = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[0-9]{1}[0-9]{1}|[0-9])$/.test(a);
                    // $(element).data('error-msg','有效格式为相关IP地址');
                }
            }
            return flag;
        }, function(params, element) {
            return $(element).data('error-msg');
        });
        $.validator.addMethod("snmpIpValid", function (a, element) {
            var name = $("#devType").find("option:checked").attr("name");
            var flag= true ;
            if(name !=null){
                if(name == "SNMP"){
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
                    devVerify:true,
                    maxlength:18,
                    minlength:2,
                },
                devNo: {
                    required: true,
                    devNoVerify:true,
                    maxlength:18,
                    minlength:2,
                },
                comAddr: {
                    required: true,
                    comAddrValid:true
                },
                snmpIpValid:{
                    required: true,
                },
                power:{
                    min:0
                }
            },
            messages: {
                devName: {
                    required: "不能为空",
                    devVerify:"设备已存在",
                    maxlength:"设备名称最多18个字符",
                    minlength:"设备名称不能少于2个字符"
                },
                devNo: {
                    required: "设备编码不能为空",
                    devNoVerify:"设备编码已存在",
                    maxlength:"设备编码最多18个字符",
                    minlength:"设备编码不能少于2个字符"
                },
                comAddr: {
                    required: "不能为空",
                },
                snmpIpValid:{
                },
                power:{
                    min:"额定功率不能小于0"
                }
            },
        });
        form.validate(formParam);
    };

    /* * 添加用户校验*/
    var userValidate = function(){
        var form = $('#user_form');
        var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
            rules: {
                nickName: {
                    required: true,
                    maxlength:18,
                    minlength:2,
                },
                account:{
                    required: true,
                    userValid:true,
                    maxlength:18,
                    minlength:2,
                },
                phone:{
                    required:true,
                    phone:true,
                },
                email:{
                    required: true,
                    email:true,
                },
                roleName:{
                    required:true,
                    minlength:1
                }
            },
            messages: {
                nickName: {
                    required: "名称不能为空",
                    maxlength:"名称最多18个字符",
                    minlength:"名称不能少于2个字符"
                },
                email:{
                    email: "请输入正确的邮箱地址",
                    required:"邮箱不能为空",
                },
                phone:{
                    required:"联系方式不能为空",
                    phone:"请填入正确手机号码",
                },
                account:{
                    required: "账号不能为空",
                    userValid:"账号已存在",
                    maxlength:"账号最多18个字符",
                    minlength:"账号不能少于2个字符"
                },
                roleName:{
                    required:"角色不能为空",
                    minlength:"请选择一项"
                }
            },
        });
        form.validate(formParam);
    };

    /* * 修改用户校验*/
    var mdfUserValidate = function(){
        var form = $('#mdf_user_form');
        var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
            rules: {
                nickName: {
                    required: true,
                    maxlength:18,
                    minlength:2,
                },
                account:{
                    required: true,
                    userVerify:true,
                    maxlength:18,
                    minlength:2,
                },
                phone:{
                  required:true,
                    phone:true,
                },
                email:{
                    required: true,
                    email:true,
                },
                roleName:{
                    required:true,
                    minlength:1
                }
            },
            messages: {
                nickName: {
                    required: "名称不能为空",
                    maxlength:"名称最多18个字符",
                    minlength:"名称不能少于2个字符"
                },
                phone:{
                    required:"短信不能为空",
                    phone:"请填入正确手机号码",
                },
                email:{
                    email: "请输入正确的邮箱地址",
                    required:"邮箱不能为空",
                },
                account:{
                    required: "账号不能为空",
                    userVerify:"账号已存在",
                    maxlength:"账号最多18个字符",
                    minlength:"账号不能少于2个字符"
                },
                roleName:{
                    required:"角色不能为空",
                    minlength:"请选择一项"
                }
            },
        });
        form.validate(formParam);
    };
    /* * 修改用户校验*/
    var mdfUserInfoValidate = function(){
        var form = $('#mdf_userInfo_form');
        var formParam = $.extend(true,{}, PublicConstant.fnValidator(form), {
            rules: {
                nickName: {
                    required: true,
                    maxlength:18,
                    minlength:2,
                },
                phone:{
                    required:true,
                    phone:true,
                },
                email:{
                    required: true,
                    email:true,
                }
            },
            messages: {
                nickName: {
                    required: "名称不能为空",
                    maxlength:"名称最多18个字符",
                    minlength:"名称不能少于2个字符"
                },
                phone:{
                    required:"手机号码不能为空",
                    phone:"请填入正确手机号码",
                },
                email:{
                    email: "请输入正确的邮箱地址",
                    required:"邮箱不能为空",
                },
            },
        });
        form.validate(formParam);
    };

    

    /*修改节能策略校验*/
    var fnSaveEnergyValid = function () {
        var form = $("#mdfSaveTempForm");
        var formParam= $.extend(true,{}, PublicConstant.fnValidator(form), {
            rules: {
                goodTemp: {
                    required: true,
                    number:true
                },
                minTemp: {
                    required: true,
                    number:true
                },
                maxTemp: {
                    required: true,
                    number:true
                },
            },
            messages: {
                goodTemp: {
                    required: "适宜温度不能为空",
                    number:"适宜温度为数字类型"
                },
                minTemp: {
                    required: "最低温度不能为空",
                    number:"最低温度为数字类型"
                },
                maxTemp: {
                    required: "最高温度不能为空",
                    number:"最高温度为数字类型"
                },

            },
        });

        form.validate(formParam);
    };


    return {
        addDevValidate:addDevValidate,
        addDampValidate:addDampValidate,
        mdfUserInfoValidate:mdfUserInfoValidate,
        mdfDevValidate:mdfDevValidate,
        userValidate:userValidate,
        mdfUserValidate:mdfUserValidate,

        fnSaveEnergyValid:fnSaveEnergyValid,
    }
}();