var args = getArgs(location.href);

var sdate = "";
var edate = "";
var route = [];
var range = null;
$(document).ready(function () {
    //getproject();
    initbutton();
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

    // 返回按钮
    $("#cancel").on("click", function () {
        history.go(-1);
    });

});

// 地图大小设置
function resize() {
    var height = $(window).height();
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
    $("#selname").html("作业员：" + name);
    $("#selid").val(id);
}

// 初始化功能区
function initbutton() {
    if (args.l == 1) {
        $("#submit").show();
        $("#export").show();
        $("#cancel").hide();
    }
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
var dlpindex = 0;
function gettaskinfo() {
    if (args.id) {
        var obj = {
            "requestMethod": "get",
            "id": args.id
        }
        $.getJSON("/ajax/task.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
            if (response.isSuccess) {
                // 获取返回数据
                var task = response.task; // 当前任务信息
                var scope = response.scope; //当前路线信息
                var ouser = response.ouser; //任务执行人员信息
                var datalist = response.datalist; // 任务提交数据列表
                if (task) {
                    //---------------------- 任务信息赋值----------------------
                    sdate = task.PSTIME.split("T")[0];
                    edate = task.PETIME.split("T")[0];
                    $("#start").html(task.PSTIME.split("T")[0]);
                    $("#end").html(task.PETIME.split("T")[0]);
                    $("#mileage").html(scope.MILEAGE + "公里");
                    if (scope.STATE == 1) {
                        //$("#isdouble").prop("checked", true);
                        $("#isdouble").html("是");
                    }
                    $("#selname").html(ouser.NAME);
                    $("#selid").val(ouser.ID);
                    $("#disc").html(scope.DIST+"米");

                    //-----------------------------任务路线绘制--------------------------
                    // 创建起点
                    var start = JSON.parse(scope.START);
                    spoint = new BMap.Marker(new BMap.Point(start.lng, start.lat), { icon: sIcon });  
                    spoint.setOffset(new BMap.Size(0, -32));
                    map.addOverlay(spoint);
                    // 创建终点
                    var end = JSON.parse(scope.END);
                    epoint = new BMap.Marker(new BMap.Point(end.lng, end.lat), { icon: eIcon });  
                    epoint.setOffset(new BMap.Size(0, -32));
                    map.addOverlay(epoint);
                    //绘制路线
                    var _points = [];
                    var points = JSON.parse(scope.RANGE);
                    for (var i in points) {
                        if (i != "remove") {
                            _points.push(new BMap.Point(points[i].lng, points[i].lat));
                        }
                    }
                     var polyline = new BMap.Polyline(_points, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });
                     map.addOverlay(polyline);


                    // -----------------------任务提交数据路线绘制 开始--------------------------
                     if (datalist.length > 0) {
                         for (var j in datalist) {
                             if (j != "remove") {
                                 linecolor = "yellow";
                                 dl_points = [];
                                 dlpindex = 0;
                                 var temp = [];
                                 var dlpoints = JSON.parse(datalist[j].RANGE);
                                 dlpcount = dlpoints.length;
                                 for (var i in dlpoints) {
                                     if (i != "remove") {
                                         // 需要进行百度坐标转换
                                         //_points.push(new BMap.Point(points[i].lng, points[i].lat));
                                         temp = [];
                                         temp.push(new BMap.Point(dlpoints[i].lng, dlpoints[i].lat));
                                         convertor.translate(temp, 1, 5, function (data) {
                                             if (data.status === 0) {
                                                 dlpindex++;
                                                 dl_points.push(data.points[0]);
                                                 //map.addOverlay(new BMap.Marker(data.points[0]));
                                                 if (dlpindex == dlpcount) {
                                                     var polyline = new BMap.Polyline(dl_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 1 });
                                                     map.addOverlay(polyline);
                                                 }
                                             }
                                         });
                                     }
                                 }

                             }
                         }
                     }
                    // -----------------------任务提交数据路线绘制 结束--------------------------

                }

            }
        });
    }
}


//------------------------------地图操作开始---------------------------------------//
var map = null;  //定义地图对象
var mapstyle = [];  // 定义路网对象
var convertor = null; // 定义坐标转换对象
var spoint = null;  // 定义起点对象
var epoint = null;  // 定义终点对象
var routes = null;      // 定义路线对象


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
    map = new BMap.Map('map', {
        enableMapClick: false    // 禁止底图POI可点击功能
    });
    map.centerAndZoom(new BMap.Point(114.41086, 30.482037), 14);
    //map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.setMapStyle({
        styleJson: mapstyle
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
    //gettasklist();
    gettaskinfo();
}

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

//------------------------------地图操作结束---------------------------------------//


// 删除数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};