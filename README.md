# BikingScatterplot

Scatterplot displaying drug use and racetimes for professional bicycle racers (1995-2015). The user can hover over data points to see additional information, including the racer's name, nationality, and drug use allegations.

***Highlights:***

- `d3.timeParse` was used to convert years into full dates. `d3.scaleTime` was used to create a scale of dates on the x-axis.

- Racetimes were stored as a string in the original dataset (e.g, "36:50"). I converted these racetimes into seconds using a for loop and added those times to the data array. (Seconds are turned back into minutes for the y-axis, using `.tickFormat`)

- A transparent div is appended to each circle, fading in when the user hovers over a circle. This is achieved using `.transition()`, `.duration()`, and `.style(opacity, 0.9)`.

- Riders with drug allegations have a value in data array at index 5 (`data[5]`). These riders appear in blue while other riders appear in orange.
