var map2 = new L.Map("map2", {
    crs: L.CRS.EPSG3857,
    continuousWorld: true,
    worldCopyJump: false,
    minZoom: 10,
    maxZoom: 24
  });
  var url = "https://wmts.geo.bs.ch/wmts/1.0.0/BaseMap_farbig/default/3857/{z}/{y}/{x}.png";
  var tilelayer = new L.tileLayer(url, {
    attribution:
      '<a href="https://www.geo.bs.ch/">Geoportal Kanton Basel-Stadt</a>',
    maxZoom: 24
  });
  map2.addLayer(tilelayer);
  map2.setView(L.latLng(47.55856, 7.59142), 11);

 