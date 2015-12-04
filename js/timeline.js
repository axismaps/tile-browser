function buildTimeline() {
  var w = $('.timeline').width();
  var h = $('.timeline').height();
  var dotRadius = 5;
  var padding = 20;
  var binWidth = 1; //in years
  var binNum = w / binWidth;
  var binnedData = _.toArray(_.groupBy(data.maps, function(v, k) {
    var mod = +v.date % binWidth;
    return +v.date - mod;
  }));
  var dateDomain = [+binnedData[0][0].date - binWidth*2, +binnedData[binnedData.length-1][0].date + binWidth*2];
  
  var t = d3.select('.timeline')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr('class', 'timeline--svg')
    .append('g');
    
  var yScale = d3.scale.linear().domain([h, 0]).range([0,20]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  
  var xScale = d3.scale.linear().domain(dateDomain).range([padding, w - padding*2]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(20)
    .tickSize(5)
    .tickFormat(d3.format(".0f"));
    
  d3.select('.timeline--svg').append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + (h - padding) + ')')
    .call(xAxis);
    
  var bins = t.selectAll('g.bin')
    .data(binnedData)
    .enter().append('g')
    .attr('class', 'bin')
    .attr('transform', function(d, i) { return 'translate(' + xScale(+d[0].date) + ', 0)' });
  
  bins.selectAll('.timeline--dot')
    .data(function(d) { return d })
    .enter().append('circle')
    .attr('class', 'timeline--dot')
    .attr('r', dotRadius)
    .attr('cx', binWidth/2)
    .attr('cy', function(d, i) { return (h - padding - dotRadius - 2) - i * (dotRadius*2 + 2); })
    .on('mouseover', function(d) { $(document).trigger('highlight:', +d.number) })
    .on('mouseout', function(d) { $(document).trigger('dehighlight:', +d.number) })
    .on('click', function(d) { $(document).trigger('select:', +d.number) });
}

function highlightDot(mapNumber) {
  d3.selectAll('.timeline--dot')
    .filter(function(d) {
      return +d.number === mapNumber;
    })
    .classed('highlight', true);
}

function dehighlightDot(mapNumber) {
  d3.selectAll('.timeline--dot')
    .filter(function(d) {
      return +d.number === mapNumber;
    })
    .classed('highlight', false);
}