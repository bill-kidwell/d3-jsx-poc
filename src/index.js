import * as d3 from 'd3';
import jsxAppend from './d3-jsx/jsxAppend';

const data = [
    {name: "Locke",    value:  4},
    {name: "Reyes",    value:  8},
    {name: "Ford",     value: 15},
    {name: "Jarrah",   value: 16},
    {name: "Shephard", value: 23},
    {name: "Kwon",     value: 42}
  ];

const width = 420,
      barHeight = 20;

const height = barHeight*data.length;      

const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, (d) => d.value)]);                       

const svg = jsxAppend(
    d3.select("body"), 
    (<svg className="chart" width={width} height={height}></svg>)
);

// Using call is a double-edged sword.  It returns the _original_ selection.
//svg.call(jsxAppend, (<rect width={width} height={height} fill="white"></rect>));

const bar = svg.selectAll("g")
  .data(data)
  .enter();

jsxAppend(bar, (
    <g transform={(d, i) => { return 'translate(0,' + i*barHeight + ')';}}>
        <rect width={(d) => x(d.value)} height={barHeight - 1}></rect>
        <text x={(d)=>x(d.value)-3} y={ barHeight / 2 } dy=".35em">{(d) => d.value}</text>
    </g>
));