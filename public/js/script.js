console.log("Script working...");

const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const {latitude, longitude} = position.coords;
            socket.emit("send-location", {latitude, longitude});
        }, (err) => {
            console.error(err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

const map = L.map("map").setView([23.5, 86], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const marker = {};

socket.on("receive-location", (data) => {
    console.log(data);
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 16);
    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude], {draggable: true, title: "You're here"}).addTo(map);
    }
    console.log(marker);
});

socket.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});

