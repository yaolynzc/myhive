// 记录列表当前页码
var currPage = 0;
var pageSize = 10;

var orderby = "";

$(document).ready(function () {
    // 导航菜单加载
    main.init($("#navlist"), "0201");
    // 页面初始化  
    out.init();
    getplist();
});


var out = function () {
    return {
        // 列表页面初始化
        init: function () {
            $("#mainForm").hide();
            $("#pagination").hide();
            $("#nodata").hide();
            $("#loading").show();
        },
        // 记录列表初始化
        initlist: function () {
            var obj = {
                "requestMethod": "count",
                "pid": $("#project").val(),
                //"level": 0,
                "ouserid": $.cookie(config_cookie.UID),
                "state": 1
            }
            $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                if (response.isSuccess) {
                    $("#pagination").pagination(response.dataCount, {
                        callback: getlist,
                        prev_text:"上一页",
                        next_text:"下一页",
                        items_per_page: pageSize,
                        num_display_entries: 5,
                        current_page: currPage
                    });
                }
            });
        }

    };

}();
// 获取记录列表数据
function getlist(index, jq) {
    //var uid = $.cookie(config_cookie.UID);
    var obj = {
        "requestMethod": "list",
        "pid": $("#project").val(),
        //"level": 0,
        "state":1,
        "ouserid": $.cookie(config_cookie.UID),
        "index":index,
        "size": pageSize
    }
    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var template = "";
            if (response.dt.length > 0) {
                var data = response.dt;
                $("#Tlist").html("");
                var state = "";
                var module = "";
                for (var i in data) {
                    var ptime = "";
                    state = task_state[data[i].STATE];
                    if (data[i].LEVEL == 0) {
                        module = '<a class="btn mini green" title="分配任务" name="create" data-pid="' + data[i].PJID + '" data-id="' + data[i].ID + '" data-state="' + data[i].STATE + '"><i class="icon-edit"></i>分配任务</a>';
                        if (data[i].STATE > 3) {
                            module = '<a class="btn mini purple" title="查看任务详情" name="view" data-pid="' + data[i].PJID + '" data-id="' + data[i].ID + '" data-state="' + data[i].STATE + '"><i class="icon-eye-open"></i>查看</a>';
                        }
                    } else if (data[i].LEVEL == 1) {
                        module = '<a class="btn mini green" title="执行任务" name="action" data-pid="' + data[i].PJID + '" data-id="' + data[i].ID + '" data-mileage="' + data[i].MILEAGE + '" data-state="' + data[i].STATE + '"><i class="icon-edit"></i>执行任务</a>';
                    }

                    if (data[i].STARTTIME != null && data[i].STARTTIME != "")
                        ptime = data[i].STARTTIME.split("T")[0];
                    if (data[i].ENDTIME != null && data[i].ENDTIME != "")
                        ptime += "/" + data[i].ENDTIME.split("T")[0];
                    template = '<tr>'
                            + '<td>' + data[i].ID + '</td>'
                            + ' <td>' + data[i].PNAME + '</td>'
                             + '   <td>' + ptime + '</td>'
                             + ' <td>' + data[i].PUBTIME.split("T")[0] + '</td>'
                             + '   <td>' + state + '</td>'
                             + '   <td>' + module + '   </td>'

                            +'</tr>';
                    $("#Tlist").append(template);
                }
                //分配任务
                $("[name='create']").on("click", function () {
                    $("html").css("overflow", "hidden");
                    var id = $(this).attr("data-id");
                    var pid = $(this).attr("data-pid");
                    var state = $(this).attr("data-state");
                    var height = $(window).height();
                    var width = $(window).width();
                    if (state < 2) {
                        var obj = {
                            "requestMethod": "update",
                            "id": id,
                            "state": 2
                        };
                        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                            if (response.isSuccess) {
                          
                            }
                        });
                    }
                    var fplayer = layer.open({
                        type: 2,
                        area: [width + "px", height + "px"],
                        fixed: false, //不固定
                        maxmin: true,
                        title: '分配任务',
                        content: 'outedit.html?id=' + id + '&pid=' + pid,
                        end: function () {
                            //$(window.top).css("overflow", "");
                            $("html", window.top.document).css("overflow", "");
                        }
                    });
                    

                });
                // 查看
                $("[name='view']").on("click", function () {
                    $("html").css("overflow", "hidden");
                    var id = $(this).attr("data-id");
                    var pid = $(this).attr("data-pid");
                    var state = $(this).attr("data-state");
                    var height = $(window).height();
                    var width = $(window).width();
                    layer.open({
                        type: 2,
                        area: [width + "px", height + "px"],
                        fixed: false, //不固定
                        maxmin: true,
                        title: '分配任务',
                        content: 'outedit.html?id=' + id + '&pid=' + pid,
                        end: function () {
                            //$(window.top).css("overflow", "");
                            $("html", window.top.document).css("overflow", "");
                        }
                    });
                });

                // 执行任务
                $("[name='action']").on("click", function () {
                    $("html").css("overflow", "hidden");
                    var id = $(this).attr("data-id");
                    var pid = $(this).attr("data-pid");
                    var mileage = $(this).attr("data-mileage");
                    var state = $(this).attr("data-state");
                    var height = $(window).height();
                    var width = $(window).width();

                    if (state < 2) {
                        var obj = {
                            "requestMethod": "update",
                            "id": id,
                            "state": 2
                        };
                        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                            if (response.isSuccess) {

                            }
                        });
                    }

                    layer.open({
                        type: 2,
                        area: [width + "px", height + "px"],
                        fixed: false, //不固定
                        maxmin: true,
                        title: '执行任务',
                        content: "outdatasubmit.html?pid=" + pid + "&tid=" + id + "&tm=" + mileage,
                        end: function () {
                            //$(window.top).css("overflow", "");
                            $("html", window.top.document).css("overflow", "");
                        }
                    });
                });


                $("#mainForm").show();
                $("#pagination").show();
                $("#nodata").hide();
                $("#loading").hide();
                tb_init('#Tlist a.thickbox');
                currPage = index;
            } else {
                currPage = currPage - 1;
                if (currPage >= 0) {
                    User.initlist();
                }
                else {
                    $("#mainForm").hide();
                    $("#pagination").hide();
                    $("#nodata").show();
                    $("#loading").hide();
                }
            }
            $("#checkall").prop("checked", false);
            $.uniform.update(':checkbox');
        }
       
    });
}

// 获取项目列表
function getplist() {
    var obj = {
        "requestMethod": "list",
        "state": 1,
        "index": 0,
        "size": 100
    }
    $.getJSON("/ajax/project.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var template = "";
            $("#project").html("<option value=''>选择项目</option>");
            if (response.dt.length > 0) {
                var data = response.dt;
                for (var i in data) {
                    template = '<option value="' + data[i].ID + '">' + data[i].NAME + '</option>';
                    $("#project").append(template);
                }

                out.initlist();

                $("#project").on("change", function () {
                    currPage = 0;
                    out.initlist();

                });
            } else {    //  系统一个项目都没有时，停止加载动画效果  
                $("#loading").hide();
            }
        } 
    });
}

// 删除勾选记录数据
function deleteData() {
    var ids = "";
    $("input:checkbox[name='ids']").each(function () {
        if (this.checked) {
            ids += $(this).val()+",";
        }
    });

    var obj = {
        "requestMethod": "delete",
        "ids": ids.substring(0,ids.length-1)
    }
    $.getJSON("/ajax/user.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            //alert(response.info);
            layer.msg(response.info, {time:1000});
            User.initlist();
        }
    });
}