(function() {
    var myChart = echarts.init(document.querySelector(".xzbmap .chart"));

    var xData = function() {
        var data = [];
        data.push('1990');
        data.push('1995');
        data.push('2000');
        for (var i = 2005; i < 2018; i++) {
            data.push(i);
        }
        return data;
    }();

    myChart.setOption({
        backgroundimage: "#FFF",

        title: {
            text: '1990-2017年中国城乡居民心血管病死亡率变化',
            subtext: '数据来自《中国心血管健康与疾病报告2019》',
            top: 20,
            left: "center",
            textStyle: {
                color: "#fff",
                fontSize: 20,
            },
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                textStyle: {
                    color: "#fff"
                }

            },
        },
        grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
                color: "#fff"
            }
        },
        legend: {
            x: '46%',
            top: '11%',
            textStyle: {
                color: '#90979c',
            },
            data: ['城市', '农村']
        },


        calculable: true,
        xAxis: [{
            type: "category",
            axisLine: {
                lineStyle: {
                    color: "rgba(204,187,225,0.5)",
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: xData,
        }],

        yAxis: [{
            type: "value",
            name: "死亡率（1/10万）",
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
                color: '#fff',
                fontSize: 15,
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "rgba(204,187,225,0.5)",
                }
            },

        }],
        dataZoom: [{
                show: true,
                height: 30,
                xAxisIndex: [0],
                bottom: 30,

                "start": 0,
                "end": 60,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: "#5B3AAE",
                },
                textStyle: {
                    color: "rgba(204,187,225,0.5)",
                },
                fillerColor: "rgba(67,55,160,0.4)",
                borderColor: "rgba(204,187,225,0.5)",

            },
            {
                type: "inside",
                show: true,
                height: 15,
                start: 1,
                end: 35
            }
        ],
        series: [{
            name: "城市",
            type: "line",
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                color: "#6f7de3",
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值',

                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            data: [
                213, 230, 234, 209, 184, 212, 242, 255,
                254, 257, 252, 259, 262, 265, 265, 268
            ],
        }, {
            name: "农村",
            type: "line",
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                color: "#c257F6",
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值',

                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            data: [
                174, 170, 189, 174, 177, 206, 221, 265,
                257, 262, 255, 294, 296, 298, 309, 312,
            ]
        }, ]

    });
    //实现地图自适应浏览器的大小
    window.addEventListener("resize", function() {
        myChart.resize();
    });
})();