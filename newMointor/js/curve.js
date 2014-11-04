//创建曲线图函数
function createCurve(ele, queueData, callRateData){
    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });

    // Create the chart
    $('#' + ele).highcharts({
        chart : {
            backgroundColor: 'rgba(44,44,44,1)'
        },

        title: {
            text: null
        },

        credits: {
            enabled: false
        },

        rangeSelector: {
            enabled: false
        },

        exporting: {
            enabled: false
        },

        scrollbar: {
            enabled: false
        },

        xAxis: {
            labels: {
               enabled: false
            },
            tickLength: 0,
            minorTickLength: 0,
            lineColor: '#414141',
            gridLineColor: '#414141',
            gridLineWidth: 1
        },

        legend: {
            enabled: false
        },

        yAxis: [{
            title: {
                text: null
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
               enabled: false
            }
        }, {
            title: {
                text: null
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
               enabled: false
            }
        }],

        plotOptions: {
            column: {
                borderWidth: 0
            },
            spline: {
                lineColor: '#60848a'
            },
            series: {
                dataLabels: {
                    enabled: false
                },
                marker: {
                    enabled: true,
                    //lineWidth: 2,
                    fillColor: '#60848a',
                    lineColor: '#60848a',
                    radius: 7,
                    //symbol: 'url(images/marker1.png)'
                }
            }
        },

        tooltip: {
            enabled: false,
            backgroundColor: '#fd8a25',
            hideDelay: 1000 * 60 * 60,
            crosshairs: false,
            useHTML: true,
            style: {
                color: '#FFFFFF',
                fontSize: '32px',
                fontWeight: 'bolder'
            },
            formatter: function(){
                return '<span>' + this.points[0].y + '</span>';
            }
        },

        navigator: {
            enabled: false
        },

        series : [{
            type: 'column',
            yAxis: 1,
            color: '#57C8DA',
            name: '排队量',
            data: queueData
        }, {
            type: 'spline',
            name : '接通率',
            data : callRateData
        }]
    });
}
