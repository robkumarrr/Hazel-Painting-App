const svgNS = "http://www.w3.org/2000/svg"; 
const game = document.querySelector( "#game" ); // 
const brush_size = document.getElementById( "myRange" );
const output = document.getElementById( "text_output" );
output.innerHTML = "<strong>" + brush_size.value + "</strong>"; // output the brush size

// Listener to active the brush on Keydown 
document.addEventListener("keydown", activateBrush); 

// This function will change the active state of the brush when W is pressed
// While TRUE the brush will paint on the canvas
// While FALSE the brush will stop painting, but the brush position will still follow the cursor
let paint_active; 
const brush_status = document.querySelector("#brush_status");
brush_status.innerHTML = "<strong>Brush is Inactive</strong>";
brush_status.style.backgroundColor = "RGB(223, 86, 81)";
function activateBrush(event) { 
    // Adapted from: https://javascript.info/keyboard-events
    if (event.code == 'KeyW') { // if W is being pressed
        if (paint_active) { // deactivate the brush if it's active
            paint_active = false; 
            brush_status.innerHTML = "<strong>Brush is Inactive</strong>";
            brush_status.style.backgroundColor = "RGB(223, 86, 81)"; // soft red
        } else if (!paint_active) { // activate brush if it's inactive
            paint_active = true;
            brush_status.innerHTML = "<strong>Brush is Active</strong>";
            brush_status.style.backgroundColor = "RGB(108, 198, 116)"; // soft green
        }
        // console.log(paint_active);
    }
}

// Needed to get the SVG coordinates in absolute space so they were represented accurately in relative space
// This was quite difficult for me to figure out with the course material so I adapted code from the link below:
// https://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
// I have also indicated below where this helped me out below using  // *****
// const svg = document.querySelector("svg"); 
let point = game.createSVGPoint(); // get the point of the start of the SVG (0,0 in this case for the SVG)
let brush_pos; // declare brush position globally

// Learned how to get mouse coordinates from the following document:
// Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
game.addEventListener("mousemove", changeBrushPosition);
game.addEventListener("mousemove", paint);

// This function moves the circle wherever the mouse moves on the screen
brush_pos = document.createElementNS( svgNS, "circle");
brush_pos.setAttribute( "class", "brush_pos")
function changeBrushPosition( mouse ) { 
    point.x = mouse.clientX; // *****
	point.y = mouse.clientY; // *****
	point = point.matrixTransform(game.getScreenCTM().inverse()); // *****
    // Set brush cursor attributes
    brush_pos.setAttribute( "r", brush_size.value);
    brush_pos.setAttribute( "cx", point.x);
    brush_pos.setAttribute( "cy", point.y);
    brush_pos.setAttribute( "stroke", colourPicker()); // colourPicker returns an RGB colour code 
    brush_pos.setAttribute( "stroke-width", 4);
    brush_pos.setAttribute( "fill-opacity", 0.0);
    game.appendChild( brush_pos ); // keeps the brush on top of all other brush strokes
};

// This function paints circles on the SVG canvas when the paint brush is active
// It will not work while the brush is inactive
let stroke_tracker; // made global so all brush strokes can be removed with the Clear All button
function paint( mouse ) { 
    point.x = mouse.clientX; // *****
	point.y = mouse.clientY; // *****
	point = point.matrixTransform(game.getScreenCTM().inverse()); // *****
    // Set brush stroke attributes
    stroke = document.createElementNS( svgNS, "circle");
    stroke.setAttribute( "r", brush_size.value);
    stroke.setAttribute( "cx", point.x);
    stroke.setAttribute( "cy", point.y);
    stroke.setAttribute( "fill", colourPicker()); // colourPicker returns an RGB colour code 
    stroke.setAttribute( "class", "stroke")

    if (paint_active) { // If brush is active then the circles will be painted on to the canvas here
        game.appendChild( stroke );
        stroke_tracker = document.querySelectorAll( ".stroke"); // track each circle placed
    }
    // console.log( stroke_tracker );
};

// This function takes the colour values from the range sliders in the DOM and converts them to usable RGB colour codes
// Formatted strings are used to return the values appropriately to the paint and changeBrushPosition functions
let current_colour = document.getElementById("current_colour");
let colour_sample = document.getElementById("colour_sample");
function colourPicker() {
    let red = document.getElementById( "r" ).value; // get red from r slider
    let green = document.getElementById( "g" ).value; // get green from g slider
    let blue = document.getElementById( "b" ).value; // get blue from b slider
    current_colour.innerHTML = `RGB(${red}, ${green}, ${blue})`; // report colour back to the DOM 
    
    // This conditional block controls the output of the Colour Sample on the DOM
    // if the colour is darker, the text turns white, and if it's lighter then the text turns black
    if (red > 115 && green > 115 && blue > 115) { 
        document.getElementById("colour_sample").style.setProperty('background-color',`rgb(${red}, ${green}, ${blue})`);
        document.getElementById("colour_sample").style.setProperty('color', 'black');
    } else {
        document.getElementById("colour_sample").style.setProperty('background-color',`rgb(${red}, ${green}, ${blue})`);
        document.getElementById("colour_sample").style.setProperty('color', 'white');
    }
    // console.log(`rgb(${red}, ${green}, ${blue})`);
    return `rgb(${red}, ${green}, ${blue})`; 
}

// This function will remove all of the paint brush strokes from the SVG canvas
function clearAll() {
    // console.log("it's firing");
    for (let i = 0; i < stroke_tracker.length; i++) {
        game.removeChild(stroke_tracker[i]);
    }
    
}

// The colour picker should run immediately when the page loads to populate the DOM
colourPicker();

// Like colourPicker, this runs when the page loads to populate the DOM with the brush size
brush_size.oninput = function () { 
    brush_pos.setAttribute( "r", this.value);  
    output.innerHTML = "<strong>" + this.value + "</strong>";
}



