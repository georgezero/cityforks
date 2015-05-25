Template.home.rendered = function() {
    Tracker.autorun(function() {
        if (Session.get('location')) {
            latitude = Session.get('location').coords.latitude;
            longitude = Session.get('location').coords.longitude;
            
            
            // create map using leaflet and openstreetmap
            
            var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
            var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 25, attribution: osmAttrib});    
            
            var map = L.map('map').setView([latitude,longitude], 15);
            map.addLayer(osm);
            
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
                .openPopup();
                
            bounds = map.getBounds();
            if (bounds) {
              Session.set('bottomLeft', [bounds._southWest.lng, bounds._southWest.lat]);
              Session.set('topRight', [bounds._northEast.lng, bounds._northEast.lat]);
            }
            
            if (Template.instance().data) {
              Template.instance().data.forEach(function(place) {
                L.marker([place.geometry.location.lat, place.geometry.location.lng]).addTo(map)
                  .bindPopup("<strong>" + place.name + "</strong><br />" + place.vicinity);
              });
            }
            
            map.on('moveend', function(event) {
              bounds = event.target.getBounds()
              Session.set('bottomLeft', [bounds._southWest.lng, bounds._southWest.lat]);
              Session.set('topRight', [bounds._northEast.lng, bounds._northEast.lat]);
              coords = {latitude: event.target.getCenter().lat, longitude: event.target.getCenter().lng}
              Session.set('location', {coords: coords})
              Meteor.call('fetchNearbyLocations', coords)
            });
        } 
    });
}