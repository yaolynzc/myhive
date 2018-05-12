var args = getArgs(location.href);

$(document).ready(function () {
    // 初始化上传控件
    $('#gps').uploadify({
        'buttonText': '上传GPS文件',
        'swf': '/Content/uploadify/uploadify.swf',
        'uploader': '/ajax/datasubmit.aspx?RequestMethod=upfile',
        'fileTypeExts': '*.hdi',
        'fileSizeLimit': '2MB',
        'multi': false,
        'onUploadSuccess': function (file, data, response) {
            var result = $.parseJSON(data);
            if (result.isSuccess) {
                //$("#CoverPicture").val(result.filepath);
                var localpath = $('#gps').val();
                $('#preview').html(file.name);
                $('#spath').val(result.filepath);
            } else {
                alert(result.msg);
            }
        }
    });

    // 获取提交数据信息
    if (args.id) {
        var obj = {
            "requestMethod": "get",
            "id": args.id
        };
        $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.isSuccess) {
                var datasubmit = response.datasubmit;
                $("#did").val(datasubmit.DID);
                $("#path").val(datasubmit.PATH);
                $("#memo").val(datasubmit.MEMO);
                $("#distance").val(datasubmit);
            }
        });
    }



    // 保存操作
    $("#submit").on("click", function () {

        //loading层
        var layerloading = layer.msg('数据提交中', {
            icon: 16,
            shade: 0.01
        });
        

        var did = $("#did").val();
        var gps = $("#spath").val();
        var path = $("#path").val();
        var memo = $("#memo").val();
        var distance = $("#distance").val();
        if (did == "") {
            layer.msg("请输入存储编号！");
            return;
        }
        if (path == "") {
            layer.msg("请输入数据路径！");
            return;
        }
        if (gps == "" && !args.id) {
            layer.msg("请上传GPS文件！");
            return;
        }
        var obj = {
            "requestMethod": "insert",
            "tid": args.tid,
            "did": did,
            "path": path,
            "gps": gps,
            "memo": memo,
            "dist":distance
        };
        if (args.id) {
            obj = {
                "requestMethod": "update",
                "id": args.id,
                "tid": args.tid,
                "did": did,
                "path": path,
                "gps": gps,
                "memo": memo,
                "dist": distance
            };
        }
        $.ajax({
            url: "/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)),
            type: "post",
            async: false,
            dataType: "json",
            data: obj,
            success: function (response) {
                layer.close(layerloading);
                var info = "";
                if (response.isSuccess) {
                    //info = "数据保存成功！"
                    //window.parent.layer.msg("数据保存成功！");
                    layer.msg("数据保存成功,请在数据列表进行提交！", { time: 3000 }, function () {
                        window.parent.layer.closeAll();
                        window.parent.currentPage = 0;
                        window.parent.submit.initlist();
                    });
                } else {
                    info = "数据保存失败，请稍后重试！"
                    //window.parent.layer.msg("数据保存失败！");
                }
                
            },
            error: function (xhr, ajaxOptions, thrownError) { alert(xhr.responseText); layer.msg("信息保存失败！"); }
        });

    });

    // 取消操作
    $("#cancel").on("click", function () {
        window.parent.layer.closeAll();
    });


});