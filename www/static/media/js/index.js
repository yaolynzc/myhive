var Index = function () {
    return {
        //初始化工作台功能列表
        init: function () {
            $.ajax({
                type: "GET",
                url: "/user/getnav",
                data: "",
                success: function (json) {
                    if(json.status===1){
                        var modlist = json.dt;
                        var template = "";
                        var containt = $("#modulelist");
                        for (var i in modlist) {
                            if (modlist[i].LEVEL == 1) {
                                template = '<li><h4>' + modlist[i].NAME + '</h4></li>';
                                template += '<ul id="m' + modlist[i].ID + '" class="dl-horizontal unstyled"></ul>';
                                containt.append(template);
                            }
                            else if (modlist[i].LEVEL == 2) {
                                template = '<li class="m10 floatleft"><a href="' + modlist[i].URL + '" class="btn red-stripe">' + modlist[i].NAME + '<span class="muted">' + modlist[i].MEMO + '</span></a></li>';
                                var pid = modlist[i].ID.substring(0, (modlist[i].LEVEL - 1) * 2);
                                $("#m" + pid).append(template);
                            }
                            else {
                                //后续扩展
                            }
                        }
                    }
                }
            });
        }
    };
}();