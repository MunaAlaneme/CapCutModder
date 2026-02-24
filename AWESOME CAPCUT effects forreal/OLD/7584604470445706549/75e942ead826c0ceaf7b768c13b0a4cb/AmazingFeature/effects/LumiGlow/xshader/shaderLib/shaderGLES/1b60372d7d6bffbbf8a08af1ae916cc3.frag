precision highp float;
precision highp int;

uniform float u_colorPhase;
uniform float u_colorLoops;
uniform float u_midpoint;
uniform mediump int u_glowColors;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform mediump sampler2D u_inputTexture;
uniform mediump sampler2D u_blurTexture;
uniform mediump int u_show;
uniform float u_intensity;
uniform mediump int u_blendMode;

varying vec2 v_uv;

float _f1(float _p0)
{
    float _55 = mod(_p0 + u_colorPhase, 1.0099999904632568359375) * u_colorLoops;
    float _t1 = ceil(_55) - _55;
    if (u_midpoint == 0.5)
    {
        return _t1;
    }
    float _74 = clamp(u_midpoint, 0.00999999977648258209228515625, 0.9900000095367431640625);
    float _76 = _t1;
    float _91 = _76 / max(2.0 * _74, 9.9999997473787516355514526367188e-05);
    _t1 = _91;
    if (_91 < 0.5)
    {
        return clamp(_t1, 0.0, 0.5);
    }
    return clamp(((_76 - 1.0) / (2.0 * max(1.0 - _74, 9.9999997473787516355514526367188e-05))) + 1.0, 0.5, 1.0);
}

float _f0(float _p0, float _p1, float _p2, float _p3, float _p4)
{
    return (((_p0 - _p1) * (_p4 - _p3)) / (_p2 - _p1)) + _p3;
}

float _f2(inout float _p0)
{
    _p0 = mod(_p0 + u_colorPhase, 1.0);
    _p0 = mod(_p0, 1.0 / u_colorLoops);
    _p0 *= u_colorLoops;
    _p0 = (_p0 * 2.0) - 1.0;
    float _t4 = 0.0;
    float param = u_midpoint;
    float param_1 = 0.0;
    float param_2 = 1.0;
    float param_3 = 0.100000001490116119384765625;
    float param_4 = 0.89999997615814208984375;
    float _128 = _f0(param, param_1, param_2, param_3, param_4);
    if (_128 <= 0.5)
    {
        _t4 = 0.5 * (1.0 + cos(3.141592502593994140625 * pow(abs(_p0), 2.0 * _128)));
    }
    else
    {
        _t4 = 1.0 - (0.5 * (1.0 + cos(3.141592502593994140625 * pow(1.0 - abs(_p0), 2.0 * (1.0 - _128)))));
    }
    return _t4;
}

vec4 _f3(vec4 _p0)
{
    if (u_glowColors < 1)
    {
        return _p0;
    }
    if (u_glowColors == 1)
    {
        vec4 _t6 = _p0;
        float param = _p0.x;
        float _191 = _t6.w;
        vec3 _192 = mix(u_colorA, u_colorB, vec3(_f1(param))) * _191;
        _t6.x = _192.x;
        _t6.y = _192.y;
        _t6.z = _192.z;
        return _t6;
    }
    else
    {
        if (u_glowColors == 2)
        {
            vec4 _t7 = _p0;
            float param_1 = _p0.x;
            float _216 = _f2(param_1);
            float _220 = _t7.w;
            vec3 _221 = mix(u_colorB, u_colorA, vec3(_216)) * _220;
            _t7.x = _221.x;
            _t7.y = _221.y;
            _t7.z = _221.z;
            return _t7;
        }
    }
    return _p0;
}

void main()
{
    mediump vec4 _243 = texture2D(u_inputTexture, v_uv);
    vec4 _t8 = _243;
    mediump vec4 _248 = texture2D(u_blurTexture, v_uv);
    if (u_show == 1)
    {
        gl_FragData[0] = _248;
        return;
    }
    vec4 param = _248;
    vec4 _t10 = _f3(param) * u_intensity;
    if (_t10.w > 1.0)
    {
        _t10 /= vec4(_t10.w);
    }
    if ((u_show == 2) || (u_blendMode == 6))
    {
        gl_FragData[0] = _t10;
        return;
    }
    vec4 _t11 = _243;
    if (u_blendMode == 1)
    {
        vec4 _296 = _t10;
        vec4 _297 = (vec4(1.0) - _248) + _296;
        _t10 = _297;
        vec3 _302 = _297.xyz * _243.xyz;
        _t11.x = _302.x;
        _t11.y = _302.y;
        _t11.z = _302.z;
    }
    else
    {
        if (u_blendMode == 2)
        {
            vec3 _319 = abs(_t10.xyz - _243.xyz);
            _t11.x = _319.x;
            _t11.y = _319.y;
            _t11.z = _319.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                vec3 _336 = max(_t10.xyz, _243.xyz);
                _t11.x = _336.x;
                _t11.y = _336.y;
                _t11.z = _336.z;
            }
            else
            {
                if (u_blendMode == 4)
                {
                    vec3 _352 = _243.xyz;
                    vec3 _359 = (_t10.xyz + _352) - (_t10.xyz * _352);
                    _t11.x = _359.x;
                    _t11.y = _359.y;
                    _t11.z = _359.z;
                }
                else
                {
                    if (u_blendMode == 5)
                    {
                        vec3 _373 = _243.xyz;
                        vec3 _383 = (_373 + _t10.xyz) - ((_373 * 2.0) * _t10.xyz);
                        _t11.x = _383.x;
                        _t11.y = _383.y;
                        _t11.z = _383.z;
                    }
                    else
                    {
                        vec3 _395 = _t10.xyz + _243.xyz;
                        _t11.x = _395.x;
                        _t11.y = _395.y;
                        _t11.z = _395.z;
                    }
                }
            }
        }
    }
    _t11.w = _t10.w + ((1.0 - _t10.w) * _t8.w);
    gl_FragData[0] = _t11;
}

