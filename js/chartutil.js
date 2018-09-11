var options;
var data;
var xAxisUnit;
var yAxisUnit;
var zAxisUnit;
(function( $ ){
    $.fn.chart = function(data1,options1) {
        if (arguments.length == 1) {
            var options1={};
        }
       var options0={
            zoomType:"xy",
            export:true,
            lineWidth:1.2,
            cursor:'pointer',
            yTitleUnit:false,
            title: {
                align: 'left',
                color: '#55B951',
                fontSize:'14px'
            },
            legend:{
                enabled:true,
                fontWeight:"normal",
                fontSize:"12px",
                color:'#000'
            },
            labels: {
                color: "#666666", 
                fontSize: "12px" ,
                fontWeight:"normal"
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
                shared: true,
                color: "#333333", 
                fontSize: "12px",
                whiteSpace: "nowrap",
                fontWeight:"normal"
            },
            xAxis:{
                enabledTitle:true
            },
            yAxis:{
                enabledTitle:true
            },
            color:["#64bcff","#0dd8d1","#ff7f31", "#d84d4d", "#8085e9",
            "#90ed7d", "#f15c80", "#e4d354","#91e8e1",
            '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
            '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
            pie:{
                subY:55,
                subfontSize:'25px',
                size:'100%'
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
        new Highcharts.Chart(defaultChart(id,data,options));
    }
    var defaultChart = function(divId,data,options) {
        Highcharts.setOptions({
            lang : {
                loading : "加载中..."
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
                text: data[0].label.title,
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
                    text:xAxisUnit.split("-")[0]+(xAxisUnit.split("-")[1]!=''?"("+xAxisUnit.split("-")[1]+")":""),
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
                    text:yAxisUnit.split("-")[0]+(yTitleUnit()?"("+yAxisUnit.split("-")[1]+")":"")
                },
                labels: {
                    style: { 
                        color: options.labels.color, 
                        fontSize: options.labels.fontSize ,
                        fontWeight:options.labels.fontWeight
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
            },
            tooltip: {
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
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    area: {
                        cursor: options.cursor,
                        fillOpacity: 0.3,
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
                                    radius:options.marker.radius
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
                    }
                };
                break;
            case "piechartring":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                var title=parseInt(getPieColorData(data).innerData[0].y/(getPieColorData(data).innerData[0].y+getPieColorData(data).innerData[1].y)*100)+"%";
                defaultChart["subtitle"]={
                    text: title,
                    align: 'center',
                    verticalAlign: 'middle',
                    y: options.pie.subY,
                    style: {
                        color: getPieColorData(data).color[0],
                        fontSize:options.pie.subfontSize
                    }
                };
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        startAngle: -110, // 圆环的开始角度
                        endAngle: 110,    // 圆环的结束角度
                        center: ['50%', '65%'],
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
                drilldown(defaultChart);
                break;
            case "columnchart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,false)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["xAxis"]["type"]="category";
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    column: {
                        dataLabels: {
                            enabled: options.dataLabels.enabled,
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,true)
                        },
                        cursor: options.cursor
                    }
                }
                break;
            case "barchart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                var yAxis={
                    title: {
                        align: 'high'
                    },
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type)
                    }
                };
                defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                defaultChart["xAxis"]["type"]="category";
                defaultChart["xAxis"]["title"]["align"]="middle";
                defaultChart["series"]=dataproArr;
                defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                defaultChart["plotOptions"]={
                    bar: {
                        dataLabels: {
                            enabled: options.dataLabels.enabled,
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,true)
                        },
                        cursor: options.cursor
                    }
                }
                break;
            case "scatterchart":
                defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,false)
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
                var yAxis={
                    labels:{
                        formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],false,data[0].label.type,false)
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
        }
        return defaultChart;
    };
})( jQuery );
//饼图下钻处理
 function drilldown(defaultChart){
    data.map(function(batchData){
        if(batchData.label.hasOwnProperty("drillData")){
            batchData.label.drillData.map(function(elem){
                elem.tooltip=formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false)
            });
            defaultChart["drilldown"]={
                series:getPieColorData(data).drillData
            };
        }
    });
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
function format(times){
    var time = new Date(times);
    var y = time.getFullYear().toString().slice(2);
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
                    oneDataResult.values.map(function(point){
                        if(data[0].label.xAxisType=="dataTime"){
                            point[0]=Number(point[0])*1000;
                        }
                        point[1]=(point[1]=='null'?null:Number(point[1]));
                    });
                    var seriesElem={
                        "data":oneDataResult.values,
                        "tooltip": formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false),
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "piechartring":
        case "piechart":
            var colorData=getPieColorData(data);
            var innerObj={
                size:options.pie.size,
                innerSize: '65%',
                data:colorData.innerData,
                colors: colorData.color,
                tooltip: formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false)
            };
            var outSiteObj={
                size:options.pie.size,
                innerSize: '90%',
                data: colorData.outerData,
                colors: options.color,
                tooltip: formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false,true)
            };
            if(data[0].label.type=='piechart'){
                innerObj['innerSize']='0';
                innerObj['size']='100%';
            }
            dataproArr.push(innerObj);
            if (data[0].label.type=='piechartring') {
                dataproArr.push(outSiteObj);
            }
            break;
        case "columnchart":
        case "barchart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    oneDataResult.values.map(function(point){
                        point[1]=(point[1]=='null'?null:Number(point[1]));
                    });
                    var seriesElem={
                        "data":oneDataResult.values,
                        "tooltip": formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false),
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "scatterchart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    oneDataResult.values.map(function(point){
                        point[0]=Number(point[0]);
                        point[1]=(point[1]=='null'?null:Number(point[1]));
                    });
                    var seriesElem={
                        "marker":{enabled: true},
                        "data":oneDataResult.values,
                        "tooltip": formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false),
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        case "bubblechart":
            data.map(function(batchData){
                for(var oneDataResult of batchData.result){
                    oneDataResult.values.map(function(point){
                        point[0]=Number(point[0]);
                        point[1]=(point[1]=='null'?null:Number(point[1]));
                    });
                    var seriesElem={
                        "marker":{enabled: true},
                        "data":oneDataResult.values,
                        "tooltip": formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],true,data[0].label.type,false),
                        "name":transSeriesName(batchData,oneDataResult)
                    };
                    dataproArr.push(seriesElem);
                }
            });
            break;
        default:
    }
    return dataproArr;
}
//科学计数法
function scienceNum(num){
    var p = Math.floor(Math.log(Math.abs(num))/Math.LN10);
    var n = parseFloat((num * Math.pow(10, -p)).toFixed(2));
    return n + 'e' + p;
}
//保留两位小数并去除小数点后无用的0
function decimal(number){
    if(Math.abs(number)<10000){
        return parseFloat(number.toFixed(2));
    }else{
        return scienceNum(number);
    }
}
//Y轴刻度是否显示单位判断
function yTitleUnit(){
    return yAxisUnit.split("-")[1]!=''&&options.yTitleUnit&&yAxisUnit.split("-")[1]!="KiB/S"&&yAxisUnit.split("-")[1]!="KiB";
}
//单位转换
function formatterFun(xUnit,yUnit,zUnit,tooltipBoolean,type,dataLabelsBoolean,outerBoolean){
    pointFormat={
        pointFormatter: function() {
            if(yUnit=="KiB/S"){
                var pointY=formatterKiBs(this.y,"y");
            }else if(yUnit=="KiB"){
                var pointY=formatterKiB(this.y,"y");
            }else{
                var pointY=formatterOtherY(this.y)+yUnit;
            }
            if(zUnit=="KiB/S"){
                var pointZ=formatterKiBs(this.z,"z");
            }else if(zUnit=="KiB"){
                var pointZ=formatterKiB(this.z,"z");
            }else{
                var pointZ=formatterOtherY(this.z)+zUnit;
            }
            
            
            if((type=="piechart"||type=="piechartring")&&outerBoolean){
                return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b>'
            }else if(type=="piechart"||type=="piechartring"){
                return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b><br/><span style="color: '+ this.color + '">\u25CF值</span> '+': <b>'+pointY+'</b>'
            }else if(type=="scatterchart"){
                return '<span style="color: '+ this.series.color + '">'+this.x+xUnit+"  "+pointY+'</span> ';
            }else if(type=="bubblechart"){
                return '<span style="color: '+ this.series.color + '">('+this.x+xUnit+","+pointY+")"+"  大小:"+pointZ+'</span> ';
            }else{
                return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ pointY+'</b><br/>'
            }
        }
    };
    var formatterOtherY=function(value) {
        if(Math.abs(value)>=10000){
            return Math.abs(value)>=Math.pow(10,8)?decimal(value):decimal(value/10000) + 'w';
        }else if(Math.abs(value)>=1000){
            return decimal(value/1000) + 'k';
        }else{
            return decimal(value);
        }
    };
    var formatterKiBs=function(value,tooltipBoolean) {
        var yValue=dataLabelsBoolean?this.y:this.value;
        if(tooltipBoolean){
            yValue=value;
        }
        if(Math.abs(yValue)>=Math.pow(1024,3)){
            return decimal(yValue/Math.pow(1024,3))+'TiB/s';
        }else if(Math.abs(yValue)>=Math.pow(1024,2)){
            return decimal(yValue/Math.pow(1024,2))+'GiB/s';
        }else if(Math.abs(yValue)>=1024){
            return decimal(yValue/1024)+'MiB/s';
        }else if(Math.abs(yValue)<1){
            return decimal(yValue*1024)+'Byte/s';
        }else{
            return parseInt(yValue)+'KiB/s';
        }
    };
    var formatterKiB=function(value,tooltipBoolean) {
        var yValue=dataLabelsBoolean?this.y:this.value;
        if(tooltipBoolean){
            yValue=value;
        }
        if(Math.abs(yValue)>=Math.pow(1024,3)){
            return decimal(yValue/Math.pow(1024,3))+ 'TiB';
        }else if(Math.abs(yValue)>=Math.pow(1024,2)){
            return decimal(yValue/Math.pow(1024,2))+'GiB';
        }else if(Math.abs(yValue)>=1024){
            return decimal(yValue/1024)+'MiB';
        }else if(Math.abs(yValue)<1){
            return decimal(yValue*1024)+'Byte';
        }else{
            return parseInt(yValue)+'KiB';
        }
    };
    var formatterOtherV=function(){
        var yValue=dataLabelsBoolean?this.y:this.value;
        if(dataLabelsBoolean||yTitleUnit()){
            yUnit='';
        }
        if(Math.abs(yValue)>=10000){
            return Math.abs(yValue)>=Math.pow(10,8)?decimal(yValue)+yUnit:decimal(yValue/10000) + 'w'+yUnit;
        }else if(Math.abs(yValue)>=1000){
            return decimal(yValue/1000)+'k'+yUnit;
        }else{
            return decimal(yValue)+yUnit;
        }
    };
    if(tooltipBoolean){
        return pointFormat;
    }else{
        if(yUnit=="KiB/S"){
            return formatterKiBs;
        }else if(yUnit=="KiB"){
        return formatterKiB;
        }else{
        return formatterOtherV;
        }
    }
}
//得到饼图内环颜色+内外环值
function getPieColorData(data){
    var innerData=[];
    var drillData=[];
    data.map(function(batchData){
        for(var oneDataResult of batchData.result){
            var elem=oneDataResult.values[0];
            elem[1]=Number((Number(elem[1]).toFixed(2)));
            innerData.push({
                name:transSeriesName(batchData,oneDataResult),
                y:elem[1]
            });
            if(batchData.label.hasOwnProperty("drillData")){
                innerData[innerData.length-1]["drilldown"]=elem[2];
            }
        };
        if(batchData.label.drillData){
            drillData=drillData.concat(batchData.label.drillData);
        }
    });
    var outerData=[];
    var color=options.color;
    if(data[0].label.type=="piechartring"){
        var allValue=innerData[0]["y"]+innerData[1]["y"];
        color=[options.color[0],'#e6e6e6'];
        var allPre=0;
        data[0].label.outerData.map(function(elem,index){
            elem[1]=Number((Number(elem[1]).toFixed(2)));
            outerData.push({
                name:elem[0],
                y:elem[1]
            });
            allPre+=elem[1];
            if(innerData[0]["y"]/allValue>allPre/100){
                color=[index==options.color.length-1?options.color[index]:options.color[index+1],'#e6e6e6'];
            }
        });
    }
    return {color:color,innerData:innerData,outerData:outerData,drillData:drillData};
}