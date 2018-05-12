var args = getArgs(location.href);
// ztree权限树设置
var setting = {
    view: {
        selectedMulti: true,
        dblClickExpand: false   // 关闭双击节点展开事件
    },
    check: {
        enable: true,
        chkStyle: 'checkbox',
        radioType: "level"
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: false
    },
    callback: {  
        onClick: onNodeClick // 设置单击节点展开事件
    }  
};
// ztree权限树节点值simpleData:JSON
var zNodes =[];

$(document).ready(function () {
    //  新增或编辑角色信息
    editinit();
});

function editinit() {
    // 获取模块权限信息
    var datas = {
        "index": 0,
        "size": 1000,
        "state": 1
    };

    $.ajax({
        type: "GET",
        url: "/module/getlist",
        data: datas,
        success: function (json) {
            if (json.status) {
                var data = json.dt;
                for (var i in data) {
                    // 创建ztree一级节点
                    if(data[i].LEVEL == 1){
                        var level01 = {
                            id:data[i].ID,
                            pId:0,
                            name:data[i].NAME
                        }
                        zNodes.push(level01);
                    }
                    // 创建ztree二级节点
                    if(data[i].LEVEL == 2){
                        var level02 = {
                            id:data[i].ID,
                            pId:data[i].ID.substring(0,2),
                            name:data[i].NAME
                        }
                        zNodes.push(level02);
                    }
                }
                // 创建权限树
                $.fn.zTree.init($("#module"), setting, zNodes);
            }

            if (args.id) {
                // 获取角色信息
                var datass = {
                    "id": args.id
                };
                $.ajax({
                    type: "GET",
                    url: "/role/get",
                    data: datass,
                    success: function (json) {
                        if (json.status) {
                            var role = json.role;
                            $("#Name").val(role.NAME);
                            $("#Info").val(role.MEMO);

                            if (role.STATE === 1)
                                $("#IsActive").prop("checked", true);
                            else
                                $("#IsActive").prop("checked", false);
                            var rights = json.right;
                            setCheckedByID(rights);
                        }
                    }
                });
            }
        }
    });
}

// 提交新记录数据
function addData() {
    if (!checkUrole(args.id)) {
        var name = $("#Name").val();
        var memo = $("#Info").val();
        var isenable = $("#IsActive").prop("checked") ? 1 : 0;
        var mids = getCheckedID();

        var datas = {
            "name": name,
            "memo": memo,
            "state": isenable,
            "mids": mids,
            "rad": Math.random()
        };

        $.ajax({
            type: "GET",
            async: false,
            url: "/role/add",
            data: datas,
            success: function (json) {
                if (json.status) {
                    window.top.currentPage = 0;
                    window.top.Role.initlist();
                    layer.msg(json.msg);
                } else {
                    window.top.Role.initlist();
                    layer.msg(json.msg);
                }
            }
        });
    }
}

// 更新记录数据
function updateData(id) {
    // 更改后的角色名称不存在的情况下执行更新
    if (!checkUrole(id)) {
        var name = $("#Name").val();
        var memo = $("#Info").val();
        var isenable = $("#IsActive").prop("checked") ? 1 : 0;
        var mids = getCheckedID();

        var datas = {
            "id": id,
            "name": name,
            "memo": memo,
            "state": isenable,
            "mids": mids,
            "rad": Math.random()
        };

        $.ajax({
            type: "GET",
            async: false,
            url: "/role/update",
            data: datas,
            success: function (json) {
                if (json.status) {
                    window.top.Role.initlist();
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                    window.top.msginfo(json.msg);  //父页面执行信息显示
                } else {
                    window.top.Role.initlist();
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                    window.top.msginfo(json.msg);  //父页面执行信息显示
                }
            }
        });
    }
}

//  检测角色名是否存在
function checkUrole(rid) {
    // 记录角色名是否存在，默认不存在
    var result = false;

    if ($("#Name").val() != "") {
        var datas = {
            name: $("#Name").val(),
            rad: Math.random()
        }
        $.ajax({
            type: "get",
            url: "/role/getbyname",
            async: false,
            data: datas,
            success: function (json) {
                var id = json.role.ID;
                if (id != null) {
                    // 角色已存在，且不是当前角色的情况下，可以新增
                    if(id != rid || !rid){
                        layer.msg('角色名已存在，请使用其它名称！');
                        result = true;
                    }else{
                        result = false;
                    }
                } else {
                    result = false;
                }
            }
        });
    }
    return result;
}

// 获取权限树所有选中节点的ID值
function getCheckedID() {
    var treeObj = $.fn.zTree.getZTreeObj("module"),
        nodes = treeObj.getCheckedNodes(true),
        ids = "";

    for (var i = 0; i < nodes.length; i++) {
        if(i == 0){
            ids = nodes[i].id;
        }else{
            ids += "," + nodes[i].id;
        }
    }

    return ids;
}

// 根据用户的模块MID勾选权限树中对应节点
function setCheckedByID(rights){
    var treeObj = $.fn.zTree.getZTreeObj("module");
    for (var i in rights) {
        // 只需判断并勾选二级节点，相应的一级节点会自动勾选
        // if(rights[i].MID.length == 4){
        //     var node = treeObj.getNodeByParam("id", rights[i].MID, null);
        //     treeObj.checkNode(node,true,true);
        // }

        // 判断是否父节点，不是则选中
        var node = treeObj.getNodeByParam("id", rights[i].MID, null);
        if (!node.isParent) {
            treeObj.checkNode(node, true, true);
        }
    }
}

// 设置ztree单击节点展开
function onNodeClick(e,treeId, treeNode) {  
    var zTree = $.fn.zTree.getZTreeObj("module");
    zTree.expandNode(treeNode);
}