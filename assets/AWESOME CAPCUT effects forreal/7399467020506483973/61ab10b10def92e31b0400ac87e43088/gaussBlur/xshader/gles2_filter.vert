precision highp float;

attribute vec4 position;
attribute vec2 texcoord0;
varying vec2 uv0;
uniform mat4 u_MVP;
varying vec2 pos;
varying vec2 pos1;
uniform float time;
void main() 
{ 
    gl_Position = vec4(position.xyz ,1.0);
    uv0 = texcoord0;
    

}
