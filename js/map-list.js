function buildMapList() {
  _.each(data.maps, function(v, k) {
    var listItem = $('<li>').appendTo($('.map-list--list'))
      
    $('<a>')
      .attr('href', '#')
      .attr('data-number', parseInt(v.number))
      .addClass('map-list--link')
      .text(v.title.slice(0,30))
      .appendTo(listItem)
      .on('click', function() {
        $(document).trigger('select:', parseInt(v.number));
      })
      .on('mouseover', function() {
        $(document).trigger('highlight:', parseInt(v.number));
      })
      .on('mouseout', function() {
        $(document).trigger('dehighlight:', parseInt(v.number));
      });
  });
}