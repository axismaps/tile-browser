var map = {};

function initMap() {
  map = L.map('map').setView([40, -100], 4);

  L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png').addTo( map );
}