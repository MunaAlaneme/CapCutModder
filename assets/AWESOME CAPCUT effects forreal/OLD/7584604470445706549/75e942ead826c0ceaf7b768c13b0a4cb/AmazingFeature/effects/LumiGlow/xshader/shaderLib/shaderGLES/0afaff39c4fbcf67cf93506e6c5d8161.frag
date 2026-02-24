precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_inputTexture;
uniform float u_sigma;
uniform float u_horzR;

varying vec2 uv0;

float _f1(float _p0)
{
    return exp((-(_p0 * _p0)) / (((((2.0 * u_sigma) * u_sigma) * u_horzR) * u_horzR) / 100.0)) * 10.0;
}

vec4 _f0(float _p0)
{
    vec2 _49 = vec2(1.0) / ((vec2(u_ScreenParams.xy) / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * 800.0);
    vec2 _59 = uv0 + (_49 * vec2(_p0, 0.0));
    vec2 _t2 = _59;
    vec2 _66 = uv0 - (_49 * vec2(_p0, 0.0));
    vec2 _t3 = _66;
    return ((texture2D(u_inputTexture, _59) * step(_t2.x, 1.0)) * step(0.0, _t2.x)) + ((texture2D(u_inputTexture, _66) * step(_t3.x, 1.0)) * step(0.0, _t3.x));
}

vec4 _f2(vec4 _p0)
{
    vec4 _t5 = vec4(0.0) + (_p0 * 10.0);
    float _t7 = 10.0;
    float _t8 = 0.0;
    for (float _t9 = 1.0; _t9 <= 100.0; _t9 += 1.0)
    {
        if (_t9 > (8.0 * (u_horzR / 10.0)))
        {
            break;
        }
        float param = _t9;
        _t8 = _f1(param);
        float param_1 = _t9;
        _t5 += (_f0(param_1) * _t8);
        _t7 += (_t8 * 2.0);
    }
    vec4 _166 = _t5;
    vec4 _168 = _166 / vec4(_t7);
    _t5 = _168;
    return _168;
}

void main()
{
    vec4 param = texture2D(u_inputTexture, uv0);
    gl_FragData[0] = _f2(param);
}

