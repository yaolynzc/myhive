
var Login = function () {
    
    return {
        // 初始化
        init: function () {
           
            //var info = getclientInfo();
           $('.login-form').validate({
	            errorElement: 'label', //默认输入错误信息显示容器
	            errorClass: 'help-inline', // 默认输入错误显示样式
	            focusInvalid: false, // 焦点定位在最后的输入位置
	            rules: {
	                username: {
	                    required: true,
	                    charnum: true
	                },
	                password: {
	                    required: true,
	                    minlength: 8
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "请输入用户名."
	                },
	                password: {
	                    required: "请输入密码.",
	                    minlength: "请输入至少8位字符的密码."
	                }
	            },

	            invalidHandler: function (event, validator) { // 提交时显示错误信息   
	                //$('.alert-error', $('.login-form')).show();
	                //console.log($('#username').val());
	                //alert($('#password').val());
	                if ($('#username').val() == '' && $('#password').val() == '') {
	                    if ($('#alertclick').val() == '0') {
	                        $('.alert-error').show();
	                    } else {
	                        $('.alert-error').hide();
	                        $('#alertclick').val('0');
	                    }
	                }
	            },

	            highlight: function (element) { // 高亮显示错误输入框
	                $(element).closest('.control-group').addClass('error'); // 设置输入错误样式
	            },

	            success: function (label) { // 输入正确移除错误样式
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	                $('.alert-error').css('display', 'none');
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) { // 提交表单信息
	                var uid = $("#username").val();
	                var pwd = $("#password").val();
	                var isrem = $("#rember").is(":checked");
	                var obj = {
	                    "RequestMethod": "lg",
	                    "uid": uid,
	                    "pwd": pwd
	                };
	                $.getJSON("ajax/user.aspx?rad=" + Math.floor(Math.random() * (1000 + 1)), obj, function (response) {
	                    if (!response.isSuccess) {
	                        //alert(response.info);
	                        layer.msg(response.info, { icon: 2, time: 1000 });
	                    } else {
	                        $.cookie(config_cookie.UID, response.user.ID, { expires: 7, path: '/' });
	                        //var ckk = $.cookie(config_cookie.UID);
	                        if (isrem) {
	                            //$.cookie(config_cookie.UID, response.user.ID, { expires: 1, path: '/' });
	                            $.cookie(config_cookie.PWD, pwd, { expires: 7, path: '/' });
	                        }
	                        else {
	                            //$.cookie(config_cookie.UID, null);
	                            $.cookie(config_cookie.PWD, pwd);
	                        }
	                        window.location.href = "main.html";
	                    }
	                });
	                //window.location.href = "index.html";
	            }
	        });

	        $('.login-form input').keypress(function (e) { // 设置输入回车按键进行提交
	            if (e.which == 13) {
	                //if ($('.login-form').validate().form()) {
	                //    window.location.href = "index.html";
	                //}
	                //return false;
	                $('.login-form').validate();
	            }
	        });

	        $('.forget-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },

	            messages: {
	                email: {
	                    required: "请输入电子邮箱."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                window.location.href = "index.html";
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                //if ($('.forget-form').validate().form()) {
	                //    window.location.href = "index.html";
	                //}
	                //return false;
	                $('.forget-form').validate();
	            }
	        });

	        jQuery('#forget-password').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.forget-form').show();
	        });

	        jQuery('#back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.forget-form').hide();
	        });

	        $('.register-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                rpassword: {
	                    equalTo: "#register_password"
	                },
	                email: {
	                    required: true,
	                    email: true
	                },
	                tnc: {
	                    required: true
	                }
	            },

	            messages: { // custom messages for radio buttons and checkboxes
	                tnc: {
	                    required: "Please accept TNC first."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
	                    error.addClass('help-small no-left-padding').insertAfter($('#register_tnc_error'));
	                } else {
	                    error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	                }
	            },

	            submitHandler: function (form) {
	                window.location.href = "index.html";
	            }
	        });

	        jQuery('#register-btn').click(function () {
	            jQuery('.login-form').hide();
	            jQuery('.register-form').show();
	        });

	        jQuery('#register-back-btn').click(function () {
	            jQuery('.login-form').show();
	            jQuery('.register-form').hide();
	        });
        }

    };

}();

function getclientInfo() {
    var obj = {
        "ip": "",
        "system": "other",
        "browser":""
    }

    var brow = $.browser;

    if (brow.msie) { obj.browser = "MicrosoftInternetExplorer" + brow.version; }

    if (brow.mozilla) { obj.browser = "MozillaFirefox" + brow.version; }

    if (brow.safari) { obj.browser = "AppleSafari" + brow.version; }

    if (brow.opera) { obj.browser = "Opera" + brow.version; }

    if (brow.chrome) { obj.browser = "Chrome" + brow.version; }


    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) obj.system = "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) obj.system= "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) obj.system = "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) obj.system = "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) obj.system = "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) obj.system = "Win2003";
        var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) obj.system = "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) obj.system = "Win7";
        var isWin7 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if (isWin7) obj.system = "Win10";
    }

    return obj;

}