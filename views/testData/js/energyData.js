var  EnergyData = function() {
		var table,startDate = "",endDate = "",iDisplayLength="",devTable;
        var eventDataUrl ="./json/energyAllData.json";       
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
//          fnInitPage().fnInitEnergy();
//			fnInitPage().fnInitTable();
            
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
			                                    fnInitPage().fnInitEnergy();
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
                fnInitEnergy:function(){
                	var url = baseUrl+"test.action?datatype=sed&SessionId="+SessionId;
                	var opt = $("#group").find("option:checked").val();
                	if(opt =="all"){
                		url=url+"&option=all";
                	}else{
                		url=url+"&option=seg&grouId="+opt;
                	}
                	var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
			            type: 'get',
//			            url: "./json/energyData.json",
			            url:url,
			            success: function (data, textStatus, jqXHR) {
			                if(textStatus==="success"){
			                    if(data.code==0){
			                    	$("#energyOff").html(data.data.energyCost); 
			                    	$("#energyOn").html(data.data.energySave);
			                    	$("#energyMoney").html(data.data.moneySave);
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
                	var url = baseUrl+"test.action?datatype=sed&SessionId="+SessionId+"&t_begin="+(startDate/1000)+"&t_end="+(endDate/1000);
                	var opt = $("#group").find("option:checked").val();
                	if(opt =="all"){
                		url=url+"&option=all";
                	}else{
                		url=url+"&option=seg&grouId="+opt;
                	}
                    var ajaxParam = $.extend(true,{},PublicConstant.Ajax_Option,{
			            type: 'get',
//			            url: eventDataUrl,
			            url:url,
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
			                    {"sTitle":"节能","mData":"energySave","bVisible":true},
			                    {"sTitle":"耗能","mData":"energyCost","bVisible":true},
			                    {"sTitle":"节省费用","mData":"moneySave","bVisible":true},
			                    {"sTitle":"时间","mData":"timeInterval","bVisible":true},
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
			                    devTable = CommonJS.$DataTable(dataParam ,"energyTable",title);
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
				fnInitPage().fnInitEnergy();
			});
			
			$("#look").on("click",function(){
				fnInitPage().fnInitTable();
			});
			
			$("#group").on("change",function(){
				fnInitPage().fnInitEnergy();
				fnInitPage().fnInitTable();
			});
			
			$("#dateRange").on("change",function(){
				fnInitPage().fnInitTable();
			});
			
			$("#group").on("change",function(){
				fnInitPage().fnInitEnergy();
				fnInitPage().fnInitTable();
			});
        };
		
		return{
			fnInit:fnInit,
		}
}();
