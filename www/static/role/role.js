// 记录列表当前页码
var currentPage = 0;
var pageSize = 10;
var currentType = "9902";

jQuery(document).ready(function () {
    // 导航菜单加载
    main.init($("#navlist"), currentType);

    // 页面初始化
    Role.init();
    
    // 列表初始化
    Role.initlist();

    // 点击搜索
    $("#search").click(function () {
        currentPage = 0;
        $("#mainForm").hide();
        $("#pagination").hide();
        $("#nodata").hide();
        $("#loading").show();
        Role.initlist();
    });

    $("#add").click(function () {
        layer.open({
            type: 2,
            title: $(this).attr("title"),
            area:['500px','600px'],
            content:'edit.html'
        })
    });

});

var Role = function () {
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
            var datas = {
                name: $("#RoleName").val(),
                rad: Math.random()
            }

            $.ajax({
                type: "GET",
                url: "/role/getcount",
                data: datas,
                success: function (response) {
                    if (response.status === 1) {
                        $("#pagination").pagination(response.count, {
                            callback: getlist,
                            prev_text: "上一页",
                            next_text: "下一页",
                            items_per_page: pageSize,
                            num_display_entries: 5,
                            current_page: currentPage
                        });
                    }
                }
            });
        }

    };

}();

// 获取记录列表数据
function getlist(index, jq) {
    var datas = {
        name: $("#RoleName").val(),
        index: index,
        size: pageSize,
        rad: Math.random()
    }

    $.ajax({
        type: "GET",
        url: "/role/getlist",
        data: datas,
        success: function (response) {
            // console.log(response.status);
            if (response.status) {
                var template = "";
                // console.log(response.dt.length);
                if (response.dt.length > 0) {
                    var data = response.dt;
                    $("#Tlist").html("");
                    for (var i in data) {
                        var temp = data[i].STATE == 0 ? 'label-inverse">False' : 'label-success">True';
                        var memo = !data[i].MEMO ? '':data[i].MEMO;
                        template = ' <tr>'
                            + '   <td>'
                            + '       <input type="checkbox" class="checkboxes" name="ids" value="' + data[i].ID + '" />'
                            + '   </td>'
                            + '  <td>' + data[i].NAME + '</td>'
                            + '   <td class="hidden-480">' + memo + '</td>'
                            + '   <td > <span class="label ' + temp + '</span></td>'
                            + '   <td>'
                            + '       <a class="btn mini purple" title="编辑角色权限" href="javascript:;"data-id="' + data[i].ID + '">'
                            + '           <i class="icon-edit"></i> 编辑角色权限</a></td></tr>';
                        $("#Tlist").append(template);
                    }
                    
                    $(".btn.mini.purple").click(function () {
                        layer.open({
                            type: 2,
                            title: $(this).attr("title"),
                            area:['500px','600px'],
                            content:'edit.html?id=' + $(this).attr('data-id')
                        })
                    });
                    
                    $("#mainForm").show();
                    $("#pagination").show();
                    $("#nodata").hide();
                    $("#loading").hide();
                    currentPage = index;
                } else {
                    currentPage = currentPage - 1;
                    if (currentPage >= 0) {
                        Role.initlist();
                    }
                    else {
                        $("#mainForm").hide();
                        $("#pagination").hide();
                        $("#nodata").show();
                        $("#loading").hide();
                    }
                }
                $("#checkall").prop("checked", false);
            }
        }
    });
}

// 删除勾选记录数据
function deleteData() {
    var ids = "";
    $("input:checkbox[name='ids']").each(function () {
        if (this.checked) {
            ids += $(this).val() + ",";
        }
    });

    var datas = {
        ids: ids.substring(0, ids.length - 1),
        rad:Math.random()
    }
    $.ajax({
        type: "GET",
        url: "/role/delete",
        data: datas,
        success: function (response) {
            if (response.status) {
                layer.msg(response.msg, { time: 2000 });
                Role.initlist();
            } else {
                layer.msg(response.names + "<br />使用中，无法删除！请不要勾选！", { time: 2000 });
            }
        }
    });
}