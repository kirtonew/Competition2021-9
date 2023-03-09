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

// 读取文本
function getResultByText() {
    var res = null;
    var form = document.getElementById('form');
    var formData = new FormData(form);
    //获取疾病类型
    formData.append("category", $(".dept_thumb").attr("id"));
    $.ajax({
        url: "/text",
        type: "post",
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        cache: false,
        success: function(response) {
            res = response;
            // console.log(response);
        },
        error: function(xhr) {
            console.log(xhr);
        },
    });
    return res;
}

$("#submit").on("click", function() {
    var res = getResultByText();
    var fileName = { name: res[res.length - 1] }; //疾病类型

    var text = null;
    $.ajaxSettings.async = false; //关闭异步
    if (res[res.length - 1] == 'xzb' || res[res.length - 1] == 'gk') {
        //文本预测结果
        $.get("/KNN", fileName, function(response) {
            text = response;
            // console.log(text);
        });
    } else {
        //文本预测结果
        $.get("/Kmeans", fileName, function(response) {
            text = response;
            // console.log(text);
        });
    }

    $.ajaxSettings.async = true; //开启异步
    // console.log(text);

    var delivery = null;
    //分割结果字符串 前者为预测结果 后者为预测准确率
    result = $.trim(text).split("&")[0]; //trim方法能过滤字符串首尾的空格
    acc = $.trim(text).split("&")[1];
    switch (result) {
        //心脏病
        case "xzb预测结果为：患病":
            delivery = "您被确诊为心脏病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "xzb预测结果为：正常":
            delivery = "您没有被确诊为心脏病患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //糖尿病
        case "tnb预测结果为：患病":
            delivery = "您被确诊为糖尿病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "tnb预测结果为：正常":
            delivery = "您没有被确诊为糖尿病患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //骨科疾病
        case "gk预测结果为：异常":
            delivery = "您被确诊为骨科疾病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "gk预测结果为：正常":
            delivery = "您没有被确诊为骨科疾病患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;

            //心血管疾病
        case "xxg预测结果为：异常":
            delivery = "您被确诊为心血管疾病患者(正确率为" + acc + ")，请尽快前往医院进行治疗。也可以通过在线医生诊断进行进一步确诊。";
            break;
        case "xxg预测结果为：正常":
            delivery = "您没有被确诊为心血管疾病患者(正确率为" + acc + ")。可以通过在线医生诊断进行进一步确诊。";
            break;
        default:
            delivery = "结果出错了，请再次尝试。";
    }
    // console.log(delivery);

    var name = document.getElementById("N").value;
    var age = document.getElementById("A").value;
    var email = document.getElementById("E").value;
    var phone = document.getElementById("P").value;
    var sex = document.getElementById("S").value;
    window.location.href = "result_TXT.html?delivery=" + encodeURI(delivery.replace(/%/g, '%25')) +
        "&name=" + encodeURI(name) +
        "&age=" + encodeURI(age) +
        "&email=" + encodeURI(email) +
        "&phone=" + encodeURI(phone) +
        "&sex=" + encodeURI(sex) +
        "&category=" + encodeURI(fileName.name); //防止出现中文乱码
});