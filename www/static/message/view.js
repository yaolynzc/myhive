$(document).ready(function () {
    //获取用户系统消息列表
    var argsid = getUrlParam('id');
    getMessage(argsid);
});

function getMessage(id) {
    var obj = {
        "requestMethod": "get",
        "id": id,
    }
    $.getJSON("/ajax/message.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            if (response.dt.length > 0) {
                var data = response.dt;

                var template = "";
                $("#messageDiv").html("");

                for (var i in data) {
                    var addtime = !data[i].ADDTIME ? '' : data[i].ADDTIME.toString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');

                    template = '<a class="list-group-item"><label>主题：</label>' + data[i].TITLE + '</a>'
                            + '<a class="list-group-item"><label>内容：</label>' + data[i].CONTENT + '</a>'
                            + '<a class="list-group-item"><label>发送人：</label>' + data[i].UNAME + '</a>'
                            + '<a class="list-group-item"><label>发送时间：</label>' + addtime + '</a>'
                            + '<a class="list-group-item" href="javascript:history.go(-1);"><button color="red">返回</button></a>'
                    $("#messageDiv").append(template);
                }
            }
        }
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}