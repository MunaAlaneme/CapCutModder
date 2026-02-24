precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_albedo;
uniform vec2 center;
uniform float radius;
uniform float angle;

varying vec2 v_uv0;

vec4 _f0(mediump sampler2D _p0, vec2 _p1, vec2 _p2, inout float _p3, float _p4)
{
    vec2 _t0 = _p1 - _p2;
    float _38 = u_ScreenParams.x / u_ScreenParams.y;
    bool _42 = _38 < 1.0;
    if (_42)
    {
        _t0.x *= _38;
    }
    else
    {
        _t0.y /= _38;
    }
    float _58 = length(_t0);
    _p3 *= mix(1.0, 1.25, smoothstep(0.0, 0.449999988079071044921875, (1.77777779102325439453125 / max(_38, 1.0 / _38)) - 1.0));
    if (_58 < _p3)
    {
        float _90 = (1.0 - smoothstep(0.0, 1.0, _58 / _p3)) * radians(_p4);
        float _93 = sin(_90);
        float _96 = cos(_90);
        _t0 = vec2(dot(_t0, vec2(_96, -_93)), dot(_t0, vec2(_93, _96)));
    }
    if (_42)
    {
        _t0.x /= _38;
    }
    else
    {
        _t0.y *= _38;
    }
    vec2 _125 = _t0;
    vec2 _126 = _125 + _p2;
    _t0 = _126;
    return (((texture2D(_p0, _126) * step(_t0.x, 1.0)) * step(_t0.y, 1.0)) * step(0.0, _t0.x)) * step(0.0, _t0.y);
}

void main()
{
    vec2 param = v_uv0;
    vec2 param_1 = center;
    float param_2 = radius / 100.0;
    float param_3 = angle;
    vec4 _167 = _f0(u_albedo, param, param_1, param_2, param_3);
    gl_FragData[0] = _167;
}

