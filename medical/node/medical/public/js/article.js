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

//评论功能
$("#tijiao").on('click', function() {
    getTime = function() {
        var t = new Date();
        var y = t.getFullYear();
        var m = t.getMonth() + 1;
        var d = t.getDate();
        var h = t.getHours();
        var mi = t.getMinutes();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        h = h < 10 ? "0" + h : h;
        mi = mi < 10 ? "0" + mi : mi;
        return y + "-" + m + "-" + d + " " + h + ":" + mi;
    };

    var txt = document.getElementById("comment");
    var commentsArea = document.getElementById("comments-area")

    var div = document.createElement("div");
    div.className = "comment-list";
    var html = '<div class="single-comment justify-content-between d-flex">' +
        '<div class="user justify-content-between d-flex">' +
        '<div class="thumb"><img src="img/comment/头像.png" alt=""></div>' +
        '<div class="desc">' +
        '<p class="comment">' + txt.value + '</p>' +
        '<div class="d-flex justify-content-between">' +
        '<div class="d-flex align-items-center"><h5>热心的市民</h5><p class="date">' + getTime() + '</p></div>' +
        '</div></div></div></div>';
    div.innerHTML = html;
    commentsArea.appendChild(div);
    txt.value = "";
    txt.placeholder = "评论...";
    txt.parentNode.className = "form-group";
})