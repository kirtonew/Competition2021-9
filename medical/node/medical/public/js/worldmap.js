(function() {
    //地图类型为世界地图
    var mapName = "world";
    //echarts对象初始化
    var myChart = echarts.init(document.querySelector(".worldmap .chart"));

    $.ajax({
        url: "http://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427",
        dataType: "jsonp",
        success: function(data) {
            var time = data.data.times;
            var lists = data.data.worldlist.map((item) => {
                return {
                    name: item.name,
                    value: item.econNum,
                    addNum: item.conadd,
                };
            });
            // console.log(lists);
            /*地图配置项*/
            myChart.setOption({
                title: {
                    text: '世界实时疫情地图',
                    subtext: time,
                    /*padding: [100,100,100,100],*/
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
                tooltip: {
                    show: true,

                    tigger: "item",
                    formatter: function(params) {
                        // console.log(params);
                        if (!params.value) {
                            return ("国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家：" +
                                params.name +
                                "<br />" +
                                "现存确诊：未知")
                        }
                        if (params.name == "中国") {
                            return (
                                "国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家：" +
                                params.name +
                                "<br />" +
                                "新&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增：待公布" +
                                "<br />" +
                                "现存确诊：" +
                                params.value
                            );
                        }
                        return (
                            "国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家：" +
                            params.name +
                            "<br />" +
                            "新&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;增：" +
                            params.data.addNum +
                            "<br />" +
                            "现存确诊：" +
                            params.value
                        );
                    },
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
                    min: 1000,
                    max: 3000000,
                    text: ['High', 'Low'],

                    realtime: false,
                    calculable: true,
                    color: ['orangered', 'yellow', 'lightskyblue'],

                },
                //设置地理坐标系组件
                geo: {
                    //地图类型为世界地图
                    map: "world",
                    // show: true,
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
                    //系列类型为地图、类型为世界地图
                    type: "map",
                    map: "world",
                    //地图长宽比
                    aspectScale: 0.75,
                    //控制对应地区的汉字
                    label: {
                        // normal: {
                        //     // show: true,
                        // },
                        //鼠标悬停时，该地区字体变色
                        emphasis: {
                            color: "#000",
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