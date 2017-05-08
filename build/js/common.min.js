$(document).ready(function () {
    // контейнер с комментариями
    var connentBox = document.querySelector(".comments");
    var startContentComments = connentBox.innerHTML;

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
            html += `<div class="comm_header">`;
            html += `<p class="user_name">${i.name}</p>`;
            html += setRateStars(i.rate);
            html += `</div>`;
            html += `<p class="user_post">${i.post}</p>`;
            html += `<div class="data_post">${dateToPost}</div>`;
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
    var startContentComments = connentBox.innerHTML;
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
    
    var currentPost = {};
    $("#form").on("submit", function(e){
        e.preventDefault();
        console.dir($(this)[0]);
        currentPost.name = $(this)[0][0].value;
        currentPost.email = $(this)[0][1].value;
        currentPost.rate = $(this)[0][2].value;
        currentPost.post = $(this)[0][3].value;
        currentPost.dateMS = Date.now();
        
        arrComments.push(currentPost);
        localStorage.setItem("comments", JSON.stringify(arrComments));
        makeComments();
        makePreloaderBox();
        $.magnificPopup.close();
    });
    
    
    
    
    
    // navBAR
    var counter = 1;
    
    (function navBar(){
        $(".menu_bar").on("click", function(){
//           $("nav").toggle(); 
            if (counter === 1) {
                $("header ul").animate({
                    left: "0",
                    
                }, 300);
                $(".menu_bar a").css("color", "#4DD7C8");
                counter =0;
            } else {
                counter = 1;
                $("header ul").animate({
                    left: "-100%"
                }, 300);
                $(".menu_bar a").css("color", "");
            }
        });
    })();
    
    
    //Header
    
    var headerEl = document.querySelector(".header");
    
    var computedStyleHeader = getComputedStyle(headerEl);
    
    function setPaddingTonderHeader() {
        document.querySelector(".wrap_full_width_anderHeader").style.marginTop = computedStyleHeader.height;
    }
    setPaddingTonderHeader();
    $(window).on("scroll", function(){
        console.log("dsdsds");
        if($(this).scrollTop() > 20) {
            $(".header .container").css("padding", "5px");
//            $(".header").css("position", "fixed");
//            setPaddingTonderHeader()
        } else {
            $(".header .container").css("padding", "");
//            $(".header").css("position", "");
//            setPaddingTonderHeader()
        }
    });
    

    window.addEventListener('resize', function(event){
        $("header ul").animate({
            left: "-100%"
        });
        counter = 1;
        $(".menu_bar a").css("color", "");
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