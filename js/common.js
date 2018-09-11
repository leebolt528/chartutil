var dh = $(window).height();
var toph=$(".head_top").height()+$(".app-header").height();
var toolh=$(".app-monitor-show-toolview").height();
var pageh=$(".datasummary-page").outerHeight();
var enlarge=false;
var datatablesOvh;
$(function(){
    $(".alert-loading .close").on("click",function(){
        closeMonitorLoad();
    });
    $(".alert-laydate .close").on("click",function(){
        $(".alert-laydate").removeClass("show");
    });

    /*工具栏视图按钮*/
    $(".app-monitor-nav .app-monitor-i button").click(function(){
        $(".app-monitor-nav .app-monitor-i button").removeClass("active");
        $(this).addClass("active");
    });
    /*页面结构*/
    $('.app-monitor-showtool').click(function () {
        $(".app-monitor-show-toolview").slideToggle("slow");
        $(".toolview-bg").slideToggle("slow");
        if($("#page-content").height()== $("#embed-refreshable").height()+pageh){
            $("#embed-refreshable").css("height", dh-toph-toolh-pageh + "px");
        }else{
            $("#embed-refreshable").css("height", dh-toph-pageh + "px");
        }
    });

    $(window).resize(function(){
        computeLayout(enlarge);
    });
    computeLayout(enlarge);
    /*$(document).on("click",".tab-content .enlarge",function(){
        $(".tab-content").css({"position":"fixed","z-index":"2000","left":"0","right":"0","top":"0","bottom":"0","background":"rgba(0,0,0,0.6)"});
        enlarge=true;
        canvasWH(enlarge);
    });*/
});
function showMonitorLoad(){
    $("#page-container .alert-loading").addClass("show");
}

function closeMonitorLoad(){
    $("#page-container .alert-loading").removeClass("show");
}

function computeLayout(enlarge){
    dh = $(window).height();
    toph=$(".head_top").height()+$(".app-header").height();
    pageh=$(".datasummary-page").outerHeight();
    $(".app-header").css("top",$(".head_top").height()+"px");
    $(".app-monitor-show-toolview").css("top",toph+"px");
    $(".toolview-bg").css("height",$(".app-monitor-show-toolview").height()+"px");
    $("#page-leftbar").css("top",$(".head_top").height()+"px");
    $("#page-container").css("top", toph+ "px");
    $("#page-container").css("height", dh-toph + "px");
    $("#page-content").css("height", dh-toph + "px");
    if($(".toolview-bg").css("display")=="block"){
        toolh=$(".app-monitor-show-toolview").height();
        $("#embed-refreshable").css("height", dh-toph-toolh-pageh + "px");
    }else{
        toolh=$(".app-monitor-show-toolview").height();
        $("#embed-refreshable").css("height", dh-toph-pageh + "px");
    }
    /*datatables表体滚动*/
    if($(".tableOutPa").css("marginTop")&&$(".tableOutPa .tableOut").css("marginTop")&&!transtree){
        datatablesOvh =$("#embed-refreshable").height()-$(".tableOutPa").css("marginTop").split("px")[0]-$(".tableOutPa .row.row1").height()-$(".tableOutPa .tableOut").css("marginTop").split("px")[0]-$(".tableOutPa .tableOut").css("marginBottom").split("px")[0]-$(".tableOutPa .tableOut thead").height()-5;
        $(".tableOutPa .tableOut tbody").css("height", datatablesOvh + "px");
        if($(".tableOutPa .tableOut tbody.layout").prop('scrollHeight')>datatablesOvh+5){
            $(".tableOutPa .tableOut tbody.layout tr").addClass("tbodyOut");
        }else{
            $(".tableOutPa .tableOut tbody.layout tr").removeClass("tbodyOut");
        }
    }
    /*transtree页面表格高度及表体滚动*/
    if($(".tableOutPa1").css("marginTop")&&$(".tableOutPa1 .tableOut").css("marginTop")){
        datatablesOvh =$("#embed-refreshable").height()-$(".tableOutPa1").css("marginTop").split("px")[0]-$(".tableOutPa1 .tableOut").css("marginTop").split("px")[0]-$(".tableOutPa1 .tableOut").css("marginBottom").split("px")[0]-$(".tableOutPa1 .tableOut thead").height()-$(".tableOutPa1 .long-arrow-left").height()-5;
        $(".tableOutPa1 .tableOut tbody").css("height", datatablesOvh + "px");
        if($(".tableOutPa1 .tableOut tbody.layout").prop('scrollHeight')>datatablesOvh+5){
            $(".tableOutPa1 .tableOut tbody.layout tr").addClass("tbodyOut");
        }else{
            $(".tableOutPa1 .tableOut tbody.layout tr").removeClass("tbodyOut");
        }
    }
    //main.jsp
    canvasWH(enlarge);
    sidebarP();
    //tap布局
    if($("#page-content").hasClass("moveR")){
        $(".app-monitor-panel").css({
            width: $('.app-content').width()-258-14,
            paddingLeft: Math.floor((($('.app-content').width()-258-14) % $(".app-monitor-panel-item>.panel").outerWidth(true))/2)
        });
    }else{
        $(".app-monitor-panel").css({
            width: $('.app-content').width()-14,
            paddingLeft: Math.floor((($('.app-content').width()-14)% $(".app-monitor-panel-item .panel").outerWidth(true))/2)
        });
    }
}
/*main.jsp计算侧边和画布栏高度宽度*/
function canvasWH(boolean){
    if(boolean){
        var canvasW=$(window).innerWidth()-$(".sidebar").outerWidth(true);
        var canvasH=$(window).height();
    }else{
        var canvasW=$("#page-content.moveR .tab-content").innerWidth()-$(".sidebar").outerWidth(true);
        var canvasH=$("#page-content").height();
    }
    $("#canvas").css("width",canvasW);
    $("#page-content.moveR .tab-content").css("height",canvasH+"px");
    $("#page-content.moveR .tab-content .tab-pane").css("height",canvasH+"px");
    $("#page-content.moveR .tab-content .tab-pane:first>div").css("height",canvasH+"px");
    //main.jsp弹出层内部高度
    $(".sidebar-body").css("height",$(".sidebar").height()-$(".sidebar .header").outerHeight(true)+"px");
}
/*main.jsp弹出层定位*/
function sidebarP(){
    $(".sidebar.first").css("top",toph+"px");
    $(".sidebar.second").css("top",toph+"px");
}
/*左侧菜单收缩*/
function menuArrowFun(){
    if(menuArrow=="true"){
        $("#page-leftbar ul li span").css("display","none");
        $("#page-leftbar").css("width","60px");
        $(".menu-arrow").css("width","60px");
        $(".menu-arrow>i").removeClass("fa-long-arrow-left");
        $(".menu-arrow>i").addClass("fa-long-arrow-right");
        $(".menu-arrow>i").css({"padding-left":"20px","padding-right":"20px"});
        $("#page-content.moveR .app-monitor-show-toolview,\n" +
            "#page-content.moveR .toolview-bg,\n" +
            "#page-content.moveR .app-header,\n" +
            "#page-content.moveR .app-content #embed-refreshable").css("margin-left","68px");
        canvasWH(enlarge);
    }
}
$(document).on("click",".menu-arrow .fa-long-arrow-left",function(){
    menuArrow=true;
    $("#page-leftbar ul li span").css("display","none");
    $("#page-leftbar").css("width","60px");
    $(".menu-arrow").css("width","60px");
    $(this).removeClass("fa-long-arrow-left");
    $(this).addClass("fa-long-arrow-right");
    $(this).css({"padding-left":"20px","padding-right":"20px"});
    $("#page-content.moveR .app-monitor-show-toolview,\n" +
        "#page-content.moveR .toolview-bg,\n" +
        "#page-content.moveR .app-header,\n" +
        "#page-content.moveR .app-content #embed-refreshable").css("margin-left","68px");
    canvasWH(enlarge);
    if($("#app-dashboard-nav li:first").hasClass("active") || $("#app-server-nav li:nth-child(2)").hasClass("active")){
        diagram.layoutDiagram(true);
    }
});
$(document).on("click",".menu-arrow .fa-long-arrow-right",function(){
    menuArrow=false;
    $("#page-leftbar ul li span").css("display","inline");
    $("#page-leftbar").css("width","250px");
    $(".menu-arrow").css("width","250px");
    $(this).removeClass("fa-long-arrow-right");
    $(this).addClass("fa-long-arrow-left");
    $(this).css({"padding-left":"10px","padding-right":"10px"});
    $("#page-content.moveR .app-monitor-show-toolview,\n" +
        "#page-content.moveR .toolview-bg,\n" +
        "#page-content.moveR .app-header,\n" +
        "#page-content.moveR .app-content #embed-refreshable").css("margin-left","258px");
    canvasWH(enlarge);
    if($("#app-dashboard-nav li:first").hasClass("active") || $("#app-server-nav li:nth-child(2)").hasClass("active")){
        diagram.layoutDiagram(true);
    }
});