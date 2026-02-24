precision highp float;
precision highp int;

uniform vec4 u_backgroundColor;
uniform mediump sampler2D u_imageTexture;
uniform float u_intensity;
uniform float u_opacity;

varying vec2 v_imageTexCoord;

vec3 _f0(vec3 _p0, vec3 _p1)
{
    return _p0 * _p1;
}

void main()
{
    mediump vec4 _35 = texture2D(u_imageTexture, v_imageTexCoord);
    vec4 _t1 = _35;
    vec3 param = u_backgroundColor.xyz;
    vec3 param_1 = clamp(_35.xyz * (1.0 / max(0.001000000047497451305389404296875, _t1.w)), vec3(0.0), vec3(1.0));
    gl_FragData[0] = vec4(mix(u_backgroundColor.xyz, mix(u_backgroundColor.xyz, _f0(param, param_1), vec3(_t1.w)), vec3(u_intensity * u_opacity)), _t1.w);
}

