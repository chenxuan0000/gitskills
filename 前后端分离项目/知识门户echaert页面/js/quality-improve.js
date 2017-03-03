(function(win, $) {

    var date = new Date,
        year = date.getFullYear(),
        startYear,
        month = date.getMonth() + 1,
        startMonth;
    if (month < 7) {
        startMonth = 6 + month;
        startYear = year - 1;
    } else {
        startYear = year;
        startMonth = month - 6;
    }
    // 返回当前选择月份的开始时间
    var getStartDate = function(year, mon) {
        var year = parseInt(year),
            mon = parseInt(mon);
        if (mon > 1) {
            return year + '-' + (mon - 1) + '-' + 1;
        } else {
            return (year - 1) + '-12-1';
        }
    };
    // 返回前6个月的时间节点
    var getMonthDay = function(year, num) {
        var year = parseInt(year),
            mon = parseInt(month);
        if (mon <= num) {
            return (year - 1) + '-' + (12 + mon - num);
        } else {
            return year + '-' + (mon - num);
        }
    };
    var para1 = {
            startdate: getStartDate(year, month),
            enddate: year + '-' + month + '-1'
        }, //前一个月参数
        para2 = {
            startdate: startYear + '-' + startMonth + '-1',
            enddate: year + '-' + month + '-1'
        }, //近6个月参数
        sixMonth = [getMonthDay(year, 6), getMonthDay(year, 5), getMonthDay(year, 4), getMonthDay(year, 3), getMonthDay(year, 2), getMonthDay(year, 1)],
        html = [],
        M = Mustache,
        temp1 = $('#tmpl1').html(),
        echart1Data = {
            one: [],
            two: [],
            three: [],
            four: [],
            five: [],
            six: []
        },
        dataInfo = {
            "finish": [
                [],
                [],
                [],
                [],
                [],
                []
            ],
            "unfinish": [
                [],
                [],
                [],
                [],
                [],
                []
            ],
            "average": [
                [],
                [],
                [],
                [],
                [],
                []
            ]
        },
        constructionChart1,
        constructionChart2,
        constructionChart3,
        constructionChart4,
        constructionChart5,
        constructionChart6,
        // dataUrl = 'http://oa2.epoint.com.cn/EpointKnowledge/Service/KnowledgeProblemInfo.asmx/ProblemCount',
        dataUrl = 'http://192.168.118.34:9500/EpointKnowledge/ProblemCount';


    //完善问题数量
    var getProblemAll = function(json) {
        var num1 = parseInt(json.ZWFWcountall.Text),
            num2 = parseInt(json.DZZWcountall.Text),
            num3 = parseInt(json.SZJScountall.Text),
            num4 = parseInt(json.JZQYcountall.Text),
            num5 = parseInt(json.JCZCcountall.Text);
        return (num1 + num2 + num3 + num4 + num5);
    };
    //完善已结案问题数量
    var getProblemDone = function(json) {
        var num1 = parseInt(json.ZWFWcountYJA.Text),
            num2 = parseInt(json.DZZWcountYJA.Text),
            num3 = parseInt(json.SZJScountYJA.Text),
            num4 = parseInt(json.JZQYcountYJA.Text),
            num5 = parseInt(json.JCZCcountYJA.Text);
        return (num1 + num2 + num3 + num4 + num5);
    };

    //完善未结案问题数量
    var getProblemUnDone = function(json) {
        var num1 = parseInt(json.ZWFWcountDJA.Text),
            num2 = parseInt(json.DZZWcountDJA.Text),
            num3 = parseInt(json.SZJScountDJA.Text),
            num4 = parseInt(json.JZQYcountDJA.Text),
            num5 = parseInt(json.JCZCcountDJA.Text);
        return (num1 + num2 + num3 + num4 + num5);
    };

    //完善平均处理时长
    var getProblemTime = function(json) {
        var num1 = parseInt(json.ZWFWHour.Text),
            num2 = parseInt(json.DZZWHour.Text),
            num3 = parseInt(json.SZJSHour.Text),
            num4 = parseInt(json.JZQYHour.Text),
            num5 = parseInt(json.JCZCHour.Text);
        return (num1 + num2 + num3 + num4 + num5) / 5;
    };

    //完善疑难问题数量
    var getProblemYN = function(json) {
        var num1 = parseInt(json.ZWFWYN.Text),
            num2 = parseInt(json.DZZWYN.Text),
            num3 = parseInt(json.SZJSYN.Text),
            num4 = parseInt(json.JZQYYN.Text),
            num5 = parseInt(json.JCZCYN.Text);
        return (num1 + num2 + num3 + num4 + num5);
    };

    //完善各研发群问题数量
    var perfectDepartCount = function(json) {
        var num1 = json.ZWFWcountall.Text,
            num2 = json.DZZWcountall.Text,
            num3 = json.SZJScountall.Text,
            num4 = json.JZQYcountall.Text,
            num5 = json.JCZCcountall.Text;
        return [num1, num2, num3, num4, num5];
    };
    //完善各研发群已结案问题数量
    var perfectDoneCount = function(json) {
        var num1 = json.ZWFWcountYJA.Text,
            num2 = json.DZZWcountYJA.Text,
            num3 = json.SZJScountYJA.Text,
            num4 = json.JZQYcountYJA.Text,
            num5 = json.JCZCcountYJA.Text;
        return [num1, num2, num3, num4, num5];
    };

    //完善各研发群待结案问题数量
    var perfectUnDoneCount = function(json) {
        var num1 = json.ZWFWcountDJA.Text,
            num2 = json.DZZWcountDJA.Text,
            num3 = json.SZJScountDJA.Text,
            num4 = json.JZQYcountDJA.Text,
            num5 = json.JCZCcountDJA.Text;
        return [num1, num2, num3, num4, num5];
    };

    //完善各研发群平均办结时间
    var perfectTimeCount = function(json) {
        var num1 = json.ZWFWHour.Text,
            num2 = json.DZZWHour.Text,
            num3 = json.SZJSHour.Text,
            num4 = json.JZQYHour.Text,
            num5 = json.JCZCHour.Text;
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
    var perfectLine2 = function(json) {
        var num1 = ((json.ZWFWcountYJA.Text / json.ZWFWcountall.Text) * 100).toFixed(1),
            num2 = ((json.DZZWcountYJA.Text / json.DZZWcountall.Text) * 100).toFixed(1),
            num3 = ((json.SZJScountYJA.Text / json.SZJScountall.Text) * 100).toFixed(1),
            num4 = ((json.JZQYcountYJA.Text / json.JZQYcountall.Text) * 100).toFixed(1),
            num5 = ((json.JCZCcountYJA.Text / json.JCZCcountall.Text) * 100).toFixed(1);
        var obj = [{ name: '政务服务', num: num1 },
            { name: '电子政务', num: num2 },
            { name: '数字建设', num: num3 },
            { name: '建筑企业', num: num4 },
            { name: '基础支撑', num: num5 }
        ];
        obj.sort(sortBy('num', false, parseInt));
        return obj;
    };
    //渲染统计问题数据
    var applyCount = function(json, id) {
        var $num = $('#' + id).children('.count-block').find('span');
        $num.eq(0).text(getProblemAll(json));
        $num.eq(1).text(getProblemDone(json));
        $num.eq(2).text(getProblemUnDone(json));
        $num.eq(3).text(getProblemTime(json));
        $num.eq(4).text(getProblemYN(json));
    };

    // 饼图 数据渲染
    var renderPieChartData = function(chart, myData) {
        chart.setOption({
            series: [{}, {}, {
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
    // 各研发群问题数量处理情况汇总 数据渲染
    var renderBarData = function(chart, myData) {
        chart.setOption({
            series: [{
                data: myData.finish
            }, {
                data: myData.unfinish
            }, {
                data: myData.average
            }]
        });
    };
    // 各研发群问题处理情况汇总 数据渲染
    var renderTimeBarData = function(chart, myData) {
        chart.setOption({
            series: [{
                data: myData
            }]
        });
    };

    // 各研发群问题处理情况汇总6个月的 数据渲染
    var renderBarData2 = function(chart, myData) {
        chart.setOption({
            timeline: {
                axisType: 'category',
                left: 23,
                right: 28,
                bottom: -15,
                autoPlay: true,
                controlStyle: {
                    show: true
                },
                checkpointStyle: {
                    symbol: 'circle',
                    color: '#f66e1a',
                    symbolSize: 8,
                    borderWidth: 0,
                },
                lineStyle: {
                    width: 1
                },
                playInterval: 3000,
                symbol: 'circle',
                symbolSize: 7,
                data: sixMonth,
                controlStyle: {
                    showPlayBtn: false,
                    itemSize: 10,
                    itemGap: 5,
                },
                label: { position: 10 }
            },
            options: [{
                color: ["#0d96e6", "#f99e29", "#56c755"],
                tooltip: {
                    trigger: 'axis'
                },

                legend: {
                    top: 20,
                    left: 40,
                    itemWidth: 14,
                    itemHeight: 7,
                    data: [{
                        name: '已结案问题',
                        icon: 'rect'
                    }, {
                        name: '未结案问题',
                        icon: 'rect'
                    }, {
                        name: '平均处理时长',
                        icon: 'image://./images/legend3.jpg',
                    }],
                    itemGap: 20
                },
                grid: {
                    width: 445,
                    height: 215,
                    left: 15,
                    bottom: 36,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['政务服务', '电子政务', '数字建设', '建筑企业', '基础支撑'],
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
                    type: 'bar',
                    barWidth: '28%',
                    barGap: '10%',
                    data: myData.finish[0]
                }, {
                    name: '未结案问题',
                    type: 'bar',
                    barWidth: '26%',
                    barGap: '10%',
                    data: myData.unfinish[0]
                }, {
                    name: '平均处理时长',
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
                    yAxisIndex: 1,
                    data: myData.average[0]
                }]
            }, {
                series: [
                    { data: myData.finish[1] },
                    { data: myData.unfinish[1] },
                    { data: myData.average[1] }
                ]

            }, {
                series: [
                    { data: myData.finish[2] },
                    { data: myData.unfinish[2] },
                    { data: myData.average[2] }
                ]

            }, {
                series: [
                    { data: myData.finish[3] },
                    { data: myData.unfinish[3] },
                    { data: myData.average[3] }
                ]

            }, {
                series: [
                    { data: myData.finish[4] },
                    { data: myData.unfinish[4] },
                    { data: myData.average[4] }
                ]

            }, {
                series: [
                    { data: myData.finish[5] },
                    { data: myData.unfinish[5] },
                    { data: myData.average[5] }
                ]

            }]
        });
    };

    // 各研发群问题总数 6个月  数据渲染
    var renderSixMonthLineData = function(chart, myData) {
        chart.setOption({
            legend: {
                data: ['政务服务', '电子政务', '数字建设', '建筑企业', '基础支撑']
            },
            xAxis: [{
                data: sixMonth,
            }],
            series: [{
                name: '政务服务',
                data: [myData.one[0], myData.two[0], myData.three[0], myData.four[0], myData.five[0], myData.six[0]]
            }, {
                name: '电子政务',
                data: [myData.one[1], myData.two[1], myData.three[1], myData.four[1], myData.five[1], myData.six[1]]
            }, {
                name: '数字建设',
                data: [myData.one[2], myData.two[2], myData.three[2], myData.four[2], myData.five[2], myData.six[2]]
            }, {
                name: '建筑企业',
                data: [myData.one[3], myData.two[3], myData.three[3], myData.four[3], myData.five[3], myData.six[3]]
            }, {
                name: '基础支撑',
                data: [myData.one[4], myData.two[4], myData.three[4], myData.four[4], myData.five[4], myData.six[4]]
            }]
        });
    };

    //上个月ajax
    $.ajax({
        url: dataUrl,
        data: para1,
        dataType: "xml",
        type: 'post',
        success: function(res) {
            var jsonData = $.xmlToJSON(res).Problem;
            //渲染统计问题数据
            applyCount(jsonData, 'last-month');
            // 饼图 数据渲染
            renderPieChartData(constructionChart2, perfectDepartCount(jsonData));
            //右侧各研发部办结率排行
            var rankData = perfectLine2(jsonData);
            $.each(rankData, function(index, value) {
                value.i = index + 1;
            });
            html.push(M.render(temp1, { item: rankData }));
            $('#done-rank').empty().prepend(html.join(''));
            html = [];
            // 各研发群问题数量处理情况汇总
            var dataInfo1 = {
                "finish": perfectDoneCount(jsonData),
                "unfinish": perfectUnDoneCount(jsonData),
                "average": perfectTimeCount(jsonData)
            };
            renderBarData(constructionChart3, dataInfo1);
            dataInfo.finish[5] = perfectDoneCount(jsonData);
            dataInfo.unfinish[5] = perfectUnDoneCount(jsonData);
            dataInfo.average[5] = perfectTimeCount(jsonData);
            renderBarData2(constructionChart5, dataInfo);

            // 各研发群平均处理时间情况汇总
            renderTimeBarData(constructionChart4, perfectTimeCount(jsonData));

            // 获取上个月数据填充图表
            echart1Data.six = perfectDepartCount(jsonData);
            renderSixMonthLineData(constructionChart1, echart1Data);
        }
    });

    //封装获取前6个月数据的ajax
    var getSixAjax = function(mon, num, pos) {
        $.ajax({
            url: dataUrl,
            data: {
                startdate: getMonthDay(year, mon + 1) + '-1',
                enddate: getMonthDay(year, mon) + '-1'
            },
            dataType: "xml",
            type: 'post',
            success: function(res) {
                var jsonData = $.xmlToJSON(res).Problem;
                // 获取上个月数据填充图表
                echart1Data[pos] = perfectDepartCount(jsonData);
                renderSixMonthLineData(constructionChart1, echart1Data);

                // 各研发群问题数量处理情况汇总 6月
                dataInfo.finish[num] = perfectDoneCount(jsonData);
                dataInfo.unfinish[num] = perfectUnDoneCount(jsonData);
                dataInfo.average[num] = perfectTimeCount(jsonData);
                renderBarData2(constructionChart5, dataInfo);
            }
        });
    };
    getSixAjax(5, 0, 'one');
    getSixAjax(4, 1, 'two');
    getSixAjax(3, 2, 'three');
    getSixAjax(2, 3, 'four');
    getSixAjax(1, 4, 'five');
    //近6个月ajax
    $.ajax({
        url: dataUrl,
        data: para2,
        dataType: "xml",
        type: 'post',
        success: function(res) {
            var jsonData = $.xmlToJSON(res).Problem;
            //渲染统计问题数据
            applyCount(jsonData, 'six-month');

            //右侧各研发部办结率排行
            var rankData = perfectLine2(jsonData);
            $.each(rankData, function(index, value) {
                value.i = index + 1;
            });
            html.push(M.render(temp1, { item: rankData }));
            $('#done-rank2').empty().prepend(html.join(''));
            html = [];

            // 各研发群平均处理时间情况汇总
            renderTimeBarData(constructionChart6, perfectTimeCount(jsonData));
        }
    });

    var initEchart = function() {
        var initChartOption1 = {
            tooltip: {
                trigger: 'axis'
            },
            color: ['#56b5ef', '#ee7b20', '#6ac11a', '#ff3801', '#cb37cb'],
            legend: {
                left: 30,
                top: 10,
                data: [],
                itemGap: 15,
                itemWidth: 17,
                itemHeight: 8,
            },
            grid: {
                left: '1%',
                right: '5%',
                top: '16%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel: { interval: 0 },
                axisTick: { inside: true }
            }],
            yAxis: [{
                type: 'value',
                interval: 500
            }],
            series: [{
                type: 'line',
                stack: '总量',
                symbolSize: 6,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#56b5ef' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#fff' // 100% 处的颜色
                        }], false)
                    }
                }
            }, {
                type: 'line',
                stack: '总量',
                symbolSize: 6,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ee7b20' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#fff' // 100% 处的颜色
                        }], false)
                    }
                }
            }, {
                type: 'line',
                stack: '总量',
                symbolSize: 6,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#6ac11a' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#fff' // 100% 处的颜色
                        }], false)
                    }
                }
            }, {
                type: 'line',
                stack: '总量',
                symbolSize: 6,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ff3801' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#fff' // 100% 处的颜色
                        }], false)
                    }
                }
            }, {
                type: 'line',
                stack: '总量',
                symbolSize: 6,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#cb37cb' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#fff' // 100% 处的颜色
                        }], false)
                    }
                }
            }]
        };

        var initChartOption2 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color: ['#37adf3', '#f04b38', '#1464b9', '#f69e18', '#57c856'],
            legend: {
                orient: 'vertical',
                top: 10,
                left: 14,
                textStyle: {
                    fontSize: 13
                },
                data: ['政务服务', '电子政务', '建筑企业', '数字建设', '基础支撑'],
                itemGap: 17
            },
            series: [{
                type: 'pie',
                center: ['55%', '55%'],
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
                },
                data: [
                    { value: 0 }
                ]
            }, {
                type: 'pie',
                center: ['55%', '55%'],
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
                },
                data: [
                    { value: 0 }
                ]
            }, {
                name: '访问来源',
                type: 'pie',
                center: ['55%', '55%'],
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
        var initChartOption3 = {
            timeline: {
                show: false
            },
            options: [{
                color: ["#0d96e6", "#f99e29", "#56c755"],
                tooltip: {
                    trigger: 'axis'
                },

                legend: {
                    top: 20,
                    left: 40,
                    itemWidth: 14,
                    itemHeight: 7,
                    data: [{
                        name: '已结案问题',
                        icon: 'rect'
                    }, {
                        name: '未结案问题',
                        icon: 'rect'
                    }, {
                        name: '平均处理时长',
                        icon: 'image://./images/legend3.jpg',
                    }],
                    itemGap: 20
                },
                grid: {
                    width: 445,
                    height: 215,
                    left: 15,
                    bottom: 36,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['政务服务', '电子政务', '数字建设', '建筑企业', '基础支撑'],
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
                    type: 'bar',
                    barWidth: '28%',
                    barGap: '10%'
                }, {
                    name: '未结案问题',
                    type: 'bar',
                    barWidth: '26%',
                    barGap: '10%'
                }, {
                    name: '平均处理时长',
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
        }

        var initChartOption4 = {
            color: ['#37adf3'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '7%',
                top: '10%',
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                splitLine: false,
                boundaryGap: [0, '3.8%'],
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                type: 'category',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid'
                    }
                },
                data: ['政务服务', '电子政务', '数字建设', '建筑企业', '基础支撑'],
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

        var initChartOption5 = {

        };
        constructionChart1 = echarts.init(document.getElementById('echart1'));
        constructionChart1.setOption(initChartOption1);

        constructionChart2 = echarts.init(document.getElementById('echart2'));
        constructionChart2.setOption(initChartOption2);

        constructionChart3 = echarts.init(document.getElementById('echart3'));
        constructionChart3.setOption(initChartOption3);

        constructionChart4 = echarts.init(document.getElementById('echart4'));
        constructionChart4.setOption(initChartOption4);

        constructionChart5 = echarts.init(document.getElementById('echart5'));
        constructionChart5.setOption(initChartOption5);

        constructionChart6 = echarts.init(document.getElementById('echart6'));
        constructionChart6.setOption(initChartOption4);
    };
    initEchart();

}(this, jQuery));
