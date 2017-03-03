// 详细页
jQuery.support.cors = true;
(function(win, $) {
    var infoGuid = Util.getUrlParams().InfoGuid,
        lanmuUrl = 'WebInfo_GetDetail_V6', //3.3.4   获取详细信息
        $nowPos = $('#ewb-now'),
        $main = $('#detail-main'),
        $nav = $('#ewb-now'),
        M = Mustache,
        html = [],
        tem = $('#detail-info').html(),
        tem2 = $('#info-from').html();

    //地址栏传来的guid
    win.PageLoad = function(userguid, token) {
        // 获取详细信息
        para = {
            "ValidateData": token,
            "paras": {
                UserGuid: userguid,
                InfoGuid: infoGuid
            }
        };
        Util.ajax({
            url: http + lanmuUrl,
            type: 'POST',
            dataType: 'json',
            cache:false,  
            data: JSON.stringify(para),
            success: function(data) {
                var singleInfo = data.SigleInfoRecord;
                if(singleInfo === undefined) {
                    singleInfo =[];
                }
                html.push(M.render(tem, singleInfo));
                // 获取OA数据，并绑定到页面
                $main.empty().prepend(html.join(''));
                html = [];
                getFileUrl(data);
                getColumnNav(data);
                changeSize();
                //打印
                $('#print').on('click', function() {
                    $main.jqprint();
                });
            },
            error: function() {
                console.log("接口不连通");
            }
        });
    };
    // 改变字体大小
    function changeSize() {
        var $big = $('#bigger'),
            $middle = $('#middle'),
            $small = $('#smaller'),
            $fontsize = $('#info-from'),
            $content = $('#info-content');

        $fontsize.on('click', '.fsize', function() {
            id = this.id;
            // $content.addClass(this.id);
            if (id === 'bigger') {
                $content.css('font-size', '16px');
            } else if (id === 'smaller') {
                $content.css('font-size', '12px');
            } else {
                $content.css('font-size', '14px');
            }
        });

    }

    //获取附件下载地址
    function getFileUrl(data) {
        var attach = data.SigleInfoRecord.AttachFiles,
            attachLen = attach.length;
            if(attachLen > 0) {
                $main.append('<span class="green">附件</span>');
            }
        for (var i = 0; i < attachLen; i++) {
            var attachUrl = attach[i].SingleFile.DownLoadUrl,
                attFileName = attach[i].SingleFile.AttFileName;
            $main.append('<a class="file-upload" href="' + attachUrl + '">' + attFileName + '</a> ')
        }
    }

    ///获取当前信息的所属栏目
    function getColumnNav(data) {
        var CateGoryList = data.SigleInfoRecord.CateGoryList,
            columnLen = CateGoryList.length;
        for (var j = 0; j < columnLen; j++) {
            var columnName = CateGoryList[j].CateGory.CategoryName,
                columnGuid = CateGoryList[j].CateGory.CategoryGuid;
            if (j == columnLen - 1) {
                $nav.append(' &gt; <a class="ewb-now-link" target="_blank" href="about.html?CategoryGuid=' + columnGuid + '">' + columnName + '</a>')
            } else {
                $nav.append(' &gt; <a target="_blank" href="about.html?CategoryGuid=' + columnGuid + '">' + columnName + '</a>')
            }
        }
    };


}(this, jQuery));
