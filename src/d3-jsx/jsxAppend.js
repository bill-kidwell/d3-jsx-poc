import * as d3 from 'd3';

const paramCase = (input) => input.split(/(?=[A-Z])/g).map(function (value) { return value.charAt(0).toLowerCase() + value.substring(1) }).join("-");

// Fragile implementation
const keyToAttr = (input) => {
    if (input === 'className') {
        return 'class';
    } else {
        return paramCase(input);
    }
}

/**
 * Takes a selection first (for compatibility with selection.call)
 * and the content from createElement and a d3 selection 
 */
export default function jsxAppend(selection, content) {
    let element = selection.append(content.elementName);

    // TODO: use d3 multi-selection to apply attrs
    let keys = Object.keys(content.attributes);
    // This is more complicated than just setting the attributes.  We need to look up the proper name.
    // For example className => class.  paramCase takes care of things like textAnchor => text-anchor
    // Look to https://github.com/pixelass/jsx-create-element/ for an example of looking this up
    keys.map((key) => {
        element = element.attr(keyToAttr(key), content.attributes[key]);
    });

    content.children.map((child) => {
        if (typeof child === 'string' || typeof child === 'function') {
            element.text(child);
        } else {
            jsxAppend(element, child);
        }
    });

    return element;
};
