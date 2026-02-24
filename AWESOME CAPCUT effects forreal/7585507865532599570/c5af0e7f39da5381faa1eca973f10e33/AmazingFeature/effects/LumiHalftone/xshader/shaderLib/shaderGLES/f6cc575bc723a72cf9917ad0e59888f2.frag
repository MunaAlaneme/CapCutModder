precision highp float;
precision highp int;

uniform float u_stride;
uniform mediump sampler2D u_inputTex;
uniform vec4 u_ScreenParams;
uniform float u_angle;
uniform mediump int u_steps;

varying vec2 v_uv;

float _f0(float _p0)
{
    return exp(((-0.5) * (_p0 * _p0)) / 0.0900000035762786865234375);
}

vec4 _f1(mediump int _p0, vec2 _p1)
{
    vec4 _t0 = vec4(0.0);
    vec4 _t1 = vec4(0.0);
    for (mediump int _t2 = 0; _t2 < 1000; _t2++)
    {
        if (_t2 >= _p0)
        {
            break;
        }
        mediump float _56 = float(_t2);
        float param = _56 / float(_p0);
        float _63 = _f0(param);
        _t0 += (((texture2D(u_inputTex, v_uv + ((_p1 * _56) * u_stride)) + texture2D(u_inputTex, v_uv + ((_p1 * (-_56)) * u_stride))) * _63) / vec4(2.0));
        _t1 += vec4(_63);
    }
    return _t0 / max(vec4(_t1), vec4(0.001000000047497451305389404296875));
}

void main()
{
    mediump int param = u_steps;
    vec2 param_1 = vec2(cos(u_angle), sin(u_angle)) / ((u_ScreenParams.xy * 720.0) / vec2(min(u_ScreenParams.x, u_ScreenParams.y)));
    gl_FragData[0] = _f1(param, param_1);
}

