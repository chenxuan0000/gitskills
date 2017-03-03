// jQuery.support.cors = true; //支持跨服务器请求
(function(win, $) {
    var $firstYear = $('#first-year'),
        $secondYear = $('#second-year'),
        $firstMonth = $('#first-month'),
        $secondMonth = $('#second-month'),
        $createEcharts = $('#create-echarts'),
        $echartsOne = $('#echarts-one'),
        $echartsTwo = $('#echarts-two'),
        $echartSeven = $('#echart-seven');
    var para = {}, //参数
        meterData = {}, //右侧仪表盘数据
        M = Mustache,
        html = [],
        temp1 = $('#tmpl1').html(),
        temp2 = $('#tmpl2').html(),
        constructionChart2, constructionChart3, constructionChart4, constructionChart5, constructionChart6, onlineChart1,
        // dataUrl = 'http://oa2.epoint.com.cn/EpointKnowledge/Service/KnowledgeProblemInfo.asmx/ProblemCount',
        dataUrl = 'http://192.168.118.34:9500/EpointKnowledge/ProblemCount';

    //完善仪表盘数据
    var perfectMeter = function(data, json) {
        var wttj = json.JCZCcountall.Text,
            yjawt = json.JCZCcountYJA.Text,
            wtzjal = ((yjawt / wttj) * 100).toFixed(1),
            wtminute = json.JCZCHour.Text,
            wttime1 = parseInt(wtminute / 60),
            wttime2 = wtminute % 60;
        if (wttime1 < 10) {
            wttime1 = '0' + wttime1;
        }
        if (wttime2 < 10) {
            wttime2 = '0' + wttime2;
        }
        data.wtzjal = wtzjal;
        data.wttime1 = wttime1;
        data.wttime2 = wttime2;
    };

    //完善各研发群问题数量
    var perfectDepartCount = function(json) {
        var num1 = json.JCSScountall.Text,
            num2 = json.QDcountall.Text,
            num3 = json.WZDScountall.Text,
            num4 = json.KJZCcountall.Text,
            num5 = json.YDKFcountall.Text;
        return [num1, num2, num3, num4, num5];
    };

    //完善各研发群已结案问题数量
    var perfectDoneCount = function(json) {
        var num1 = json.JCSScountYJA.Text,
            num2 = json.QDcountYJA.Text,
            num3 = json.WZDScountYJA.Text,
            num4 = json.KJZCcountYJA.Text,
            num5 = json.YDKFcountYJA.Text;
        return [num1, num2, num3, num4, num5];
    };

    //完善各研发群待结案问题数量
    var perfectUnDoneCount = function(json) {
        var num1 = json.JCSScountDJA.Text,
            num2 = json.QDcountDJA.Text,
            num3 = json.WZDScountDJA.Text,
            num4 = json.KJZCcountDJA.Text,
            num5 = json.YDKFcountDJA.Text;
        return [num1, num2, num3, num4, num5];
    };

    //完善各研发群平均办结时间
    var perfectTimeCount = function(json) {
        var num1 = json.JCSSHour.Text,
            num2 = json.QDHour.Text,
            num3 = json.WZDSHour.Text,
            num4 = json.KJZCHour.Text,
            num5 = json.YDKFHour.Text;
        return [num1, num2, num3, num4, num5];
    };
    //完善各条线疑难问题数量
    var perfectDifficult = function(json) {
        var num1 = json.JCSSYN.Text,
            num2 = json.QDYN.Text,
            num3 = json.WZDSYN.Text,
            num4 = json.KJZCYN.Text,
            num5 = json.YDKFYN.Text;
        return [num1, num2, num3, num4, num5];
    };
    var sortBy = function(filed, rev, primer) {
        rev = (rev) ? -1 : 1;
        return function(a, b) {
            a = a[filed];
            b = b[filed];
            if (typeof(primer) != 'undefined') {
                a = primer(a);
                b = primer(b);
            }
            if (a < b) {
                return rev * 1;
            }
            if (a > b) {
                return rev * -1;
            }
            return 1;
        }
    };
    //完善各研发群问题结案率
    var perfectLine = function(json) {
        var num1 = ((json.WZDScountYJA.Text / json.WZDScountall.Text) * 100).toFixed(1),
            num2 = ((json.JCSScountYJA.Text / json.JCSScountall.Text) * 100).toFixed(1),
            num3 = ((json.KJZCcountYJA.Text / json.KJZCcountall.Text) * 100).toFixed(1),
            num4 = ((json.YDKFcountYJA.Text / json.YDKFcountall.Text) * 100).toFixed(1),
            num5 = ((json.QDcountYJA.Text / json.QDcountall.Text) * 100).toFixed(1);
        var obj = [{ name: '网站大师', num: num1 },
            { name: '基础组件', num: num2 },
            { name: '框架支撑', num: num3 },
            { name: '移动研发', num: num4 },
            { name: '前端支撑', num: num5 }
        ];
        obj.sort(sortBy('num', false, parseInt));
        return obj;
    };
    //渲染统计问题数据
    var applyCount = function(json) {
        var $num = $('#countAll-num').find('.num');
        $num.eq(0).text(json.JCZCcountall.Text);
        $num.eq(1).text(json.JCZCcountYJA.Text);
        $num.eq(2).text(json.JCZCcountDJA.Text);
        $num.eq(3).text(json.JCZCYN.Text);
    };
    //渲染统计问题数据2
    var applyCount2 = function(json) {
        var $num = $('#ynCount-num').find('.secondNum');
        $num.eq(0).text(json.YDKFYN.Text);
        $num.eq(1).text(json.KJZCYN.Text);
        $num.eq(2).text(json.WZDSYN.Text);
        $num.eq(3).text(json.QDYN.Text);
        $num.eq(4).text(json.JCSSYN.Text);
    };

    // 饼图 数据渲染
    var renderPieChartData = function(chart, myData) {
        chart.setOption({
            series: [{
                data: [
                    { value: 0 }
                ]
            }, {
                data: [
                    { value: 0 }
                ]
            }, {
                data: [
                    { value: myData[0], name: '政务服务' },
                    { value: myData[1], name: '电子政务' },
                    { value: myData[3], name: '建筑企业' },
                    { value: myData[2], name: '数字建设' },
                    { value: myData[4], name: '基础支撑' }
                ]
            }]
        });
        // $('#echart2-count').css('display', 'block');
    };
    // 仪表盘数据渲染
    var renderTopChartData = function(chart, myData) {
        var myData1 = myData / 100;
        chart.setOption({
            series: {
                data: { value: myData },
                axisLine: {
                    lineStyle: {
                        color: [
                            [0, '#1464b9'],
                            [myData1, '#1464b9'],
                            [1, '#d2e7fc']
                        ]
                    }
                },
            }
        });
    };
    // 各研发群问题数量处理情况汇总 数据渲染
    var renderBarData = function(chart, myData) {
        chart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [{
                    name: '已结案问题',
                    icon: 'rect'
                }, {
                    name: '未结案问题',
                    icon: 'rect'
                }, {
                    name: '平均处理时长',
                    icon: 'image://./images/legend3.jpg',
                }]
            },
            xAxis: [{
                type: 'category',
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发'],
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                    inside: true
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                axisTick: { show: false }
            }, {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                splitLine: { show: false },
                axisTick: { show: false }
            }],
            series: [{
                name: '已结案问题',
                data: myData.finish
            }, {
                name: '未结案问题',
                data: myData.unfinish
            }, {
                name: '平均处理时长',
                data: myData.average
            }]
        });
    };
    // 各研发群问题平均处理时长 数据渲染
    var renderTimeBarData = function(chart, myData) {
        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                show: true
            },
            yAxis: {
                show: true,
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发']
            },
            series: [{
                data: myData
            }]
        });
    };
    // 雷达图数据渲染1
    var renderRadarChartData = function(radarData) {
        radarData.chart.setOption({
            legend: {
                data: ['未结案', '已结案']
            },
            radar: {
                indicator: [
                    { name: '基础组件', max: 2000 },
                    { name: '前端支撑', max: 2000 },
                    { name: '网站大师', max: 2000 },
                    { name: '框架支撑', max: 2000 },
                    { name: '移动研发', max: 2000 }
                ]
            },
            series: [{
                data: [{
                    name: '未结案',
                    value: radarData.data1
                }, {
                    name: '已结案',
                    value: radarData.data2
                }]
            }]
        });
    };
    //发送请求1
    var sendAjax = function(para) {
        $.ajax({
            url: dataUrl,
            data: para,
            dataType: "xml",
            type: 'post',
            success: function(res) {
                var jsonData = $.xmlToJSON(res).Problem;
                //渲染统计问题数据
                applyCount(jsonData);
                // 饼图 数据渲染
                renderPieChartData(constructionChart2, perfectDepartCount(jsonData));
                perfectMeter(meterData, jsonData);
                meterData.echart = 'echart2';
                html.push(M.render(temp1, meterData));
                $echartsTwo.empty().prepend(html.join(''));
                html = [];
                // 左侧仪表盘
                var constructionChart1 = echarts.init(document.getElementById('echart2'));
                constructionChart1.setOption(initChartOption);
                renderTopChartData(constructionChart1, meterData.wtzjal);
                // 各研发群问题数量处理情况汇总
                var dataInfo = {
                    "finish": perfectDoneCount(jsonData),
                    "unfinish": perfectUnDoneCount(jsonData),
                    "average": perfectTimeCount(jsonData)
                };
                renderBarData(constructionChart3, dataInfo);

                //右侧各研发部办结率排行
                var rankData = perfectLine(jsonData);
                $.each(rankData, function(index, value) {
                    value.i = index + 1;
                });
                html.push(M.render(temp2, { item: rankData }));
                $('#done-rank').empty().prepend(html.join(''));
                html = [];
                // 各条线疑难问题情况汇总
                applyCount2(jsonData);
                // 各研发群平均处理时间情况汇总
                renderTimeBarData(constructionChart4, perfectTimeCount(jsonData));
                var radarData = {
                    chart: onlineChart1,
                    data1: perfectUnDoneCount(jsonData),
                    data2: perfectDoneCount(jsonData)
                };
                // 各条线问题结案率排行
                renderRadarChartData(radarData);

            }
        })
    };

    //生成图表按钮事件
    $createEcharts.click(function() {
        var firstYear = $firstYear.find("option:selected").val(),
            secondYear = $secondYear.find("option:selected").val(),
            firstMonth = $firstMonth.find("option:selected").val(),
            secondMonth = $secondMonth.find("option:selected").val();
        para.startdate = firstYear + '-' + firstMonth + '-' + 1;
        para.enddate = secondYear + '-' + secondMonth + '-' + 1;
        // 判断选中的结束日期是否大于开始日期
        if (secondYear < firstYear) {
            alert('结束日期要大于开始日期');
        } else if(secondYear === firstYear){
            if (secondMonth > firstMonth) {
                sendAjax(para);
            } else {
                alert('结束日期要大于开始日期');
            }
        } else {
            sendAjax(para);
        }
    });

    // 下拉选值变化操作
    $('#form-control').on('change', function() {
        var link = $(this).val();
        window.location.href = link;
    })

    var initChartOption = {
        tooltip: {
            formatter: "{a}{c}%"
        },
        series: [{
            type: 'gauge',
            name: '问题总结案率：',
            center: ['18%', '40%'],
            radius: '70%',
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 16
                }
            },
            axisLabel: { show: false },
            splitLine: { show: false },
            axisTick: { show: false },
            detail: { show: false }
        }]
    };
    //初始化图表
    var initChart = function() {
        // 第一个饼图配置
        var initChartOption4 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ['#37adf3', '#f04b38', '#1464b9', '#f69e18', '#57c856'],
            legend: {
                orient: 'vertical',
                top: 10,
                left: 0,
                textStyle: {
                    fontSize: 13
                },
                data: ['政务服务', '电子政务', '建筑企业', '数字建设', '基础支撑'],
                itemGap: 17
            },
            series: [{
                type: 'pie',
                center: ['55%', '47%'],
                radius: ['72%', '72.1%'],
                "color": ["#eee"],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                stillShowZeroSum: false,
                itemStyle: {
                    normal: {
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        borderColor: "#e7e7e7"
                    }
                },
                tooltip: { show: false },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: { show: false }
                }
            }, {
                type: 'pie',
                center: ['55%', '47%'],
                radius: ['38%', '38.1%'],
                "color": ["#eee"],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                stillShowZeroSum: false,
                itemStyle: {
                    normal: {
                        borderColor: "#e7e7e7"
                    },
                    emphasis: {
                        borderColor: "#e7e7e7"
                    }
                },
                tooltip: { show: false },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: { show: false }
                }
            }, {
                name: '访问来源',
                type: 'pie',
                center: ['55%', '47%'],
                radius: ['45%', '65%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        formatter: '{b},{c}',
                        textStyle: {
                            fontSize: 12
                        }
                    }
                }
            }]
        };

        constructionChart2 = echarts.init(document.getElementById('echart1'));
        constructionChart2.setOption(initChartOption4);

        var initChartOption3 = {
            timeline: {
                show: false
            },
            options: [{
                color: ["#0d96e6", "#f99e29", "#56c755"],
                legend: {
                    top: 20,
                    left: 55,
                    itemWidth: 14,
                    itemHeight: 7,
                    itemGap: 20
                },
                grid: {
                    left: 15,
                    right: 20,
                    bottom: 16,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value'
                }, {
                    type: 'value'
                }],
                series: [{
                    type: 'bar',
                    barWidth: '28%',
                    barGap: '10%'
                }, {
                    type: 'bar',
                    barWidth: '26%',
                    barGap: '10%'
                }, {
                    type: 'line',
                    symbolSize: 6,
                    markLine: {
                        symbol: ['none', 'arrow'],
                        symbolSize: [2, 4],
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: 'orange'
                                },
                                barBorderColor: 'orange',
                                label: {
                                    normal: {
                                        position: 'end',
                                        formatter: function(params) {
                                            return Math.round(params.value);
                                        }
                                    },

                                    textStyle: {
                                        color: 'orange'
                                    }
                                }
                            }
                        },
                        data: [{
                            type: 'average',
                            name: '总平均处理时长'
                        }]
                    },
                    yAxisIndex: 1
                }]
            }]
        };
        constructionChart3 = echarts.init(document.getElementById('echart3'));
        constructionChart3.setOption(initChartOption3);

        var initChartOption4 = {
            color: ['#37adf3'],
            grid: {
                left: '3%',
                right: '7%',
                top: '10%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                show: false,
                type: 'value',
                splitLine: false,
                boundaryGap: [0, '3.8%'],
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                show: false,
                type: 'category',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid'
                    }
                },
                data: [],
                axisTick: { show: false }
            },
            series: [{
                name: '时长',
                type: 'bar',
                barWidth: '38%',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{c}min',
                        textStyle: {
                            fontSize: 14,
                            color: '#333'
                        }
                    }
                }
            }]
        };
        constructionChart4 = echarts.init(document.getElementById('echart4'));
        constructionChart4.setOption(initChartOption4);
        var onlineOption = {
            color: ['#f89f29', '#0d96e6'],
            tooltip: {},
            legend: {
                top: 28,
                left: 0,
                width: 30,
                itemHeight: 8,
                itemWidth: 16
            },
            grid: {
                containLabel: true
            },
            radar: {
                center: ['50%', '60%'],
                name: {
                    textStyle: {
                        color: '#333'
                    }
                },
                indicator: []
            },
            series: [{
                type: 'radar',
                symbolSize: 7,
                itemStyle: {
                    normal: {
                        borderColor: '#85b477',
                        borderWidth: 2
                    }
                }
            }]
        };
        onlineChart1 = echarts.init(document.getElementById('echart5'));
        onlineChart1.setOption(onlineOption);
    };
    initChart();

}(this, jQuery));
