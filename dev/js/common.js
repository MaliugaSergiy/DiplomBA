import Parallax from './parallax-js';

$(document).ready(function () {
	var scene = $('#scene').get(0);
	var parallax = new Parallax(scene);
    // контейнер с комментариями
    let connentBox = document.querySelector(".comments"),
		startContentComments = connentBox.innerHTML;

    // считываем JSON
    var comments = new XMLHttpRequest();
    comments.addEventListener("readystatechange", function(){
        if (this.readyState == 4 && this.status == 200) {
            if (localStorage.getItem("comments") !== undefined) {
                localStorage.setItem("comments", this.responseText);
            }
        }
    });
    comments.open('GET', 'comments.json', true);
    comments.send();
//    var arrComments = JSON.parse(comments.responseText);
    
    var arrComments = JSON.parse(localStorage.getItem("comments"));
    
    //console.log(arrComments);

    // отображение названия месяцев

    var months = new XMLHttpRequest();
    months.open('GET', 'dates.json', false);
    months.send();
    var arrDates = JSON.parse(months.responseText);
    
    // сортировка комментариев
    var configSelect = {
        down: function (data1, data2) {
            return data1.rate - data2.rate;
        },
        up: function (data1, data2) {
            return data2.rate - data1.rate;
        },
        new1: function (data1, data2) {
            return data2.dateMS - data1.dateMS;
        },
        old: function (data1, data2) {
            return data1.dateMS - data2.dateMS;
        },
        short: function (data1, data2) {
            return data1.post.length - data2.post.length;
        },
        long: function (data1, data2) {
            return data2.post.length - data1.post.length;
        }
    };

    arrComments.sort(configSelect[$("#select_comments").val()]); // параметр сортировки при загрузке страницы, берет значение у select

    // формируем комментарии
    var totalRate,
        averageRate = 0;

    function makeComments() {
        totalRate = 0;
        arrComments.forEach((i) => {
            totalRate += +i.rate;
            let html = "";
            let date = new Date(i.dateMS);
            //    console.dir(date.getTime()); 
            let language = "ru";
            let month = arrDates[language][date.getMonth()].toLowerCase();
            let dateToPost = `${date.getDate()} ${month} ${date.getFullYear()} `;
            html += `<div class="comment comments_item">`;
            
            html += `<div class="comment_content">`;
            html += `<span class="closeModal">&times;</span>`;
            html += `<div class="comm_header">`;
            html += `<p class="user_name">${i.name}</p>`;
            html += setRateStars(i.rate);
            html += `</div>`;
            html += `<p class="user_post">${i.post}</p>`;
            html += `<div class="data_post">${dateToPost}</div>`;
            html += `</div>`;
            html += `</div>`;
            connentBox.insertAdjacentHTML("beforeEnd", html);
        });
    }
    makeComments();
    
    //console.log(arrComments.length);  //кол-во постов
    //console.log(totalRate); // сумма всех оценок
    //console.log(Math.round(averageRate)); // округленная величина оценки
    //console.log((averageRate.toFixed(1))); // средняя величина оценки, которая выводится на страницу

    var arrStars = [0, 0, 0, 0, 0]; // массив с кол-вом каждой оценки(1-5)

    var starQ = arrComments.map(function (n) { // массив всех рейтенгов всех постов
        return n.rate;
    });
    starQ.forEach(function (item) {
        arrStars[item - 1]++;
    });

    console.log(starQ);
    console.log(arrStars);

    // формируем блок с графиками
    var rateBox = document.querySelector(".rate");

    function makePreloaderBox() {
        averageRate = totalRate / arrComments.length; // средняя величина оценки
        let html = "";
        html += `<div class="comments_header">`;
        html += `<span class="votes_num">${averageRate.toFixed(1)}</span>`;
        //    html += `<div class="user_rate">`;
        html += setRateStars(Math.round(averageRate));
        //    html += `</div>`;
        html += `<div class="votesAmount">(${arrComments.length})</div>`;
        html += `</div>`;
        html += `<div class="stars_container">`;
        for (let i = 0; i < 5; i++) {
            let Star = (i == 0) ? "star" : "stars";
            html += `<div class="preloader_item">`;
            html += `<div class="before_preloader">${i+1} ${Star}</div>`;
            let persent = (100 * arrStars[i] / arrComments.length).toFixed(1);
            let bg_gradient = `style='background: linear-gradient(90deg, #d0b430 0%, #ECC81A ${persent}%, #DBE2E8 ${persent}%, #DBE2E8 100%)'`;
            html += `<div class="rate_preloader" ${bg_gradient}>`;
            html += ` <div class="amount_rate">${arrStars[i]}</div>`;
            html += `</div>`;

            html += ` <div class="after_preloader">${persent}%</div>`;
            html += `</div>`;
        }
        html += `</div>`;

        rateBox.innerHTML = html;

        var div = document.createElement('div');
        div.innerHTML = html;
        //    console.log(div.innerHTML);

    }
    makePreloaderBox();
    connentBox.innerHTML = `<div class="rate comments_item"> ${rateBox.innerHTML} </div>`;
    startContentComments = connentBox.innerHTML;
    makeComments();

    $("#select_comments").on("change", sortMeker); // событие на select

    function sortMeker(e) {
        arrComments.sort(configSelect[e.target.value]);
        connentBox.innerHTML = startContentComments;
        makeComments();
    };

    // формируем отображение звездочек рейтинга

    function setRateStars(n) {
        let html = "<div class='user_rate'>";
        let starNA = "startest";
        let starA = "startest startest-active";
        for (let i = 0; i < 5 - n; i++) {
            html += `<div class="${starNA}"></div>`;
        }
        for (let i = 0; i < n; i++) {
            html += `<div class="${starA}"></div>`;
        }
        html += "</div>";
        return html;
    }
    
    
    $(".popup").magnificPopup({
        removalDelay: 300,
        mainClass: 'mfp-fade',
        closeOnBgClick: false
    });
    
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    var currentPost = {};
    $("#form").on("submit", function(e){
        e.preventDefault();
        currentPost.name = this.elements.name.value;
        currentPost.email = this.elements.email.value;
        currentPost.rate = this.elements.rate.value;
        currentPost.post = this.elements.post.value;
        currentPost.dateMS = Date.now();
        
        if (validateEmail(currentPost.email)) {
            arrComments.push(currentPost);
            localStorage.setItem("comments", JSON.stringify(arrComments));
            makeComments();
            makePreloaderBox();
            
            var http = new XMLHttpRequest();
            var url = "process_form.json";
            console/defin
//            var url = form.attr("action");
            
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    alert(http.responseText);
                }
            };
            
            
            console.log(JSON.stringify(currentPost));
            http.send(JSON.stringify(currentPost));
            
            
            $.magnificPopup.close();            
        } else {
            alert("not valid Email");
        }
        
        
    });
    
    
    
    
    
    // navBAR
    var counter = 1;
    var overlayBody = $("<div class='overlayBody'></div>");
    (function navBar(){
        $(".menu_bar").on("click", function(e){
            e.preventDefault();
//           $("nav").toggle(); 
            if (counter === 1) {
                $("header ul").animate({
                    left: "0",
                }, 300);
                $(".menu_bar a").css("color", "#4DD7C8");
                
                $("body").append(overlayBody);
                setTimeout(function(){
                    $(".overlayBody").css("backgroundColor", "rgba(13,39,59,.85)");
                });
                $("body").css("overflow", "hidden");
                
                counter =0;
            } else {
                counter = 1;
                
                $("body").css("overflow", "auto");
                $("header ul").animate({
                    left: "-100%"
                }, 300);
                $(".menu_bar a").css("color", "");
                $(".overlayBody").css("backgroundColor", "");
                setTimeout(function(){
                    $(".overlayBody").remove();
                }, 300)
            }
        });
    })();
    
    window.addEventListener("resize", function() {
    
        if (window.innerWidth > 690) {
            counter = 1;
            $("header ul").css("left", "");
            $(".menu_bar a").css("color", "");
            $("body").css("overflow", "auto");
            $(".overlayBody").remove();
        }
        
    });
    
    $("header ul a").on("click", function(){
        if (window.innerWidth < 690) {
            counter = 1;
            $("header ul").animate({
                left: "-100%"
            }, 300);
            $(".menu_bar a").css("color", "");
            $(".overlayBody").css("backgroundColor", "");
            setTimeout(function(){
                $(".overlayBody").remove();
            }, 300);
            
        }
    })
    
    
    
    //Header
    
    var headerEl = document.querySelector(".header");
    
    var computedStyleHeader = getComputedStyle(headerEl);
    
//    function setPaddingTonderHeader() {
//        document.querySelector(".wrap_full_width_anderHeader").style.marginTop = computedStyleHeader.height;
//    }
//    setPaddingTonderHeader();
    $(window).on("scroll", function(){
        if($(this).scrollTop() > 77) {
            
            $(".header .container").css("padding", "5px");
            $(".header").css("background", "white");
//            $(".header").css("position", "fixed");
//            setPaddingTonderHeader()
        } else {
            $(".header .container").css("padding", "");
            $(".header").css("background", "");
//            $(".header").css("position", "");
//            setPaddingTonderHeader()
        }
    });
    

//    window.addEventListener('resize', function(event){
//        $("header ul").animate({
//            left: "-100%"
//        });
//        counter = 1;
//        $(".menu_bar a").css("color", "");
//    });
    
    // Accordeon
    $('.accordeon_content').hide();

    $('.accordeon_title').click(function(){
        console.dir($(this).offset().top);
        $(this).parent().toggleClass('active').siblings().removeClass('active');
        $('.accordeon_content').slideUp();

        if(!$(this).next().is(":visible")) {
            $(this).next().slideDown();
        }
    });
    
    //---------------------
    
    //related course
    
    var modalContent = $(".modalCourse");
    var closeModal = $(".closeModal");

    
    modalContent.on("click", function(e){

        if (e.target.tagName != "SPAN") {
            $("body").css("overflow","hidden");
            $(this).addClass("modalActive");
        } else{
            $("body").css("overflow","auto");
            $(this).removeClass("modalActive");
        }
        
//        $(this).toggleClass("modalActive");
        
        
    });
    
    
    // href inner links
    
    $(".rec_courses:before").on('click', function(){
        console.log("dsdsda");
    });
    
    $('a[data-target^="anchor"], [data-target^="anchor"] ').on("click.smoothscroll", function(){
        var target = $(this).attr("href"),
            bl_top = $(target).offset().top - 70;
        $('body, html').animate({scrollTop: bl_top}, 700);
        return false;
    });
    
    // button arrow to UP
    
    $("body").append("<button class='btn_up'/>");
    
    $(window).scroll(function(){
        var windscroll = $(window).scrollTop();
        if ($(window).scrollTop() > 50) {
            $(".btn_up").addClass("activeB");
        }
        else {
            $(".btn_up").removeClass("activeB");
        }
        
        
        
    });
    
    $(".btn_up").on("click", function(e){
        e.preventDefault();
        $(this).removeClass("activeB");
       $("body").animate({'scrollTop': 0}, 800); 
       $("html").animate({'scrollTop': 0}, 800); 
        
    });
    
    console.log("Helloddsd");
    
    
    //  anchor navigation
    
    $('.nav a').click(function(e) {

        $('.nav a.activeNavLink').removeClass('activeNavLink');
        $(this).addClass('activeNavLink');

        // Scroll to anchor

//        $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top - 70},'slow');
//
//        e.preventDefault();
//        return false;

    });

    // On scroll, remove class on active element and add it to the new one

    $(document).scroll(function() {

//        var position = Math.floor($(this).scrollTop() / 800) + 1;
//        console.log(position);
//        console.log($(this).scrollTop());
        
        
//        console.log($("[data-pos]"));
 
        navigationAnchors(1);
        navigationAnchors(2);
        navigationAnchors(3);
        navigationAnchors(4);
        navigationAnchors(5);
        
        function navigationAnchors(n) {
            if (($(`[data-pos='pos-${n}']`).offset().top - $(window).scrollTop()) - 300 < 0) {
                if (!$(`[data-pos='pos-${n}']`).next().offset().top - $(window).scrollTop() - 300 < 0 ) 
                {
                    $(`.nav a.link-${n}`).parent().siblings().children().removeClass('activeNavLink');
//                    console.dir($(`.nav a.link-${n}`).parent().siblings());
                    $(`.nav a.link-${n}`).addClass('activeNavLink');
                } else {
                    $(`.nav a.link-${n}`).removeClass('activeNavLink');
                }
            } else {
                $(`.nav a.link-${n}`).removeClass('activeNavLink');
            }
        }
        
        
        
        
//        var pos2;
//        if (($("[data-pos]").offset().top - $(window).scrollTop()) - 73 < 0) {
//            pos2 = $("[data-pos]").attr("data-pos").split("-")[1];
//            console.log(pos2);
//            if (!$("[data-pos]").next().offset().top - $(window).scrollTop() - 73 < 0 ) 
//            {
//                console.dir($("[data-pos]").next().offset().top - $(window).scrollTop() - 73);
//                $('.nav a.link-' + pos2).addClass('activeNavLink');
//            } else {
//                $('.nav a.link-' + pos2).removeClass('activeNavLink');
//            }
//            
//            
//        } else {
//            pos2 = $("[data-pos]").attr("data-pos").split("-")[1];
//            $('.nav a.link-' + pos2).removeClass('activeNavLink');
//        }
        
        
        
        

//        $('.nav a.activeNavLink').removeClass('activeNavLink');
//        $('.nav a.link-' + position).addClass('activeNavLink');

    });
    
    // footer
    
    $(window).on("scroll", function(){
        var footer = document.getElementById("footer"),
            footerPosition = footer.offsetTop;
        console.log(footer.offsetTop);
//        console.log(window.scrollY);
    });

    
});


// 


//var jsonDate = (new Date()).toJSON();
//var backToDate = new Date(jsonDate);
//
//console.log( jsonDate);
//console.log( backToDate);

//var time = new Date().getTime();
//var date = new Date(time);
//
//console.log(new Date(1430221424400))
//console.log(new Date("2015-04-28T11:43:44.400Z"))

//добавление активкласса линку в главной навигаци при скроле
//if ($("#client_comments").offset().top-100 < windscroll ) {
//    $('#nav4').addClass("activeNavLink");
//    $('#nav4').parent().siblings().children()[0].removeClass("activeNavLink");
//    console.log();
//}
//else {
//    $('#nav4').removeClass("activeNavLink");
//}
//
//if ($("#about_course").offset().top-100 < windscroll ) {
//    $('#nav2').addClass("activeNavLink");
//    $('#nav2').parent().siblings().children()[0].removeClass("activeNavLink");
//    console.log();
//}
//else {
//    $('#nav2').removeClass("activeNavLink");
//}
//
//if ($("#related_course").offset().top-100 < windscroll ) {
//    $('#nav3').addClass("activeNavLink");
//    $('#nav3').parent().siblings().children()[0].removeClass("activeNavLink");
//    console.log();
//}
//else {
//    $('#nav3').removeClass("activeNavLink");
//}
//
//if ($("#anderHeader").offset().top-100 < windscroll ) {
//    $('#nav1').addClass("activeNavLink");
//    $('#nav1').parent().siblings().children()[0].removeClass("activeNavLink");
//    console.log();
//}
//else {
//    $('#nav1').removeClass("activeNavLink");
//}