function buildMapList() {
  console.log(data.maps);
  _.each(data.maps, function(v, k) {
    var listItem = $('<li>').appendTo($('.map-list--list'))
      
    $('<a>')
      .attr('href', '#')
      .text(v.title.slice(0,30))
      .appendTo(listItem)
      .on('click', function() {
        $(document).trigger('select:', v);
      });
  });
}