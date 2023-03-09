(function() {
    //地图类型为中国地图
    var mapName = "china";
    //echarts对象初始化
    var myChart = echarts.init(document.querySelector(".chinamap .chart"));

    $.ajax({
        url: "http://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427",
        dataType: "jsonp",
        success: function(data) {
            var time = data.data.times;
            var lists = data.data.list.map((item) => {
                return {
                    name: item.name,
                    value: item.econNum,
                };
            });
            /*地图配置项*/
            myChart.setOption({
                //设置地图的标题文字、位置、字体
                title: {
                    text: '中国实时疫情地图',
                    subtext: time,
                    x: "center",
                    textStyle: {
                        color: "black",
                        fontFamily: "微软雅黑",
                        fontSize: 50,
                    },
                    subtextStyle: {
                        color: "black",
                        fontFamily: "微软雅黑",
                        fontSize: 20,
                    },
                },
                //设置提示框 主要是当鼠标停在某一省份上时，显示相关信息
                tooltip: {
                    show: true,
                    tigger: "item",
                    formatter: function(params) {
                        if (params.name == "南海诸岛") {
                            params.value = 0;
                        }
                        return "地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区：" + params.name + "<br />" +
                            "现存确诊：" + params.value
                    }

                },
                //设置视觉映射 地图左下方的图例
                visualMap: {
                    type: "continuous",
                    left: "50",
                    bottom: "80",
                    textStyle: {
                        color: "#333333",
                        fontSize: 14,
                    },
                    min: 0,
                    max: 150,
                    text: ['High', 'Low'],

                    realtime: false,
                    calculable: true,
                    color: ['orangered', 'yellow', 'lightskyblue'],
                },
                //设置地理坐标系组件
                geo: {
                    //地图类型为中国地图
                    map: "china",
                    show: true,
                    // label: {
                    //     emphasis: {
                    //         show: false
                    //     }
                    // },
                    //区域描边、阴影
                    itemStyle: {
                        normal: {
                            borderColor: "rgba(0,63,140,0.2)",
                            shadowColor: "rgba(0,63,140,0.2)",
                            shadowOffsetY: 20,
                            shadowBlur: 30,
                        },
                    },
                },
                series: [{
                    //系列类型为地图、类型为中国地图
                    type: "map",
                    map: "china",
                    //地图长宽比
                    aspectScale: 0.75,
                    //控制对应地区的汉字
                    label: {
                        normal: {
                            show: true,
                        },
                        //鼠标悬停时，该地区字体变色
                        emphasis: {
                            color: "#fff",
                            show: true,
                        },
                    },
                    //地图板块的边框
                    itemStyle: {
                        normal: {
                            areaColor: "#B2CAE0",
                            borderColor: "#fff",
                            borderWidth: 1,
                        },
                        //鼠标悬停时，该地区变色
                        emphasis: {
                            //高亮状态下的多边形和标签样式
                            //控制地图划过的颜色
                            label: {
                                color: "#fff", //移入后显示颜色
                                fontSize: 12,
                            },
                            //控制鼠标滑过时的高亮样式
                            itemStyle: {
                                //移入后颜色和边框
                                areaColor: "#FFAE00", //区域颜色
                                borderWidth: "yellow", //边框颜色
                            },
                        },
                    },
                    data: lists,
                }, ],
            });
            //实现地图自适应浏览器的大小

            window.addEventListener("resize", function() {
                myChart.resize();
            });

        },
    });
})();