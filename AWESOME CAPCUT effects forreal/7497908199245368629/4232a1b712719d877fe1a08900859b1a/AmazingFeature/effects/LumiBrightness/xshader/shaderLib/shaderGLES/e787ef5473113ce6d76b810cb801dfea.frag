precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform float u_intensity;

varying vec2 uv0;

void main()
{
    vec4 _t0 = texture2D(u_inputTexture, uv0);
    float _t1 = 0.0;
    if (u_intensity > 0.0)
    {
        _t1 = 1.0 + (u_intensity * 5.0);
    }
    else
    {
        _t1 = 1.0 / (1.0 - (u_intensity * 2.5));
        vec4 _46 = _t0;
        vec3 _49 = _46.xyz - vec3((-u_intensity) * 0.00999999977648258209228515625);
        _t0.x = _49.x;
        _t0.y = _49.y;
        _t0.z = _49.z;
    }
    vec4 _60 = _t0;
    vec3 _68 = vec3(1.0) - pow(vec3(1.0) - _60.xyz, vec3(_t1));
    _t0.x = _68.x;
    _t0.y = _68.y;
    _t0.z = _68.z;
    gl_FragData[0] = clamp(_t0, vec4(0.0), vec4(1.0));
}

