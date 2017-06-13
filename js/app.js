var map;
var marker;
var infowindow;
var locations = [{  name: 'Stokes Grill and Bar',
    lat: 41.264331,
    lng: -96.12829,
    fourSquareVenueID: "4adca202f964a520212e21e3"
   
}, {
    name: 'Spezia',
    lat: 41.229737,
    lng: -96.023418,
    fourSquareVenueID: "4ad4f296f964a52035ff20e3"
}, {
    name: 'The Drover',
    lat: 33.893421,
    lng: 35.490153,
    fourSquareVenueID: "4ad4f296f964a520f4fe20e3"
}, {
    name: 'Blue Sushi Sake Grill',
    lat: 41.255865,
    lng: -95.932194,
    fourSquareVenueID: "4b29659bf964a520349e24e3"
}, {
    name: 'Salt 88',
    lat: 41.290495,
    lng: -96.115525,
    fourSquareVenueID: "5123b17fe4b04e6a14d65ad6"
}, 
{
    name:'Kitchen Table',
    lat:41.257275,
    lng:-95.935318,
    fourSquareVenueID:"51a8db50498e89db9a229b35"
},
{
       name:'Pitch Coal-Fire Pizzeria',
    lat:41.264788,
    lng:-95.992151,
    fourSquareVenueID:"4afa2a8cf964a520261722e3"
},
{
       name:'Shucks Fish House & Oyster Bar',
    lat:41.252275,
    lng:-95.941407,
    fourSquareVenueID:"4ae09a4ff964a520d78021e3"
},{
   name: 'kobe Resturant',
    lat: 41.259166,
    lng: -96.177691,
    fourSquareVenueID: "4ee3f47d490138df8cc8157f"
}];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 41.25825,
            lng: -96.010705
        },
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow({
        content: "<p>My Info Window Content</p>"
    });
    var viewModel = function() {
        var self = this;
        self.locations = ko.observableArray(locations);


        self.locations().forEach(function(location) {
            // create marker object for each location
            var marker = new google.maps.Marker({
                position: {
                    lat: location.lat,
                    lng: location.lng
                },
                map: map,
                    animation: google.maps.Animation.DROP,
                id: location.fourSquareVenueID,

            });
            // store reference to marker in marker property of location item
            location.marker = marker;
            //console.log(marker.id);
            // attach click event listener to marker
            marker.addListener('click', (function(marker) {
              return function(){
                console.log("click");
                  // calling the foursquare function
                foursquarerequest(marker);
              }
            })(marker));
        });

        self.locationClicked = function(location) {
            // when the list item is clicked
             google.maps.event.trigger(location.marker, 'click');
        }
        self.value = ko.observable('');//store the value of the search item
        self.search = ko.computed(function() {
            return ko.utils.arrayFilter(self.locations(), function(place) {
                console.log(place);
                var match = place.name.toLowerCase().indexOf(self.value().toLowerCase()) >= 0;//if a match is found set the corresponding marker to visible
                place.marker.setVisible(match);
                return match;
            });
        });
    }



    ko.applyBindings(new viewModel());
}
var foursquarerequest = function(marker) {
    var apiURL = 'https://api.foursquare.com/v2/venues/';
    var foursquareClientID = '0JEJSSCAVS0CTWH10EKY44YO1SW3TV0HB5CRJYZACCCCBY3P'
    var foursquareSecret = '2AC1SCHNC1P0LHCLXWZNKEDIHY1UZTDFGPQIINEHV4K41BCE';
    var foursquareVersion = '20170115';
    var venueFoursquareID = marker.id;
  //  console.log(venueFoursquareID);
    var foursquareURL = apiURL + venueFoursquareID + '?client_id=' + foursquareClientID + '&client_secret=' + foursquareSecret + '&v=' + foursquareVersion;

    /*async request for the FourSquare api data*/
    $.ajax({
        url: foursquareURL,
        success: function(data) {
            console.log(data);
            /*FourSquare api data is stored here*/
            var rating = data.response.venue.rating;
            var name = data.response.venue.name;
          
            /*The infowindow is udpdated with the FourSquare api data and the infowindow is opened immediately afterwards*/
            infowindow.setContent('<div class="info">'+"Resturant name:"+ name +'</div>' + '<div class="rating">' +" FourSquare Rating: " + rating.toString()+'</div>' );
            infowindow.open(map, marker);
             toggleBounce(marker);
        },
        /*Foursquare api error handling*/
        error: function(error) {
            alert("Error, Four Square api data could not display")
        }
    });
}

function toggleBounce(marker) {
   marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null)
    }, 1700);
}



function googleError() {
    window.alert(" please try again");
}