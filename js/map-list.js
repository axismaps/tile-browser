function buildMapList() {
  var dateSorted = _.groupBy(data.filtered, function(v, k) {
    return +v.date;
  });
  
  _.each(dateSorted, function(group) {
    $('<h3>').text(group[0].date).appendTo($('.map-list--list'));
    
    _.each(group, function(v, k) {
      var listItem = $('<li>').appendTo($('.map-list--list'))
        
      $('<a>')
        .attr('href', '#')
        .attr('data-number', +v.number)
        .addClass('map-list--link')
        .text(v.title)
        .appendTo(listItem)
        .on('click', function() {
          $(document).trigger('select:', +v.number);
        })
        .on('mouseover', function() {
          $(document).trigger('highlight:', +v.number);
        })
        .on('mouseout', function() {
          $(document).trigger('dehighlight:', +v.number);
        });
    });
  });
}