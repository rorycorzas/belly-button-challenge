
/* BELLY BUTTON CHALLENGE */

/* 1. Use the D3 library to read in samples.json from the URL:
URL: https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json 
*/
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {
  let selector = d3.select("#selDataset");
  d3.json(url).then((data) => {
      let sampleNames = data.names; 
      sampleNames.forEach((sample) => {
          console.log(sample);

          selector.append("option").text(sample).property("value", sample);
      });
   
      let firstSample = sampleNames[0];

      console.log(firstSample);

      buildMetadata(firstSample);
      buildBarChart(firstSample);
      buildBubbleChart(firstSample);
      //buildGaugeChart(firstSample);

  });
}

/*
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_label = data.samples.map(x=> x.otu_labels);
    
    // Get the top 10 OTU for the selected ID
    var sorted_test = sample_values.sort(function(a, b){return b-a});
    var top_ten = sorted_test.map(x => x.slice(0,10));
    var sorted_ids = otu_ids.sort(function(a, b){return b-a});
    var top_ids = sorted_ids.map(x =>x.slice(0,10));
    var sorted_labels = otu_label.sort(function(a, b){return b-a});
    var top_labels = sorted_labels.map(x =>x.slice(0,10));

    // Get the first ID to display on page on load
    var firstID = data.metadata[0]// first id
    var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
    
    //-------------------------------------------------
    // Display the first ID's demographic information
    var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
    sampleMetadata.enter()
                    .append('h1')
                    .merge(sampleMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','12px')
  
    sampleMetadata.exit().remove()
    
*/

// Bar chart
function buildBarChart(sample) {
  d3.json(url).then((data) => {
      let samples = data.samples; 
      
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      
      let sample_values = result.sample_values;
      
      // Trace
      let barData = [{
          x: sample_values.slice(0, 10).reverse(),
          y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          
          marker: {
              line: {
                  color: 'white' // White lines between the bars
              }
          }, 
      }];

      // layout for the bar chart
      let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 80, l: 150 },
      
          // Customize the chart theme here
           paper_bgcolor: 'white', 
           plot_bgcolor: 'white',
           font: {
               color: 'black'
          },
          xaxis: {
              range: [0, 200] 
          },        
          // Ajustar el tamaño de la gráfica
          width: 700, // width
          height: 500 // hight
      };

      Plotly.newPlot("bar", barData, barLayout);
  });
}

// bubble chart
function buildBubbleChart(sample) { 
  d3.json(url).then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      
      let result = resultArray[0];
      
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      
      let sample_values = result.sample_values;

      // trace for the bubble chart
      let bubbleData = [{
          x: otu_ids,
          y: sample_values,
        
          text: otu_labels,
          mode: "markers",
          
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "species"
          }
      }];

      // layout for the bubble chart
      let bubbleLayout = {
          
          title: "Bacteria Cultures Per Sample",
          
          margin: { t: 0 }, 
          hovermode: "closest",
          
          xaxis: { title: "OTUs IDs" },
          margin: { t: 30 },

          // Customize the chart theme here
          paper_bgcolor: 'lightgray', 
          plot_bgcolor: 'white', 
          font: {
              color: 'white'
         }
      };

      // Plot the chart to a div tag with id "bubble"
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}


// Metadata info
function buildMetadata(sample) {
  d3.json(url).then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      
      let result = resultArray[0];
    
      let PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
          let metadataItem = PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);

          //metadataItem.style("background-color", "#c0c");
          metadataItem.style("color", "#000"); 

      });
  });
}



// Function that updates dashboard when sample is changed
function optionChanged(newSample) {
  //buildMetadata(newSample);
  sampleMetadata
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);

  console.log(newSample); 
}
// Initialize the dashboard
init();