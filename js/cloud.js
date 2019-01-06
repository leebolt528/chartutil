(function( $ ){
    $.fn.chartc = function(data) {
        var defaultChart = function(divId) {
            var defaultChart = {
                chart: {
                    renderTo : divId,
                },
                title: {
                    text:null,
                },
                credits:{
                    enabled:false
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '70%',
                    name: '市场份额',
                    data: [
                        {name:'Firefox',   y: 45.0},
                        ['IE',       26.8],
                        {
                            name: 'Chrome',
                            y: 12.8,
                           
                        },
                        ['Safari',    8.5],
                        ['Opera',     6.2],
                        ['其他',   7]
                    ]
                }]
            }
            return defaultChart;
        }
        new Highcharts.Chart(defaultChart($(this)[0]));
    }
})( jQuery );