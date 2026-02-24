precision highp float;
precision highp int;

uniform mediump int u_fillModeX;
uniform mediump int u_fillModeY;
uniform mediump int u_frameCount;
uniform vec4 u_matricesR[260];
uniform vec4 u_matricesB[260];
uniform float u_step;
uniform vec4 u_matricesG[260];
uniform vec2 u_spriteSize;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_p;

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

vec4 _f1(mediump sampler2D _p0, vec4 _p1, vec2 _p2)
{
    vec4 _t2 = vec4(0.0);
    float _t3 = 0.0;
    for (mediump int _t4 = 0; _t4 < 64; _t4++)
    {
        if (_t4 >= u_frameCount)
        {
            break;
        }
        mediump int _146 = _t4 * 4;
        vec2 _192 = (mat4(vec4(u_matricesR[_146 + 0]), vec4(u_matricesR[_146 + 1]), vec4(u_matricesR[_146 + 2]), vec4(u_matricesR[_146 + 3])) * _p1).xy;
        vec2 _243 = (mat4(vec4(u_matricesB[_146 + 4]), vec4(u_matricesB[_146 + 5]), vec4(u_matricesB[_146 + 6]), vec4(u_matricesB[_146 + 7])) * _p1).xy;
        float _257 = clamp(ceil(length(_243 - _192) / u_step), 1.0, 8.0);
        vec2 param = _192 * _p2;
        vec4 _262 = _f0(_p0, param);
        _t2 += _262;
        _t3 += 1.0;
        for (mediump int _t11 = 1; _t11 < 8; _t11++)
        {
            if (float(_t11) >= _257)
            {
                break;
            }
            vec2 param_1 = mix(_192, _243, vec2(float(_t11) / _257)) * _p2;
            vec4 _296 = _f0(_p0, param_1);
            _t2 += _296;
            _t3 += 1.0;
        }
    }
    return _t2 / vec4(_t3);
}

vec4 _f2(mediump sampler2D _p0, vec4 _p1, vec2 _p2)
{
    vec4 _t13 = vec4(0.0);
    float _t14 = 0.0;
    for (mediump int _t15 = 0; _t15 < 64; _t15++)
    {
        if (_t15 >= u_frameCount)
        {
            break;
        }
        mediump int _330 = _t15 * 4;
        vec2 _374 = (mat4(vec4(u_matricesG[_330 + 0]), vec4(u_matricesG[_330 + 1]), vec4(u_matricesG[_330 + 2]), vec4(u_matricesG[_330 + 3])) * _p1).xy;
        vec2 _421 = (mat4(vec4(u_matricesB[_330 + 4]), vec4(u_matricesB[_330 + 5]), vec4(u_matricesB[_330 + 6]), vec4(u_matricesB[_330 + 7])) * _p1).xy;
        float _432 = clamp(ceil(length(_421 - _374) / u_step), 1.0, 8.0);
        vec2 param = _374 * _p2;
        vec4 _437 = _f0(_p0, param);
        _t13 += _437;
        _t14 += 1.0;
        for (mediump int _t22 = 1; _t22 < 8; _t22++)
        {
            if (float(_t22) >= _432)
            {
                break;
            }
            vec2 param_1 = mix(_374, _421, vec2(float(_t22) / _432)) * _p2;
            vec4 _470 = _f0(_p0, param_1);
            _t13 += _470;
            _t14 += 1.0;
        }
    }
    return _t13 / vec4(_t14);
}

vec4 _f3(mediump sampler2D _p0, vec4 _p1, vec2 _p2)
{
    vec4 _t24 = vec4(0.0);
    float _t25 = 0.0;
    for (mediump int _t26 = 0; _t26 < 64; _t26++)
    {
        if (_t26 >= u_frameCount)
        {
            break;
        }
        mediump int _503 = _t26 * 4;
        vec2 _547 = (mat4(vec4(u_matricesB[_503 + 0]), vec4(u_matricesB[_503 + 1]), vec4(u_matricesB[_503 + 2]), vec4(u_matricesB[_503 + 3])) * _p1).xy;
        vec2 _594 = (mat4(vec4(u_matricesB[_503 + 4]), vec4(u_matricesB[_503 + 5]), vec4(u_matricesB[_503 + 6]), vec4(u_matricesB[_503 + 7])) * _p1).xy;
        float _605 = clamp(ceil(length(_594 - _547) / u_step), 1.0, 8.0);
        for (mediump int _t33 = 1; _t33 < 8; _t33++)
        {
            if (float(_t33) >= _605)
            {
                break;
            }
            vec2 param = mix(_547, _594, vec2(float(_t33) / _605)) * _p2;
            vec4 _634 = _f0(_p0, param);
            _t24 += _634;
            _t25 += 1.0;
        }
        vec2 param_1 = _547 * _p2;
        vec4 _645 = _f0(_p0, param_1);
        _t24 += _645;
        _t25 += 1.0;
    }
    return _t24 / vec4(_t25);
}

void main()
{
    vec4 _664 = vec4(v_p, 0.0, 1.0);
    vec2 _670 = vec2(1.0) / u_spriteSize;
    vec4 param = _664;
    vec2 param_1 = _670;
    vec4 _t37 = _f1(u_inputTexture, param, param_1);
    vec4 param_2 = _664;
    vec2 param_3 = _670;
    vec4 _t38 = _f2(u_inputTexture, param_2, param_3);
    vec4 param_4 = _664;
    vec2 param_5 = _670;
    vec4 _t39 = _f3(u_inputTexture, param_4, param_5);
    gl_FragData[0] = vec4(_t37.x, _t38.y, _t39.z, max(max(_t37.w, _t38.w), _t39.w));
}

