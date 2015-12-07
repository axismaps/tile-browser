function buildSearch() {
  $('.search--bar').on('keydown', function(e) {
    if(e.keyCode == 13) {
      var value = $(this).val();
      filters.push(value);
      $(document).trigger('filter:');
      
      addSearchTerm(value);
      recalcWidth();
    }
  });
}

function addSearchTerm(v) {
  var termSpan = $('<span>')
    .addClass('search--textTerm')
    .text(v);
    
  var closeSpan = $('<span>')
    .addClass('search--closeTerm')
    .html('<i class="icon-cancel-circled"></i>')
    .on('click', function() {
      filters = _.without(filters, $(this).prev().text());
      $(this).parent().remove();
      recalcWidth();
      $(document).trigger('filter:');
    });
    
  var term = $('<div>')
    .addClass('search--term')
    .append(termSpan)
    .append(closeSpan);
  
  if($('.search--term').length > 0) $('.search--term').last().after(term);
  else $('.search--container').prepend(term);
}

function recalcWidth() {
  $('.search--bar').css('width', '100%');
  
  var termWidth = 0;
  $('.search--term').each(function() {
    termWidth += $(this).width() + 15;
  });
  
   $('.search--bar')
      .width($('.search--bar').width() - termWidth)
      .val('');
}