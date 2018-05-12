var args = getArgs(location.href);

var currentPage = 0;
var pageSize = 10;
var route = [];

$(document).ready(function () {

    $("#taskcode").html("任务编号：" + args.tid);
   

    $("#checkall").click(function () {
        var ischecked = this.checked;
        $("input:checkbox[name='ids']").each(function () {
            if (ischecked) {
                if (this.checked != ischecked)
                    map.addOverlay(route[$(this).val()]);
            } else {
                if (this.checked != ischecked)
                    map.removeOverlay(route[$(this).val()]);
            }
            this.checked = ischecked;
        });
        //$.uniform.update(':checkbox');
    });

    // 路线显示设置
    $("#highway1").on("change", function () {
        if (this.checked) {
            mapstyle1.push(highway);
        } else {
            mapstyle1.remove(highway);
        }
        map.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#arterial1").on("change", function () {
        if (this.checked) {
            mapstyle1.push(arterial);

        } else {
            mapstyle1.remove(arterial);
        }
        map.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#local1").on("change", function () {
        if (this.checked) {
            mapstyle1.push(local);

        } else {
            mapstyle1.remove(local);
        }
        map.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#range").on("change", function () {
        if (this.checked) {
            map.addOverlay(range);
        } else {
            map.removeOverlay(range);
        }
    });

    // 提交数据
    $("#btncreate").on("click", function () {
        //打开提交数据弹出层
        layer.open({
            type: 2,
            area: ['600px', '470px'],
            fixed: false, //不固定
            maxmin: true,
            title: '上传数据',
            content: 'datasubmit.html?tid=' + args.tid
        });

    });

    // 完成数据上传
    $("#btncomplete").on("click", function () {
        var obj = {
            "requestMethod": "unsubmitcount",
            "tid": args.tid
        };
        $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.dataCount > 0) {
                layer.msg("你还有数据未提交，请先将数据全部提交。");
            } else {
                layer.confirm("确定任务数据已经全部上传完成？", { icon: 3, title: '提示' }, function (index) {
                    //将页面顶部“创建任务”、“分配完成”置为不可用？或跳转会主任务列表页面？
                    var obj = {
                        "requestMethod": "update",
                        "id": args.tid,
                        "state": 4
                    };
                    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            //task.initlist();
                            window.parent.layer.closeAll();
                        }
                    });
                });
            }
        });
       
    });

});

// 地图大小设置
function resize() {
    var height = $(window).height() - 70;
    $("#map1").height(height);
    $("#listdiv").height(height - 42);
    var mapw1 = $("#map1").width();
    $("#tools1").css("left", mapw1 - 50);
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



// 获取任务信息
function gettaskinfo() {
    var obj = {
        "requestMethod": "get",
        "id": args.tid
    }
    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var task = response.task;
            var scope = response.scope;
            var ouser = response.ouser;
            if (task) {
                
                $("#allmelage").html(scope.MILEAGE);
                $("#unpub").html(scope.MILEAGE);
                // 创建起点
                var start = JSON.parse(scope.START);
                //spoint_ = start;
                 var spoint = new BMap.Marker(new BMap.Point(start.lng, start.lat), { icon: sIcon });
                spoint.setOffset(new BMap.Size(0, -32));
                map.addOverlay(spoint);
                // 创建终点
                var end = JSON.parse(scope.END);
                //epoint_ = end;
                var epoint = new BMap.Marker(new BMap.Point(end.lng, end.lat), { icon: eIcon });
                epoint.setOffset(new BMap.Size(0, -32));
                map.addOverlay(epoint);
                //绘制路线
                //routes = scope.RANGE;

                var _points = [];
                var points = JSON.parse(scope.RANGE);
                for (var i in points) {
                    if (i != "remove") {
                        _points.push(new BMap.Point(points[i].lng, points[i].lat));
                    }
                }
                var polyline = new BMap.Polyline(_points, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });
                map.addOverlay(polyline);
            }

            submit.init();
            submit.initlist();
        }
    });
}

// 获取项目信息
var pid = "";
var range = "";
function getproject() {
    var obj = {
        "requestMethod": "get",
        "id": args.pid
    }
    $.getJSON("/ajax/project.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var project = response.project;
            pid = project.ID;
            if (map) {
                //map.centerAndZoom(project.DISTRICT, 12);
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


// 加载任务列表
var pindex = 0;// 坐标转换索引
var pcount = 0;// 坐标转换总数
var linecolor = ""; // 路线颜色
var _points = []; // 转换后坐标存放
var submit = function () {
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
                "tid": args.tid
            }
            $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                if (response.isSuccess) {
                    $("#pagination").pagination(response.dataCount, {
                        callback: getsubmitlist,
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
function getsubmitlist(index, jq) {
    var obj = {
        "requestMethod": "list",
        "tid": args.tid,
        "index": index,
        "size": pageSize
    }
    $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var taskinfo = response.task;
            if (taskinfo.STATE > 3) {
                $("#btncreate").hide();
                $("#btncomplete").hide();
            }
            var template = "";
            if (response.dt.length > 0) {
                // 清空数据路线
                if (route.length > 0) {
                    for (var k in route) {
                        map.removeOverlay(route[k]);
                    }
                    route = [];
                }

                var data = response.dt;
                var mileage = 0; //总里程
                var _mileage = 0; // 未发布里程
                var mileage_ = 0; // 已分布里程
                $("#Tlist").html("");
                var state = '';
                var btns = '';
                //map.clearOverlays();
                for (var j in data) {
                    if (j != "remove") {
                        state = submit_state[data[j].STATE];
                        if (taskinfo.STATE > 3) {
                            btns = '<a class="btn mini purple" title="查看数据" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a>';
                        }
                        else if (data[j].STATE < 2) {
                            btns = '<a class="btn mini green" title="提交数据" name="pub" data-id="' + data[j].ID + '"><i class="icon-share"></i>提交</a> <a class="btn mini blue" title="编辑数据" name="update" data-id="' + data[j].ID + '"><i class="icon-edit"></i>编辑</a> ';
                            btns += '<a class="btn mini black" title="删除数据" name="delete" data-id="' + data[j].ID + '"><i class="icon-remove"></i>删除</a>'
                        }
                        else if (data[j].STATE == 2) {
                            btns = '<a class="btn mini purple" title="查看数据" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a> <a class="btn mini black" title="撤销提交" name="cancel" data-id="' + data[j].ID + '"><i class="icon-remove"></i>撤销</a>';
                        }

                        else {
                            btns = '<a class="btn mini purple" title="查看数据" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a>';
                        }
                        template = '<tr>'
                               + '                  <td>'
                             + '                       <input type="checkbox" class="checkboxes" name="ids" value="' + j + '" />'
                             + '                   </td>'
                                   + '         <td class="hidden-480">' + data[j].ID + '</td>'
                                   + '         <td>' + data[j].DID + '</td>'
                                    + '         <td>' + data[j].MILEAGE + '公里</td>'
                                   + '         <td>' + state + ' </td>'
                                    + '        <td>' + btns + '</td>'
                                    + '    </tr>';
                        $("#Tlist").append(template);

                        linecolor = "yellow";
                        if (data[j].STATE > 1) {
                            mileage_ = parseFloat(mileage_) + parseFloat(data[j].MILEAGE);
                            linecolor = "green";
                        }
                        else
                            _mileage = parseFloat(_mileage) + parseFloat(data[j].MILEAGE);

                        _points = [];
                        pindex = 0;
                        var temp = [];
                        var points = JSON.parse(data[j].R1);

                        for (var i in points) {
                            if (i != "remove") {
                                // 需要进行百度坐标转换
                                _points.push(new BMap.Point(points[i].lng, points[i].lat));
                            
                            }
                        }
                        var polyline = new BMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 1 });
                        route.push(polyline);

                        mileage = parseFloat(mileage) + parseFloat(data[j].MILEAGE);

                        //map.addOverlay(polyline);
                    }
                }
                // 统计任务里程
                //$("#allmelage").html("<strong>" + parseInt(mileage) + "</strong>");
                _mileage = parseFloat($("#allmelage").html()) - mileage_;
                $("#pubed").html("<strong>" + mileage_ + "</strong>");
                $("#unpub").html("<strong>" + _mileage + "</strong>");
                // 删除数据
                $("[name='delete']").on("click", function () {
                    var id = $(this).attr("data-id");
                    layer.confirm("你确定要删除该数据？", { icon: 3, title: '提示' }, function () {
                        var obj = {
                            "requestMethod": "delete",
                            "ids": id
                        };
                        $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                            if (response.isSuccess) {

                                layer.msg("删除数据成功！");
                                submit.initlist();
                            }
                        });
                    });
                });
                // 撤销提交
                $("[name='cancel']").on("click", function () {
                    var id = $(this).attr("data-id");
                    var obj = {
                        "requestMethod": "cancel",
                        "id": id
                    };
                    $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            layer.msg("数据提交撤销成功！");
                            submit.initlist();
                        }
                    });
                });
                // 提交数据
                $("[name='pub']").on("click", function () {
                    var id = $(this).attr("data-id");
                    var obj = {
                        "requestMethod": "pub",
                        "id": id
                    };
                    $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            //if (response.islast == 0) {
                                layer.msg("数据提交成功！");
                            //}
                            //else {
                            //    layer.confirm("你上传的数据已经全部提交，是否完成数据上传？", { icon: 3, title: '提示' }, function () {
                            //        //将页面顶部“创建任务”、“分配完成”置为不可用？或跳转会主任务列表页面？
                            //        var obj = {
                            //            "requestMethod": "update",
                            //            "id": args.tid,
                            //            "state": 4
                            //        };
                            //        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                            //            if (response.isSuccess) {
                            //                //task.initlist();
                            //                window.parent.layer.closeAll();
                            //            }
                            //        });

                            //    });
                            //}
                            submit.initlist();
                        }
                    });
                });
                // 编辑数据
                $("[name='update']").on("click", function () {
                    var id = $(this).attr("data-id");
                    //window.location.href = "outcreate.html?pid=" + args.pid + "&id=" + id;
                    //打开提交数据弹出层
                    layer.open({
                        type: 2,
                        area: ['600px', '470px'],
                        fixed: false, //不固定
                        maxmin: true,
                        title: '编辑数据',
                        content: 'datasubmit.html?tid=' + args.tid + '&id=' + id
                    });
                });
                // 查看数据
                $("[name='view']").on("click", function () {
                    var id = $(this).attr("data-id");
                    layer.open({
                        type: 2,
                        area: ['600px', '400px'],
                        fixed: false, //不固定
                        maxmin: true,
                        title: '查看数据',
                        content: 'datasubmitview.html?pid=' + args.pid + '&id=' + id
                    });
                    //window.location.href = "datasubmitview.html?pid=" + args.pid + "&id=" + id;
                });

                // 选择框勾选状态改变
                $("input:checkbox[name='ids']").on("change", function () {
                    var index = $(this).val();
                    if (this.checked)
                        map.addOverlay(route[index]);
                    else
                        map.removeOverlay(route[index]);
                });

                $("#mainForm").show();
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
                    $("#mainForm").hide();
                    $("#pagination").hide();
                    $("#nodata").show();
                    $("#loading").hide();
                }
            }
        }
    });
}



//--------------------------------------------------地图操作开始------------------------------------------------------
//地图接口加载
function loadScript() {
    var script = document.createElement("script");
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=QBGrhAebZvUq7fs2mCMH4mnC&callback=initialize";//此为v2.0版本的引用方式  
    document.body.appendChild(script);
}
window.onload = loadScript;

// 地图初始化
function initialize() {
    //实例化地图
    map = new BMap.Map('map1',{
        enableMapClick: false    // 禁止底图POI可点击功能
    });
    map.centerAndZoom(new BMap.Point(114.41086, 30.482037), 14);
    //map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.setMapStyle({
        styleJson: mapstyle1
    });

    sIcon = new BMap.Icon("../media/image/start.png", new BMap.Size(37, 62), {
        offset: new BMap.Size(20, 62),
        imageOffset: new BMap.Size(0, 0)
    });
    bIcon = new BMap.Icon("../media/image/must.png", new BMap.Size(37, 62), {
        offset: new BMap.Size(20, 62),
        imageOffset: new BMap.Size(0, 0)
    });
    eIcon = new BMap.Icon("../media/image/end.png", new BMap.Size(37, 62), {
        offset: new BMap.Size(20, 62),
        imageOffset: new BMap.Size(0, 0)
    });
    convertor = new BMap.Convertor();
    getproject();
    gettaskinfo();
    
    resize();
}
var convertor = null; // 定义坐标转换对象
var mapstyle1 = [];  // 定义路网对象
// 高速路样式
var highway = {
    "featureType": "highway",
    "elementType": "geometry",
    "stylers": {
        "color": "#ff9900",
        "hue": "#ff0000",
        "visibility": "on"
    }
};
// 城市主路样式
var arterial = {
    "featureType": "arterial",
    "elementType": "geometry",
    "stylers": {
        "color": "#9900ff",
        "hue": "#9900ff",
        "visibility": "on"
    }
};
// 普通道路样式
var local = {
    "featureType": "local",
    "elementType": "geometry",
    "stylers": {
        "color": "#666666",
        "hue": "#666666",
        "visibility": "on"
    }
};

// 起点图标样式
var sIcon = null;
// 必经点图标样式
var bIcon = null;
// 终点图标样式
var eIcon = null;


//根据经纬极值计算绽放级别。  
function getZoom(maxLng, minLng, maxLat, minLat) {
    var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。  
    var pointA = new BMap.Point(maxLng, maxLat);  // 创建点坐标A  
    var pointB = new BMap.Point(minLng, minLat);  // 创建点坐标B  
    var distance = map.getDistance(pointA, pointB).toFixed(1);  //获取两点距离,保留小数点后两位  
    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
            return 18 - i + 3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
        }
    };
}
//--------------------------------------------------地图操作结束------------------------------------------------------
// 删除数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};