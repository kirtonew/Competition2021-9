(function($) {
    "use strict";
    // TOP Menu Sticky
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll < 400) {
            $("#sticky-header").removeClass("sticky");
            $('#back-top').fadeIn(500);
        } else {
            $("#sticky-header").addClass("sticky");
            $('#back-top').fadeIn(500);
        }
    });


    $(document).ready(function() {

        // filter items on button click
        $('.portfolio-menu').on('click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });

        //for menu active class
        $('.portfolio-menu button').on('click', function(event) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            event.preventDefault();
        });

        // wow js
        new WOW().init();

        if (document.getElementById('default-select')) {
            $('select').niceSelect();
        }

    });




    // Search Toggle
    $("#search_input_box").hide();
    $("#search").on("click", function() {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
    $("#close_search").on("click", function() {
        $('#search_input_box').slideUp(500);
    });
    // Search Toggle
    $("#search_input_box").hide();
    $("#search_1").on("click", function() {
        $("#search_input_box").slideToggle();
        $("#search_input").focus();
    });
})(jQuery);

var delivery = getUrlQueryString('delivery');
var category = getUrlQueryString('category');
var fileName = getUrlQueryString('fileName');
// console.log(category);
// console.log(fileName);

function getUrlQueryString(names, urls) {
    urls = decodeURI(decodeURI(urls || window.location.href)); //防止出现中文乱码
    urls && urls.indexOf("?") > -1 ? urls = urls
        .substring(urls.indexOf("?") + 1) : "";
    var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)", "i");
    var r = urls ? urls.match(reg) : window.location.search.substr(1)
        .match(reg);
    if (r != null && r[2] != "")
        return unescape(r[2]);
    return null;
};

function getTableData() { //向表格中添加转化后的负数据库文件
    var res = null;
    var params = { category: category, name: fileName };
    $.ajaxSettings.async = false; //关闭异步
    $.get("/read", params, function(response) {
        res = response;
    });
    $.ajaxSettings.async = true; //开启异步

    var lines = res.split("\n") //对文件按行进行分割
    var rows = [];
    for (var i = 0; i < lines.length - 1; i++) {
        var col1 = lines[i].split(",")[0];
        var col2 = lines[i].split(",")[1];
        var col3 = lines[i].split(",")[2];
        var col4 = lines[i].split(",")[3];
        var col5 = lines[i].split(",")[4];
        var row = [col1, col2, col3, col4, col5];
        rows.push(row);
    }
    return rows;
}

window.onload = function() {
    var tbody = document.getElementById('tbody');
    var data = getTableData();
    for (var i = 0; i < data.length; i++) { //遍历data数据
        var trow = getEachRow(data[i]);
        tbody.appendChild(trow);
    }
}

function getEachRow(R) {
    var row = document.createElement('tr'); //创建行

    var col1 = document.createElement('td'); //创建第一列
    col1.setAttribute("class", "td1");
    col1.setAttribute("style", "width: 10%");
    col1.innerHTML = R[0]; //填充数据
    row.appendChild(col1); //加入行,下面类似

    var col2 = document.createElement('td'); //创建第二列
    col2.setAttribute("class", "td1");
    col2.setAttribute("style", "width: 10%");
    col2.innerHTML = R[1];
    row.appendChild(col2);

    var col3 = document.createElement('td'); //创建第三列
    col3.setAttribute("class", "td1");
    col3.setAttribute("style", "width: 10%");
    col3.innerHTML = R[2];
    row.appendChild(col3);

    var col4 = document.createElement('td'); //创建第四列
    col4.setAttribute("class", "td1");
    col4.setAttribute("style", "width: 10%");
    col4.innerHTML = R[3];
    row.appendChild(col4);

    var col5 = document.createElement('td'); //创建第五列
    col5.setAttribute("class", "td2")
    col5.setAttribute("style", "width: 60%;overflow-x: scroll");


    col5.innerHTML = R[4];
    row.appendChild(col5);

    return row; //返回tr数据
}

function getImg(category) {
    var imgUrl = "";
    switch (category) {
        case 'xgfy':
            imgUrl = "../ndbData/resultImage/xgfy-Local.jpg";
            break;
        case 'rxa':
            imgUrl = "../ndbData/resultImage/rxa-Local.jpg";
            break;
        case 'fy':
            imgUrl = "../ndbData/resultImage/fy-Local.jpg";
            break;
        case 'eye':
            imgUrl = "../ndbData/resultImage/eye-Local.jpg";
            break;
        case 'nj':
            imgUrl = "../ndbData/resultImage/nj-Local.jpg";
            break;
        default:
            imgUrl = "../ndbData/resultImage/xgfy-Local.jpg";
            break;
    }
    return imgUrl;
}

var text_area = document.getElementById("textarea");
text_area.value = "         智能诊断诊断系统反馈的结果显示，" + delivery;
document.getElementById("lossImg").style.backgroundImage = 'url(' + getImg(category) + ')';