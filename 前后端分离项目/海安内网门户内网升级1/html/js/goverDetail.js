// 详细页
jQuery.support.cors = true;
(function(win, $) {
    var Outboxguid = Util.getUrlParams().Outboxguid,
        lanmuUrl = 'GetWJ_Detail_V6', //3.3.4   获取政务详细信息
        $main = $('#detail-main'),
        M = Mustache,
        html = [],
        tem = $('#detail-info').html(),
        tem2 = $('#info-from').html();
   // 地址栏 传来的guid
    win.PageLoad = function(userguid, token) {
        // 获取详细信息
        para = {
            "ValidateData": token,
            "paras": {
                OutBoxGuid: Outboxguid
            }
        };
        Util.ajax({
            url: http1 + lanmuUrl,
            type: 'POST',
            dataType: 'json',
            cache:false,  
            data: JSON.stringify(para),
            success: function(data) {
                var singleInfo = data.ExcenterRecord;
                if(singleInfo === undefined) {
                    singleInfo =[];
                }
                html.push(M.render(tem, singleInfo));
                // 获取OA数据，并绑定到页面
                $main.empty().prepend(html.join(''));
                html = [];
                getFileUrl(data);
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
    //获取附件下载地址
    function getFileUrl(data) {
        var attach = data.ExcenterRecord.AttachList,
            attachLen = attach.length;
            if(attachLen > 0) {
                $main.append('<span class="green">附件</span>');
            }
        for (var i = 0; i < attachLen; i++) {
            var attachUrl = attach[i].AttachInfo.AttachDownLoadUrl,
                attFileName = attach[i].AttachInfo.AttachName;
            $main.append('<a class="file-upload" href="' + attachUrl + '">' + attFileName + '</a> ')
        }
    }


}(this, jQuery));
