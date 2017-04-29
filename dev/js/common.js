// контейнер с комментариями
var connentBox = document.querySelector(".comments");
var startContentComments = connentBox.innerHTML;

// считываем JSON
var comments = new XMLHttpRequest();
comments.open('GET', 'comments.json', false);
comments.send();
var arrComments = JSON.parse(comments.responseText);
console.log(arrComments);

// отображение названия месяцев
var months = new XMLHttpRequest();
months.open('GET', 'dates.json', false);
months.send();
var arrDates = JSON.parse(months.responseText);

// сортировка комментариев
var configSelect = {
    down: function (data1, data2) {return data1.rate - data2.rate;},
    up: function (data1, data2) {return data2.rate - data1.rate;},
    new1: function (data1, data2) {return data2.dateMS - data1.dateMS;},
    old: function (data1, data2) {return data1.dateMS - data2.dateMS;},
    short: function (data1, data2) {return data1.post.length - data2.post.length;},
    long: function (data1, data2) {return data2.post.length - data1.post.length;}
};
console.log($("#select_comments").val());
console.log($("#select_comments").val());

arrComments.sort(configSelect[$("#select_comments").val()]);  // параметр сортировки при загрузке страницы, берет значение у select

$("#select_comments").on("change", sortMeker);  // событие на select

function sortMeker(e){
    arrComments.sort(configSelect[e.target.value]);
    connentBox.innerHTML = startContentComments;
    makeComments();
};

// формируем комментарии
var totalRate = 0,
    averageRate = 0;
function makeComments() {
    arrComments.forEach((i)=>{
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
makeComments() ;
averageRate = totalRate / arrComments.length;
console.log(arrComments.length);
console.log(totalRate);
console.log(averageRate);

// формируем отображение звездочек рейтинга
function setRateStars(n){
    let html = "<div class='user_rate'>";
    let starNA ="startest";
    let starA ="startest startest-active";
    for (let i = 0; i < 5-n; i++){
        html += `<div class="${starNA}"></div>`;
    }
    for (let i = 0; i < n; i++){
        html += `<div class="${starA}"></div>`;
    }
    html += "</div>";
    return html;
}

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






