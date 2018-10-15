var options;
var data;
var xAxisUnit;
var yAxisUnit;
var zAxisUnit;
var chart;
(function( $ ){
    $.fn.chart = function(data1,options1) {
        if (arguments.length == 1) {
            var options1={};
        }
       var options0={
            zoomType:"xy",
            export:false,
            lineWidth:1.7,
            cursor:'pointer',
            title: {
                enabled:false,
                align: 'left',
                color: '#55B951',
                fontSize:'14px'
            },
            legend:{
                enabled:true,
                fontWeight:"normal",
                fontSize:"12px",
                color:'#000',
                navEnabled:true,
                navHeight:40
            },
            labels: {
                color: "#666666", 
                fontSize: "12px" ,
                fontWeight:"normal"
            },
            stackLabels: {
                enabled: false,
                color: "contrast",
                fontSize: "11px",
                fontWeight: "bold"
            },
            dataLabels: {
                enabled: true,
                color: "contrast",
                fontSize: "11px",
                fontWeight: "bold"
            },
            marker:{
                enabled:false,
                radius:5
            },
            tooltip: {
                enabled:true,
                shared: true,
                color: "#333333", 
                fontSize: "12px",
                whiteSpace: "nowrap",
                fontWeight:"normal"
            },
            xAxis:{
                enabledTitle:true,
                xTitleUnit:true
            },
            yAxis:{
                enabledTitle:true,
                yTitleUnit:false
            },
            color:["#64bcff","#0dd8d1","#ff7f31", "#d84d4d", "#8085e9",
            "#90ed7d", "#f15c80", "#e4d354","#91e8e1",
            '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
            '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
            colorRule:['#38ae33','#ef8f40','#f64a4a',"#e6e6e6"],
            size:'100%',
            halfChart:{
                startAngle:-110,
                endAngle:110,
                innerSize:'65%',
                outerSize:'90%',
                center:['50%', '65%']
            },
            pieRingRule:{
                subY:55,
                subfontSize:'35px'
            },
            gauge:{
                subY:20,
                subfontSize:'35px',
                //borderWidth:'28px',
                outerRadius:'100%',
                innerRadius:'70%',
                tickAmount:2
            },
            pieRing:{
                subEnabled:true,
                subY:-10,
                subfontSize:'15px',
                subColor:"#333333"
            }
       };
       options=$.extend(true,{},options0,options1);
       data=data1;
       xAxisUnit=data[0].label.xAxisUnit;
       yAxisUnit=data[0].label.yAxisUnit;
       zAxisUnit=data[0].label.zAxisUnit;
        if(!$(this).attr("id")){
            return false;
        }
        var id=$(this).attr("id");
        chart=new Highcharts.Chart(defaultChart(id,data,options));
    }
    var defaultChart = function(divId,data,options) {
        Highcharts.setOptions({
            lang : {
                loading : "加载中...",
                noData: '无响应数据'
            },
            global : {
                useUTC : false
            },
            colors: options.color
        });
        var dataproArr = parseData(data);
        var defaultChart = {
            chart: {
                renderTo : divId,
                zoomType: options.zoomType
            },
            title: {
                text: options.title.enabled?data[0].label.title:null,
                align: options.title.align,
                style: {
                    color: options.title.color,
                    fontSize:options.title.fontSize
                }
            },
            xAxis:{
                labels: {
                    style: { 
                        color: options.labels.color, 
                        fontSize: options.labels.fontSize ,
                        fontWeight:options.labels.fontWeight
                    }
                },
                title: {
                    enabled:options.xAxis.enabledTitle,
                    text:xAxisUnit.split("-")[0]+(xTitleUnit()?"("+xAxisUnit.split("-")[1]+")":""),
                    align: 'high',
                    style: { 
                        color: options.labels.color, 
                        fontSize: options.labels.fontSize ,
                        fontWeight:options.labels.fontWeight
                    }
                }
            },
            yAxis:{
                title: {
                    enabled:options.yAxis.enabledTitle,
                    text:yAxisUnit.split("-")[0]+(yTitleUnit()?"("+yTitleUnitTrans()+")":"")
                },
                labels: {
                    style: { 
                        color: options.labels.color, 
                        fontSize: options.labels.fontSize ,
                        fontWeight:options.labels.fontWeight
                    }
                },
                stackLabels: {
                    enabled: options.stackLabels.enabled,
                    style: {
                        color: options.stackLabels.color, 
                        fontSize: options.stackLabels.fontSize ,
                        fontWeight:options.stackLabels.fontWeight
                    }
                }
            },
            credits:{
                enabled:false
            },
            exporting: {
                enabled: options.export,
                filename:data[0].label.title
            },
            navigation: {
                menuItemHoverStyle: {
                    background: '#64bcff',
                },
                buttonOptions: {
                    symbolStrokeWidth: 1.5
                }
            },
            legend : {
                enabled:options.legend.enabled,
                itemStyle : {
					fontFamily : '微软雅黑',
					fontSize : options.legend.fontSize,
					fontWeight : options.legend.fontWeight
				},
                color: options.legend.color,
                maxHeight:options.legend.navHeight,
                navigation:{
                    enabled:options.legend.navEnabled
                }
            },
            tooltip: {
                enabled:options.tooltip.enabled,
                shared: options.tooltip.shared,
                style:{ 
                    color: options.tooltip.color, 
                    fontSize: options.tooltip.fontSize,
                    whiteSpace: options.tooltip.whiteSpace ,
                    fontWeight:options.tooltip.fontWeight
                }
            }
        };
        switch(data[0].label.type){
            case "areachart":  
            case "areasplinechart":
            case "areachartpercent":
            case "areachartnormal":
            case "linechart":
            case "splinechart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.xAxisType=="dataTime"){
                    xAxisData(defaultChart);
                }else if(data[0].label.xAxisType=="number"){
                    var xAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                        }
                    };
                    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                }else{
                    defaultChart["xAxis"]["type"]="category";
                    defaultChart["xAxis"]["tickmarkPlacement"]="on";
                };
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    area: {
                        cursor: options.cursor,
                        fillOpacity: 0.3,
                        lineWidth: 1.2,
                        states: {
                            hover: {
                                lineWidth: 1.2
                            }
                        },
                        marker: {
                            enabled: options.marker.enabled,
                            radius: 5,
                            states: {
                                hover: {
                                    radius:5
                                }
                            }
                        },
                        stacking:data[0].label.type.split("chart")[1]
                    },
                    line: {
                        cursor: options.cursor,
                        lineWidth: options.lineWidth,
                        states: {
                            hover: {
                                lineWidth: options.lineWidth
                            }
                        },
                        marker: {
                            enabled: options.marker.enabled,
                            radius: options.marker.radius,
                            states: {
                                hover: {
                                    radius: options.marker.radius
                                }
                            }
                        },
                        shadow: false
                    },
                    spline:{
                        cursor: options.cursor,
                        lineWidth: options.lineWidth,
                        states: {
                            hover: {
                                lineWidth: options.lineWidth
                            }
                        },
                        marker: {
                            enabled: options.marker.enabled,
                            radius: options.marker.radius,
                            states: {
                                hover: {
                                    radius: options.marker.radius
                                }
                            }
                        },
                        shadow: false
                    },
                    areaspline:{
                        cursor: options.cursor,
                        fillOpacity: 0.3,
                        lineWidth: 1.2,
                        states: {
                            hover: {
                                lineWidth: 1.2
                            }
                        },
                        marker: {
                            enabled: options.marker.enabled,
                            radius: 5,
                            states: {
                                hover: {
                                    radius: 5
                                }
                            }
                        },
                        shadow: false
                    }
                };
                break;
            case "piechartringrule":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                defaultChart["subtitle"]={
                    text: singlePreValue(),
                    align: 'center',
                    verticalAlign: 'middle',
                    y: options.pieRingRule.subY,
                    style: {
                        color: getPieColorData(data).color[0],
                        fontSize:options.pieRingRule.subfontSize
                    }
                };
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    pie: {
                        dataLabels: {
                            enabled: false,
                            style: {
                                color: options.dataLabels.color, 
                                fontSize: options.dataLabels.fontSize ,
                                fontWeight:options.dataLabels.fontWeight
                            }
                        },
                        startAngle: options.halfChart.startAngle, // 圆环的开始角度
                        endAngle: options.halfChart.endAngle,    // 圆环的结束角度
                        center: options.halfChart.center,
                        showInLegend: false,
                        cursor: options.cursor
                    }
                };
                defaultChart["series"]=dataproArr;
                break;
            case "piechart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    pie: {
                        cursor: options.cursor,
                        fillOpacity: 0.3,
                        allowPointSelect: true,
                        dataLabels: {
                            enabled:options.dataLabels.enabled,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: options.dataLabels.color, 
                                fontSize: options.dataLabels.fontSize ,
                                fontWeight:options.dataLabels.fontWeight
                            }
                        },
                        showInLegend: options.legend?true:false
                    }
                };
                defaultChart["series"]=dataproArr;
                pieDrilldown(defaultChart);
                break;
            case "piechartring":
            case "piechartringhalf":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                defaultChart["subtitle"]={
                    //text: '',
                    text:options.pieRing.subEnabled?data[0].label.title:null,
                    align: 'center',
                    verticalAlign: 'middle',
                    y: options.pieRing.subY,
                    style: {
                        color: options.pieRing.subColor,
                        fontSize:options.pieRing.subfontSize
                    }
                };
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    pie: {
                        cursor: options.cursor,
                        fillOpacity: 0.3,
                        allowPointSelect: true,
                        dataLabels: {
                            enabled:options.dataLabels.enabled,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: options.dataLabels.color, 
                                fontSize: options.dataLabels.fontSize ,
                                fontWeight:options.dataLabels.fontWeight
                            }
                        },
                        showInLegend: options.legend?true:false,
                        // point: {
                        //     events: {
                        //         // mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                        //         //     if(options.pieRing.subEnabled){
                        //         //         chart.setTitle(null,{
                        //         //             text: e.target.name+ '\t'+ e.target.y + ' %'
                        //         //         });
                        //         //     }
                        //         // },
                        //         click: function(e) { // 同样的可以在点击事件里处理
                        //             if(options.pieRing.subEnabled){
                        //                 chart.setTitle(null,{
                        //                     text: e.point.name+ '\t'+ e.point.y + ' %'
                        //                 });
                        //             }
                        //         }
                        //     }
                        // },
                    }
                };
                if(data[0].label.type=="piechartringhalf"){
                    defaultChart["plotOptions"]["pie"]["startAngle"]=options.halfChart.startAngle, // 圆环的开始角度
                    defaultChart["plotOptions"]["pie"]["endAngle"]=options.halfChart.endAngle   // 圆环的结束角度
                    defaultChart["plotOptions"]["pie"]["center"]=options.halfChart.center,
                    defaultChart["subtitle"]["y"]=options.pieRing.subY+25
                }
                // if(Math.abs(options.halfChart.startAngle-options.halfChart.endAngle)<300){
                //     defaultChart["plotOptions"]["pie"]["center"]=['50%', '85%'];
                // }
                defaultChart["series"]=dataproArr;
                //pieDrilldown(defaultChart);
            break;
            case "columnchartdrill":
                defaultChart["legend"]["enabled"]=false;
            case "columnchart":
            case "columnchartpercent":
            case "columnchartnormal":
            case "columnchartdrill":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.xAxisType=="dataTime"){
                    xAxisData(defaultChart);
                }else if(data[0].label.xAxisType=="number"){
                    var xAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                        }
                    };
                    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                }else{
                    defaultChart["xAxis"]["type"]="category";
                };
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    column: {
                        stacking: data[0].label.type.split("chart")[1],
                        dataLabels: {
                            enabled: options.dataLabels.enabled,
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,true),
                            style: {
                                color: options.dataLabels.color, 
                                fontSize: options.dataLabels.fontSize ,
                                fontWeight:options.dataLabels.fontWeight
                            }
                        },
                        cursor: options.cursor
                    }
                }
                columnDrilldown(defaultChart);
                break;
            case "barchart":
            case "barchartpercent":
            case "barchartnormal":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.xAxisType=="dataTime"){
                    xAxisData(defaultChart);
                }else if(data[0].label.xAxisType=="number"){
                    var xAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                        }
                    };
                    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                }else{
                    defaultChart["xAxis"]["type"]="category";
                };
                var yAxis={
                    title: {
                        align: 'high'
                    },
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["xAxis"]["title"]["align"]="middle";
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    bar: {
                        stacking: data[0].label.type.split("chart")[1],
                        dataLabels: {
                            enabled: options.dataLabels.enabled,
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,true),
                            style: {
                                color: options.dataLabels.color, 
                                fontSize: options.dataLabels.fontSize ,
                                fontWeight:options.dataLabels.fontWeight
                            }
                        },
                        cursor: options.cursor
                    }
                }
                break;
            case "scatterchart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.xAxisType=="dataTime"){
                    xAxisData(defaultChart);
                }else if(data[0].label.xAxisType=="number"){
                    var xAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                        }
                    };
                    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                }else{
                    defaultChart["xAxis"]["type"]="category";
                    defaultChart["xAxis"]["tickmarkPlacement"]="on";
                };
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["series"]=dataproArr;
                defaultChart["plotOptions"]={
                    scatter: {
                        cursor: options.cursor,
                        marker: {
                            radius: options.marker.radius
                        }
                    }
                }
                break;
            case "bubblechart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.xAxisType=="dataTime"){
                    xAxisData(defaultChart);
                }else if(data[0].label.xAxisType=="number"){
                    var xAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                        }
                    };
                    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                }else{
                    defaultChart["xAxis"]["type"]="category";
                    defaultChart["xAxis"]["tickmarkPlacement"]="on";
                };
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["series"]=dataproArr;
                defaultChart["plotOptions"]={
                    bubble: {
                        cursor: options.cursor
                    }
                }
                break;
            case "solidgaugechartnum":
            case "solidgaugechart":
            case "solidgaugecharthalf":
            case "solidgaugechartnumhalf":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                if(data[0].label.type.split("chart")[1]!=="num"&&data[0].label.type.split("chart")[1]!=="numhalf"){
                    var title=singlePreValue();
                }else{
                    var title=singleValue(data[0].result[0].values[0][1],data[0].label.yAxisUnit.split("-")[1],false);
                }
                var preValue=Number(singlePreValue().replace("%",""));
                defaultChart["subtitle"]={
                    text: title,
                    align: 'center',
                    verticalAlign: 'middle',
                    y: options.gauge.subY,
                    style: {
                        color:preValue<=50?options.colorRule[0]:preValue>70?options.colorRule[2]:options.colorRule[1],
                        fontSize:options.gauge.subfontSize
                    }
                };
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["pane"]={
                    size:options.size,
                    startAngle: 395,
                    endAngle: 35,
                    background: [{
                        outerRadius: options.gauge.outerRadius,
                        innerRadius: options.gauge.innerRadius,
                        backgroundColor: options.colorRule[3],
                        shape: 'arc'
                    }]
                };
                var maxV=Number(data[0].result[0].values[0][1])+Number(data[0].result[1].values[0][1]);
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false),
                        y:15
                    },
                    min: 0,
                    max: maxV,
                    lineWidth: 0,
                    stops: [
                        [0.5, options.colorRule[0]], // green
                        [0.7, options.colorRule[1]], // yellow
                        [1, options.colorRule[2]] // red
                    ]
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                if(data[0].label.type=="solidgaugecharthalf"||data[0].label.type=="solidgaugechartnumhalf"){
                    defaultChart["pane"]["startAngle"]=options.halfChart.startAngle, // 圆环的开始角度
                    defaultChart["pane"]["endAngle"]=options.halfChart.endAngle   // 圆环的结束角度
                    defaultChart["pane"]["center"]=options.halfChart.center,
                    defaultChart["subtitle"]["y"]=options.gauge.subY+25,
                    defaultChart["yAxis"]["tickAmount"]=options.gauge.tickAmount,
                    defaultChart["yAxis"]["showFirstLabel"]=true,
                    defaultChart["yAxis"]["showLastLabel"]=true
                    if(options.gauge.tickAmount<=2){
                        defaultChart["yAxis"]["minorTickInterval"]=null,
                        defaultChart["yAxis"]["tickPixelInterval"]=[]
                    }
                }else{
                    defaultChart["pane"]["size"]=(Number(options.size.replace("%",""))-20)+"%";
                        defaultChart["yAxis"]["tickAmount"]=options.gauge.tickAmount-1,
                        defaultChart["yAxis"]["showFirstLabel"]=false,
                        defaultChart["yAxis"]["showLastLabel"]=true
                }
                defaultChart["plotOptions"]={
                    solidgauge: {
                        cursor: options.cursor,
                        fillOpacity: 0.3,
                        //borderWidth: options.gauge.borderWidth,
                        //borderColor:options.color[0],
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false,
                        showInLegend: false
                    }
                };
                defaultChart["series"]=dataproArr;
                break;
        }
        return defaultChart;
    };
})( jQuery );
//Y轴单位显示在标题后面时yTitleUnit=true;
function yTitleUnitTrans(){
    if(data[0].label.type=="columnchartpercent"||data[0].label.type=="areachartpercent"||data[0].label.type=="barchartpercent"){
        return "%";
    }else{
        return yAxisUnit.split("-")[1];
    }
}
//x轴为时间戳时xAxis属性处理
function xAxisData(defaultChart){
    var xAxis={
        tickPixelInterval: 170,
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M',
            hour: '%Y-%m-%d %H',
            day: '%Y-%m-%d',
            week: '%Y-%m',
            month: '%Y-%m',
            year: '%Y'
        }
    };
    defaultChart["tooltip"]["dateTimeLabelFormats"]={
        millisecond: '%Y-%m-%d %H:%M:%S',
        second: '%Y-%m-%d %H:%M:%S',
        minute: '%Y-%m-%d %H:%M',
        hour: '%Y-%m-%d %H',
        day: '%Y-%m-%d',
        week: '%Y-%m',
        month: '%Y-%m',
        year: '%Y'
    };
    defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
}
//饼图下钻处理
 function pieDrilldown(defaultChart){
    data.map(function(batchData){
        if(batchData.label.hasOwnProperty("drillData")){
            batchData.label.drillData.map(function(elem){
                elem.tooltip={
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                }
            });
            defaultChart["drilldown"]={
                series:getPieColorData(data).drillData
            };
        }
    });
 }
 //柱状图下钻处理
function columnDrilldown(defaultChart){
    data.map(function(batchData){
        if(batchData.label.hasOwnProperty("drillData")){
            batchData.label.drillData.map(function(elem){
                elem.tooltip={
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                }
            });
            defaultChart["drilldown"]={
                series:getColDrillData(data)
            };
        }
    });
}
//获取柱状图下钻数据drillData
function getColDrillData(){
    var drillData=[];
    data.map(function(batchData){
        if(batchData.label.drillData){
            drillData=drillData.concat(batchData.label.drillData);
        }
    });
    return drillData;
}
 //获取数据项名称
 function transSeriesName(batchData,oneDataResult){
    var newString;
    if(batchData.label.hasOwnProperty("seriesReg")&&batchData.label.seriesReg!==""){
        var seriesReg=batchData.label.seriesReg;
        newString = seriesReg.replace(/{{[\w\_]*}}/g, replacer);
    }else{
        newString=JSON.stringify(batchData.label);
    }
    function replacer(match) {
        var str = match.match(/{{(\S*)}}/)[1];
        var seriesName=oneDataResult.seriesAttr[str];
        return seriesName;
    }
    return newString;
}
//时间转换
function add0(m){
    return m<10?'0'+m:m
}
function dateFormat(times){
    var time = new Date(times);
    var y = time.getFullYear().toString()/* .slice(2) */;
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
//获取series
var parseData=function(data){
    var dataproArr=[];
    switch(data[0].label.type){
        case "areachart":
        case "areasplinechart":
        case "areachartpercent":
        case "areachartnormal":
        case "linechart":
        case "splinechart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null){
                        oneDataResult.values.map(function(point){
                            xAxisTypeFun(data,point);
                            point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                        });
                    }
                    var seriesElem={
                        "data":oneDataResult.values,
                        "tooltip": {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        },
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "piechartringrule":
        case "piechart":
        case "piechartring":
        case "piechartringhalf":
            var colorData=getPieColorData(data);
            var innerObj={
                size:options.size,
                innerSize: options.halfChart.innerSize,
                data:colorData.innerData,
                colors: colorData.color,
                tooltip: {
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                }
            };
            var outSiteObj={
                size:options.size,
                innerSize: options.halfChart.outerSize,
                data: colorData.outerData,
                colors: options.colorRule,
                tooltip: {
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false,true)
                }
            };
            if(data[0].label.type=='piechart'){
                innerObj['innerSize']='0';
                innerObj['size']='100%';
            }
            dataproArr.push(innerObj);
            if (data[0].label.type=='piechartringrule') {
                dataproArr.push(outSiteObj);
            }
            break;
        case "columnchart":
        case "columnchartpercent":
        case "columnchartnormal":
        case "barchart":
        case "barchartpercent":
        case "barchartnormal":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null){
                        oneDataResult.values.map(function(point){
                            point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                        });
                    }
                    var seriesElem={
                        "data":oneDataResult.values,
                        "tooltip": {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        },
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "columnchartdrill":
            var series=[];
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null){
                        oneDataResult.values.map(function(point){
                            xAxisTypeFun(data,point);
                            point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                            var seriesElem={
                                "name":point[0],
                                "y":point[1],
                                "drilldown":point[2]
                            };
                            series.push(seriesElem);
                        });
                    }
                };
            });
            dataproArr.push({
                "name":transSeriesName(data[0],data[0].result[0]),
                "tooltip": {
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                },
                "colorByPoint": true,
                "data":series
            });
            break;
        case "scatterchart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null){
                        oneDataResult.values.map(function(point){
                            xAxisTypeFun(data,point);
                            point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                        });
                    }
                    var seriesElem={
                        "marker":{enabled: true},
                        "data":oneDataResult.values,
                        "tooltip": {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        },
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "bubblechart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null){
                        oneDataResult.values.map(function(point){
                            xAxisTypeFun(data,point);
                            point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                            point[2]=((point[2]=='null'||point[2]==null)?null:Number(point[2]));
                        });
                    }
                    var seriesElem={
                        "marker":{enabled: true},
                        "data":oneDataResult.values,
                        "tooltip": {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        },
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "solidgaugechartnum":
        case "solidgaugechart":
        case "solidgaugecharthalf":
        case "solidgaugechartnumhalf":
            var yValue=Number(data[0].result[0].values[0][1]);
            dataproArr=[{
                name: transSeriesName(data[0],data[0].result[0]),
                tooltip: {
                    "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                },
                data: [{
                    color:options.color[0],
                    radius: options.gauge.outerRadius,
                    innerRadius: options.gauge.innerRadius,
                    y: yValue
                }]
            }];
            break;
        default:
    }
    return dataproArr;
}
//封装series数据时,X轴数据不同类型时的处理
function xAxisTypeFun(data,point){
    if(data[0].label.xAxisType=="dataTime"){
        point[0]=Number(point[0])*1000;
    }else if(data[0].label.xAxisType=="number"){
        point[0]=Number(point[0]);
    }
}
//科学计数法
function scienceNum(num){
    var p = Math.floor(Math.log(Math.abs(num))/Math.LN10);
    var n = parseFloat((num * Math.pow(10, -p)).toFixed(2));
    return n + 'e' + p;
}
//保留两位小数并去除小数点后无用的0
function decimal(number){
    number=Number(number);
    if(Math.abs(number)<10000){
        return parseFloat(number.toFixed(2));
    }else{
        return scienceNum(number);
    }
}
//Y轴刻度是否显示单位判断
function yTitleUnit(){
    return yAxisUnit.split("-")[1]!=''&&options.yAxis.yTitleUnit&&yAxisUnit.split("-")[1]!="KiB/s"&&yAxisUnit.split("-")[1]!="KiB";
}
//X轴刻度是否显示单位判断
function xTitleUnit(){
    return xAxisUnit.split("-")[1]!=''&&options.xAxis.xTitleUnit&&xAxisUnit.split("-")[1]!="KiB/s"&&xAxisUnit.split("-")[1]!="KiB";
}
var formatterOtherY=function(value) {
    if(Math.abs(value)>=10000){
        return Math.abs(value)>=Math.pow(10,8)?decimal(value):decimal(value/10000) + 'w';
    }else if(Math.abs(value)>=1000){
        return decimal(value/1000) + 'k';
    }else{
        return decimal(value);
    }
};
var formatterKiBs=function(value,tooltipBoolean,dataLabelsBoolean) {
    var thisValue=dataLabelsBoolean?this.y:this.value;
    if(tooltipBoolean){
        thisValue=value;
    }
    if(Math.abs(thisValue)>=Math.pow(1024,3)){
        return decimal(thisValue/Math.pow(1024,3))+'TiB/s';
    }else if(Math.abs(thisValue)>=Math.pow(1024,2)){
        return decimal(thisValue/Math.pow(1024,2))+'GiB/s';
    }else if(Math.abs(thisValue)>=1024){
        return decimal(thisValue/1024)+'MiB/s';
    }else if(Math.abs(thisValue)<1){
        return decimal(thisValue*1024)+'Byte/s';
    }else{
        return parseInt(thisValue)+'KiB/s';
    }
};
var formatterKiB=function(value,tooltipBoolean,dataLabelsBoolean) {
    var thisValue=dataLabelsBoolean?this.y:this.value;
    if(tooltipBoolean){
        thisValue=value;
    }
    if(Math.abs(thisValue)>=Math.pow(1024,3)){
        return decimal(thisValue/Math.pow(1024,3))+ 'TiB';
    }else if(Math.abs(thisValue)>=Math.pow(1024,2)){
        return decimal(thisValue/Math.pow(1024,2))+'GiB';
    }else if(Math.abs(thisValue)>=1024){
        return decimal(thisValue/1024)+'MiB';
    }else if(Math.abs(thisValue)<1){
        return decimal(thisValue*1024)+'Byte';
    }else{
        return parseInt(thisValue)+'KiB';
    }
};
//Y轴和Z轴单位刻度+提示框格式单位处理
function formatterFun(xUnit,yUnit,zUnit,positionType,chartType,dataLabelsBoolean,outerBoolean){
    var data1=data;
    var pointFormat=function() {
        if(yUnit=="KiB/s"){
            var pointY=formatterKiBs(this.y,"y",dataLabelsBoolean);
        }else if(yUnit=="KiB"){
            var pointY=formatterKiB(this.y,"y",dataLabelsBoolean);
        }else{
            var pointY=formatterOtherY(this.y)+yUnit;
        }

        if(zUnit=="KiB/s"){
            var pointZ=formatterKiBs(this.z,"z",dataLabelsBoolean);
        }else if(zUnit=="KiB"){
            var pointZ=formatterKiB(this.z,"z",dataLabelsBoolean);
        }else{
            var pointZ=formatterOtherY(this.z)+zUnit;
        }
        if(data1[0].label.xAxisType=="dataTime"){
            var pointX=dateFormat(this.x);
        }else if(data1[0].label.xAxisType=="number"){
            if(xUnit=="KiB/s"){
                var pointX=formatterKiBs(this.x,"x",dataLabelsBoolean);
            }else if(xUnit=="KiB"){
                var pointX=formatterKiB(this.x,"x",dataLabelsBoolean);
            }else{
                var pointX=formatterOtherY(this.x)+xUnit;
            }
        }else{
            var pointX=this.x;
        }
        
        if((chartType=="piechart"||chartType=="piechartringrule")&&outerBoolean){
            return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b>'
        }else if(chartType=="piechart"||chartType=="piechartringrule"||chartType=="piechartring"||chartType=="piechartringhalf"){
            return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b><br/><span style="color: '+ this.color + '">\u25CF值</span> '+': <b>'+pointY+'</b>'
        }else if(chartType=="scatterchart"){
            return '<span style="color: '+ this.series.color + '">'+pointX+"  "+pointY+'</span> ';
        }else if(chartType=="bubblechart"){
            return '<span style="color: '+ this.series.color + '">('+pointX+","+pointY+")"+"  大小:"+pointZ+'</span> ';
        }else if(chartType=="columnchartpercent"||chartType=="areachartpercent"||chartType=="barchartpercent"){
            return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ decimal(Number(this.percentage))+'%'+'('+pointY+')</b><br/>'
        }else if(chartType=="columnchartnormal"||chartType=="areachartnormal"||chartType=="barchartnormal"){
            return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ pointY+'('+decimal(Number(this.percentage))+'%)</b><br/>'
        }else if(chartType=="columnchartdrill"){
            return '<span style="color: '+ this.series.color + '">\u25CF</span> '+'<b>'+ pointY+'</b><br/>'
        }else if(chartType=="solidgaugechart"||chartType=="solidgaugechartnum"||chartType=="solidgaugecharthalf"||chartType=="solidgaugechartnumhalf"){
            return '<span style="color: '+ this.color + '">\u25CF值</span> '+': <b>'+pointY+'</b>'
        }else{
            return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ pointY+'</b><br/>'
        }
    };
    var formatterOtherV=function(){
        var xyUnit;
        var thisValue=dataLabelsBoolean?this.y:this.value;
        if(positionType=="yAxis"){
            xyUnit=yUnit;
        }else{
            xyUnit=xUnit;
        }
        if(dataLabelsBoolean||yTitleUnit()||xTitleUnit()){
            xyUnit='';
        }
        if(dataLabelsBoolean&&(data1[0].label.type=="columnchartpercent"||data1[0].label.type=="areachartpercent"||data1[0].label.type=="barchartpercent")){
    
            return decimal(Number(this.percentage))+"%";
        }
        
        if(Math.abs(thisValue)>=10000){
            return Math.abs(thisValue)>=Math.pow(10,8)?decimal(thisValue)+xyUnit:decimal(thisValue/10000) + 'w'+xyUnit;
        }else if(Math.abs(thisValue)>=1000){
            return decimal(thisValue/1000)+'k'+xyUnit;
        }else{
            return decimal(thisValue)+xyUnit;
        }
    };
    if(positionType=="tooltip"){
        return pointFormat;
    }else if(positionType=="yAxis"){//Y轴刻度显示和数据标签都使用yAxis
        if(chartType=="columnchartpercent"||chartType=="areachartpercent"||chartType=="barchartpercent"){
            yUnit="%";
        }
        if(yUnit=="KiB/s"){
            return formatterKiBs;
        }else if(yUnit=="KiB"){
            return formatterKiB;
        }else{
            return formatterOtherV;
        }
    }else{
        if(xUnit=="KiB/s"){
            return formatterKiBs;
        }else if(xUnit=="KiB"){
            return formatterKiB;
        }else{
            return formatterOtherV;
        }
    }
}
//活动图单值单位换算
function singleValue(value,unit,dataLabelsBoolean){
    if(unit=="KiB/s"){
        var pointZ=formatterKiBs(value,true,dataLabelsBoolean);
    }else if(unit=="KiB"){
        var pointZ=formatterKiB(value,true,dataLabelsBoolean);
    }else{
        var pointZ=formatterOtherY(value)+unit;
    }
    return pointZ.indexOf(".")==-1?pointZ:pointZ.split(/\.\d*/)[0]+pointZ.split(/\.\d*/)[1];
}
//环图和活动图百分比计算
function singlePreValue(){
    return parseInt(getPieColorData(data).innerData[0].y/(getPieColorData(data).innerData[0].y+getPieColorData(data).innerData[1].y)*100)+"%";
}
//得到饼图内环颜色+内外环值
function getPieColorData(data){
    var innerData=[];
    var drillData=[];
    data.map(function(batchData){
        for(var oneDataResult of batchData.result){
            if(oneDataResult.values!=null&&oneDataResult.values!=[]){
                var elem=oneDataResult.values[0];
                elem[1]=((elem[1]=='null'||elem[1]==null)?null:Number((Number(elem[1]).toFixed(2))));
                innerData.push({
                    name:transSeriesName(batchData,oneDataResult),
                    y:elem[1]
                });
                if(batchData.label.hasOwnProperty("drillData")){
                    innerData[innerData.length-1]["drilldown"]=elem[2];
                }
            }else{
                innerData.push({
                    name:transSeriesName(batchData,oneDataResult),
                    y:null
                });
                if(batchData.label.hasOwnProperty("drillData")){
                    innerData[innerData.length-1]["drilldown"]=null;
                }
            }
        };
        if(batchData.label.drillData){
            drillData=drillData.concat(batchData.label.drillData);
        }
    });
    var outerData=[];
    var color=options.color;
    if(data[0].label.type=="piechartringrule"){
        var allValue=innerData[0]["y"]+innerData[1]["y"];
        //color=[options.color[0],'#e6e6e6'];
        var allPre=0;
        data[0].label.outerData.map(function(elem,index){
            elem[1]=((elem[1]=='null'||elem[1]==null)?null:Number((Number(elem[1]).toFixed(2))));
            outerData.push({
                name:elem[0],
                y:elem[1]
            });
            allPre+=elem[1];
            if(innerData[0]["y"]/allValue>allPre/100){
                color=[index==options.colorRule.length-1?options.colorRule[index]:options.colorRule[index+1],options.colorRule[3]];
            }
        });
    }
    return {color:color,innerData:innerData,outerData:outerData,drillData:drillData};
}