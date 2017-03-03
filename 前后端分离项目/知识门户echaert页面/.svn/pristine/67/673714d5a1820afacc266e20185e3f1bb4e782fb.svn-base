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
    var para1 = {}, //前一个月参数
        para2 = {}, //后一个月参数
        meter1Data = {}, //左侧仪表盘数据
        meter2Data = {}, //右侧仪表盘数据
        M = Mustache,
        html = [],
        firstDate, secondDate,
        temp1 = $('#tmpl1').html(),
        constructionChart3, constructionChart4, constructionChart5, constructionChart6, onlineChart1, onlineChart2,
        // dataUrl = 'http://oa2.epoint.com.cn/EpointKnowledge/Service/KnowledgeProblemInfo.asmx/ProblemCount',
        dataUrl = 'http://192.168.118.34:9500/EpointKnowledge/ProblemCount';

    // 返回当前选择月份的结束时间
    var getEndDate = function(year, mon) {
        var year = parseInt(year),
            mon = parseInt(mon);
        if (mon === 12) {
            return (year + 1) + '-01-' + 1;
        } else {
            return year + '-' + (mon + 1) + '-' + 1;
        }
    };
    //完善仪表盘数据
    var perfectMeter = function(data, json) {
        var wttj = json.JCZCcountall.Text,
            yjawt = json.JCZCcountYJA.Text,
            wjawt = json.JCZCcountDJA.Text,
            ynwt = json.JCZCYN.Text,
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
        data.wttj = wttj;
        data.yjawt = yjawt;
        data.wjawt = wjawt;
        data.ynwt = ynwt;
        data.wtzjal = wtzjal;
        data.wttime1 = wttime1;
        data.wttime2 = wttime2;
    };
    //完善各条线问题数量
    var perfectTwoBar = function(json, falg) {
        var num1 = json.JCSScountall.Text,
            num2 = json.QDcountall.Text,
            num3 = json.WZDScountall.Text,
            num4 = json.KJZCcountall.Text,
            num5 = json.YDKFcountall.Text;
        if (falg) {
            return [num1, num2, num3, num4, num5];
        } else {
            return [-num1, -num2, -num3, -num4, -num5];
        }
    };
    //完善各条线问题解决时间
    var perfectLine = function(json) {
        var num1 = json.JCSSHour.Text,
            num2 = json.QDHour.Text,
            num3 = json.WZDSHour.Text,
            num4 = json.KJZCHour.Text,
            num5 = json.YDKFHour.Text;
        return [num1, num2, num3, num4, num5];
    };
    //完善各条线问题已结案数量
    var perfectDoneBar = function(json) {
        var num1 = json.JCSScountYJA.Text,
            num2 = json.QDcountYJA.Text,
            num3 = json.WZDScountYJA.Text,
            num4 = json.KJZCcountYJA.Text,
            num5 = json.YDKFcountYJA.Text;
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
    //完善各条线问题未结案数量
    var perfectUnDoneBar = function(json) {
        var num1 = json.JCSScountDJA.Text,
            num2 = json.QDcountDJA.Text,
            num3 = json.WZDScountDJA.Text,
            num4 = json.KJZCcountDJA.Text,
            num5 = json.YDKFcountDJA.Text;
        return [num1, num2, num3, num4, num5];
    };
    //完善各条线问题结案率
    var perfectLine2 = function(json) {
        var num1 = ((json.JCSScountYJA.Text / json.JCSScountall.Text) * 100).toFixed(1),
            num2 = ((json.QDcountYJA.Text / json.QDcountall.Text) * 100).toFixed(1),
            num3 = ((json.WZDScountYJA.Text / json.WZDScountall.Text) * 100).toFixed(1),
            num4 = ((json.KJZCcountYJA.Text / json.KJZCcountall.Text) * 100).toFixed(1),
            num5 = ((json.YDKFcountYJA.Text / json.YDKFcountall.Text) * 100).toFixed(1);
        return [num1, num2, num3, num4, num5];
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
    // 各条线问题数量 数据渲染
    var renderChartData1 = function(chart, myData) {
        chart.setOption({
            series: [{
                data: myData
            }, {}]
        });
    };
    // 各条线问题数量 数据渲染
    var renderChartData2 = function(chart, myData) {
        chart.setOption({
            legend: {
                data: [firstDate, secondDate]
            },
            yAxis: [{
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发']
            }],
            series: [{
                name: firstDate
            }, {
                name: secondDate,
                data: myData
            }]
        });
    };
    // 折线图量 数据渲染1
    var renderLineChartData1 = function(chart, myData) {
        chart.setOption({
            series: [{
                data: myData
            }, {}]
        });
    };
    // 折线图量 数据渲染2
    var renderLineChartData2 = function(chart, myData) {
        chart.setOption({
            legend: {
                data: [{ name: firstDate, icon: 'rect' }, { name: secondDate, icon: 'rect' }]
            },
            xAxis: [{
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发']
            }],
            yAxis: {
                name: '分钟'
            },
            series: [{
                name: firstDate
            }, {
                name: secondDate,
                data: myData
            }]
        });
    };
    // 折线图量 数据渲染3 结案率
    var renderLineChartData3 = function(chart, myData) {
        chart.setOption({
            legend: {
                data: [{ name: firstDate, icon: 'rect' }, { name: secondDate, icon: 'rect' }]
            },
            xAxis: [{
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发']
            }],
            yAxis: {
                name: '%',
                min: 0,
                max: 100
            },
            series: [{
                name: firstDate
            }, {
                name: secondDate,
                data: myData
            }]
        });
    };
    // 堆叠图 数据渲染1
    var renderpileChartData1 = function(chart, myData1, myData2) {
        chart.setOption({
            legend: {
                data: [firstDate + '已结案', firstDate + '未结案', secondDate + '已结案', secondDate + '未结案'],
            },
            xAxis: [{
                data: ['基础组件', '前端支撑', '网站大师', '框架支撑', '移动研发']
            }],
            series: [{
                name: firstDate + '已结案',
                stack: firstDate,
                data: myData1
            }, {
                name: firstDate + '未结案',
                stack: firstDate,
                data: myData2
            }, {
                name: secondDate + '已结案',
                stack: secondDate,
            }, {
                name: secondDate + '未结案',
                stack: secondDate,
            }]
        });
    };
    // 堆叠图 数据渲染2
    var renderpileChartData2 = function(chart, myData1, myData2) {
            chart.setOption({
                series: [{}, {}, {
                    data: myData1
                }, {
                    data: myData2
                }]
            });
        }
        // 数据渲染 各条线总数类别对比
    var renderListCount = function(myData, falg) {
        var $firstNum = $echartSeven.find('.firstNum'),
            $secondNum = $echartSeven.find('.secondNum');
        if (falg) {
            for (var i = 0; i < 5; i++) {
                $secondNum.eq(i).text(myData[i]);
            }
        } else {
            for (var i = 0; i < 5; i++) {
                $firstNum.eq(i).text(myData[i]);
            }
        }
    };
    // 雷达图数据渲染1
    var renderRadarChartData1 = function(radarData) {
        radarData.chart.setOption({
            title: {
                text: radarData.title
            },
            legend: {
                data: ['未结案', '已结案']
            },
            radar: {
                indicator: [
                    { name: '移动研发', max: 200 },
                    { name: '基础组件', max: 200 },
                    { name: '前端支撑', max: 200 },
                    { name: '网站大师', max: 200 },
                    { name: '框架支撑', max: 200 }
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
    var sendAjax1 = function(para) {
        $.ajax({
            url: dataUrl,
            data: para,
            dataType: "xml",
            type: 'post',
            success: function(res) {
                var jsonData = $.xmlToJSON(res).Problem;
                perfectMeter(meter1Data, jsonData);
                meter1Data.echart = 'echart1';
                html.push(M.render(temp1, meter1Data));
                $echartsOne.empty().prepend(html.join(''));
                html = [];
                // 左侧仪表盘
                var constructionChart1 = echarts.init(document.getElementById('echart1'));
                constructionChart1.setOption(initChartOption);
                renderTopChartData(constructionChart1, meter1Data.wtzjal);
                //各条线问题数量对比
                renderChartData1(constructionChart3, perfectTwoBar(jsonData, true));
                // 各条线问题平均办理时长对比
                renderLineChartData1(constructionChart4, perfectLine(jsonData));
                // 各条线问题结案率对比
                renderLineChartData1(constructionChart6, perfectLine2(jsonData));
                // 堆叠图数据
                renderpileChartData1(constructionChart5, perfectDoneBar(jsonData), perfectUnDoneBar(jsonData));
                // 数据渲染 各条线总数类别对比
                renderListCount(perfectDifficult(jsonData), true);
                // 数据渲染 各条线问题处理情况对比 雷达图
                var radarData = {
                    chart: onlineChart1,
                    data1: perfectUnDoneBar(jsonData),
                    data2: perfectDoneBar(jsonData),
                    title: firstDate
                };
                renderRadarChartData1(radarData);
            }
        })
    };
    //发送请求
    var sendAjax2 = function(para) {
        $.ajax({
            url: dataUrl,
            data: para,
            dataType: "xml",
            type: 'post',
            success: function(res) {
                var jsonData = $.xmlToJSON(res).Problem;
                perfectMeter(meter2Data, jsonData);
                meter2Data.echart = 'echart2';
                html.push(M.render(temp1, meter2Data));
                $echartsTwo.empty().prepend(html.join(''));
                html = [];
                // 右侧仪表盘
                var constructionChart2 = echarts.init(document.getElementById('echart2'));
                constructionChart2.setOption(initChartOption);
                //各条线问题数量对比
                renderTopChartData(constructionChart2, meter2Data.wtzjal);
                //各条线问题数量对比
                renderChartData2(constructionChart3, perfectTwoBar(jsonData, false));
                // 各条线问题平均办理时长对比
                renderLineChartData2(constructionChart4, perfectLine(jsonData));
                // 各条线问题结案率对比
                renderLineChartData3(constructionChart6, perfectLine2(jsonData));
                // 堆叠图数据
                renderpileChartData2(constructionChart5, perfectDoneBar(jsonData), perfectUnDoneBar(jsonData));
                // 数据渲染 各条线总数类别对比
                renderListCount(perfectDifficult(jsonData), false);
                // 数据渲染 各条线问题处理情况对比 雷达图
                var radarData = {
                    chart: onlineChart2,
                    data1: perfectUnDoneBar(jsonData),
                    data2: perfectDoneBar(jsonData),
                    title: secondDate
                };
                renderRadarChartData1(radarData);
            }
        })
    };

    //生成图表按钮事件
    $createEcharts.click(function() {
        var firstYear = $firstYear.find("option:selected").val(),
            secondYear = $secondYear.find("option:selected").val(),
            firstMonth = $firstMonth.find("option:selected").val(),
            secondMonth = $secondMonth.find("option:selected").val();
        firstDate = firstYear + '年' + firstMonth + '月';
        secondDate = secondYear + '年' + secondMonth + '月';
        // 改变静态页面年月title
        meter1Data.title = firstDate;
        meter2Data.title = secondDate;
        $echartSeven.find('.classic1').text(firstMonth + '月').end().find('.classic2').text(secondMonth + '月');
        para1.startdate = firstYear + '-' + firstMonth + '-' + 1;
        para1.enddate = getEndDate(firstYear, firstMonth);
        para2.startdate = secondYear + '-' + secondMonth + '-' + 1;
        para2.enddate = getEndDate(secondYear, secondMonth);
        sendAjax1(para1);
        sendAjax2(para2);
    });
    // 下拉选值变化操作
    $('#form-control').on('change', function() {
        var link = $(this).val();
        window.location.href = link;
    });

    var initChartOption = {
        tooltip: {
            formatter: "{a}{c}%"
        },
        series: [{
            type: 'gauge',
            name: '问题总结案率：',
            center: ['30%', '40%'],
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
        var initChartOption1 = {
            color: ['#0d96e6', '#f99e29'],
            title: { show: false },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                top: 10,
                left: 58,
                itemHeight: 8,
                itemWidth: 16
            },
            grid: {
                top: 45,
                left: 4,
                right: 20,
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'solid'
                    }
                }
            },
            yAxis: [{
                type: 'category',
                position: 'left',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid'
                    }
                },
                axisTick: { show: false },
                data: []
            }],
            series: [{
                type: 'bar',
                barWidth: '55%',
                stack: '总量'
            }, {
                type: 'bar',
                barWidth: '55%',
                stack: '总量'
            }]
        };

        // 折线图配置参数
        var initChartOption2 = {
            color: ['#f7a235', '#50b3ec'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 30,
                top: 10,
                itemHeight: 4,
                itemWidth: 16
            },
            grid: {
                left: 4,
                right: 30,
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: [10, 10],
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        borderColor: '#f7a235',
                        borderWidth: 4
                    }
                },
                data: []
            }, {
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        borderColor: '#50b3ec',
                        borderWidth: 4
                    }
                },
                data: []
            }]
        };


        constructionChart4 = echarts.init(document.getElementById('echart4'));
        constructionChart4.setOption(initChartOption2);
        constructionChart6 = echarts.init(document.getElementById('echart6'));
        constructionChart6.setOption(initChartOption2);
        // 建设工程
        constructionChart3 = echarts.init(document.getElementById('echart3'));
        constructionChart3.setOption(initChartOption1);



        var initChartOption3 = {
            color: ['#0d96e6', '#57c854', '#f79e2a', '#38aff1'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                top: 8,
                left: 25,
                itemHeight: 8,
                itemWidth: 16,
                textStyle: {
                    color: '#000'
                },
                itemGap: 25
            },
            grid: {
                top: 55,
                left: 4,
                right: 30,
                bottom: 30,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: [],
                axisTick: { alignWithLabel: true },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                nameTextStyle: 'start',
                axisTick: { show: false },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#000'
                    }
                }
            }],
            series: [{
                type: 'bar',
                barWidth: '21%',
                barGap: '10%',
                barCategoryGap: '10%'
            }, {
                type: 'bar',
                barWidth: '21%',
                barGap: '10%',
                barCategoryGap: '10%'
            }, {
                type: 'bar',
                barWidth: '21%',
                barGap: '10%',
                barCategoryGap: '10%'
            }, {
                type: 'bar',
                barWidth: '21%',
                barGap: '10%',
                barCategoryGap: '10%'
            }]
        };

        constructionChart5 = echarts.init(document.getElementById('echart5'));
        constructionChart5.setOption(initChartOption3);


        var onlineOption = {
            color: ['#f89f29', '#0d96e6'],
            title: {
                width: 50,
                height: 70,
                top: 11,
                left: 70,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#1264ba'
                }
            },
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
        onlineChart1 = echarts.init(document.getElementById('echart7'));
        onlineChart1.setOption(onlineOption);
        onlineChart2 = echarts.init(document.getElementById('echart8'));
        onlineChart2.setOption(onlineOption);
    };
    initChart();

}(this, jQuery));
