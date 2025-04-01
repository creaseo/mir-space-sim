console.clear();

// ----------------------------------------------
// Axis data (do not modify)
// ----------------------------------------------

let A = [
    [0.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 1.0]
];

// ----------------------------------------------
// end axis data
// ----------------------------------------------

// ----------------------------------------------
// Simuation control (do not modify)
// ----------------------------------------------

let xang = 0;
let yang = 0;
let zang = 0;
let rot = 0;
let axisRotation = null;
let rot_inc = 10;

function startRotation(rotationFunc) {
    if (axisRotation !== null) clearInterval(axisRotation);
    axisRotation = setInterval(rotationFunc, 100);
}

function stopRotation() {
    clearInterval(axisRotation);
    axisRotation = null;
}

document.addEventListener('mouseup', stopRotation);

document.addEventListener('mousedown', function (event) {
    switch ( event.target.id ) {
        case "pitch-up":
            startRotation(() => { xang = ( xang + rot_inc ) % 360; });
            break;
        case "pitch-down":
            startRotation(() => { xang = ( xang - rot_inc ) % 360; });
            break;
        case "roll-left":
            startRotation(() => { zang = ( zang + rot_inc ) % 360; });
            break;
        case "roll-right":
            startRotation(() => { zang = ( zang - rot_inc ) % 360; });
            break;
        case "yaw-left":
            startRotation(() => { yang = ( yang + rot_inc ) % 360; });
            break;
        case "yaw-right":
            startRotation(() => { yang = ( yang - rot_inc ) % 360; });
            break;
        case "reset":
            xang = yang = zang = 0; 
            break;
        default:
            stopRotation();
    }
});

// ----------------------------------------------
// End simuation control
// ----------------------------------------------

let webgl_context = null;
let attr_vertex = null;
let uniform_props = null;
let uniform_color = null;
let z_translation = null;
let uniform_view = null;
let vertex_data = [];
let canvas = null;
let program = null;
let count = 2;
let size = 3;
let axis_index = 0;

function configureXYZ() {
    
    canvas = document.getElementById( "xyz" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
    webgl_context.enable( webgl_context.DEPTH_TEST );
       
    attr_vertex = webgl_context.getAttribLocation( program, "vertex" );
    uniform_props = webgl_context.getUniformLocation( program, "props" );
    uniform_color = webgl_context.getUniformLocation( program, "color" );
    
    z_translation = webgl_context.getUniformLocation(program, "z_translation");
    uniform_view = webgl_context.getUniformLocation(program, "View");
    webgl_context.uniformMatrix4fv(uniform_view, false, flatten(mat4()));
    
}

function configureXZ() {
    
    canvas = document.getElementById( "xz" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
    webgl_context.enable( webgl_context.DEPTH_TEST );
       
    attr_vertex = webgl_context.getAttribLocation( program, "vertex" );
    uniform_props = webgl_context.getUniformLocation( program, "props" );
    uniform_color = webgl_context.getUniformLocation( program, "color" );
    
    z_translation = webgl_context.getUniformLocation(program, "z_translation");
    uniform_view = webgl_context.getUniformLocation(program, "View");
    webgl_context.uniformMatrix4fv(uniform_view, false, flatten(mat4()));
    
}

function configureYZ() {
    
    canvas = document.getElementById( "yz" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
    webgl_context.enable( webgl_context.DEPTH_TEST );
       
    attr_vertex = webgl_context.getAttribLocation( program, "vertex" );
    uniform_props = webgl_context.getUniformLocation( program, "props" );
    uniform_color = webgl_context.getUniformLocation( program, "color" );
    
    z_translation = webgl_context.getUniformLocation(program, "z_translation");
    uniform_view = webgl_context.getUniformLocation(program, "View");
    webgl_context.uniformMatrix4fv(uniform_view, false, flatten(mat4()));
    
}

function configureXY() {

    canvas = document.getElementById( "xy" );
    
    webgl_context = canvas.getContext( "webgl" );
    program = initShaders( webgl_context, "vertex-shader", "fragment-shader" );
    webgl_context.useProgram( program );
    
    webgl_context.viewport( 0, 0, canvas.width, canvas.height );
    webgl_context.enable( webgl_context.DEPTH_TEST );
       
    attr_vertex = webgl_context.getAttribLocation( program, "vertex" );
    uniform_props = webgl_context.getUniformLocation( program, "props" );
    uniform_color = webgl_context.getUniformLocation( program, "color" );
    
    z_translation = webgl_context.getUniformLocation(program, "z_translation");
    uniform_view = webgl_context.getUniformLocation(program, "View");
    webgl_context.uniformMatrix4fv(uniform_view, false, flatten(mat4()));

}

let vertex_data_plane = [];
let vertex_data_propeller = [];
let axis_index_plane = 0;
let axis_index_propeller = 0;

function createVertexData() {

    let row = 0;
    for (let i = 0; i < Fpl.length; i++) {
        
        vertex_data_plane[row++] = Vpl[ Fpl[i][0] ];
        vertex_data_plane[row++] = Vpl[ Fpl[i][1] ];
        vertex_data_plane[row++] = Vpl[ Fpl[i][2] ];
        
    }
    axis_index_plane = vertex_data_plane.length;
    for (let i = 0; i < A.length; i++) {
        vertex_data_plane[row++] = A[i];
    }

    // creating propeller vertex data
    row = 0;
    for (let i = 0; i < Fpp.length; i++) {

        vertex_data_propeller[row++] = Vpp[ Fpp[i][0] ];
        vertex_data_propeller[row++] = Vpp[ Fpp[i][1] ];
        vertex_data_propeller[row++] = Vpp[ Fpp[i][2] ];
        
    }
    axis_index_propeller = vertex_data_propeller.length;
    for (let i = 0; i < A.length; i++) {
        vertex_data_propeller[row++] = A[i];
    }
}

let buffer_id_plane = null;
let buffer_id_propeller = null;

function allocateMemory() 
{
    buffer_id_plane = webgl_context.createBuffer();
    webgl_context.buffer_id_plane = buffer_id_plane;

    webgl_context.bindBuffer( webgl_context.ARRAY_BUFFER, buffer_id_plane );
    webgl_context.bufferData( webgl_context.ARRAY_BUFFER, flatten(vertex_data_plane), webgl_context.STATIC_DRAW );
    

    buffer_id_propeller = webgl_context.createBuffer();
    webgl_context.buffer_id_propeller = buffer_id_propeller;

    webgl_context.bindBuffer( webgl_context.ARRAY_BUFFER, buffer_id_propeller );
    webgl_context.bufferData( webgl_context.ARRAY_BUFFER, flatten(vertex_data_propeller), webgl_context.STATIC_DRAW );

    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
}

function draw() {

    configureXYZ()
    // plane

    webgl_context.uniform4f(uniform_props, xang * Math.PI / 180, yang * Math.PI / 180, zang * Math.PI / 180, 1.75);
    webgl_context.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, 0.0);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_plane);
    webgl_context.vertexAttribPointer(attr_vertex, size, webgl_context.FLOAT, false, 0, 0);
    webgl_context.enableVertexAttribArray( attr_vertex );
    
    let i = 0;
    let j = 0;

    for (let j = 0; j < axis_index_plane; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }

    for ( j = 0; j < axis_index_plane; j += size) { 
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }

    webgl_context.uniform4f( uniform_color, 0.81, 0.81, 0.81, 1.0 ); 
    webgl_context.drawArrays( webgl_context.TRIANGLES, 0, i += axis_index_plane );
  
    // axes

    i = axis_index_plane;
    webgl_context.uniform4f( uniform_color, 1.0, 0.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
    
    webgl_context.uniform4f( uniform_color, 0.0, 1.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
  
    webgl_context.uniform4f( uniform_color, 0.0, 0.0, 1.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    
    // propeller

    webgl_context.uniform4f(uniform_props, xang * Math.PI / 180, yang * Math.PI / 180, zang * Math.PI / 180 + rot, 1.75);
    webgl_context.uniform4f(uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, -0.37);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_propeller);
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    for (let j = 0; j < axis_index_propeller; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    webgl_context.uniform4f(uniform_color, 0.81, 0.81, 0.81, 1.0);
    webgl_context.drawArrays(webgl_context.TRIANGLES, 0, axis_index_propeller);

    configureXZ();
    // plane

    webgl_context.uniform4f(uniform_props, -1.6, yang * Math.PI / 180, 0, 1.75);
    webgl_context.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, 0.0);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_plane);
    webgl_context.vertexAttribPointer(attr_vertex, size, webgl_context.FLOAT, false, 0, 0);
    webgl_context.enableVertexAttribArray( attr_vertex );

    
    for (let j = 0; j < axis_index_plane; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    
    for ( j = 0; j < axis_index_plane; j += size) { 
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }

    webgl_context.uniform4f( uniform_color, 0.81, 0.81, 0.81, 1.0 ); 
    webgl_context.drawArrays( webgl_context.TRIANGLES, 0, axis_index_plane );
  
    // axes

    i = axis_index_plane;
    webgl_context.uniform4f( uniform_color, 1.0, 0.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
    
    webgl_context.uniform4f( uniform_color, 0.0, 1.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
  
    webgl_context.uniform4f( uniform_color, 0.0, 0.0, 1.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    
    // propeller

    webgl_context.uniform4f(uniform_props, -1.6, yang * Math.PI / 180, rot, 1.75);
    webgl_context.uniform4f(uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, -0.37);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_propeller);
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    for (let j = 0; j < axis_index_propeller; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    webgl_context.uniform4f(uniform_color, 0.81, 0.81, 0.81, 1.0);
    webgl_context.drawArrays(webgl_context.TRIANGLES, 0, axis_index_propeller);

    configureYZ();
    // plane

    webgl_context.uniform4f(uniform_props, xang * Math.PI / 180, 0, 0, 1.75);
    webgl_context.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 ); 
    webgl_context.uniform1f(z_translation, 0.0);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_plane);
    webgl_context.vertexAttribPointer(attr_vertex, size, webgl_context.FLOAT, false, 0, 0);
    webgl_context.enableVertexAttribArray(attr_vertex);
    
    for (let j = 0; j < axis_index_plane; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    
    for ( j=0; j<axis_index_plane; j+=size) { 
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    webgl_context.uniform4f( uniform_color, 0.81, 0.81, 0.81, 1.0 ); 
    webgl_context.drawArrays( webgl_context.TRIANGLES, 0, axis_index_plane );
  
    // axes

    i = axis_index_plane;
    webgl_context.uniform4f( uniform_color, 1.0, 0.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i+=count;
    
    
    webgl_context.uniform4f( uniform_color, 0.0, 1.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i+=count;
    
  
    webgl_context.uniform4f( uniform_color, 0.0, 0.0, 1.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    
    // propeller

    webgl_context.uniform4f(uniform_props, xang * Math.PI / 180, 0, rot, 1.75);
    webgl_context.uniform4f(uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, -0.37);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_propeller);
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    for (let j = 0; j < axis_index_propeller; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    webgl_context.uniform4f(uniform_color, 0.81, 0.81, 0.81, 1.0);
    webgl_context.drawArrays(webgl_context.TRIANGLES, 0, axis_index_propeller);

    configureXY();
    // plane

    webgl_context.uniform4f(uniform_props, 0, -1.6, zang * Math.PI / 180, 1.75);
    webgl_context.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 ); 
    webgl_context.uniform1f(z_translation, 0.0);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_plane);
    webgl_context.vertexAttribPointer(attr_vertex, size, webgl_context.FLOAT, false, 0, 0);
    webgl_context.enableVertexAttribArray(attr_vertex);
    
    for (let j = 0; j < axis_index_plane; j += size) {
        webgl_context.drawArrays(webgl_context.LINE_STRIP, j, size);    
    }
    
    for ( j = 0; j < axis_index_plane; j += size) { 
        webgl_context.drawArrays(webgl_context.LINE_STRIP, j, size);    
    }
    webgl_context.uniform4f(uniform_color, 0.81, 0.81, 0.81, 1.0); 
    webgl_context.drawArrays(webgl_context.TRIANGLES, 0, axis_index_plane);
  
    // axes

    i = axis_index_plane;
    webgl_context.uniform4f( uniform_color, 1.0, 0.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
    
    webgl_context.uniform4f( uniform_color, 0.0, 1.0, 0.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    i += count;
    
  
    webgl_context.uniform4f( uniform_color, 0.0, 0.0, 1.0, 1.0 );
    webgl_context.drawArrays( webgl_context.LINES, i, count);
    
    // propeller
    webgl_context.uniform4f(uniform_props, 0, -1.5, zang * Math.PI / 180 + rot, 1.75);
    webgl_context.uniform4f(uniform_color, 0.60, 0.60, 0.60, 1.0 );
    webgl_context.uniform1f(z_translation, -0.37);
    webgl_context.bindBuffer(webgl_context.ARRAY_BUFFER, webgl_context.buffer_id_propeller);
    webgl_context.vertexAttribPointer( attr_vertex, size, webgl_context.FLOAT, false, 0, 0 );
    webgl_context.enableVertexAttribArray( attr_vertex );
    for (let j = 0; j < axis_index_propeller; j += size) {
        webgl_context.drawArrays( webgl_context.LINE_STRIP, j, size );    
    }
    webgl_context.uniform4f(uniform_color, 0.81, 0.81, 0.81, 1.0);
    webgl_context.drawArrays(webgl_context.TRIANGLES, 0, axis_index_propeller);

    rot = ( rot + rot_inc ) % 360
}

createVertexData();
configureXYZ();
allocateMemory();
configureXZ();
allocateMemory();
configureYZ();
allocateMemory();
configureXY();
allocateMemory();
draw();
setInterval(draw, 100);