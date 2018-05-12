var args = getArgs(location.href); // 获取页面参数
var currentPage = 0; // 记录列表当前页码
var pageSize = 5; // 分页大小配置
$(document).ready(function () {
    User.init();
    User.initlist();
    // 点击搜索
    $("#search").on("click", function () {
        currentPage = 0;
        $("#mainTable").hide();
        $("#pagination").hide();
        $("#nodata").hide();
        $("#loading").show();
        User.initlist();
    });


});
var User = function () {
    return {
        // 列表页面初始化
        init: function () {
            $("#mainTable").hide();
            $("#pagination").hide();
            $("#nodata").hide();
            $("#loading").show();
        },
        // 记录列表初始化
        initlist: function () {
            var obj = {
                "requestMethod": "count",
                "name": $("#name").val(),
                "uid": ""
            }
            $.getJSON("/ajax/user.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                if (response.isSuccess) {
                    $("#pagination").pagination(response.dataCount, {
                        callback: getlist,
                        prev_text: "上一页",
                        next_text: "下一页",
                        items_per_page: pageSize,
                        num_display_entries: 5,
                        current_page: currentPage
                    });
                }
            });
        }

    };

}();
// 获取记录列表数据
function getlist(index, jq) {
    var obj = {
        "requestMethod": "list",
        "name": $("#name").val(),
        "uid":"",
        "index": index,
        "size": pageSize
    }
    $.getJSON("/ajax/user.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var template = "";
            if (response.dt.length > 0) {
                var data = response.dt;
                $("#Tlist").html("");
                for (var i in data) {
                  
                    template = '<tr>'
                             + '                   <td>' + data[i].NAME + '</td>'
                             + '                   <td>' + data[i].DEPT + '</td>'
                             + '                   <td>' + data[i].JOB + '</td>'

                             + '                   <td>'
                             + '                       <a data-name="' + data[i].NAME + '" data-id="' + data[i].ID + '" class="btn mini purple">'
                             + '                           <i class="icon-edit"></i>选择 </a>  '
                             + '       </td>'
                             + '  </tr>';
                    $("#Tlist").append(template);
                }

                // 选择人员
                $("#Tlist [data-id]").on("click", function () {
                    var id = $(this).attr("data-id");
                    var name = $(this).attr("data-name");
                    eval('window.parent.'+args.f+'(id, name)');
                    window.parent.layer.closeAll();
                });

                $("#mainTable").show();
                $("#pagination").show();
                $("#nodata").hide();
                $("#loading").hide();
                currentPage = index;
            } else {
                currentPage = currentPage - 1;
                if (currentPage >= 0) {
                    User.initlist();
                }
                else {
                    $("#mainTable").hide();
                    $("#pagination").hide();
                    $("#nodata").show();
                    $("#loading").hide();
                }
            }
            $("#checkall").prop("checked", false);
            //$.uniform.update(':checkbox');
        }

    });
}

