precision highp float;
precision highp int;

uniform vec2 u_center;
uniform float u_feather;
uniform float u_radius;
uniform float u_reverse;
uniform mediump sampler2D u_inputTex;
uniform vec2 u_screenSize;

varying vec2 v_xy;

void main()
{
    float _16 = distance(v_xy, u_center);
    float _22 = min(_16, u_feather);
    float _32 = smoothstep(u_radius + _22, u_radius - _22, _16);
    gl_FragData[0] = texture2D(u_inputTex, v_xy / u_screenSize) * mix(_32, 1.0 - _32, u_reverse);
}

