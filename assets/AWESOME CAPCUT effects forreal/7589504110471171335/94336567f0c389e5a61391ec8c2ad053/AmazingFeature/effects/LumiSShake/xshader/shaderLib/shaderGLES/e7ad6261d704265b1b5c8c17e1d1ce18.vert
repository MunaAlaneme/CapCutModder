
uniform mat4 u_uvMatR;
uniform mat4 u_uvMatG;
uniform mat4 u_uvMatB;

attribute vec4 a_position;
varying vec2 v_uvR;
attribute vec2 a_texcoord0;
varying vec2 v_uvG;
varying vec2 v_uvB;

void main()
{
    gl_Position = a_position;
    vec4 _27 = vec4(a_texcoord0, 0.0, 1.0);
    v_uvR = (u_uvMatR * _27).xy;
    v_uvG = (u_uvMatG * _27).xy;
    v_uvB = (u_uvMatB * _27).xy;
}

