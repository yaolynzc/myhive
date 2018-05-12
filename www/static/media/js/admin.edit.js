$(document).ready(function(){

    // 为提交按钮绑定click事件
    $("#submit").on("click", function () {
        var mainForm = $("#submit").parent().parent();

        if (mainForm.valid()) {
            if(args.id){
                updateData(args.id);        // 编辑，提交
            }else if(args.uid){             // 修改密码，提交
                updatePwd(args.uid);
            }else{                          // 新增，提交
                addData();
            }
        }

    });

    // 为取消按钮绑定click事件
    $("#cancel").on("click", function () {
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
    
});

//获取 url 参数列表
getArgs = function (url) {
    if (url == null) {
        url = window.location.href;
    }
    var query = (url.indexOf('?') != -1) ? url.substring(url.indexOf('?') + 1) : '';
    var args = new Object();
    pairs = query.split(/[&;]/);
    for (var i = 0; i < pairs.length; ++i) {
        keyValue = pairs[i].split(/=/);
        if (keyValue.length == 2) {
            args[decodeURIComponent(keyValue[0])] =
                decodeURIComponent(keyValue[1]);
        }
    }

    return args;
};

//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlName, uploadUrl) {
    var control = $('#' + ctrlName);
    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions: ['jpg', 'png', 'gif'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式             
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
    });
}

// 验证是否为数字
function isnum(val) {
    var reg = new RegExp("^[0-9]*$");
    return reg.test(val);
}

//验证EMAIL格式是否正确    
function isemail(val) {
    if (val.length != 0) {
        reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return reg.test(val);
    }
    else {
        return false;
    }
}

//判断输入的字符是否为双精度    
function IsDouble(val) {
    if (val.length != 0) {
        reg = /^[-\+]?\d+(\.\d+)?$/;
        return reg.test(val)
    }
    else {
        return false;
    }
}