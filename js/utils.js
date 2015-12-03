function findLeafletLayer(number) {
  var m;
  atlas.eachLayer(function(l) {
    if(l.feature && l.feature.properties.number == number) m = l;
  });
  
  return m;
}