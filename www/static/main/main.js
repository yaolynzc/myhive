var map = null;     //  定义一个地图对象

$(document).ready(function () {
    //resize();
    $("html").css("overflow", "hidden");
    
    //  初始化地图
    map = new AMap.Map('map',{
        resizeEnable:true,
        zoom:10,
        center:[114.41086, 30.482037]
    });

    //  调整地图div大小
    resize();

    //  加载所有采集任务的规划路网
    gettasks();
});

// 地图大小设置
function resize() {
    var height = $(window).height() - 40;
    //alert(height);
    $("#map").height(height);
    var mapw1 = $("#map").width();
    $("#tools1").css("left", mapw1+225 - 50);
}

//  浏览器窗口大小改变后重新设置地图div大小
window.onresize = resize;

// 获取任务信息
function gettasks() {
    var datas = {
        level:'1',
        rad: Math.random()
    }
    $.ajax({
        type: "get",
        url: "/task/getlist",
        data: datas,
        success: function (json) {
            if(json.status===1){
                var data = json.dt;
                //  保存所有路线中最大（小）经纬度
                var maxLng = "";
                var minLng = "";
                var maxLat = "";
                var minLat = "";

                for (var j in data) {
                    if (j != "remove") {
                        var _points = [];

                        var points = JSON.parse(data[j].RANGE);
                        if (maxLng == "") maxLng = bd09togcj02(points[0].lng, points[0].lat)[0];
                        if (minLng == "") minLng = bd09togcj02(points[0].lng, points[0].lat)[0];
                        if (maxLat == "") maxLat = bd09togcj02(points[0].lng, points[0].lat)[1];
                        if (minLat == "") minLat = bd09togcj02(points[0].lng, points[0].lat)[1];
                        
                        for (var i in points) {
                            if (i != "remove") {

                                // _points.push([points[i].lng, points[i].lat]);
                                _points.push(bd09togcj02(points[i].lng, points[i].lat));

                                //  保存最大（小）经纬度
                                if (points[i].lng > maxLng) maxLng = bd09togcj02(points[i].lng, points[i].lat)[0];
                                if (points[i].lng < minLng) minLng = bd09togcj02(points[i].lng, points[i].lat)[0];
                                if (points[i].lat > maxLat) maxLat = bd09togcj02(points[i].lng, points[i].lat)[1];
                                if (points[i].lat < minLat) minLat = bd09togcj02(points[i].lng, points[i].lat)[1];
                            }
                        }
                        // console.log(maxLng + '/' + maxLat);
                        var linecolor = "blue";
                        if (data[j].STATE > 0) {
                            linecolor = "green";
                        }
                        var polyline = new AMap.Polyline({
                            path:_points,
                            strokeColor:linecolor,
                            strokeWeight:5,
                            strokeOpacity:0.8,
                            strokeStyle:"solid"
                        });
                        polyline.setMap(map);
                        // var polyline = new AMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 0.8 });
                        // map.addOverlay(polyline);
                        //map.setViewport(_points);   //  地图视野定位到路线
                    }
                }

                var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;         //  计算最大与最小经度中点
                var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;         //  计算最大与最小纬度中点
                var zoom = getZoom(maxLng, minLng, maxLat, minLat);                 //  获取最大与最小点显示在地图上的地图级别
                console.log(zoom);
                map.setZoomAndCenter(zoom,[cenLng,cenLat]);                         //  改变地图缩放级别和中心点
                
                //  加载所有已上传数据的路网轨迹
                getdatasubmits();
            }
        }
    });
}

// 获取提交数据信息
function getdatasubmits() {
    var datas = {
        rad: Math.random()
    }
    $.ajax({
        type: "get",
        url: "/datasubmit/getlist",
        data: datas,
        success: function (json) {
            if(json.status===1){
                var data = json.dt;
                for (var j in data) {
                    if (j != "remove" && data[j].STATE > 0) {
                        var _points = [];
                        var points = JSON.parse(data[j].R1);
                        for (var i in points) {
                            if (i != "remove") {
                                // _points.push([points[i].lng, points[i].lat]);
                                _points.push(bd09togcj02(points[i].lng, points[i].lat));
                            }
                        }

                        linecolor = "yellow";

                        var polyline = new AMap.Polyline({
                            path:_points,
                            strokeColor:linecolor,
                            strokeWeight:5,
                            strokeOpacity:1,
                            strokeStyle:"solid"
                        });
                        polyline.setMap(map);
                        // var polyline = new AMap.Polyline(_points, { strokeColor: linecolor, strokeWeight: 5, strokeOpacity: 1 });
                        // map.addOverlay(polyline);
                    }
                }
            }
        }
    });
}

//根据经纬度计算地图缩放级别。  
function getZoom(maxLng, minLng, maxLat, minLat) {
    var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000","3000000"]//级别18到2。  
    var pointA = new AMap.LngLat(maxLng, maxLat);  // 创建点坐标A
    var pointB = new AMap.LngLat(minLng, minLat);  // 创建点坐标B
    var distance = pointA.distance(pointB).toFixed(1);  //获取两点距离,保留小数点后一位
    console.log(distance);
    for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
            return 18 - i + 3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3
        }
    };
}