function buildTimeline() {
  var binWidth = 12;
  var binNum = 1200 / binWidth;
  var binnedData = _.toArray(_.groupBy(data.maps, function(v, k) {
    var year = +v.date;
    var mod = year % binWidth;
    return year - mod;
  }));  
  
  var t = d3.select('.timeline')
    .append('svg')
    .style('border', '1px solid')
    .attr('width', '1200px')
    .attr('height', '100px')
    .attr('class', 'timeline--svg')
    .append('g');
    
  var yScale = d3.scale.linear().domain([100, 0]).range([0,20]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');
  
  var xScale = d3.scale.linear().range([0,1200]).domain([1600,1900]);
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(binNum/10)
    .tickSize(5)
    .tickFormat(d3.format(".0f"));
    
  d3.select('.timeline--svg').append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, 100)')
    .call(xAxis);
    
  var bins = t.selectAll('g.bin')
    .data(binnedData)
    .enter().append('g')
    .attr('class', 'bin')
    .attr('transform', function(d, i) { return 'translate(' + xScale(+d[0].date) + ', 0)' });
  
  bins.selectAll('.dot')
    .data(function(d) { return d })
    .enter().append('circle')
    .attr('class', 'timeline--dot')
    .attr('r', 5)
    .attr('cx', binWidth/2)
    .attr('cy', function(d, i) { return 100 - i * 12; })
    .style('fill', 'black');
}