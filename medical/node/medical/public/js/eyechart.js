(function() {
    var myChart = echarts.init(document.querySelector(".bar .chart"));

    var seriesData1 = [18.1, 18.5, 18.9, 19.4, 19.6, 19.9, 20.3, 20.6, 21.0, 21.3, 21.6, 21.9, 22.2, 22.4, 22.7, 23.0]
    var xAxisData = [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020E",
        "2021E",
        "2022E",
        "2023E",
        "2024E",
        "2025E",
        "2026E",
        "2027E",
        "2028E",
        "2029E",
        "2030E",
    ];

    var barTopColor = ["#02c3f1", "#53e568", "#a154e9", '#FCCE10', '#E87C25', '#27727B',
        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
    ];
    var barBottomColor = [
        "rgba(2,195,241,0.1)",
        "rgba(83, 229, 104, 0.1)",
        "rgba(161, 84, 233, 0.1)",
        "rgba(252,206,16,0.1)",
        "rgba(232,124,37, 0.1)",
        "rgba(39,114,123, 0.1)",
        "rgba(254,132,99,0.1)",
        "rgba(155,202,99, 0.1)",
        "rgba(250,216,96, 0.1)",
        "rgba(243,164,59,0.1)",
        "rgba(96,192,221, 0.1)",
        "rgba(215,80,75, 0.1)",
        "rgba(198,229,121,0.1)",
        "rgba(244,224,1, 0.1)",
        "rgba(240,128,90, 0.1)",
        "rgba(38,192,192,0.1)",
    ];

    myChart.setOption({
        backgroundimage: "#061326",
        title: {
            text: '中国青光眼病患人数（百万）',
            subtext: '数据来自新浪网',
            top: 30,
            left: "center",
            textStyle: {
                color: "#fff",
                fontSize: 40,
            },
            subtextStyle: {
                color: "#fff",
                fontSize: 20,
            },
        },
        grid: {
            top: "25%",
            bottom: "15%",
        },
        xAxis: {
            data: xAxisData,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle:{
                    color: "#FFF",
                }
            },
            axisLabel: {
                show: true,
                margin: 15,
                align: "center",
                formatter: function(params, index) {
                    return (
                        "{b|" +
                        params +
                        "}"
                    );
                },
                textStyle: {
                    fontSize: 14,
                    color: "#FFF",
                    rich: {
                        a: {
                            fontSize: 12,
                            color: "#FFF",
                        },
                        b: {
                            height: 20,
                            fontSize: 14,
                            color: "#FFF",
                        },
                    },
                },
            },
        },
        yAxis: {
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
        },
        series: [{
                name: "柱顶部",
                type: "pictorialBar",
                symbolSize: [26, 10],
                symbolOffset: [0, -5],
                z: 12,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return barTopColor[params.dataIndex];
                        },
                    },
                },
                label: {
                    show: true,
                    position: "top",
                    fontSize: 16,
                },
                symbolPosition: "end",
                data: seriesData1,
            },
            {
                name: "柱底部",
                type: "pictorialBar",
                symbolSize: [26, 10],
                symbolOffset: [0, 5],
                z: 12,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return barTopColor[params.dataIndex];
                        },
                    },
                },
                data: seriesData1,
            },
            {
                type: "bar",
                itemStyle: {
                    normal: {
                        color: function(params) {
                            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 1,
                                    color: barTopColor[params.dataIndex],
                                },
                                {
                                    offset: 0,
                                    color: barBottomColor[params.dataIndex],
                                },
                            ]);
                        },
                        opacity: 0.8,
                    },
                },
                z: 16,
                silent: true,
                barWidth: 26,
                barGap: "-100%",
                data: seriesData1,
            },
        ],
    });
    //实现地图自适应浏览器的大小
    window.addEventListener("resize", function() {
        myChart.resize();
    });
})();

(function() {
    var myChart = echarts.init(document.querySelector(".pie .chart"));
    var color = ['#FC4567', '#2F8DF4', '#C25EC4', '#FCCE10', '#E87C25']
    var data = [{
            value: 1,
            name: '50岁以下'
        }, {
            value: 6,
            name: '51到60岁'
        },
        {
            value: 16,
            name: '61到70岁'
        },
        {
            value: 29,
            name: '71到80岁'
        },
        {
            value: 48,
            name: '81岁以上'
        }
    ]
    myChart.setOption({
            backgroundColor: "#FFF",
            color: color,
            title: {
                text: '不同年龄段白内障发病率',
                subtext: '数据来自华径情报网',
                left: 'center',
                top: '50%',
                textStyle: {
                    fontSize: 20,
                    color: 'black',
                },
                subtextStyle: {
                    color: 'black',
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{d}%',
            },
            legend: {
                orient: 'vertical',
                right: 20,
                top: 20,
                textStyle: {
                    color: 'black',
                },

                selectedMode: false
            },
            series: [{
                type: 'pie',
                radius: ['60%', '80%'],
                center: ['50%', '50%'],
                data: data,
                label: {
                    normal: {
                        formatter: '{icon|●}{name|}{font|{b}}',
                        rich: {
                            font: {
                                fontSize: 14,
                                padding: [5, 0],
                                color: 'black'
                            },
                            hr: {
                                height: 0,
                                borderWidth: 1,
                                width: '100%',
                                borderColor: '#fff'
                            }
                        }
                    },
                },
                // labelLine: {
                //     lineStyle: {
                //         color: '#fff'
                //     }
                // },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0,0,0,0.5)'
                    }
                }
            }]
        })
        //实现地图自适应浏览器的大小
    window.addEventListener("resize", function() {
        myChart.resize();
    });
})();