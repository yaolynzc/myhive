// 选择主题及初始化主题逻辑
(function() {
  $('.color-panel .color-mode ul li').click(function() {
    var color = $(this).attr('data-style');
      $.cookie('currentTheme', color, { expires: 7, path: '/' });
    });
    var currentTheme = $.cookie('currentTheme');
    if (currentTheme != null && currentTheme) {
      $('#style_color').attr("href", "/static/assets/css/style_" + currentTheme + ".css");
    }
})();

//新菜单根据Url决定逻辑
(function () {
    var locationHref = window.location.href;
    $(".page-sidebar>ul>li>a").each(function () {

        if (locationHref.indexOf($(this).attr("href")) > 0) {
            $(this).parent().addClass("active");
            $(this).append("<span class='selected'></span>");

            $("#navigation .page-title span").html($(this).text());
            $("#navigation .page-title small").html($(this).attr("title") || "");
            $("#navigation .breadcrumb li:eq(1) span").html($(this).text());
            $("#navigation .breadcrumb li:eq(1) i").remove();
            $("#navigation .breadcrumb li:eq(2)").remove();

            //document.title = $(this).text() + " - " + document.title;

            return false;
        }
        else {
            var parent = $(this);
            $(this).next("ul").each(function () {
                $("a", $(this)).each(function () {
                    if (locationHref.indexOf($(this).attr("href")) > 0) {
                        $(this).parent().addClass("active");

                        parent.parent().addClass("active");
                        $(".arrow", parent).addClass("open").before("<span class='selected'></span>");

                        $("#navigation .page-title span").html($(this).text());
                        $("#navigation .page-title small").html($(this).attr("title") || "");
                        $("#navigation .breadcrumb li:eq(1) span").html(parent.text());
                        $("#navigation .breadcrumb li:eq(2) span").html($(this).text());

                        //document.title = $(this).text() + " - " + document.title;

                        return false;
                    }
                });
            });
        }
    });
})();

$("#checkall").click(function () {
    var ischecked = this.checked;
    $("input:checkbox[name='ids']").each(function () {
        this.checked = ischecked;
    });

    $.uniform.update(':checkbox');
});

$("#delete").click(function () {
    var message = "你确定要删除勾选的记录吗?";
    var select = 0
    if ($(this).attr("message"))
        message = $(this).attr("message") + "，" + message;
    $("input:checkbox[name='ids']").each(function () {
        if (this.checked)
            select++;
    });
    if (select > 0) {
        layer.confirm(message,{icon: 3, title:'提示'}, function () {
            deleteData();
        });
    }
    else {
        layer.msg("请勾选需要删除的记录！");
    }
        
});

// 获取菜单列表并加载到页面
var main = function () {
    return {
        // 初始化左侧功能菜单
        init: function (containt,selectid) {
            var datas ={
                uid:"",
                rad: Math.random()
            };
            $.ajax({
                type: "get",
                url: "/user/getnav",
                data: datas,
                success: function (json) {
                    if(json.status===1){
                        var navlist = json.dt;
                        var template = "";
                        var spid = "";

                        if (selectid != undefined) {
                            spid = selectid.substring(0, 2);
                        }

                        $("#username").html(json.uname);    //  设置登录用户的姓名

                        for (var i in navlist) {
                            if (navlist[i].LEVEL == 1) {
                                if (spid != "" && spid == navlist[i].ID) {
                                    template = '<li class="has-sub active">'
                                            + '<a href="javascript:;">'
                                            + '<i class="' + navlist[i].ICON + '"></i>'
                                            + '<span class="title">' + navlist[i].NAME + '</span>'
                                            + '<span class="arrow"></span>'
                                            + '</a>'
                                            + '<ul id="' + navlist[i].ID + '" class="sub"> '
                                            + '</ul>'
                                            + '</li>';
                                }
                                else {
                                    template = '<li class="has-sub">'
                                            + '<a href="javascript:;">'
                                            + '<i class="' + navlist[i].ICON + '"></i>'
                                            + '<span class="title">' + navlist[i].NAME + '</span>'
                                            + '<span class="arrow"></span>'
                                            + '</a>'
                                            + '<ul id="' + navlist[i].ID + '" class="sub"> '
                                            + '</ul>'
                                            + '</li>';
                                }
                                containt.append(template);
                                
                            }
                            else if (navlist[i].LEVEL == 2) {
                                if (selectid != undefined && selectid == navlist[i].ID)
                                    template = ' <li class="active"><a href="' + navlist[i].URL + '" title="' + navlist[i].MEMO + '">' + navlist[i].NAME + '</a></li>';
                                else
                                    template = ' <li ><a href="' + navlist[i].URL + '" title="' + navlist[i].MEMO + '">' + navlist[i].NAME + '</a></li>';
                                var pid = navlist[i].ID.substring(0, (navlist[i].LEVEL - 1) * 2);
                                $("#" + pid).append(template);
                            }
                            else {
                                //后续扩展
                            }
                            // console.log(template);
                        }
                        App.init();
                        // $(".username").text(json.username);
                    }else{
                        window.location.href = "/login.html";
                    }
                }
            });
        },

        // 修改密码
        modipwd: function() {
            layer.open({
                type:2,
                title:'修改密码',
                area:['300px','200px'],
                content:'/user/pwd.html?uid=' + $.cookie(config_cookie.UID)
            });
        },

        // 退出登录
        logout: function() {
            var datas = {
                rad: Math.random()
            }
            $.ajax({
                type: "get",
                url: "/user/logout",
                data: datas,
                success: function (json) {
                    if(json.status===1){
                        // 用户退出后清空cookie
                        $.cookie(config_cookie.UID, null);
                        $.cookie(config_cookie.PWD, null);
                        window.location.href = "/login.html";
                    }
                }
            });
        }
    
    };
}();

// 弹出提示信息
function msginfo(info) {
    layer.msg(info);
}





