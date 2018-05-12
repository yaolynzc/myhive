jQuery(document).ready(function () {
    // 用户登录状态下，获取用户未读消息并在右下角提醒
    getMessage(0);  //用户第一次登录执行一次
    var timer = window.setInterval('getMessage(0)', 900000); // 每隔15分钟执行一次
});

function getMessage(state) {
    var datas = {
        state: state,
        uid: '',
        rad: Math.random()
    }

    $.ajax({
        type: "get",
        url: "/message/getlist",
        data: datas,
        success: function (json) {
            if (json.status === 1 && json.dt.length > 0) {
                layer.open({
                    title: '<h4 style="color:red;margin-left:-5px;border:none">你有' + json.dt.length + '条新消息！</h4>',
                    type: 2,
                    shade: 0,
                    area: ['360px', '270px'],
                    offset: 'rb',
                    time: 60000, //1分钟后自动关闭
                    anim: 2,
                    content: ['/message/mess.html', 'no']
                });
            }
        }
    });
}