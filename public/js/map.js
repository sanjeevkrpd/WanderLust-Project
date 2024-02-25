mapboxgl.accessToken = mapToken;



const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: data.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(data.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${data.location }</h4>`))
    .addTo(map);
