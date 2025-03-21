console.clear();

// ----------------------------------------------
// variables used in the program
// ----------------------------------------------

let webgl_context = null;
let attr_vertex = null;
let uniform_props = null;
let uniform_color = null;
let uniform_z_translation = null;
let uniform_view = null;
let vertex_data = [];
let canvas = null;
let program = null;
let count = 2;
let size = 3;
let rot = 0;
let axis_index = 0;

let at = vec3(0.0,0.0,0.0);
let up = vec3(0.0,0.5,0.0);
let eye = vec3(-0.15,-0.15,0.35);
let viewMatrix = lookAt( eye, at, up );


// Axis coordinate system

let A = [
  [0.0, 0.0, 0.0],    
  [1.0/2, 0.0, 0.0],
  [0.0, 0.0, 0.0],
  [0.0, 1.0/2, 0.0],
  [0.0, 0.0, 0.0],
  [0.0, 0.0, 1.0]
];


// ----------------------------------------------
// Configure the WebGL context
// ----------------------------------------------
function configure() {
    
    canvas = document.getElementById( "webgl-canvas" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
    webgl_context.enable( webgl_context.DEPTH_TEST );
       
    attr_vertex = webgl_context.getAttribLocation( program, "vertex" );
    uniform_props = webgl_context.getUniformLocation( program, "props" );
    uniform_color = webgl_context.getUniformLocation( program, "color" );
    
    
    uniform_z_translation = webgl_context.getUniformLocation(program, "z_translation");

    
    uniform_view = webgl_context.getUniformLocation(program, "View");
    
    webgl_context.uniformMatrix4fv(uniform_view, false, flatten(viewMatrix));

}


// ----------------------------------------------
// Create vertex data matrix  
// ----------------------------------------------
function createVertexData() {

    let row = 0;
    
    for ( let i=0; i<F.length; i++ ) {
        
        vertex_data[row++] = V[ F[i][0] ];
        vertex_data[row++] = V[ F[i][1] ];
        vertex_data[row++] = V[ F[i][2] ];
        
    }
    
    axis_index = vertex_data.length;
    
    for ( let i=0; i<A.length; i++ ) {
         vertex_data[row++] = A[i];
    }
    
 
}

// ----------------------------------------------
// Allocate memory and load data.
// ----------------------------------------------
function allocateMemory() {
    
    let buffer_id = webgl_context.createBuffer();
    
    webgl_context.bindBuffer( webgl_context.ARRAY_BUFFER, buffer_id );
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    webgl_context.bufferData( webgl_context.ARRAY_BUFFER, flatten(vertex_data), webgl_context.STATIC_DRAW );
    
}

// ----------------------------------------------
// Run the pipeline and draw data
// ----------------------------------------------
function draw() {

        
    let x_rotation = document.getElementById("xang").value * Math.PI / 180;
    let y_rotation = document.getElementById("yang").value * Math.PI / 180;
    let z_rotation = rot * Math.PI / 180;
    let scale = document.getElementById("scale").value;

    webgl_context.uniform4f(uniform_props, x_rotation, y_rotation, z_rotation, scale);
        
    let zTrans = parseFloat(document.getElementById("ztrans").value);
    webgl_context.uniform1f(uniform_z_translation, zTrans);
    
    
    let i = 0;
    let j = 0;
    
    
    webgl_context.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 );
    for ( j=0; j<axis_index; j+=size) { 
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }

    webgl_context.uniform4f( uniform_color, 0.81, 0.81, 0.81, 1.0 ); 
    webgl_context.drawArrays( webgl_context.TRIANGLES, 0, i+=axis_index );
  
   
    webgl_context.uniform4f( uniform_color, 1.0, 0.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i+=count;
    
    
    webgl_context.uniform4f( uniform_color, 0.0, 1.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i+=count;
    
  
    webgl_context.uniform4f( uniform_color, 0.0, 0.0, 1.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    
        
    let gravity = document.getElementById("gravity");
    if (gravity.checked) {
        rot = rot + 5 % 360;
    }

}

createVertexData();
configure();
allocateMemory();
draw();
setInterval(draw, 100);

