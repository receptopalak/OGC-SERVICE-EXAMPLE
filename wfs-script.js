var a =[];
var iller =[];
var asisayisi = [];
var features_covid = []
$.getJSON( "http://localhost:8080/geoserver/turkey/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=turkey%3Aillere_gore_asi_sayisi&outputFormat=application%2Fjson", function(data){

        var b = data;
        console.log(b);
        a.push(data)

        for (i=0;i<b.features.length;i++) {

        console.log(b.features[i].properties.il)
        console.log(b.features[i].properties.asisayisi)
        asisayisi.push(b.features[i].properties.asisayisi);

    }

    var map3 = L.map('map3').setView([38.9477,34.5547],6);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map3);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map3) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>İl Bazında Aşılanma Sayısı</h4>' +  (props ?
        '<b>' + props.il + '</b><br />' + props.asi_sayisi.toLocaleString('tr','TR') + ' Kişi Aşılanmıştır.'
        : 'Lütfen Aşılanma Sayısını Öğrenmek İstediğiniz Şehrin Üzerine Geliniz.');
};

info.addTo(map3);


// get color depending on population density value
function getColor(d) {
    return d > 1000000 ? '#800026' :
            d > 500000  ? '#BD0026' :
            d > 200000  ? '#E31A1C' :
            d > 100000  ? '#FC4E2A' :
            d > 50000   ? '#FD8D3C' :
            d > 20000   ? '#FEB24C' :
            d > 10000   ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.asi_sayisi)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map3.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    
           layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map3);

map3.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map3) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10000, 20000, 50000, 100000, 200000, 500000, 1000000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map3);

var features_il = []
var features_asi = []




    for (i=0;i<b.features.length;i++) {

        console.log(b.features[i].properties.il)
        console.log(b.features[i].properties.asisayisi)
        asisayisi.push(b.features[i].properties.asisayisi);
    
        var obj = new Object();
        obj.il = b.features[i].properties.il;
        obj.asi  = b.features[i].properties.asi_sayisi;
        obj.nufus = b.features[i].properties.nufus;
        var jsonString= JSON.stringify(obj);
        features_covid.push(obj);  
    }



console.log(features_covid);



// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

 // Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
chart.data = features_covid;

// Create axes
var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "il";
categoryAxis.numberFormatter.numberFormat = "#";
categoryAxis.renderer.inversed = true;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.cellStartLocation = 0.1;
categoryAxis.renderer.cellEndLocation = 0.9;

var  valueAxis = chart.xAxes.push(new am4charts.ValueAxis()); 
valueAxis.renderer.opposite = true;

// Create series
function createSeries(field, name) {
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueX = field;
  series.dataFields.categoryY = "il";
  series.name = name;
  series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
  series.columns.template.height = am4core.percent(80);
  series.sequencedInterpolation = true;

  var valueLabel = series.bullets.push(new am4charts.LabelBullet());
  valueLabel.label.text = "{valueX}";
  valueLabel.label.horizontalCenter = "left";
  valueLabel.label.dx = 10;
  valueLabel.label.hideOversized = false;
  valueLabel.label.truncate = false;

  var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
  categoryLabel.label.text = "{name}";
  categoryLabel.label.horizontalCenter = "right";
  categoryLabel.label.dx = -10;
  categoryLabel.label.fill = am4core.color("#fff");
  categoryLabel.label.hideOversized = false;
  categoryLabel.label.truncate = false;
}

createSeries("nufus", "nufus");
createSeries("asi", "asi");

});

