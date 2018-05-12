var args = getArgs(location.href);

$(document).ready(function () {
   
    // 获取提交数据信息
    if (args.id) {
        var obj = {
            "requestMethod": "get",
            "id": args.id
        };
        $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.isSuccess) {
                var datasubmit = response.datasubmit;
                $("#dcode").html(datasubmit.ID);
                $("#did").html(datasubmit.DID);
                $("#path").html(datasubmit.PATH);
                $("#memo").html(datasubmit.MEMO);
                $("#gps").html(datasubmit.GPS);
            }
        });
    }


});