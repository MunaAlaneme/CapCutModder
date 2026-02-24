precision highp float;
precision highp int;

uniform mediump sampler2D u_albedo;
uniform vec3 u_blackColor;
uniform vec3 u_whiteColor;
uniform float u_amount;

varying vec2 v_uv;

float _f0(vec3 _p0)
{
    return ((_p0.x * 0.2989999949932098388671875) + (_p0.y * 0.58700001239776611328125)) + (_p0.z * 0.114000000059604644775390625);
}

vec3 _f1(vec3 _p0, vec3 _p1, float _p2)
{
    vec3 _56 = texture2D(u_albedo, v_uv).xyz;
    vec3 param = _56;
    return mix(_56, mix(_p0, _p1, vec3(_f0(param))), vec3(_p2));
}

void main()
{
    vec3 param = u_blackColor;
    vec3 param_1 = u_whiteColor;
    float param_2 = u_amount;
    gl_FragData[0] = vec4(_f1(param, param_1, param_2), 1.0);
}

