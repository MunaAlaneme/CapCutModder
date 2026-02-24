precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTex;

varying vec2 v_uv;

vec3 _f1(vec3 _p0, float _p1)
{
    return mix(_p0, vec3(dot(vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625), _p0)), vec3(_p1));
}

vec4 _f2(vec4 _p0, float _p1)
{
    vec3 param = _p0.xyz;
    float param_1 = _p1;
    return vec4(_f1(param, param_1), _p0.w);
}

vec4 _f0(inout float _p0)
{
    vec4 _t0 = vec4(0.0);
    _p0 *= 255.0;
    _t0.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t0.w = _p0;
    return _t0;
}

void main()
{
    mediump vec4 _101 = texture2D(u_inputTex, v_uv);
    vec4 _t1 = _101;
    vec4 param = _101;
    float param_1 = 1.0;
    _t1 = _f2(param, param_1);
    float param_2 = _t1.x;
    vec4 _110 = _f0(param_2);
    _t1 = _110;
    gl_FragData[0] = _110;
}

