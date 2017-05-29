
function initMap() {

    var styleMap = "";
    var styleMapReq = new XMLHttpRequest();
    styleMapReq.addEventListener("readystatechange", function(){
        if (this.readyState == 4 && this.status == 200) {
            styleMap = JSON.parse(this.responseText);
            mapDraw();
        }
    });
    styleMapReq.open('GET', 'styleMap.json', true);
    styleMapReq.send();

    function mapDraw() {
        var mainAcadLatLng = {lat: 50.400322, lng: 30.523800};
        //    var mainAcadLatLng = {lat: 50.400322, lng: 30.520159};

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            disableDefaultUI: true,
            center: mainAcadLatLng,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            //        draggable: false,
            styles: styleMap
        });

        var imageMA = {
            url: 'img/Arrow_yellow.png',
            size: new google.maps.Size(68, 135),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 66),
            scaledSize: new google.maps.Size(34, 66)
        };
        //    var imageMA = {
        //        path: google.maps.SymbolPath.CIRCLE,
        //        scale: 1
        //    };
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
        };


        var mainAcademyCoordinate = {lat: 50.400322, lng: 30.520159};
        var markerMainAcademy = new google.maps.Marker({
            position: mainAcademyCoordinate,
            map: map,
            icon: imageMA,
            draggable:false,
            //        shape: shape,
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
            //        if (window.innerWidth < 690) {
            //            mainAcadLatLng = mainAcademyCoordinate;
            //            console.log(window.innerWidth);
            //        }

            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");

            if (window.innerWidth < 690) {
                map.setCenter(mainAcademyCoordinate);
            }else {
                map.setCenter(mainAcadLatLng);
            }

        }); 
    }
    
    

    
}



//window.addEventListener("resize", initMap);


