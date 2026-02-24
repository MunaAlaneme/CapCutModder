
varying vec2 v_uv;
attribute vec2 a_texcoord0;
attribute vec4 a_position;

void main()
{
    v_uv = a_texcoord0;
    gl_Position = a_position;
}

