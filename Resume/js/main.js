(function(win, $) {
    $("img.lazy").lazyload({
        effect: "fadeIn",
        load: function(elements_left, settings) {
            $(this).uberZoom({
                width: 550,
                height: 290,
                fullscreen : true
            });
        }
    });

    
    var dataStyle = {
        normal: {
            label: { show: false },
            labelLine: { show: false },
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)',
        }
    };
    var placeHolderStyle = {
        normal: {
            color: 'rgba(0,0,0,0)',
            label: { show: false },
            labelLine: { show: false }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    var legendData1 = ['html,css', 'js', 'jq', 'html5', 'css3'];
    var legendData2 = ['echart等插件', 'mustache,mock', 'node', 'angularjs', 'canvas'];

    var getInit = function(myData) {
        return {
            color: ['#85b6b2', '#6d4f8d', '#cd5e7e', '#e38980', '#f7db88'],
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                top: 20,
                itemGap: 12,
                data: myData,
                textStyle: {
                    color: '#fff'
                }
            },
            series: [{
                    name: 'Line 1',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '60%'],
                    radius: [180, 200],
                    itemStyle: dataStyle,
                    hoverAnimation: false,

                    data: [{
                            value: 300,
                            name: myData[0]
                        }, {
                            value: 50,
                            name: 'invisible',
                            itemStyle: placeHolderStyle
                        }

                    ]
                }, {
                    name: 'Line 2',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '60%'],
                    radius: [160, 180],
                    itemStyle: dataStyle,
                    hoverAnimation: false,

                    data: [{
                        value: 150,
                        name: myData[1]
                    }, {
                        value: 60,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    }]
                }, {
                    name: 'Line 3',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '60%'],
                    hoverAnimation: false,
                    radius: [140, 160],
                    itemStyle: dataStyle,

                    data: [{
                        value: 80,
                        name: myData[2]
                    }, {
                        value: 50,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    }]
                }, {
                    name: 'Line 4',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '60%'],
                    hoverAnimation: false,
                    radius: [120, 140],
                    itemStyle: dataStyle,

                    data: [{
                        value: 45,
                        name: myData[3]
                    }, {
                        value: 30,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    }]
                }, {
                    name: 'Line 5',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '60%'],
                    radius: [100, 120],
                    itemStyle: dataStyle,

                    data: [{
                        value: 30,
                        name: myData[4]
                    }, {
                        value: 30,
                        name: 'invisible',
                        itemStyle: placeHolderStyle
                    }]
                },

            ]
        };
    };

    // skill1
    var skillChart1 = echarts.init(document.getElementById('echart-skill1'));
    skillChart1.setOption(getInit(legendData1));
    // skill1
    var skillChart2 = echarts.init(document.getElementById('echart-skill2'));
    skillChart2.setOption(getInit(legendData2));
}(this, jQuery));
