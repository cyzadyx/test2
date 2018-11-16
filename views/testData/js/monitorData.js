var  MonitorData = function() {
		var table,startDate = "",endDate = "",iDisplayLength="",devTable;
        var eventDataUrl ="./json/monitorAllData.json";       
		var SessionId,baseUrl,segroupUrl,groupDataUrl;
        //页面展示初始化
        function fnInit() {
            SessionId = $.cookie("xw_terminal_SessionId");
        	baseUrl = $.cookie("xw_terminal_baseUrl");
        	if(baseUrl ==undefined || SessionId ==undefined){
        		window.location.href ='../login.html';
        	}
        	segroupUrl=baseUrl+"segroup.action";
        	groupDataUrl =segroupUrl+"?operator=query";
            fnInitPage().fnDateRangerPicker();
            fnInitPage().fnInitGroupInfo();
//          fnInitPage().fnInitTable();
//          fnInitPage().fnInitMonitor();
            fnInitEventPage();
        };

        //初始化数据显示处理
        function fnInitPage() {
            return{
            	fnInitGroupInfo : function () {
		                var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
		                    type: 'get',
		                    url: groupDataUrl+"&SessionId="+SessionId,
		                    success: function (param, textStatus, jqXHR) {
		                        if(textStatus==="success"){
		                            if(param !=null){
		                                if(param.code===0){
		                                    var data = param.data;
		                                    GroupAll = data;
		                                    var append = "<option value='all' >系统</option>";
                                    		$("#group").append(append);
		                                    if(data !=null){	                                    	
			                                    for(var i=0;i<data.length;i++){
			                                        var id = data[i].groupId;
			                                        var name = data[i].groupName;
			                                        var html = "<option value='"+id+"' >"+name+"</option>";
			                                        $("#group").append(html);
			                                    }
			                                    fnInitPage().fnInitMonitor();
			                                    fnInitPage().fnInitTable();
		                                    }
//		                                    $("#group").chosen({search_contains: true,no_results_text:"搜索不存在"});
//			                                $("#group").trigger("liszt:updated");
		                                    
		                                }else if(param.code === 5){
					                    	window.location.href = "../login.html";
					                    }
		                            }
		                        }
	                    },
	                    error: function (xhr, textStatus, error) {
	                        CommonJS.fnMessageError(error);
	                    },
	                });
	                $.ajax(ajaxParam);
	            },  
            	fnInitMonitor:function(){

                	var groupId = $("#group").find("option:checked").val();
                	var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
			            type: 'get',
//			            url: "./json/monitorData.json",
			            url:baseUrl+"test.action?datatype=analog&SessionId="+SessionId+"&groupId="+groupId,
			            success: function (data, textStatus, jqXHR) {
			                if(textStatus==="success"){
			                    if(data.code==0){
			                    	var pData = data.data;
			                    	$("#temp").html(pData.temp);
			                    	$("#humd").html(pData.humd);
			                    	$("#headNumber").html(pData.headNumber);
			                    	
			                    	$("#uab").html(pData.uab);
			                    	$("#ubc").html(pData.ubc);
			                    	$("#uca").html(pData.uca);
			                    	
			                    	$("#ua").html(pData.ua);
			                    	$("#ub").html(pData.ub);
			                    	$("#uc").html(pData.uc);
			                    	$("#ia").html(pData.ia);
			                    	$("#ib").html(pData.ib);
			                    	$("#ic").html(pData.ic);
			                    	
			                    	$("#pa").html(pData.pa);
			                    	$("#pb").html(pData.pb);
			                    	$("#pc").html(pData.pc);
			                    	$("#qa").html(pData.qa);
			                    	$("#qb").html(pData.qb);
			                    	$("#qc").html(pData.qc);
			                    	
			                    	
			                    	$("#sa").html(pData.sa);
			                    	$("#sb").html(pData.sb);
			                    	$("#sc").html(pData.sc);
			                    	
			                    	$("#pfa").html(pData.pfa);
			                    	$("#pfb").html(pData.pfb);
			                    	$("#pfc").html(pData.pfc);
			                    	
			                    	$("#pz").html(pData.pz);
			                    	$("#qz").html(pData.qz);
			                    	$("#sz").html(pData.sz);
			                    	$("#pfz").html(pData.pfz);
			                    	
			                    	$("#frq").html(pData.frq);
			                    	$("#epwrIn").html(pData.epwrIn);
			                    	
			                    	$("#epwrOut").html(pData.epwrOut);
			                    	$("#eqIn").html(pData.eqIn);
			                    	$("#eqOut").html(pData.eqOut);
			                    	$("#time").html(pData.time);
			                    }else if(data.code === 5){
			                    	window.location.href = "../login.html";
			                    }
			                }
			            },
			            error: function (xhr, textStatus, error) {
			
			            },
			        });
			        $.ajax(ajaxParam);			        
                },
                //事件表格数据
                fnInitTable:function () {
                	var groupId = $("#group").find("option:checked").val();
                    var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
			            type: 'get',
//			            url: eventDataUrl,
			            url:baseUrl+"test.action?datatype=analog&SessionId="+SessionId+"&groupId="+groupId+"&t_begin="+(startDate/1000)+"&t_end="+(endDate/1000),
			            success: function (data, textStatus, jqXHR) {
			                if(textStatus==="success"){
			                    fnGetDevData_CallBack(data);
			                }
			            },
			            error: function (xhr, textStatus, error) {
			
			            },
			        });
			        $.ajax(ajaxParam);
			
			        function fnGetDevData_CallBack(paramArray) {
			            if(paramArray.code===0){
			                var aaData = paramArray.data;
			                
			                var title =[
			                    {"sTitle":"温度","mData":"temp","bVisible":true},
			                    {"sTitle":"湿度","mData":"humd","bVisible":true},
			                    {"sTitle":"现场人数","mData":"headNumber","bVisible":true},
			                    {"sTitle":"AB相电压","mData":"uab","bVisible":true},
			                    {"sTitle":"BC相电压","mData":"ubc","bVisible":true},
			                    {"sTitle":"CA相电压","mData":"uca","bVisible":true},
			                    {"sTitle":"A相电压","mData":"ua","bVisible":true},
			                    {"sTitle":"B相电压","mData":"ub","bVisible":true},
			                    {"sTitle":"C相电压","mData":"uc","bVisible":true},
			                    {"sTitle":"A相电流","mData":"ic","bVisible":true},
			                    {"sTitle":"B相电流","mData":"ib","bVisible":true},
			                    {"sTitle":"C相电流","mData":"ia","bVisible":true},
			                    
			                    {"sTitle":"A相有功功率","mData":"pa","bVisible":true},
			                    {"sTitle":"B相有功功率","mData":"pb","bVisible":true},
			                    {"sTitle":"C相有功功率","mData":"pc","bVisible":true},
			                    {"sTitle":"A相无功功率","mData":"qa","bVisible":true},
			                    {"sTitle":"B相无功功率","mData":"qb","bVisible":true},
			                    {"sTitle":"C相无功功率","mData":"qc","bVisible":true},
			                    
			                    {"sTitle":"A相视在功率","mData":"sa","bVisible":true},
			                    {"sTitle":"B相视在功率","mData":"sb","bVisible":true},
			                    {"sTitle":"C相视在功率","mData":"sc","bVisible":true},
			                    {"sTitle":"A相功率因数P","mData":"pfa","bVisible":true},
			                    {"sTitle":"B相功率因数PF","mData":"pfb","bVisible":true},
			                    {"sTitle":"C相功率因数PF","mData":"pfc","bVisible":true},
			                    
			                    {"sTitle":"总有功功率","mData":"pz","bVisible":true},
			                    {"sTitle":"总无功功率","mData":"qz","bVisible":true},
			                    {"sTitle":"总视在功率","mData":"sz","bVisible":true},
			                    {"sTitle":"总功率因数","mData":"pfz","bVisible":true},
			                    {"sTitle":"系统频率","mData":"frq","bVisible":true},
			                    {"sTitle":"输入有功电能","mData":"epwrIn","bVisible":true},
			                    
			                    {"sTitle":"输入无功电能","mData":"eqIn","bVisible":true},
			                    {"sTitle":"输出有功电能","mData":"epwrOut","bVisible":true},
			                    {"sTitle":"输出无功电能","mData":"eqOut","bVisible":true},
			                    {"sTitle":"时间","mData":"time","bVisible":true},
			                ];
			                var dataParam = $.extend(true,{},PublicConstant.Table_Default_Options,{
			                    "aaData":aaData,
			                    "aoColumns":title,
			                    "bAutoWidth":false,
			                    "scrollX": true,
			                    "aoColumnDefs":[
			      
			                    ],
			                });
			                if(devTable != undefined){
			                    devTable.clear();
			                   if(aaData !=null){
				                	devTable.rows.add(aaData);
				                }
			                    devTable.draw(false);
			                }else{
			                    devTable = CommonJS.$DataTable(dataParam ,"eventTable",title);
			                }
			
			            }else if(paramArray.code === 5){
	                    	window.location.href = "../login.html";
	                    }
			        }
                },
                
                //时间插件数据初始化
                fnDateRangerPicker:function () {
                    var sDate = new Date().Format("yyyy-MM-dd");
                    var eDate = new Date().Format("yyyy-MM-dd HH:mm");
                    startDate = new Date(Date.parse(sDate.replace(/-/g,"/"))).getTime();
                    endDate = new Date(Date.parse(eDate.replace(/-/g,"/"))).setHours(23,59);
                    var maxEnd = new Date(endDate).Format("yyyy-MM-dd HH:mm");
                    $('#dateRange').daterangepicker({
                        "showDropdowns": true,
                        "autoApply": true,
                        "autoUpdateInput":true,
                        "locale": {
                            "format": "YYYY-MM-DD HH:mm",
                            "separator": "  至  ",
                            "monthNames": [
                                "一月",
                                "二月",
                                "三月",
                                "四月",
                                "五月",
                                "六月",
                                "七月",
                                "八月",
                                "九月",
                                "十月",
                                "十一月",
                                "十二月"
                            ],
                        },
                        "maxDate": maxEnd,
                        "startDate": sDate,
                        "endDate": eDate
                    }, function(start, end, label) {
                        var stDate = start.format('YYYY-MM-DD HH:mm');
                        var enDate = end.format('YYYY-MM-DD HH:mm');
                        startDate = new Date(Date.parse(stDate.replace(/-/g,"/"))).getTime();
                        endDate = new Date(Date.parse(enDate.replace(/-/g,"/"))).setHours(23,59);
                    });
                },
            }
        };
        
        //时间初始化
        function fnInitEventPage() {
			$("#refresh").on("click",function(){
				fnInitPage().fnInitMonitor();
			});
			
			$("#look").on("click",function(){
				fnInitPage().fnInitTable();
			});
			
			$("#dateRange").on("change",function(){
				fnInitPage().fnInitTable();
			});
			
			$("#group").on("change",function(){
				fnInitPage().fnInitMonitor();
				fnInitPage().fnInitTable();
			});
        };
		
		return{
			fnInit:fnInit,
		}
}();
