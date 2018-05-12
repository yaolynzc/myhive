// 记录列表当前页码
var currentPage = 0;
var pageSize = 10;
var currentType = "9901";

jQuery(document).ready(function () {
    // 导航菜单加载
    main.init($("#navlist"), currentType);
    // 页面初始化
    User.init();
    // 列表初始化
    User.initlist();
    // 点击搜索
    $("#search").click(function () {
        currentPage = 0;
        $("#mainForm").hide();
        $("#pagination").hide();
        $("#nodata").hide();
        $("#loading").show();
        User.initlist();
    });
    // 新增
    $("#add").click(function(){
        layer.open({
            type:2,
            title:$(this).attr("title"),
            area:['500px','520px'],
            content:'edit.html'
        });
    });

});

var User = function () {
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
                uid: $("#ID").val(),
                rad: Math.random()
            }

            $.ajax({
                type: "GET",
                url: "/user/getcount",
                data: datas,
                success: function (json) {
                    if (json.status === 1) {
                        $("#pagination").pagination(json.count, {
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
        uid: $("#ID").val(),
        index: index,
        size: pageSize,
        rad: Math.random()
    }
    // alert(index);
    $.ajax({
        type: "GET",
        url: "/user/getlist",
        data: datas,
        success: function (json) {
            // alert(json.dt.data.length);
            if (json.status === 1) {
                var template = "";
                if (json.dt.length > 0) {
                    var data = json.dt;
                    $("#Tlist").html("");
                    for (var i in data) {
                        var tel = data[i].TEL == null ? '' : data[i].TEL;
                        var temp = data[i].STATE == 0 ? 'label-inverse">False' : 'label-success">True';

                        template = '<tr>'
                            + '                  <td>'
                            + '                       <input type="checkbox" class="checkboxes" name="ids" value="' + data[i].ID + '" />'
                            + '                  </td>'
                            + '                  <td>' + data[i].ID + '</td>'
                            + '                 <td>' + data[i].NAME + '</td>'
                            + '                 <td>' + tel + '</td>'
                            + '                 <td>' + data[i].RNAME + '</td>'
                            + '                  <td>'
                            + '                       <span class="label ' + temp + '</span>'
                            + '                  </td>'
                            + '                  <td>'
                            + '                       <a class="btn mini purple" title="编辑用户信息" href="javascript:;" data-id="' + data[i].ID + '">' 
                            + '                           <i class="icon-edit"></i>编辑 </a>  '
                            + '                       <a class="btn mini black" title="修改用户密码" href="javascript:;" data-id="' + data[i].ID + '">' 
                            + '                           <i class="icon-key"></i>修改密码 </a>  '
                            + '                  </td>'
                            + '  </tr>';
                        $("#Tlist").append(template);
                    }

                    // 编辑
                    $(".btn.mini.purple").click(function(){
                        layer.open({
                            type:2,
                            title:$(this).attr("title"),
                            area:['500px','520px'],
                            content:'edit.html?id=' + $(this).attr('data-id')
                        });
                    });

                    // 修改密码
                    $(".btn.mini.black").click(function(){
                        layer.open({
                            type:2,
                            title:$(this).attr("title"),
                            area:['300px','200px'],
                            content:'pwd.html?uid=' + $(this).attr('data-id')
                        });
                    });

                    $("#mainForm").show();
                    $("#pagination").show();
                    $("#nodata").hide();
                    $("#loading").hide();
                    tb_init('#Tlist a.thickbox');
                    currentPage = index;
                } else {
                    currentPage = currentPage - 1;
                    if (currentPage >= 0) {
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
        rad: Math.random()
    }
    $.ajax({
        type: "GET",
        url: "/user/delete",
        data: datas,
        success: function (json) {
            if (json.status === 1) {
                layer.msg(json.msg, { time: 2000 });
                User.initlist();
            }
        }
    });

}