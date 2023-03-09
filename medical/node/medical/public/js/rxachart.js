(function() {
    var myChart = echarts.init(document.querySelector(".rxamap .chart"))
    myChart.setOption({
        title: {
            text: '不同行业女性乳腺彩超（除乳腺增生外）异常指标检出率',
            subtext: '数据来自《2020年中国女性健康粉红报告》',

            x: 'center',
            top: '10',
            textStyle: {
                color: '#FFF',
                fontSize: 20,
            }
        },
        tooltip: {
            trigger: 'axis',
            show: false,
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        legend: {
            selectedMode: false,
            show: false
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [{
            splitLine: {
                show: true
            },
            type: 'value',
            show: true,
        }],
        xAxis: [{
            splitLine: {
                show: false
            },
            axisLine: { //y轴
                show: true,
                lineStyle: {
                    color: "#FFF",
                }
            },
            type: 'category',
            axisTick: {
                show: true
            },
            data: [
                '房地产', '媒体出版', '互联网IT', '教育培训', '旅游休闲', '其他', '医疗保健', '公务员', '市场营销', '能源', '金融',
            ],

        }],
        series: [{
            name: '标准化',
            type: 'bar',
            barWidth: 30,
            label: {
                show: true,
                position: 'top', // 位置
                color: '#FFF',
                fontSize: 14,
                fontWeight: 'bold',
                distance: 5, // 距离
                formatter: function(params) {
                    return params.data + '%'
                        // console.log(params)
                }
            },
            itemStyle: {
                barBorderRadius: [20, 20, 0, 0], // 圆角（左上、右上、右下、左下）
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    '#FFC0CB', '#FF1493'
                ].map((color, offset) => ({
                    color,
                    offset
                }))), // 渐变
            },
            data: [27.12, 27.64, 28.36, 28.58, 29.23, 29.37, 29.78, 30.13, 32.46, 32.99, 33.50, ]
        }]
    })

    //实现地图自适应浏览器的大小
    window.addEventListener("resize", function() {
        myChart.resize();
    });
})();