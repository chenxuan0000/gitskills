﻿ // 此方法用来加载和用户账号相关的页面内容，OA提供的接口一般都需要userguid，token
 jQuery.support.cors = true;
 (function(win, $) {
     now = 1;
     // 分类信息统计数量
     win.PageLoad = function(userguid, token) {
         // 2.8获取统一支撑平台应用权限
         getLeftTop();

         function getLeftTop() {
             var url = 'getAppAndRightByUserGuid_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         UserGuid: userguid
                     }
                 };
             getLtMessage(para, url);
         };
         // 获取系统待办
         getCount();

         function getCount() {
             var para1 = {
                     "ValidateData": token,
                     "paras": {
                         "UserGuid": userguid,
                         "jbid": "",
                         "dpid": "",
                         "dyid": ""
                     }
                 },
                 para2 = {
                     "ValidateData": token,
                     "paras": {
                         "UserGuid": userguid
                     }
                 };
             getOaMessage(para1, 'User_GetInfo_V6');
             getNumMessage(para2, 'GetHandleCount_V6');
         };

         //获取UserToken 登录名
         getToken();

         function getToken() {
             var para = {
                 "ValidateData": token,
                 "paras": {
                     "UserGuid": userguid
                 }
             };
             getOaToken(para);
         }
         //获取登录名
         getname();

         function getname() {
             var para = {
                 "ValidateData": token,
                 "paras": {
                     "UserGuid": userguid
                 }
             };
             getOaName(para);
         }
         //轮播图
         getPic();

         function getPic() {
             var para = {
                 "ValidateData": token,
                 "paras": {
                     "KeyWord": "",
                     "CurrentPageIndex": "1",
                     "PageSize": "5",
                     "infoBeginTime": "",
                     "infoEndTime": ""
                 }
             };
             getSortPic(para, 'HeadNews_GetList_V6');
         };
         // 相似类目 海安动态  部门动态 最新内刊
         $('.getviewv6').each(function(i, e) {
             var tem = $('#list-tem').html(),
                 id = this.id,
                 type = true,
                 url = 'WebInfo_GetView_NoRight_V6';
             // 插入head的跳转地址
             $('#' + id + ' a').prop('href', "about.html?CategoryGuid=" + categoryGuid[id]);
             var para = {
                 "ValidateData": token,
                 "paras": {
                     CurrentPageIndex: "1",
                     PageSize: "11",
                     UserGuid: userguid,
                     CategoryGuid: categoryGuid[id],
                     KeyWord: ""
                 }
             };
             getMessage(para, id, tem, url, type);
         });
         // 政务文件
         getGovalFile();

         function getGovalFile() {
             var tem = $('#gover-tem').html(),
                 url = 'GetWJ_List_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         CurrentPageIndex: "1",
                         PageSize: "11",
                         subWebFlowOuGuid: "",
                         KeyWord: ""
                     }
                 };
             getGrovalMessage(para, tem, url);
         };


         //在线问答
         geOnline();

         function geOnline() {
             var tem = $('#list-tem6').html(),
                 url = 'GetBBSList_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         "ParentMessageGuid": "", //父信息的Guid （传空）
                         "CatGuid": categoryGuid['onlineanswer'], //栏目Guid
                         "StartRow": "1",
                         "PageSize": "10"
                     }
                 };
             getOnlineList(para, tem, url);
         };
         // tabview 系统帮助
         getXiTongHelp();

         function getXiTongHelp() {
             var tem = $('#list-tem2').html(),
                 id = 'normaldl',
                 type = true,
                 url = 'WebInfo_GetView_NoRight_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         CurrentPageIndex: "1",
                         PageSize: "13",
                         UserGuid: userguid,
                         CategoryGuid: categoryGuid[id],
                         KeyWord: ""
                     }
                 };
             $('#' + id).prop('href', "helpAbout.html?CategoryGuid=" + categoryGuid[id]);
             getMessage(para, id, tem, url, type);
         };

         //通知公告
         getTongzhi();
         function getTongzhi() {
             var tem = $('#list-tem2').html(),
                 id = 'notice2',
                 type = true,
                 url = 'WebInfo_GetView_NoRight_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         CurrentPageIndex: "1",
                         PageSize: "13",
                         UserGuid: userguid,
                         CategoryGuid: categoryGuid[id],
                         KeyWord: ""
                     }
                 };
             $('#' + id + ' a').prop('href', "about.html?CategoryGuid=" + categoryGuid[id]);
             getMessage(para, id, tem, url, type);
         };

         // 内刊信息 获取当前栏目的所有子栏目
         getColumnInfo();

         function getColumnInfo() {
             var tem = $('#list-tem3').html(),
                 id = 'columninfo',
                 type = false,
                 url = 'Webinfo_GetCateTreeByCateGoryGuid_V6',
                 para = {
                     "ValidateData": token,
                     "paras": {
                         UserGuid: userguid,
                         CateGoryGuid: categoryGuid[id]
                     }
                 };
             getMessage(para, id, tem, url, type);
         };

         getInfoCount();
         // 分类信息统计 mock 模拟数据 正式测试是修改
         function getInfoCount() {
             var comlonSize = 30, //每页数据量
                 tem1 = $('#list-tem4').html(),
                 tem2 = $('#list-tem5').html(),
                 deptUrl = 'Webinfo_GetDeptCount_V6',
                 columnUrl = 'WebInfo_GetCateGoryNum_V6';
             getSortColumn(token, userguid, 'dept-list', 'pager1', 1, comlonSize, deptUrl, tem1, true);
             getSortColumn(token, userguid, 'column-list', 'pager2', 1, comlonSize, columnUrl, tem2, false);
         }

     }

 }(this, jQuery));


 // 封装通用ajax方法
 (function(win, $) {
     var M = Mustache,
         html = [];
     win.getMessage = function(para, id, tem, url, type) {
         Util.ajax({
             url: http + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var Type = type ? data.InfoList : data.CateGoryList;
                 if (type == false) {
                     Type.shift();
                 }
                 if (Type === undefined) {
                     Type = [];
                 }
                 $.each(Type, function(i, item) {
                     html.push(M.render(tem, item));
                 });
                 // 获取OA数据，并绑定到页面
                 if (id == 'normaldl') {
                     $('#normaldlul').empty().prepend(html.join(''));
                 } else {
                     $('#' + id + ' ul').empty().prepend(html.join(''));
                 }

                 html = [];
             },
             error: function(error) {
                 console.log("接口不连通");
             }
         });
     };
     //在线问答
     win.getOnlineList = function(para, tem, url) {
         Util.ajax({
             url: http1 + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var Type = data.BBSList;
                 if (Type === undefined) {
                     Type = [];
                 }
                 $.each(Type, function(i, item) {
                     html.push(M.render(tem, item));
                 });
                 // 获取OA数据，并绑定到页面
                 $('#onlineanswerul').empty().prepend(html.join(''));
                 html = [];
             },
             error: function(error) {
                 console.log("接口不连通");
             }
         });
     };
     win.getGrovalMessage = function(para, tem, url) {
         Util.ajax({
             url: http1 + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var Type = data.InfoList;
                 if (Type === undefined) {
                     Type = [];
                 }
                 $.each(Type, function(i, item) {
                     html.push(M.render(tem, item));
                 });
                 // 获取OA数据，并绑定到页面
                 $('#goverfile').empty().prepend(html.join(''));
                 html = [];
             },
             error: function(error) {
                 console.log("接口不连通");
             }
         });
     };
     //轮播图
     win.getSortPic = function(para, url) {
         Util.ajax({
             url: http1 + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var type = data.WebinfoHeadNewsList,
                     len = type.length;
                 for (var i = 0; i < len; i++) {
                     var detail = type[i].WebinfoHeadNews,
                         InfoGuid = detail.InfoGuid,
                         PicDownLoadURL = detail.PicDownLoadURL,
                         Title = detail.Title,
                         a = i + 1;
                     $('#wb-slider-conbox').append('<div class="wb-slider-ctag"><a target="_blank" href="detail.html?InfoGuid=' + InfoGuid + '"><img src="' + PicDownLoadURL + '" alt=""></a><div class="wb-slider-mask"><a class="ellipsis" target="_blank" href="detail.html?InfoGuid=' + InfoGuid + '">' + Title + '</a></div></div>');
                     $('#wb-slider-switcher').append('<div class="wb-slider-stag">' + a + '</div>');
                 }
                 // 图片轮播
                 $('#slider').Xslider({
                     affect: 'scrollx', //scrollx 水平轮播 scrolly 垂直轮播
                     speed: 1000,
                     space: 3000,
                     conbox: '.wb-slider-conbox',
                     ctag: '.wb-slider-ctag',
                     switcher: '.wb-slider-switcher',
                     stag: '.wb-slider-stag',
                     current: 'cur',
                     trigger: 'click',
                     boxWidth: '449',
                     boxHeight: '290'
                 });
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };
     win.getLtMessage = function(para, url) {
         Util.ajax({
             url: http1 + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var len = data.length;
                 for (var i = 0; i < len; i++) {
                     var date = data[i],
                         right = date.AppRight,
                         name = date.AppName,
                         url = date.AppURL.split('★'),
                         realUrl = url[0],
                         lanmu = url[1],
                         pic1 = date.AppBigIcon, //有权限的图
                         pic2 = date.AppSmallIcon, //没权限的图
                         smallpic = pic2.substring(0, pic2.length - 1),
                         bigpic = pic1.substring(0, pic1.length - 1),
                         a = i + 1;
                     if (i == 0) {
                         //oa系统
                         $('#left-top').append('<li class="ewb-flat-item" ><a id="flat-icon1" data-id="' + realUrl + '" class="ewb-flat-a ewb-flat-icon0' + a + ' clearfix"><img src="images/xti1.png"><span class="name">' + name + '</span></a></li>');
                     } else {
                         //其他
                         if (right) {
                             $('#left-top').append('<li class="ewb-flat-item"><a id="' + lanmu + '" data-id="' + realUrl + '" class="ewb-flat-a agree-open ewb-flat-icon0' + a + ' clearfix"><img src="' + bigpic + '"><span class="name">' + name + '</span></a></li>');
                         } else {
                             $('#left-top').append('<li class="ewb-flat-item ewb-cur"><a id="' + lanmu + '" data-id="' + realUrl + '" class="ewb-flat-a agree-open ewb-flat-icon0' + a + ' clearfix"><img src="' + smallpic + '"><span class="name">' + name + '</span></a></li>');
                         }
                     }
                 }
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };

     //获取oa待办
     win.getOaMessage = function(para, url) {
         Util.ajax({
             url: http + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var oaThingNum = data.NewWaitHandleCount;
                 $('#flat-icon1').append('<i>' + oaThingNum + '</i>');
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };

     //获取其他系统待办
     win.getNumMessage = function(para, url) {
         Util.ajax({
             url: http1 + url,
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var Zhjc = data.Zhjc, //综合电子监察代办数量
                     Hass = data.Hass //海安政府实时数量
                 Hadb = data.Hadb //海安政令督办数量
                 Haan = data.Haan //海安12345数量
                 if (Zhjc > 0) {
                     $('#Zhjc').append('<i>' + Zhjc + '</i>');
                 }
                 if (Hass > 0) {
                     $('#Hass').append('<i>' + Hass + '</i>');
                 }
                 if (Hadb > 0) {
                     $('#Hadb').append('<i>' + Hadb + '</i>');
                 }
                 if (Haan > 0) {
                     $('#Haan').append('<i>' + Haan + '</i>');
                 }
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };

     //获取token
     win.getOaToken = function(para) {
         Util.ajax({
             url: http1 + 'Ha_GetOldToken',
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var token = data.token;
                 $('#left-top').on('click', '.ewb-flat-a', function() {
                     var href = $(this).attr('data-id'),
                         href1 = href + token,
                         $par = $(this).parent();
                     if ($par.hasClass('ewb-cur')) {
                         alert("没有权限");
                     } else {
                         if ($(this).hasClass('agree-open')) {
                             window.open(href1);
                         } else {
                             window.open(href);
                         }
                     }
                 });
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };

     //获取USER
     win.getOaName = function(para) {
         Util.ajax({
             url: http1 + 'Ha_GetUserName',
             type: 'POST',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var name = data.userName;
                 $('#ewb-flat-wel').append('欢迎您！' + name);
             },
             error: function() {
                 console.log("接口不连通");
             }
         });
     };
     win.getSortColumn = function(token, userguid, id, pageid, pageindex, comlonSize, url, tem, type) {
         var para = {
             "ValidateData": token,
             "paras": {
                 UserGuid: userguid,
                 CurrentPageIndex: pageindex,
                 PageSize: comlonSize
             }
         };
         Util.ajax({
             url: http1 + url,
             type: 'post',
             dataType: 'json',
             cache: false,
             data: JSON.stringify(para),
             success: function(data) {
                 var dataType = type ? data.OuInfoList : data.CateGoryList,
                     $page = $('#' + id),
                     page2 = $('#' + pageid),
                     len = data.Total,
                     tol = Math.ceil(len / comlonSize),
                     $cur = $('.cur-page', page2),
                     $tol = $('.total-page', page2),
                     $prv = $('.prv-page', page2),
                     $next = $('.next-page', page2);
                 if (dataType === undefined) {
                     dataType = [];
                 }
                 // console.log(dataType);
                 $.each(dataType, function(i, item) {
                     html.push(M.render(tem, item));
                 });

                 // 获取OA数据，并绑定到页面
                 $page.empty().prepend(html.join(''));
                 html = [];
                 $tol.html(tol); // 总页数
                 // pager
                 $next.off('click');
                 $prv.off('click');
                 if (tol === 1) {
                     $next.addClass('disable');
                 };
                 $next.on('click', function() {
                     if (tol !== 1) {
                         $prv.removeClass('disable');
                     }
                     if (now < tol) {
                         ++now;
                         getSortColumn(token, userguid, id, pageid, now, comlonSize, url, tem, type);
                         $cur.html(now);
                         if (now == tol) {
                             $next.addClass('disable');
                         }
                     }
                 });
                 $prv.on('click', function() {
                     if (now > 1) {
                         --now;
                         $next.removeClass('disable');
                         getSortColumn(token, userguid, id, pageid, now, comlonSize, url, tem, type);
                         $cur.html(now);
                         if (now == 1) {
                             $prv.addClass('disable');
                         }
                     }
                 });

             },
             error: function(data) {
                 console.log("接口不连通");
             }
         });
     };

 }(this, jQuery));

 // 新闻图片轮播
 (function(win, $) {
     $('#slider1').Xslider({
         affect: 'scrollx', //scrollx 水平轮播 scrolly 垂直轮播
         speed: 1000,
         space: 3000,
         conbox: '.wb-slider-conbox',
         ctag: '.wb-slider-ctag',
         switcher: '.wb-slider-switcher',
         stag: '.wb-slider-stag',
         current: 'cur',
         trigger: 'click',
         boxWidth: '906',
         boxHeight: '76'
     });
 }(this, jQuery));


 /* 页面交互效果 */
 (function(win, $) {
     // TAB切换,依赖于tabview.js组件
     $(".tab-view").each(function(index, el) {
         new TabView({
             dom: el,
             activeCls: 'current'
         });
     });

     $('#logoOut').on('click', function() {
         if (confirm('确认退出?')) {
             window.currentinfo = undefined;
             window.location = logoOut
         }
     });

 }(this, jQuery));
