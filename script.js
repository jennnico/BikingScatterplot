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
      data.push([val.Year, val.Time, val.Name, val.Nationality, {"Doping": val.Doping}])
      times.push(val.Time.split(":"))
    })
    console.log (data)
    
    
    //***what if I just push it onto the end of json, instead of making a whole new array?***
 
 
  //turn racetimes into SECONDS, and add to data array
   for(var i=0; i<data.length; i++){
      data[i].push((times[i][0]*60 + Number(times[i][1])))
    }
    

    
    //Original code that was refactored.
    /*
    //convert racetimes(min,sec) into seconds
    var segundos = []
    for(var i=0; i<times.length; i++){
      segundos.push(times[i][0]*60 + Number(times[i][1]))
    }
    
    //add seconds to the data array
    for(var i=0; i<data.length; i++){
      data[i].push(segundos[i])
    }*/
    console.log(data)
    
    
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
    
    //Set the X and Y axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
    
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => xScale(d[0]))
       .attr("cy", (d, i) => yScale(d[5]))
       .attr("r", 5)
       .style('fill', (d) => {
          return (d.Doping ? "red" : "green")
        })
       .append("title")
       .text(d => d[2] + ": " + d[3] + " Year: " + d[0] + " Time: " + d[1] + d[4])
       .attr("fill", "red");
    
    

       
    
    //move the X-axis
    svg.append("g")
       .attr("transform", "translate(0, " + (h-padding) + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", w/2)
       .attr("y", padding-2)
       .text("Year of Race")
    
    
    
    //move the Y-axis
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
