
uniform vec2 u_screenSize;

attribute vec4 a_position;
varying vec2 v_p;
attribute vec2 a_texcoord0;

void main()
{
    gl_Position = a_position;
    v_p = a_texcoord0 * u_screenSize;
}

