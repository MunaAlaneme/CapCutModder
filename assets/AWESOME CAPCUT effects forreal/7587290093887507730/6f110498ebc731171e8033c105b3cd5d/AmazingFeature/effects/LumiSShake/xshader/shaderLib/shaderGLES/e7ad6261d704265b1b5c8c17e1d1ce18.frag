precision highp float;
precision highp int;

uniform mediump int u_fillModeX;
uniform mediump int u_fillModeY;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_uvR;
varying vec2 v_uvG;
varying vec2 v_uvB;

vec4 _f0(mediump sampler2D _p0, inout vec2 _p1)
{
    float _t0 = 1.0;
    if (u_fillModeX == 1)
    {
        _p1.x = fract(_p1.x);
    }
    else
    {
        if (u_fillModeX == 2)
        {
            _p1.x = abs(mod(_p1.x + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t0 = step(0.0, _p1.x) * step(_p1.x, 1.0);
        }
    }
    float _t1 = 1.0;
    if (u_fillModeY == 1)
    {
        _p1.y = fract(_p1.y);
    }
    else
    {
        if (u_fillModeY == 2)
        {
            _p1.y = abs(mod(_p1.y + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t1 = step(0.0, _p1.y) * step(_p1.y, 1.0);
        }
    }
    return texture2D(_p0, _p1) * (_t0 * _t1);
}

void main()
{
    vec2 param = v_uvR;
    vec4 _106 = _f0(u_inputTexture, param);
    vec4 _t2 = _106;
    vec2 param_1 = v_uvG;
    vec4 _111 = _f0(u_inputTexture, param_1);
    vec4 _t3 = _111;
    vec2 param_2 = v_uvB;
    vec4 _116 = _f0(u_inputTexture, param_2);
    vec4 _t4 = _116;
    gl_FragData[0] = vec4(_t2.x, _t3.y, _t4.z, max(max(_t2.w, _t3.w), _t4.w));
}

