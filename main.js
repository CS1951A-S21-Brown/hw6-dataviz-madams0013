// Add your JavaScript code here
const NUM_EXAMPLES = 20;
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

const genreFile = "data/genres.csv"
const durationsFile = "data/durations.csv"
const actorsFile = "data/link.csv"

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 300;
let graph_2_width = (MAX_WIDTH / 1.5) - 10, graph_2_height = 360;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// ------------ GENRE --------------------//

function genreBarChart() {
  let svg = d3.select("#graph1")
      .append("svg")
      .attr("width", graph_1_width)
      .attr("height", graph_1_height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

  let y = d3.scaleBand()
      .range([0, graph_1_height - margin.top - margin.bottom])
      .padding(0.1);

  let countRef = svg.append("g");
  let y_axis_label = svg.append("g");

  // x-axis label
  svg.append("text")
      .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                    ${(graph_1_height - margin.top - margin.bottom + 10)})`)
      .style("text-anchor", "middle")
      .text("Movie Count");

  // y-axis label
  let y_axis_text = svg.append("text")
      .attr("transform", `translate(-140, ${(graph_1_height - margin.top - margin.bottom) / 2 - 5})`)
      .style("text-anchor", "middle");

  // chart title
  let title = svg.append("text")
      .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)
      .style("text-anchor", "middle")
      .style("font-size", 15);

  function setData() {
    d3.csv(genreFile).then(function(data) {
      // Clean and strip desired amount of data for barplot
      const numPerGenre = getDataGraph1(data, comp, NUM_EXAMPLES)

      // Update the x axis domain with the max count of the provided data
      x.domain([0, d3.max(numPerGenre, function(d) {return parseInt(d.count);})]);

      // Update the y axis domains with the genres
      y.domain(numPerGenre.map(d=>d.genre));

      // Render y-axis label
      y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

      let bars = svg.selectAll("rect").data(numPerGenre);

      let color = d3.scaleOrdinal()
          .domain(numPerGenre.map(function(d) { return d.genre }))
          .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

      bars.enter()
          .append("rect")
          .merge(bars)
          .attr("fill", function(d) { return color(d.genre); })
          .transition()
          .duration(1000)
          .attr("x", x(0))
          .attr("y", function(d) {return y(d.genre);})
          .attr("width", function(d) {return x(parseInt(d.count));})
          .attr("height", y.bandwidth());

        let counts = countRef.selectAll("text").data(numPerGenre);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x(parseInt(d.count)) + 10;})
            .attr("y", function(d) {return y(d.genre) + 8;})
            .style("font-size", "10px")
            .style("text-anchor", "start")
            .text(function(d) {return d.count;});

          y_axis_text.text("Genre");
          title.text(`Count per Genre`);

          bars.exit().remove();
          counts.exit().remove();
    });
  }

  setData()

}

function comp(a, b) {
  let ac = parseInt(a.count)
  let bc = parseInt(b.count)
  if (ac < bc) {
    return 1
  } else if (ac == bc) {
    return 0
  } else {
    return -1
  }
}

function getDataGraph1(data, comparator, num) {
  data = data.sort(comparator)
  data = data.slice(0, num)
  return data
}

// -------- DURATION ----------------------//

function durationBarChart(endYear) {
  let svg = d3.select("#graph2")
      .append("svg")
      .attr("width", graph_2_width)
      .attr("height", graph_2_height)
      .append("g")
      .attr("transform", `translate(${margin.left-80},${margin.top})`);

    var years = ["1942", "1943", "1944", "1945", "1946", "1947", "1954",
                "1955", "1956", "1958", "1959", "1960", "1962", "1964",
                "1965", "1966", "1967", "1968", "1969", "1970", "1971",
                "1972", "1973", "1974", "1975", "1976", "1977", "1978",
                "1979", "1980", "1981", "1982", "1983", "1984", "1985",
                "1986", "1987", "1988", "1989", "1990", "1991", "1992",
                "1993", "1994", "1995", "1996", "1997", "1998", "1999",
                "2000", "2001", "2002", "2003", "2004", "2005", "2006",
                "2007", "2008", "2009", "2010", "2011", "2012", "2013",
                "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(years)
      .enter()
       .append('option')
       .text(function (d) { return d; }) // text showed in the menu
       .attr("value", function (d) { return d; }) // corresponding value returned by the button

     d3.select("#selectButton").on("change", function(d) {
         var selectedOption = d3.select(this).property("value")
         setData(selectedOption)
     })

   // x-axis label
   svg.append("text")
       .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                     ${(graph_2_height - margin.top - margin.bottom + 38)})`)
       .style("text-anchor", "middle")
       .text("Year");

   // y-axis label
   let y_axis_text = svg.append("text")
       .attr("transform", `translate(-60, ${(graph_2_height - margin.top - margin.bottom) / 2 - 5})`)
       .style("text-anchor", "middle")
       .text("Duration (mins)")
       .style("font-size", 10);

   // chart title
   let title = svg.append("text")
       .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`)
       .style("text-anchor", "middle")
       .style("font-size", 15);

   let selectionTitle = svg.append("text")
       .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2 - 375}, ${-27})`)
       .style("text-anchor", "middle")
       .style("font-size", 15);

   selectionTitle.text("Choose End Year");

   title.text("Average Movie Duration per Year");

  function setData(endYear) {
    d3.csv(durationsFile).then(function(data) {

      startYear = "1942"
      data = sliceDurationData(startYear, endYear, data);

      // Clean and strip desired amount of data for barplot
      let x = d3.scaleBand()
        .range([0, graph_2_width - margin.left - margin.right])
        .domain(data.map(function(d) { return d.release_year; }))
        .padding(0.1);

      // Set up reference to count SVG group
      let yearRef = svg.append("g");
      let years = yearRef.selectAll("text").data(data);

      let y = d3.scaleLinear()
          .range([0, graph_2_height - margin.top - margin.bottom])
          .domain([d3.max(data, function(d) {return parseInt(d.duration) + 20;}), 0]);
      svg.append("g")
          .call(d3.axisLeft(y));

      let color = d3.scaleOrdinal()
          .domain(data.map(function(d) { return d.genre }))
          .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

      let bars = svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          //.merge(bars)
          .attr("fill", function(d) { return color(d.genre); }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
          .transition()
          .duration(1000)
          .attr("x", function(d) {return x(d.release_year);})
          .attr("y", function(d) {return y(parseInt(d.duration));})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
          .attr("width", x.bandwidth())
          .attr("height", function(d) {return y(0)-y(parseInt(d.duration));});        // HINT: y.bandwidth() makes a reasonable display height

      // Set up reference to y axis label to update text in setData
      let x_axis_label = svg.append("g")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10, 275)rotate(-45)")
        .style("text-anchor", "end");

    });
  }

  setData("1969");

}

function sliceDurationData(startYear, endYear, d) {
  sY = parseInt(startYear)
  eY = parseInt(endYear)

  lowSlice = 0
  highSlice = 0
  for (i = 0; i < d3.keys(d).length; i++) {
    if ((d3.values(d)[i].release_year) == sY) {
      lowSlice = i
    } else if ((d3.values(d)[i].release_year) == eY) {
      highSlice = i+1
    }
  }
  d = d.slice(lowSlice, highSlice)
  return d
}

//---------- NETWORK -----------------//

function networkGraph() {
  let svg = d3.select("#graph3")
      .append("svg")
      .attr("width", graph_3_width)
      .attr("height", graph_3_height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);


  let title = svg.append("text")
      .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2 + 50}, ${475})`)
      .style("text-anchor", "middle")
      .style("font-size", 15);
  title.text("Network of Actors Who Acted Together in 2020");

  let subTitle = svg.append("text")
      .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2 + 50}, ${495})`)
      .style("text-anchor", "middle")
      .style("font-size", 10);
  subTitle.text("(mouse over node to see name of actor)");

  function setData() {
    d3.csv(actorsFile).then(function(data) {
      var network = {
        'nodes': [],
        'links': []
      };
      data.forEach(function(d) {
        if (network.nodes.indexOf(d.sourcename.trim()) < 0) {
          network.nodes.push(d.sourcename.trim())
        }
        if (network.nodes.indexOf(d.targetname.trim()) < 0) {
          network.nodes.push(d.targetname.trim())
        }
        network.links.push({source:network.nodes.indexOf(d.sourcename.trim()),
                    target:network.nodes.indexOf(d.targetname.trim())})
      });
      network.nodes = network.nodes.map(function(n) {
        return {name:n}
      })

      // initialize links
      var link = svg
        .selectAll("line")
        .data(network.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa")

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

      // Initialize the nodes
      var node = svg
        .selectAll("circle")
        .data(network.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .style("fill", "#69b3a2")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.name)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

      var simulation = d3.forceSimulation(network.nodes)
            .force("link", d3.forceLink()
              .id(function(d) { return d.index; })
              .links(network.links)
            )
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(graph_3_width/3, graph_3_height/3))
        .force("x", d3.forceX(graph_3_width/2).strength(3))
        .force("y", d3.forceY(graph_3_height/2).strength(3))
        .on("tick", ticked);

        function ticked() {
          link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
          }

        let tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)

        });
    };

    setData();

}


// render all 3 charts
genreBarChart()
durationBarChart()
networkGraph()
