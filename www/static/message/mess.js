$(document).ready(function () {
    //获取用户未读消息列表
    getMessage(0);
});

function getMessage(state) {
    var datas = {
        state: state,
        uid: ''
    }
        
    $.ajax({
        type: "get",
        url: "/message/getlist",
        data: datas,
        success: function (json) {
            if (json.status === 1) {
                var template = "";
                if (json.dt.length > 0) {
                    var data = json.dt;
                    $("#messageDiv").html("");

                    for (var i in data) {
                        var messname = "其他";
                        switch (data[i].TYPE) {
                            case '1':
                                messname = '合同项目';
                                break;
                            case '2':
                                messname = '自研项目';
                                break;
                            case '3':
                                messname = '其他项目';
                                break;
                            case '4':
                                messname = '外业任务';
                                break;
                            case '5':
                                messname = '内业任务';
                                break;
                            case '6':
                                messname = '编译任务';
                                break;
                            case '7':
                                messname = '质检任务';
                                break;
                            case '8':
                                messname = '即时通知';
                                break;
                            case '9':
                                messname = '定向消息';
                                break;
                            case '10':
                                messname = '系统提示';
                                break;
                            default:
                                break;
                        }

                        template = '<a href="javascript:viewMessage(\'' + data[i].ID + '\',\'' + data[i].TYPE + '\',\'' + data[i].GLID + '\');" class="list-group-item">' + data[i].TITLE + '&nbsp&nbsp&nbspl&nbsp<label>' + messname + '</label></a>';
                        $("#messageDiv").append(template);
                    }
                }
            }
        }
    });
}

function viewMessage(mid, type, glid) {
    // 将用户点击过的消息设置为已读状态
    setMesRead(mid);

    // 项目类型或任务类型的消息
    if (type < 8) {
        // 工作台导航至消息所对应的子功能模块页面
        navToModule(glid);
    } else {    // 系统类型的消息
        // 直接在当面消息框显示具体消息内容
        navToHtml(mid);
    }
}

// 将用户的消息变为已读或未读状态
function setMesRead(mid) {
    var datas = {
        id: mid,
        hr: 1
    }
    $.ajax({
        type: "get",
        url: "/message/set",
        data: datas,
        success: function (json) {
            if (json.status === 1) {

            }
        }
    });
}

// 点击消息后导航到相应的用户子功能模块
function navToModule(glid) {
    var datas = {
        id: glid
    }
    $.ajax({
        type: "get",
        url: "/module/get",
        data: datas,
        success: function (json) {
            if (json.status === 1) {
                var modulestr = json.dt;
                top.window.location = modulestr[0].URL;
            }
        }
    });
}

// 点击消息后在当前页面显示具体内容
function navToHtml(mid) {
    this.location = "/message/view.html?id=" + mid;
}