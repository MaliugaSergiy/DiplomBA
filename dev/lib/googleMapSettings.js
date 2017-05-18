
function initMap() {

    var styleMap = "";
    var styleMapReq = new XMLHttpRequest();
    styleMapReq.addEventListener("readystatechange", function(){
        if (this.readyState == 4 && this.status == 200) {
            styleMap = JSON.parse(this.responseText);
        }
    });
    styleMapReq.open('GET', 'styleMap.json', false);
    styleMapReq.send();


    var mainAcadLatLng = {lat: 50.400322, lng: 30.522159};
    //    {lat: 50.400322, lng: 30.520159};
    
    

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mainAcadLatLng,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        //        draggable: false,
        styles: styleMap
    });



    var imageMA = {
        //        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//        url: 'https://maliugasergiy.github.io/DiplomBA/build/img/Arrow_Luxury_Down.png',
        url: 'img/Arrow_yellow.png',
        //         This marker is 20 pixels wide by 32 pixels high.
        //        size: new google.maps.Size(20, 32),
        size: new google.maps.Size(68, 135),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        //        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        //        anchor: new google.maps.Point(0, 32),
        anchor: new google.maps.Point(18, 18),
        scaledSize: new google.maps.Size(34, 66)
    };
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

 
    var mainAcademyCoordinate = {lat: 50.400322, lng: 30.520159};
    var markerMainAcademy = new google.maps.Marker({
        position: mainAcademyCoordinate,
        map: map,
        icon: imageMA,
        draggable:true,
        shape: shape,
        animation: google.maps.Animation.BOUNCE,
        title: "Main Academy"
    });

    var infowindow = new google.maps.InfoWindow({
        content: "Hello World!"
    });

    markerMainAcademy.addListener('click', function() {
        infowindow.open(map, markerMainAcademy);

    });
    
    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
    

    
}



//window.addEventListener("resize", initMap);


