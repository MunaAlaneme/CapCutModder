precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform float u_offsetX;
uniform float u_offsetY;

varying vec2 v_uv;

void main()
{
    vec4 _t0 = texture2D(u_inputTexture, v_uv);
    vec2 _34 = (vec2(u_offsetX, u_offsetY) * (vec2(1.0) - v_uv)) * v_uv;
    vec4 _t3 = texture2D(u_inputTexture, v_uv + _34);
    _t0.x = _t3.x;
    vec4 _t5 = texture2D(u_inputTexture, v_uv - _34);
    _t0.z = _t5.z;
    _t0.w = ((_t3.w + _t0.w) + _t5.w) / 3.0;
    gl_FragData[0] = _t0;
}

