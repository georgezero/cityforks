Places = new Mongo.Collection('places');

Meteor.methods({
   'fetchNearbyLocations': function(coords) {
        if (Meteor.isServer) {
            request = HTTP.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + coords.latitude + "," + coords.longitude + "&radius=500&types=food&sensor=true&key=AIzaSyBQjvi1L9erhHp0wwprgDw1hWnarWl3jaA");
            _(request.data.results).each(function(place) {
                _.extend(place, {loc: {type: "Point", coordinates: [place.geometry.location.lng, place.geometry.location.lat]}});
                Places.upsert({googleId: place.id}, {$set: place}); 
            });
        }   
   } 
});

// 40.708361,-74.0067334
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.708361,-74.0067334&radius=500&types=food&key=AIzaSyBQjvi1L9erhHp0wwprgDw1hWnarWl3jaA