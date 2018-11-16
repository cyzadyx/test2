var SystemEvent = function() {
		var table,startDate = "",endDate = "",iDisplayLength="",devTable;
        var eventDataUrl ="./json/eventData.json";       
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
            fnInitPage().fnInitTable();
            fnInitEventPage();
        };

        //初始化数据显示处理
        function fnInitPage() {
            return{
                //事件表格数据
                fnInitTable:function () {
                    var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
			            type: 'get',
//			            url: eventDataUrl,
			            url:baseUrl+'test.action?datatype=event&t_begin='+(startDate/1000)+'&t_end='+(endDate/1000)+"&SessionId="+SessionId,
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
			                    {"sTitle":"事件类型","mData":"eventType","bVisible":true},
			                    {"sTitle":"事件描述","mData":"description","bVisible":true},
			                    {"sTitle":"事件时间","mData":"time","bVisible":true},
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
				fnInitPage().fnInitTable();
			});
			
			$("#dateRange").on("change",function(){
				fnInitPage().fnInitTable();
			});
        };
		
		return{
			fnInit:fnInit,
		}
}();
