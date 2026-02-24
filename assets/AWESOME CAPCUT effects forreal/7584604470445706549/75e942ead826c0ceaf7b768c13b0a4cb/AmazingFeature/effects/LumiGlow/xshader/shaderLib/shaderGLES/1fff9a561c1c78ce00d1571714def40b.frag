precision highp float;
precision highp int;

uniform float u_threshold;
uniform mediump int u_glowColors;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_uv;

float _f0(vec3 _p0)
{
    return dot(_p0, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

vec3 _f2(vec4 _p0)
{
    vec3 param = _p0.xyz;
    return smoothstep(vec3(u_threshold - (0.119999997317790985107421875 * u_threshold)), vec3(u_threshold + 0.070000000298023223876953125), vec3(_f0(param)));
}

vec3 _f3(vec4 _p0)
{
    float _104 = clamp(u_threshold, 0.00999999977648258209228515625, 1.0);
    vec3 param = _p0.xyz;
    return smoothstep(vec3(_104 - (0.119999997317790985107421875 * u_threshold)), vec3(_104 + 0.0900000035762786865234375), vec3(_f0(param)));
}

vec3 _f1(vec4 _p0)
{
    vec4 _t0 = _p0;
    float _46 = clamp(u_threshold, 0.00999999977648258209228515625, 1.0);
    vec3 _59 = smoothstep(vec3(_46 - (0.07500000298023223876953125 * u_threshold)), vec3(_46 + 0.115000002086162567138671875), _p0.xyz);
    _t0.x = _59.x;
    _t0.y = _59.y;
    _t0.z = _59.z;
    return pow(_t0.xyz, vec3(0.454545438289642333984375));
}

vec4 _f4(inout vec4 _p0)
{
    if (u_glowColors == 1)
    {
        vec4 _t8 = _p0;
        vec4 param = _p0;
        vec3 _139 = _f2(param);
        _t8.x = _139.x;
        _t8.y = _139.y;
        _t8.z = _139.z;
        _t8.w = _t8.x;
        return _t8;
    }
    else
    {
        if (u_glowColors == 2)
        {
            vec4 _t9 = _p0;
            vec4 param_1 = _p0;
            vec3 _162 = _f3(param_1);
            _t9.x = _162.x;
            _t9.y = _162.y;
            _t9.z = _162.z;
            _t9.w = _t9.x;
            return _t9;
        }
    }
    vec4 param_2 = _p0;
    vec3 _176 = _f1(param_2);
    _p0.x = _176.x;
    _p0.y = _176.y;
    _p0.z = _176.z;
    return _p0;
}

void main()
{
    vec4 param = texture2D(u_inputTexture, v_uv);
    vec4 _201 = _f4(param);
    gl_FragData[0] = _201;
}

