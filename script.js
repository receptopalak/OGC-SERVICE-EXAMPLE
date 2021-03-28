let map = L.map("map").setView([38.9477,34.5547],5);



let OpenStreetMap_Mapnik = L.tileLayer(
  "	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);


let wmsLayer = L.tileLayer
  .wms("http://localhost:8080/geoserver/turkey/wms", {
    layers: "turkey:geoilceler",
    version: "1.1.0",
    opacity: 0.5
  })
  .addTo(map);




