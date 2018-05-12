var args = getArgs(location.href);

var map = null;  //定义地图对象
var mapstyle = [];  // 定义路网对象


var spoint = null;  // 定义起点对象
var epoint = null;  // 定义终点对象
var spoint_ = null;
var epoint_ = null;
var bpoint = [];    // 定义必经点对象

var searchpoint = null;


var driving = null; // 定义路径规划对象

var routePolicy = null;  // 定义路径规划规则

var routes = null;      // 定义路线对象
var _routes = null;      // 定义路线对象
var polyline = null;    // 定义路线点数据对象
var _polyline = null;    // 定义路线点数据对象

//设置路径规划参数
var options = { 
    onSearchComplete: function (results) {
        if (driving.getStatus() == BMAP_STATUS_SUCCESS) {

            // 获取第一条方案
            var plan = results.getPlan(0);
            //设置任务里程显示
            var dis = plan.getDistance(true);
            var mileage = dis.substring(0, dis.length - 2);

            //var temp =  $("#mileage").html();
            //var dict = 0;
            //if (temp != "") {
            //    dict = temp.substring(0, temp.length - 2);
            //}
            //$("#mileage").html((parseInt(mileage) + parseInt(dict))+"公里");

            if ($('#isdouble').is(':checked')) {
                $("#mileage").html(mileage*2+"公里");
            } else {
                $("#mileage").html(dis);
            }
            // 获取方案的驾车线路
            routes = null;//plan.getRoute(0);
            for (var j = 0; j < plan.getNumRoutes() ; j++) {
                if (routes == null)
                    routes = plan.getRoute(j).getPath();
                else
                    routes.push.apply(routes, plan.getRoute(j).getPath());
            }
            if (polyline) {
                map.removeOverlay(polyline);
            }
            polyline = new BMap.Polyline(routes, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });   //创建折线
            map.addOverlay(polyline);

        }
    }
};

//设置路径规划参数
var _options = {
    onSearchComplete: function (results) {
        if (driving.getStatus() == BMAP_STATUS_SUCCESS) {

            // 获取第一条方案
            var plan = results.getPlan(0);
            //设置任务里程显示
            var dis = plan.getDistance(true);
            var mileage = dis.substring(0, dis.length - 2);

            //var temp =  $("#mileage").html();
            //var dict = 0;
            //if (temp != "") {
            //    dict = temp.substring(0, temp.length - 2);
            //}
            //$("#mileage").html((parseInt(mileage) + parseInt(dict))+"公里");

            //if ($('#isdouble').is(':checked')) {
            //    $("#mileage").html(mileage * 2 + "公里");
            //} else {
            //    $("#mileage").html(dis);
            //}
            // 获取方案的驾车线路
            _routes = null;//plan.getRoute(0);
            for (var j = 0; j < plan.getNumRoutes() ; j++) {
                if (_routes == null)
                    _routes = plan.getRoute(j).getPath();
                else
                    _routes.push.apply(routes, plan.getRoute(j).getPath());
            }
            if (_polyline) {
                map.removeOverlay(_polyline);
            }
            _polyline = new BMap.Polyline(_routes, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });   //创建折线
            map.addOverlay(_polyline);

        }
    }
};

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
    map = new BMap.Map('map');
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

    // 实例化导航对象
    driving = new BMap.DrivingRoute(map, options);
    _driving = new BMap.DrivingRoute(map, _options);
    // 导航规则
    routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];


    //地图右键菜单
    var menu = new BMap.ContextMenu();
    var txtMenuItem = [
		{
		    text: '设为起点',
		    callback: function (e) {
		        spoint_ = e;
		        if (spoint) {
		            map.removeOverlay(spoint);
		        }
		       
		        
		        spoint = new BMap.Marker(e, { icon: sIcon });  // 创建标注
		        spoint.setOffset(new BMap.Size(0, -32));
		        map.addOverlay(spoint);
		        //$("#start").val(e.lng + "," + e.lat);
		        if (spoint && epoint) {
		            driving.search(spoint, epoint, { waypoints: bpoint });
		        }
		    }
		},
		{
		    text: '设为必经点',
		    callback: function (e) {
		       

		        var mpoint = new BMap.Marker(e, { icon: bIcon});  // 创建标注
		        //var mpoint = new BMap.Marker(e);
		        mpoint.setOffset(new BMap.Size(0, -32));

		        var removeMarker = function (e, ee, marker) {
		            map.removeOverlay(marker);
		            bpoint.remove(marker);
		            if (spoint && epoint) {
		                driving.search(spoint, epoint, { waypoints: bpoint });
		            }
		        }
		        //创建右键菜单
		        var markerMenu = new BMap.ContextMenu();
		        markerMenu.addItem(new BMap.MenuItem('删除', removeMarker.bind(mpoint)));
		        mpoint.addContextMenu(markerMenu);

		        map.addOverlay(mpoint);
		        bpoint.push(mpoint);
		        if (spoint && epoint) {
		            driving.search(spoint, epoint, { waypoints: bpoint });
		        }
		    }
		},{
            text: '设为终点',
            callback: function (e) {
                epoint_ = e;
                if (epoint) {
                    map.removeOverlay(epoint);
                }
               

                epoint = new BMap.Marker(e, { icon: eIcon });  // 创建标注
                    //spoint = new BMap.Marker(e);
                epoint.setOffset(new BMap.Size(0, -32));
                map.addOverlay(epoint);
                    //$("#end").val(e.lng + "," + e.lat);
                if (spoint && epoint) {
                    driving.search(spoint, epoint, { waypoints: bpoint });
                }
            }
    }
    ];
    for (var i = 0; i < txtMenuItem.length; i++) {
        menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
    }
    map.addContextMenu(menu);


    // 搜索定位
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{
		    "input": "keyword",
		    "location": map
		});
    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        $("#searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        $("#searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });
    function setPlace() {
        if(searchpoint)
            map.removeOverlay(searchpoint);    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            searchpoint = new BMap.Marker(pp);
            map.addOverlay(searchpoint);    //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }
    getproject();
    gettasklist();
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
// 删除数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

