# D3 with JSX
## A Proof of Concept

> You can read this article [here](https://medium.com/@billkidwell/d3-with-jsx-9f7afcbef0b3).

> To run this project...
> ```bash
>git clone https://github.com/bill-kidwell/d3-jsx-poc
>cd d3-jsx-poc
>npm install
>npm start
> ```

This project provides a proof of concept for using JSX with D3.js.

When you first see JSX, it looks like an abomination. A lot of people are past that hurdle, and have embraced JSX.  I found myself working with React.js and D3.js.  Each library is exciting and flexible, but they are designed quite differently.  

In order to create data visualizations with D3.js, you have to know and understand SVG. Using JSX makes it possible to write the visualization and see the SVG that you expect. 

For this proof of concept, I used [babel-plugin-transform-jsx](https://github.com/calebmer/node_modules/tree/master/babel-plugin-transform-jsx).  This plugin provides a general and unopinionated transform of JSX into JavaScript objects. While a full explanation is available on the project's GitHub page, I will walk through the project with D3 in mind.

Here is some JSX to create some simple SVG.  In this case, we could actually just plug this straight into the HTML, but bear with me. The SVG has a simple rectangle, with Hello World text on top.

```JavaScript
  const someSvg = (<svg height="100px" width="200px">
    <rect height="100px" width="200px" fill="#fff"></rect>    
    <text textAnchor="middle" x="100" y="50">Hello World!</text>
  </svg>);
```

The transform will create an object that looks like the following.
```JavaScript
const someSVG = {
    elementName: 'svg',
    attributes: {
        height: '100px',
        width: '200px'        
    },
    children: [
        {
            elementName: 'rect',
            attributes: {
                height: '100px',
                width: '200px',
                fill: '#fff'
            },
            children: []
        },{
            elementName: 'text',
            attributes: {
                textAnchor: 'middle',
                x: '100',
                y: '50'
            },
            children: [
                'Hello World!'
            ]
        }
    ]
};
```
Our job is simply to take the transformed object and make the appropriate D3.js calls.  I call the simple version of this function <code>jsxAppend</code>. The function takes a d3 selection and some SVG and returns the resulting d3 selection. 

Here is an example of how it works, using the example from Mike Bostock's [Let's Make a Bar Chart, II](https://bost.ocks.org/mike/bar/2/).

```JavaScript
const svg = jsxAppend(
    d3.select("body"), 
    (<svg className="chart" width={width} height={height}></svg>)
);
```
The code above selects the <code>body</code> tag, and uses it as the starting selection.  The SVG to be created is specified in JSX.  Notice the use of <code>className</code> to specify the class  of the svg, and the use of {} to pass variables as attribute values.

```JavaScript
const bar = svg.selectAll("g")
  .data(data)
  .enter();

jsxAppend(bar, (
    <g transform={(d, i) => { return 'translate(0,' + i*barHeight + ')';}}>
        <rect width={(d) => x(d.value)} height={barHeight - 1}></rect>
        <text x={(d)=>x(d.value)-3} y={ barHeight / 2 } dy=".35em">{(d) => d.value}</text>
    </g>
));
```
This first block in this code binds the data and sets up the entering selection for the bar chart. The <code>jsxAppend</code> call does the rest.  Each bar is wrapped in a <code>g</code> and translated to the proper position based on its index value.  The <code>rect</code> is set to a width based on the scaled value of the data element, and a pre-determined barHeight.  The text is right anchored (using css not shown here) and is set to be at the end of the bar and roughly centered vertically.

### Conclusions
There is a lot to do to make this production-ready code.  Ideally this could be added to [d3 as a module](https://bost.ocks.org/mike/d3-plugin/), and there could be a number of associated functions for actions such as <code>insert</code>.  Limited experimentation revealed problems with using <code>selection.call</code>. Since the original selection is returned, and not the new selection, you cannot chain additional calls.

There is also a question of usefulness when transitions are used, or when the enter-update-exit pattern is required.  That will require some additional work, and a more thorough example.

I wanted to put this out here and see if others thought it was interesting.  If you are using React and d3.js together, you probably want something like [Semiotic](https://github.com/emeeks/semiotic) instead.  We have some use cases that require d3.js without React.js.  I have come to appreciate React's use of JSX, and its component architecture, so this is my way of scratching that itch.
