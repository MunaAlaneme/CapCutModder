precision highp float;
precision highp int;

uniform mediump sampler2D u_lens;
uniform mediump int u_fine;
uniform float u_rotateWarpDir;
uniform float u_amountRelX;
uniform float u_amountRelY;
uniform mediump int u_wrapModeX;
uniform mediump int u_wrapModeY;
uniform vec4 u_ScreenParams;
uniform float u_amount;
uniform mediump sampler2D u_source;

varying vec2 v_uv;

float _f0(vec4 _p0)
{
    return ((_p0.x + (_p0.y / 255.0)) + (_p0.z / 65025.0)) + (_p0.w / 16581375.0);
}

vec2 _f4(vec2 _p0, float _p1, vec2 _p2)
{
    vec2 _t7 = vec2(abs(_p1)) / (_p2 * 1080.0);
    vec4 param = texture2D(u_lens, _p0 + vec2(_t7.x, 0.0));
    vec4 param_1 = texture2D(u_lens, _p0 - vec2(_t7.x, 0.0));
    vec4 param_2 = texture2D(u_lens, _p0 + vec2(0.0, _t7.y));
    vec4 param_3 = texture2D(u_lens, _p0 - vec2(0.0, _t7.y));
    return vec2(_f0(param) - _f0(param_1), _f0(param_2) - _f0(param_3));
}

vec2 _f1(vec2 _p0, float _p1)
{
    float _84 = sin(_p1);
    float _87 = cos(_p1);
    return vec2((_p0.x * _87) - (_p0.y * _84), (_p0.x * _84) + (_p0.y * _87));
}

vec2 _f5(vec2 _p0, inout vec2 _p1, float _p2)
{
    if (u_fine == 1)
    {
        _p1 *= 0.00999999977648258209228515625;
    }
    vec2 param = _p1;
    float param_1 = radians(u_rotateWarpDir);
    _p1 = _f1(param, param_1);
    return _p0 + ((_p1 * _p2) * vec2(u_amountRelX, u_amountRelY));
}

float _f2(float _p0)
{
    float _111 = fract(_p0);
    float _116 = floor(mod(_p0, 2.0));
    return (_111 + _116) - ((_111 * _116) * 2.0);
}

vec2 _f3(inout vec2 _p0, mediump int _p1, mediump int _p2, vec2 _p3)
{
    if (_p1 == 0)
    {
        _p0.x = clamp(_p0.x, 0.0, 1.0);
    }
    else
    {
        if (_p1 == 1)
        {
            _p0.x = mod(_p0.x, _p3.x);
        }
        else
        {
            if (_p1 == 2)
            {
                float param = _p0.x;
                _p0.x = _f2(param);
            }
        }
    }
    if (_p2 == 0)
    {
        _p0.y = clamp(_p0.y, 0.0, 1.0);
    }
    else
    {
        if (_p2 == 1)
        {
            _p0.y = mod(_p0.y, _p3.y);
        }
        else
        {
            if (_p2 == 2)
            {
                float param_1 = _p0.y;
                _p0.y = _f2(param_1);
            }
        }
    }
    return _p0;
}

vec4 _f6(mediump sampler2D _p0, inout vec2 _p1, vec2 _p2)
{
    vec2 param = _p1;
    mediump int param_1 = u_wrapModeX;
    mediump int param_2 = u_wrapModeY;
    vec2 param_3 = _p2;
    vec2 _309 = _f3(param, param_1, param_2, param_3);
    _p1 = _309;
    return texture2D(_p0, _p1);
}

void main()
{
    vec2 _328 = u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y));
    vec2 param = v_uv;
    float param_1 = u_amount;
    vec2 param_2 = _328;
    vec2 param_3 = v_uv;
    vec2 param_4 = _f4(param, param_1, param_2);
    float param_5 = u_amount;
    vec2 _347 = _f5(param_3, param_4, param_5);
    vec2 param_6 = _347;
    vec2 param_7 = _328;
    vec4 _355 = _f6(u_source, param_6, param_7);
    gl_FragData[0] = _355;
}

