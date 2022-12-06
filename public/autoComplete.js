let autocomplete;
function initAutoComplete(){
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('address'),
        {
            types: ["address"],
            componentRestrictions: { country: "us" },
            fields: ["place_id", "geometry", "name"]
        });
    autocomplete.addListener('place_changed',onPlaceChanged);
}

function onPlaceChanged(){
    var place = autocomplete.getPlace();
    document.getElementById('address').innerHTML = place.name;
}