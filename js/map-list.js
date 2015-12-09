function drawMapList() {
  var dateSorted = _.groupBy(data.filtered, function(v, k) {
    return +v.date;
  });
  
  $('.map-list h3, .map-list--list li, .map-list--fleur, .map-list--link').remove();
  
  _.each(dateSorted, function(group) {
    $('<h3>').text(group[0].date).appendTo($('.map-list--list'));
    
    _.each(group, function(v, k) {
      var listItem = $('<li>').appendTo($('.map-list--list'))
      
      $('<div>')
        .addClass('map-list--fleur')
        .appendTo(listItem);
        
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