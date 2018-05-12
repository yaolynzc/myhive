var args = getArgs(location.href); //获取页面参数

var currentPage = 0; // 设置当前页码
var pageSize = 10; // 设置翻页大小
var route = []; // 定义任务路线保存容器
var submit = []; // 定义提交数据保存容器

var _points = []; // 定义原始坐标保存容器
var pindex = 0; // 定义原始坐标转换位置标识

var lindex = 0; // 定义提交数据路线位置标识

var pcount = 0; // 记录当前提交数据坐标点总数
var lcount = 0; // 记录当前提交数据路线总数


$(document).ready(function () {
    //gettaskinfo();
    $("#checkall").click(function () {
        var ischecked = this.checked;
        $("input:checkbox[name='ids']").each(function () {
            if (ischecked) {
                if (this.checked != ischecked)
                    map1.addOverlay(route[$(this).val()]);
            } else {
                if (this.checked != ischecked)
                    map1.removeOverlay(route[$(this).val()]);
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
        map1.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#arterial1").on("change", function () {
        if (this.checked) {
            mapstyle1.push(arterial);

        } else {
            mapstyle1.remove(arterial);
        }
        map1.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#local1").on("change", function () {
        if (this.checked) {
            mapstyle1.push(local);

        } else {
            mapstyle1.remove(local);
        }
        map1.setMapStyle({
            styleJson: mapstyle1
        });
    });
    $("#range").on("change", function () {
        if (this.checked) {
            map1.addOverlay(range);
        } else {
            map1.removeOverlay(range);
        }
    });
    // 创建任务
    $("#btncreate").on("click", function () {
        var obj = {
            "requestMethod": "get",
            "id": args.id
        }
        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.isSuccess) {
                var state = response.task.STATE;
                if (state < 3) {
                    $.ajaxSettings.async = false;
                    var obj = {
                        "requestMethod": "update",
                        "id": args.id,
                        "state": 3
                    };
                    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {

                        }
                    });
                    $.ajaxSettings.async = true;
                }
                window.parent.layer.title("创建任务", 0);
                window.location.href = "outcreate.html?pid=" + args.pid + "&tid=" + args.id;
            } else {
                layer.msg("未查询到任务信息，无法创建任务！");
            }
        });
        
    });

    // 任务分配完成
    $("#btncomplete").on("click", function () {
        var obj = {
            "requestMethod": "unpubcount",
            "tid": args.id,
            "pid": args.pid,
            "level":1
        }
        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.dataCount > 0) {
                layer.msg("你还有任务未发布，请先将任务全部发布。");
            } else {
                layer.confirm("确定任务已经全部分配完成？", { icon: 3, title: '提示' }, function (index) {
                    //将页面顶部“创建任务”、“分配完成”置为不可用？或跳转会主任务列表页面？
                    var obj = {
                        "requestMethod": "update",
                        "id": args.id,
                        "state": 4
                    };
                    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            task.initlist();
                            window.parent.layer.closeAll();
                        }
                    });
                });
            }
        });
        
    });

});

// 地图大小设置
function resize()
{
    var height = $(window).height()-70;
    $("#map1").height(height);
    $("#listdiv").height(height-42);
    var mapw1 = $("#map1").width();
    $("#tools1").css("left", mapw1 - 50);
}
window.onresize = resize;

//删除路网样式
function deleteData(arr,val) {
    for (var i = 0; i < arr.length; i++) {
        var cur = arr[i];
        if (cur == val) {
            arr.splice(i, 1);
        }
    }
}


// 修改当前主任务状态为已查看
function updatetask(id) {
   
}


// 获取任务信息
function gettaskinfo() {
    var obj = {
        "requestMethod": "get",
        "id": args.id
    }
    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            if (response.task.STATE > 3) {
              
            }
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
            //range = project.R1;
            $("#pname").html(project.NAME);
            if (map1) {
                //map1.centerAndZoom(project.DISTRICT, 12);
                var _points = [];
                var points = [];
                if (project.R1 != "") {
                    points = JSON.parse(project.R1);
                    var maxLng = points[0].lng;
                    var minLng = points[0].lng;
                    var maxLat = points[0].lat;
                    var minLat = points[0].lat;
                }
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
                map1.addOverlay(range);
                map1.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
            }
        }
    });
}


// 加载任务列表
var task = function () {
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
                "pid": args.pid,
                "level": 1
            }
            $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                if (response.isSuccess) {
                    $("#pagination").pagination(response.dataCount, {
                        callback: gettasklist,
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
function gettasklist(index, jq) {
    var obj = {
        "requestMethod": "list",
        "pid": args.pid,
        "level": 1,
        "index":index,
        "size": pageSize
    }
    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
        if (response.isSuccess) {
            var taskinfo = response.task;
            if (taskinfo.STATE > 3) {
                $("#btncreate").hide();
                $("#btncomplete").hide();
            }
            var template = "";
            if (response.dt.length > 0) {
                route = [];
                var data = response.dt;
                var mileage = 0; //总里程
                var _mileage = 0; // 未发布里程
                var mileage_ = 0; // 已分布里程
                $("#Tlist").html("");
                var state = '';
                var btns = '';
                if (route.length > 0) {
                    for (var n in route) {
                        map1.removeOverlay(route[n]);
                    }
                }
                if (submit.length > 0) {
                    for (var m in submit) {
                        map1.removeOverlay(submit[m]);
                    }
                }
                
                for (var j in data) {
                    if (j != "remove") {
                        state = task_state[data[j].STATE];
                        if (taskinfo.STATE > 3) {
                            btns = '<a class="btn mini purple" title="查看任务" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a>';
                        }
                        else if (data[j].STATE == 0) {
                            btns = '<a class="btn mini green" title="发布任务" name="pub" data-id="' + data[j].ID + '"><i class="icon-share"></i>发布</a> <a class="btn mini blue" title="编辑任务" name="update" data-id="' + data[j].ID + '"><i class="icon-edit"></i>编辑</a> ';
                        }
                        else if (data[j].STATE == 1) {
                            btns = '<a class="btn mini purple" title="查看任务" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a> <a class="btn mini black" title="撤销任务" name="delete" data-id="' + data[j].ID + '"><i class="icon-remove"></i>撤销</a>';
                        }
                       
                        else {
                            btns = '<a class="btn mini purple" title="查看任务" name="view" data-id="' + data[j].ID + '"><i class="icon-eye-open"></i>查看</a>';
                        }
                        template = '<tr>'
                               + '                  <td>'
                             + '                       <input type="checkbox" class="checkboxes" name="ids" value="' + j + '" data-id="' + data[j].ID + '" />'
                             + '                   </td>'
                                   + '         <td class="hidden-480">' + data[j].ID + '</td>'
                                   + '         <td>' + data[j].OUSER + '</td>'
                                    + '         <td>' + data[j].MILEAGE + '公里</td>'
                                   + '         <td>' + state + ' </td>'
                                    + '        <td>' + btns + '</td>'
                                    + '    </tr>';
                        $("#Tlist").append(template);

                        var _points = [];
                        var points = JSON.parse(data[j].ROUTES);
                        for (var i in points) {
                            if (i != "remove") {
                                _points.push(new BMap.Point(points[i].lng, points[i].lat));
                            }
                        }
                        var linecolor = "blue";
                        if (data[j].STATE > 0) {
                            mileage_ = parseFloat(mileage_) + parseFloat(data[j].MILEAGE);
                            linecolor = "green";
                        }
                        else
                            _mileage = parseFloat(_mileage) + parseFloat(data[j].MILEAGE);
                        var polyline = new BMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 0.8 });
                        route.push(polyline);
                        mileage = parseFloat(mileage) + parseFloat(data[j].MILEAGE);
                       
                        //map1.addOverlay(polyline);
                    }
                }
                // 统计任务里程
                $("#allmelage").html("<strong>"+parseInt(mileage)+"</strong>");
                $("#pubed").html("<strong>" + parseInt(mileage_) + "</strong>");
                $("#unpub").html("<strong>" + parseInt(_mileage) + "</strong>");
                // 撤销任务
                $("[name='delete']").on("click", function () {
                    var id = $(this).attr("data-id");
                    var obj = {
                        "requestMethod": "cancel",
                        "id": id
                    };
                    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            layer.msg("任务撤销成功！");
                            task.initlist();
                        }
                    });                  
                });
                // 发布任务
                $("[name='pub']").on("click", function () {
                    var id = $(this).attr("data-id");
                    var obj = {
                        "requestMethod": "pub",
                        "id": id,
                        "ptid": args.id
                    };
                    $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                        if (response.isSuccess) {
                            //if (response.islast == 0) {
                                layer.msg("任务发布成功！");
                                
                            //}
                            //else {
                            //    layer.confirm("你创建任务已经全部发布，是否完成任务分配？", { icon: 3, title: '提示' }, function () {
                            //        //将页面顶部“创建任务”、“分配完成”置为不可用？或跳转会主任务列表页面？
                            //        var obj = {
                            //            "requestMethod": "update",
                            //            "id": args.id,
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
                            task.initlist();
                        }
                    });
                });
                // 编辑任务
                $("[name='update']").on("click", function () {
                    var id = $(this).attr("data-id");
                    window.parent.layer.title("编辑任务", 0);
                    window.location.href = "outcreate.html?pid=" + args.pid + "&id=" + id + "&tid=" + args.id;
                });
                // 查看任务
                $("[name='view']").on("click", function () {
                    var id = $(this).attr("data-id");
                    window.location.href = "outview.html?pid=" + args.pid + "&id=" + id + "&tid=" + args.id;;
                });

                // 选择框勾选状态改变
                $("input:checkbox[name='ids']").on("change", function () {
                    var index = $(this).val();
                    var tid = $(this).attr("data-id");
         
                    if (this.checked) {
                        map1.addOverlay(route[index]);
                        if (submit[index]) {
                            var temp = submit[index];
                            for (var k in temp) {
                                map1.addOverlay(temp[k]);
                            }
                        } else {
                            var obj = {
                                "requestMethod": "list",
                                "tid": tid,
                                "index": 0,
                                "size": 100
                            }
                            $.getJSON("/ajax/datasubmit.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
                                if (response.isSuccess) {
                                    var data = response.dt;
                                    var lines = [];  // 定义当前提交数据路线容器
                                    lindex = 0;
                                    lcount = data.length;
                                    for (var j in data) {
                                        if (j != "remove") {
                                            // 判定路线颜色
                                            linecolor = "yellow";
                                            if (data[j].STATE > 1) 
                                                linecolor = "green";

                                            _points = [];
                                            //pindex = 0;
                                            //var temp = [];
                                            var points = JSON.parse(data[j].R1);// 路线数据点串信息
                                            //pcount = points.length;
                                            for (var i in points) {        
                                                if (i != "remove") {
                                                    // 需要进行百度坐标转换
                                                    _points.push(new BMap.Point(points[i].lng, points[i].lat));
                                                    //temp = [];
                                                    //temp.push(new BMap.Point(points[i].lng, points[i].lat));
                                                    //convertor.translate(temp, 1, 5, function (data) {
                                                    //    if (data.status === 0) {
                                                    //        pindex++;
                                                    //        _points.push(data.points[0]);
                                                    //        //map.addOverlay(new BMap.Marker(data.points[0]));
                                                    //        if (pindex == pcount) {
                                                    //            lindex++;
                                                    //            var polyline = new BMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 1 });
                                                    //            lines.push(polyline);
                                                    //            map1.addOverlay(polyline);
                                                    //            if (lindex == lcount) {
                                                    //                submit[index] = lines;
                                                    //            }

                                                    //        }
                                                    //    }
                                                    //});
                                                }
                                            }
                                            var polyline = new BMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 1 });
                                            lines.push(polyline);
                                            map1.addOverlay(polyline);
                                        }
                                    }
                                    submit[index] = lines;
                                }
                            });
                        }
                    }
                    else {
                        map1.removeOverlay(route[index]);
                        if (submit[index]) {
                            var temp = submit[index];
                            for (var k in temp) {
                                map1.removeOverlay(temp[k]);
                            }
                        }
                    }
                    
                   
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
    map1 = new BMap.Map('map1', {
        enableMapClick: false    // 禁止底图POI可点击功能
    });
    map1.centerAndZoom(new BMap.Point(114.41086, 30.482037), 14);
    //map1.addControl(new BMap.MapTypeControl());
    map1.enableScrollWheelZoom(true);
    map1.setMapStyle({
        styleJson: mapstyle1
    });
    resize();
    //convertor = new BMap.Convertor();
    
    task.init();
    task.initlist();
    getproject();
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

//根据经纬极值计算绽放级别。  
function getZoom(maxLng, minLng, maxLat, minLat) {
    var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。  
    var pointA = new BMap.Point(maxLng, maxLat);  // 创建点坐标A  
    var pointB = new BMap.Point(minLng, minLat);  // 创建点坐标B  
    var distance = map1.getDistance(pointA, pointB).toFixed(1);  //获取两点距离,保留小数点后两位  
    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
            return 18 - i + 4;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。  
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