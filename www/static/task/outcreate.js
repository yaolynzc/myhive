var args = getArgs(location.href);

var sdate = "";
var edate = "";
var route = [];
var range = null;
$(document).ready(function () {
    //getproject();
    resize();
    // 路线显示设置
    $("#highway").on("change", function () {
        if (this.checked) {
            mapstyle.push(highway);
        } else {
            mapstyle.remove(highway);
        }
        map.setMapStyle({
            styleJson: mapstyle
        });
    });
    $("#arterial").on("change", function () {
        if (this.checked) {
            mapstyle.push(arterial);

        } else {
            mapstyle.remove(arterial);
        }
        map.setMapStyle({
            styleJson: mapstyle
        });
    });
    $("#local").on("change", function () {
        if (this.checked) {
            mapstyle.push(local);

        } else {
            mapstyle.remove(local);
        }
        map.setMapStyle({
            styleJson: mapstyle
        });
    });
    $("#range").on("change", function () {
        if (this.checked) {
            map.addOverlay(range);
        } else {
            map.removeOverlay(range);
        }
    });

    //任务时间初始化
    var start = {
        elem: '#start',
        format: 'YYYY/MM/DD',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istime: false,
        istoday: false,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
            sdate = datas;
        }
    };
    var end = {
        elem: '#end',
        format: 'YYYY/MM/DD',
        min: laydate.now(),
        max: '2099-06-16',
        istime: false,
        istoday: false,
        choose: function (datas) {
            start.max = datas; //结束日选好后，重置开始日的最大日期
            edate = datas;
        }
    };
    laydate(start);
    laydate(end);
    //laydate.skin("molv");


    // 撤销事件
    $("#cancel").on("click", function () {
        window.parent.layer.title("分配任务", 0);
        window.location.href = "outedit.html?pid=" + pid + "&id=" + args.tid;
    });

    // 提交事件
    $("#submit").on("click", function () {
        var _routes = "";
        var _spoint = "";
        var _epoint = "";
        if (spoint_ == null && epoint_ == null) {
            layer.msg("请在地图上右击设置路线起始点或必经点！");
            return;
        } else if (spoint_ != null && epoint_ == null) {
            layer.msg("请在地图上右击设置路线终点！");
            return;
        } else if (spoint_ == null && epoint_ != null) {
            layer.msg("请在地图上右击设置路线起点！");
            return;
        }

        if (routes == "" || routes == null) {
            layer.msg("请在地图上右击设置路线起始点或必经点！");
            return;
        }
        else {
            _routes = JSON.stringify(routes);//JSON.parse(json)反序列化
            _spoint = JSON.stringify(spoint_);
            _epoint = JSON.stringify(epoint_);
        }
        
        var isdouble = 0;
        var mileage = null;
        if ($('#isdouble').is(':checked'))
            isdouble = 1;
        //var mileage = $("#mileage").html().substring(0, $("#mileage").html().length - 2);
        if ($("#mileage").html().indexOf("米") >= 0) {
            mileage = $("#mileage").html().substring(0, $("#mileage").html().length - 1) / 1000;
        } else {
            mileage = $("#mileage").html().substring(0, $("#mileage").html().length - 2);
        }
        var ouserid = $("#selid").val();
        var dict = $("#disc").val();

        if (ouserid == "") {
            layer.msg("请选择作业人员！");
            return;
        }
        if (sdate == "" || edate=="") {
            layer.msg("请选择任务开始时间及结束时间！");
            return;
        }
        if (dict != "") {
            if (!isnum(dict)) {
                layer.msg("控制点间距必须为数字！");
                return;
            }
        }

        var obj = {
            "requestMethod": "insert",
            "tid": args.tid,
            "pid": pid,
            "pcid": "01",
            "type": 2,
            "level": 1,
            "opid": ouserid,
            "stime": sdate,
            "etime": edate,
            "dict":dict,
            "state": 0,
            "routes": _routes,
            "mileage": mileage,
            "spoint": _spoint,
            "epoint": _epoint,
            "isdouble": isdouble,
            "ltype": 1
        };
        if (args.id) {
            obj = {
                "requestMethod": "update",
                "id":args.id,
                "tid": args.tid,
                "pid": pid,
                "pcid": "01",
                "type": 2,
                "level": 1,
                "opid": ouserid,
                "stime": sdate,
                "etime": edate,
                "dict": dict,
                "state": 0,
                "routes": _routes,
                "mileage": mileage,
                "spoint": _spoint,
                "epoint": _epoint,
                "isdouble": isdouble,
                "ltype": 1
            };
        }
        $.ajax({
            url: "/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)),
            type: "post",
            async: false,
            dataType: "json",
            data: obj,
            success: function (response) {
                if (response.isSuccess) {
                    layer.msg("任务保存成功，请在任务列表进行任务发布！",{time:3000}, function () {
                        window.parent.layer.title("分配任务", 0);
                        window.location.href = "outedit.html?pid=" + pid + "&id=" + args.tid;
                    });
                } else {
                    layer.msg("任务保存失败！");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) { alert(xhr.responseText); layer.msg("任务保存失败！"); }
        });




    });

    //是否双向采集
    $("#isdouble").on("change", function () {
        var mileage = $("#mileage").html();
        if (mileage != "") {
            var m = mileage.substring(0, mileage.length - 2);
            if (this.checked) {
                $("#mileage").html(m * 2 + "公里");
                //if (_polyline) {
                //    map.addOverlay(_polyline);
                //}
                //else {
                //    _driving.search(epoint, spoint, { waypoints: bpoint });
                //}
            } else{
                $("#mileage").html(m / 2 + "公里");
                //if (_polyline) {
                //    map.removeOverlay(_polyline);
                //}
            
            }
        }
    });

    // 选择人员
    $("#selp").on("click", function () {
        layer.open({
            type: 2,
            area: ["490px", "440px"],
            fixed: false, //不固定
            maxmin: true,
            title: '选择人员',
            content: '../user/select.html?f=setselp'
        });
    });

});

// 地图大小设置
function resize() {
    var height = $(window).height() - 45;
    $("#map").height(height);
    var mapw = $("#map").width();
    $("#tools").css("left", mapw - 50);
}
window.onresize = resize;

//删除路网样式
function deleteData(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        var cur = arr[i];
        if (cur == val) {
            arr.splice(i, 1);
        }
    }
}

// 人员选择后显示操作
function setselp(id, name) {
    $("#selname").html("<span style=\"color:red\">*</span>作业员：" + name);
    $("#selid").val(id);
}


// 获取项目信息
var pid = "";
function getproject() {
    var obj = {
        "requestMethod": "get",
        "id": args.pid
    }
    $.getJSON("/ajax/project.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var project = response.project;
            pid = project.ID;
            //range = project.R1;
            if (map) {
                var _points = [];
                var points = JSON.parse(project.R1);
                var maxLng = points[0].lng;
                var minLng = points[0].lng;
                var maxLat = points[0].lat;
                var minLat = points[0].lat;
                for (var i in points) {
                    if (i != "remove") {
                        res = points[i];
                        if (res.lng > maxLng) maxLng = res.lng;
                        if (res.lng < minLng) minLng = res.lng;
                        if (res.lat > maxLat) maxLat = res.lat;
                        if (res.lat < minLat) minLat = res.lat;
                        _points.push(new BMap.Point(res.lng, res.lat));

                    }
                }
                var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
                var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
                var zoom = getZoom(maxLng, minLng, maxLat, minLat);

                range = new BMap.Polygon(_points, { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 });  //创建多边形 
                map.addOverlay(range);
                map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
            }
        }
    });
}
// 获取任务列表
function gettasklist() {
    var obj = {
        "requestMethod": "list",
        "pid": args.pid,
        "level": 1,
        "index": 0,
        "size": 100
    }
    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var template = "";
            if (response.dt.length > 0) {
                route = [];
                var data = response.dt;
                for (var j in data) {
                    if (j != "remove") {
                        var _points = [];
                        var points = JSON.parse(data[j].ROUTES);
                        for (var i in points) {
                            if (i != "remove") {
                                _points.push(new BMap.Point(points[i].lng, points[i].lat));
                            }
                        }
                        var polyline = new BMap.Polyline(_points, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });
                        if (data[j].ID != args.id) {
                            route.push(polyline);
                            map.addOverlay(polyline);
                        }
                    }
                }
            }
        } 
    });
}

// 获取当前任务信息
function gettaskinfo() {
    if (args.id) {
        var obj = {
            "requestMethod": "get",
            "id": args.id
        }
        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.isSuccess) {
                var task = response.task;
                var scope = response.scope;
                var ouser = response.ouser;
                if (task) {
                    sdate = task.PSTIME.split("T")[0];
                    edate = task.PETIME.split("T")[0];
                    $("#start").val(task.PSTIME.split("T")[0]);
                    $("#end").val(task.PETIME.split("T")[0]);
                    $("#mileage").html(scope.MILEAGE + "公里");
                    if (scope.STATE == 1) {
                        $("#isdouble").prop("checked", true);
                    }
                    $("#selname").html("<span style=\"color:red\">*</span>作业员：" + ouser.NAME);
                    $("#selid").val(ouser.ID);
                    $("#disc").val(scope.DIST);

                    // 创建起点
                    var start = JSON.parse(scope.START);
                    spoint_ = start;
                    spoint = new BMap.Marker(new BMap.Point(start.lng, start.lat), { icon: sIcon });  
                    spoint.setOffset(new BMap.Size(0, -32));
                    map.addOverlay(spoint);
                    // 创建终点
                    var end = JSON.parse(scope.END);
                    epoint_ = end;
                    epoint = new BMap.Marker(new BMap.Point(end.lng, end.lat), { icon: eIcon });  
                    epoint.setOffset(new BMap.Size(0, -32));
                    map.addOverlay(epoint);
                    //绘制路线
                    routes =  JSON.parse(scope.RANGE);

                    var _points = [];
                    var points = JSON.parse(scope.RANGE);
                    for (var i in points) {
                        if (i != "remove") {
                            _points.push(new BMap.Point(points[i].lng, points[i].lat));
                        }
                    }
                    polyline = new BMap.Polyline(_points, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });
                    map.addOverlay(polyline);
                }

            }
        });
    }
}