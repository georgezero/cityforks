Places = new Mongo.Collection('places');

Meteor.methods({
  'fetchNearbyLocations': function(coords) {
    if (Meteor.isServer) {
      results = HTTP.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + coords.latitude + "," + coords.longitude + "&radius=500&types=food&key=AIzaSyBQjvi1L9erhHp0wwprgDw1hWnarWl3jaA")
      console.log(results)
      _(results.data.results).each(function(loc) {
        _.extend(loc, {loc: {type: "Point", coordinates: [loc.geometry.location.lng, loc.geometry.location.lat]}})
        Places.upsert({id: loc.id}, {$set: loc})
      });
    }
  }
});
// 40.708361,-74.0067334
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.708361,-74.0067334&radius=500&types=food&key=AIzaSyBQjvi1L9erhHp0wwprgDw1hWnarWl3jaA