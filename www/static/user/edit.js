//先根据id获取用户信息
var args = getArgs(location.href);

$(document).ready(function () {
    //  初始化编辑页面
    editinit();
        
});

function editinit() {

    //  初始化角色select选项
    initRoleSelect();

    //  编辑用户操作
    if (args.id) {
        // 获取用户信息
        var datas = {
            uid: args.id,
            index: 0,
            size: 1,
            rad: Math.random()
        }

        $.ajax({
            type: "GET",
            url: "/user/getlist",
            data: datas,
            success: function (json) {
                if (json.status === 1) {
                    var user = json.dt[0];
                    $("#LoginID").val(user.ID);
                    $("#Name").val(user.NAME);
                    //$("#Password").val(user.PWD);
                    $("#Mobile").val(user.TEL);
                    $("#Email").val(user.EMAIL);
                    $("#Roles").val(user.RID);
                    if (user.STATE === 1)
                        $("#IsActive").prop("checked", true);
                    else
                        $("#IsActive").prop("checked", false);
                    //$("#Depts").val(user.DEPTID);
                    //$("#Jobs").val(user.JOBID);
                    //根据用户ID指定对应部门和职位
                    // getDeptsByID(user.DEPTID,user.JOBID);

                    $("#divPwd").hide();
                    //$("#LoginID").attr("readonly", "readonly");
                    $("#LoginID").attr("disabled", true);
                }
            }
        });
    }
}

// 提交新记录数据
function addData() {
    // 用户名不存在时才执行新增操作
    if (!checkUname()) {
        var id = $("#LoginID").val();
        var pwd = $("#Password").val();
        var name = $("#Name").val();
        var tel = $("#Mobile").val();
        var email = $("#Email").val();
        var roleid = $("#Roles").val();
        var isenable = $("#IsActive").prop("checked") ? 1 : 0;

        var datas = {
            "id": id,
            "pwd": pwd,
            "name": name,
            "tel": tel,
            "email": email,
            "roleid": roleid,
            "state": isenable,
            "rad": Math.random()
        };

        // $.ajaxSettings.async = false;   //  不设置同步，会导致无法显示top.msginfo(json.msg);
        $.ajax({
            type: "GET",
            url: "/user/add",
            data: datas,
            success: function (json) {
                // window.top.msginfo(json.msg);  //父页面执行信息显示
                if (json.status === 1) {
                    window.top.currentPage = 0;
                    window.top.User.initlist();
                    // window.top.tb_remove();
                    layer.msg(json.msg);
                    // layer.open({
                    //     content:json.msg,
                    //     cancel:function(){
                    //         formreset();
                    //     }
                    // });
                }
            }
        });
    }
}

// 更新记录数据
function updateData(id) {
    var name = $("#Name").val();
    var email = $("#Email").val();
    var tel = $("#Mobile").val();
    var roleid = $("#Roles").val();
    var isenable = $("#IsActive").prop("checked") ? 1 : 0;

    var datas = {
        "id": id,
        "name": name,
        "tel": tel,
        "email": email,
        "roleid": roleid,
        "state": isenable,
        "rad": Math.random()
    };

    $.ajax({
        type: "GET",
        async: false,                       //  同步执行
        url: "/user/update",
        data: datas,
        success: function (json) {
            // window.top.msginfo(json.msg);  //父页面执行信息显示
            if (json.status === 1) {
                window.top.User.initlist();
                // window.top.tb_remove();
                // layer.msg(json.msg);
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭
                window.top.msginfo(json.msg);  //父页面执行信息显示
            }
        }
    });
}

// 修改密码
function updatePwd(id) {
    var pwd = $("#password").val();
    
    var datas = {
        "id": id,
        "pwd": pwd,
        "rad": Math.random()
    };

    $.ajax({
        type: "GET",
        url: "/user/updatepwd",
        data: datas,
        success: function (json) {
            if (json.status === 1) {
                // window.top.tb_remove();
                // layer.msg(json.msg);
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭
                window.top.msginfo(json.msg);  //父页面执行信息显示
            }
        }
    });
}

//  检测用户名是否存在
function checkUname() {
    // 记录用户名是否存在，默认不存在
    var result = false;

    if ($("#LoginID").val() != "") {
        var datas = {
            id: $("#LoginID").val(),
            rad: Math.random()
        }
        $.ajax({
            type: "get",
            url: "/user/get",
            async: false,
            data: datas,
            success: function (response) {
                if (response.dt.ID != null) {
                    layer.msg('用户名已存在，请使用其它名称！');
                    result = true;
                } else {
                    result = false;
                }
            }
        });
    }
    return result;
}

//  初始化角色选项
function initRoleSelect() {
    var datas = {
        state: 1,
        rad: Math.random()
    }
    $.ajax({
        type: "get",
        url: "/role/getlist",
        data: datas,
        success: function (json) {
            if (json.status === 1) {
                var template = "";
                var roles = $("#Roles");
                var data = json.dt;

                for (var i in data) {
                    template = '<option value="' + data[i].ID + '">' + data[i].NAME + '</option>';
                    roles.append(template);
                }
            }
        }
    });
}

function formreset() {
    // 清空重置form表单中所有输入内容（除默认密码）
    $(':input', '#mainForm')
        .not(':button, :submit, :reset, :hidden,:password')
        .val('')
        // .removeAttr('checked')
        .removeAttr('selected');
}
