function buildTimeline() {
  console.log(data.maps);
  
  var tData = _.toArray(data.maps);
  console.log(tData);
  var binNum = 1200 / 12;
  var binWidth = 12;
  
  // sortedData //This needs to be an array of arrays with the mapnumber somehow embedded in it
  
  
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
    .call(xAxis);
    
  var bins = t.selectAll('g.bin')
    .data(sortedData)
    .enter().append('g')
    .attr('class', 'bin')
    .attr('transform', function(d, i) { return 'translate(' + (i * binWidth) + ', 0)' });
  
  t.selectAll('.dot')
    .data(function(d) { return d })
    .enter().append('circle')
    .attr('class', 'timeline--dot')
    .attr('r', 5)
    .attr('cx', binWidth/2)
    .attr('cy', function(d, i) { return i; })
    .style('fill', 'black');
}