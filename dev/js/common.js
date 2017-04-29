// считываем JSON
var comments = new XMLHttpRequest();

comments.open('GET', 'comments.json', false);

comments.send();

var arrComments = JSON.parse(comments.responseText);

console.log(arrComments);
//-----------------------------==



var configSelect = {
    new: function (data1, data2) {return data2.date - data1.date;},
    old: function (data1, data2) {return data1.date - data2.date;},
    down: function (data1, data2) {return data1.rate - data2.rate;},
    up: function (data1, data2) {return data2.rate - data1.rate;}
};

arrComments.sort(configSelect.up);

$("#select_comments").on("change", ggg);

function ggg(e){
    arrComments.sort(configSelect.down);
    console.log(configSelect.down);
    connentBox.innerHTML = "";
    makeComments();
};
//ggg()
//-----------------------------==



// отображение названия месяцев

var months = new XMLHttpRequest();

months.open('GET', 'dates.json', false);

months.send();

var arrDates = JSON.parse(months.responseText);

// контейнерс комментариями
var connentBox = document.querySelector(".comments");

// формируем комментарии

function makeComments() {
    arrComments.forEach((i)=>{
        let html = "";
        let date = new Date(i.date);
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

// вормируем отображение звездочек рейтинга
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
//var jsonDate = (new Date()).toJSON();
//var backToDate = new Date(jsonDate);
//
//console.log( jsonDate);
//console.log( backToDate);






