//Resource for formatting style of title: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369

document.addEventListener('DOMContentLoaded',function(){
  req=new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    
    //Data array that WILL store year and time (in SECONDS)
    var data = []
    //array of racetimes, split into arrays of min and sec
    var times = []
    json.forEach(function(val){
      data.push([val.Year, val.Time, val.Name, val.Nationality, val.Doping])
      times.push(val.Time.split(":"))
    })

  //turn racetimes into SECONDS, and add to data array
   for(var i=0; i<data.length; i++){
      data[i].push((times[i][0]*60 + Number(times[i][1])))
    }
    
    //Set dimensions of the canvas
    const w = 800;
    const h = 500;
    const padding = 50;
    
    //Scale for x-axis (years)
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d[0]-1), d3.max(data, d => d[0])]) 
                     .range([padding+10, w-padding+10]); 
    
    //Scale for y-axis (seconds)
    const yScale = d3.scaleLinear()
                     .domain([d3.max(data, d => d[5]), d3.min(data, d => d[5])])
                     .range([h-padding, padding])
    
    //Define the axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    
    // Define the div for the tooltip
    var div = d3.select("a").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    
    // Adds the svg canvas
    const svg = d3.select("a")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
    

    // Add the scatterplot
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => xScale(d[0]))
       .attr("cy", (d, i) => yScale(d[5]))
       .attr("r", 5)
       .attr("class", "circle")
       .style('fill', (d) => {
          return (d[4] ? "blue" : "orange")
       })
        //Original tooltips... could not be formatted easily
        // .append("title")
       //.text(d => d[2] + ": " + d[3] + " \nYear: " + d[0] + " Time: " + d[1] + "\n" + d[4])
       .on("mouseover", function(d) {		
           div.transition()		
               .duration(200)		
               .style("opacity", .9);		
           div .html(d[2] + ": " + d[3] + " <br/>Year: " + d[0] + " Time: " + d[1] + "<br/>" + d[4])	
               .style("left", (d3.event.pageX + 10) + "px")		
               .style("top", (d3.event.pageY - 28) + "px");
       })					
       .on("mouseout", function(d) {		
           div.transition()		
               .duration(500)		
               .style("opacity", 0);	
       });
    
    //Add and move the X-axis
    svg.append("g")
       .attr("transform", "translate(0, " + (h-padding) + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", w/2)
       .attr("y", padding-2)
       .text("Year of Race")
     
    //Add and move the Y-axis
    svg.append("g")
       .attr("transform", "translate(" + (padding + 10) + ", 0)")
       .call(yAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", -padding*2)
       .attr("y", -padding-10)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text("Time in Seconds")
    

    }
});
