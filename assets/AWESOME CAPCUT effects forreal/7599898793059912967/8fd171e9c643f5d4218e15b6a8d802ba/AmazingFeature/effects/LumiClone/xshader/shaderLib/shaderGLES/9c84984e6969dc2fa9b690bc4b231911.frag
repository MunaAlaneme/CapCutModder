precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform mediump int u_type;
uniform mediump int u_reverseLayer;
uniform float u_angle;
uniform vec4 u_ScreenParams;
uniform float u_initialScale;
uniform vec2 u_center;
uniform mediump int u_count;
uniform float u_distance;
uniform float u_scale;
uniform float u_rotation;
uniform float u_startAlpha;
uniform float u_endAlpha;
uniform float u_sortedIndices[20];
uniform float u_distribution;

varying vec2 v_uv;

vec4 _f0(vec2 _p0, float _p1)
{
    mediump vec4 _29 = texture2D(u_inputTexture, _p0);
    vec4 _31 = _29 * _p1;
    bool _38 = _p0.x < 0.0;
    bool _46;
    if (!_38)
    {
        _46 = _p0.x > 1.0;
    }
    else
    {
        _46 = _38;
    }
    bool _54;
    if (!_46)
    {
        _54 = _p0.y < 0.0;
    }
    else
    {
        _54 = _46;
    }
    bool _61;
    if (!_54)
    {
        _61 = _p0.y > 1.0;
    }
    else
    {
        _61 = _54;
    }
    bvec4 _65 = bvec4(_61);
    return vec4(_65.x ? vec4(0.0).x : _31.x, _65.y ? vec4(0.0).y : _31.y, _65.z ? vec4(0.0).z : _31.z, _65.w ? vec4(0.0).w : _31.w);
}

vec4 _f1(vec4 _p0, vec4 _p1)
{
    if (u_type == 0)
    {
        vec4 _80;
        if (u_reverseLayer == 0)
        {
            _80 = _p0 + (_p1 * (1.0 - _p0.w));
        }
        else
        {
            _80 = (_p1 * _p1.w) + (_p0 * (1.0 - _p1.w));
        }
        return _80;
    }
    else
    {
        return _p0 + (_p1 * (1.0 - _p0.w));
    }
}

void main()
{
    vec4 _t1 = vec4(0.0);
    float _120 = radians(-u_angle);
    vec2 _t3 = vec2(sin(_120), -cos(_120));
    float _135 = u_ScreenParams.x / u_ScreenParams.y;
    mat3 _145 = mat3(vec3(1.0 / _135, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0));
    vec2 _t6 = v_uv - vec2(0.5);
    vec2 _156;
    if (_135 > 1.0)
    {
        _156 = vec2(_t6.x * _135, _t6.y);
    }
    else
    {
        _156 = vec2(_t6.x, _t6.y / _135) * _135;
    }
    _t6 = (((_156 + vec2(0.5)) - vec2(0.5)) / vec2((u_initialScale == 0.0) ? 1.0 : u_initialScale)) + vec2(0.5);
    vec2 _t7 = ((u_center - vec2(0.5)) / vec2(1.0)) + vec2(0.5);
    mediump int _209 = u_count + 1;
    bool _212 = _209 > 1;
    mediump float _213;
    if (_212)
    {
        _213 = 6.28318500518798828125 / float(_209 - 1);
    }
    else
    {
        _213 = 0.0;
    }
    if (u_type == 0)
    {
        mediump float _239;
        float _254;
        float _274;
        float _286;
        for (mediump int _t10 = 1; _t10 <= _209; _t10++)
        {
            if (_t10 == 1)
            {
                _239 = 0.0;
            }
            else
            {
                _239 = float(_t10 - 1) / float(_209 - 1);
            }
            if (_t10 == 1)
            {
                _254 = 0.0;
            }
            else
            {
                _254 = _239 * u_distance;
            }
            vec2 _t12 = vec2(_254);
            float _t13 = (u_scale == (-1.0)) ? (-0.9900000095367431640625) : u_scale;
            if (_t10 == 1)
            {
                _274 = 1.0;
            }
            else
            {
                _274 = 1.0 / mix(1.0, _t13, _239);
            }
            _t13 = _274;
            if (_t10 == 1)
            {
                _286 = 0.0;
            }
            else
            {
                _286 = radians(_239 * u_rotation);
            }
            float _310 = _t13 * cos(_286);
            float _313 = sin(_286);
            vec2 param = (((_145 * mat3(vec3(_310, _t13 * _313, 0.0), vec3((-_t13) * _313, _310, 0.0), vec3(_t7.x - 0.5, _t7.y - 0.5, 1.0))) * mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(((_t3.x * _t12.x) - _t7.x) + 0.5, ((_t3.y * _t12.y) - _t7.y) + 0.5, 1.0))) * vec3(_t6 - vec2(0.5), 1.0)).xy + vec2(0.5);
            float param_1 = mix(clamp(u_startAlpha, 0.0, 1.0), clamp(u_endAlpha, 0.0, 1.0), _239);
            vec4 param_2 = _t1;
            vec4 param_3 = _f0(param, param_1);
            _t1 = _f1(param_2, param_3);
        }
    }
    else
    {
        if (u_type == 1)
        {
            if (_212)
            {
                float _500;
                for (mediump int _t18 = 1; _t18 <= _209; _t18++)
                {
                    mediump int _405 = _t18 - 1;
                    vec2 _t20 = vec2(0.0);
                    float _t21 = 1.0 / u_scale;
                    float _415 = radians(u_rotation);
                    bool _417 = u_sortedIndices[_405] == 1.0;
                    if (_417)
                    {
                        _t20 = vec2(0.0);
                        _t21 = 1.0;
                    }
                    else
                    {
                        float _428 = _120 + (_213 * (u_sortedIndices[_405] - 2.0));
                        _t20 = vec2(cos(_428), sin(_428)) * u_distance;
                    }
                    float _441 = _t21 * cos(_415);
                    float _444 = sin(_415);
                    if (_417)
                    {
                        _500 = clamp(u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _500 = clamp(u_endAlpha, 0.0, 1.0);
                    }
                    vec2 param_4 = (((_145 * mat3(vec3(_441, _t21 * _444, 0.0), vec3((-_t21) * _444, _441, 0.0), vec3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3((_t20.x - _t7.x) + 0.5, (_t20.y - _t7.y) + 0.5, 1.0))) * vec3(_t6 - vec2(0.5), 1.0)).xy + vec2(0.5);
                    float param_5 = _500;
                    vec4 param_6 = _t1;
                    vec4 param_7 = _f0(param_4, param_5);
                    _t1 = _f1(param_6, param_7);
                }
            }
            else
            {
                mediump int _t27 = 0;
                mediump float _525;
                if (_212)
                {
                    _525 = 6.28318500518798828125 / float(_209 - 1);
                }
                else
                {
                    _525 = 0.0;
                }
                vec2 _t32;
                vec2 _t36[20];
                vec4 _t37[20];
                float _653;
                for (mediump int _t29 = 1; _t29 <= _209; _t29++)
                {
                    if (_t29 > 20)
                    {
                        break;
                    }
                    float _551 = 1.0 / u_scale;
                    float _554 = radians(u_rotation);
                    if (_t29 == 1)
                    {
                        _t32 = vec2(0.0);
                    }
                    else
                    {
                        float _569 = _120 + (_525 * float(_t29 - 2));
                        _t32 = vec2(cos(_569), sin(_569)) * u_distance;
                    }
                    float _582 = _551 * cos(_554);
                    float _585 = sin(_554);
                    vec2 _637 = (((_145 * mat3(vec3(_582, _551 * _585, 0.0), vec3((-_551) * _585, _582, 0.0), vec3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3((_t32.x - _t7.x) + 0.5, (_t32.y - _t7.y) + 0.5, 1.0))) * vec3(_t6 - vec2(0.5), 1.0)).xy + vec2(0.5);
                    vec2 _t35 = _637;
                    _t36[_t27] = _637;
                    mediump vec4 _650 = texture2D(u_inputTexture, _637);
                    if (_t29 == 1)
                    {
                        _653 = clamp(u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _653 = clamp(u_endAlpha, 0.0, 1.0);
                    }
                    _t37[_t27] = _650 * _653;
                    bool _666 = _t35.x < 0.0;
                    bool _673;
                    if (!_666)
                    {
                        _673 = _t35.x > 1.0;
                    }
                    else
                    {
                        _673 = _666;
                    }
                    bool _680;
                    if (!_673)
                    {
                        _680 = _t35.y < 0.0;
                    }
                    else
                    {
                        _680 = _673;
                    }
                    bool _687;
                    if (!_680)
                    {
                        _687 = _t35.y > 1.0;
                    }
                    else
                    {
                        _687 = _680;
                    }
                    if (_687)
                    {
                        _t37[_t27] = vec4(0.0);
                    }
                    _t27++;
                }
                for (mediump int _t38 = 1; _t38 < _t27; _t38++)
                {
                    vec2 _708 = _t36[_t38];
                    vec2 _t39 = _708;
                    vec4 _712 = _t37[_t38];
                    mediump int _t41 = _t38 - 1;
                    for (;;)
                    {
                        bool _722 = _t41 >= 0;
                        bool _731;
                        if (_722)
                        {
                            _731 = _t36[_t41].y < _t39.y;
                        }
                        else
                        {
                            _731 = _722;
                        }
                        if (_731)
                        {
                            mediump int _733 = _t41 + 1;
                            _t36[_733] = _t36[_t41];
                            _t37[_733] = _t37[_t41];
                            _t41--;
                            continue;
                        }
                        else
                        {
                            break;
                        }
                    }
                    mediump int _747 = _t41 + 1;
                    _t36[_747] = _708;
                    _t37[_747] = _712;
                }
                for (mediump int _t42 = 0; _t42 < _t27; _t42++)
                {
                    vec4 param_8 = _t1;
                    vec4 param_9 = _t37[_t42];
                    _t1 = _f1(param_8, param_9);
                }
            }
        }
        else
        {
            if (u_type == 2)
            {
                for (mediump int _t43 = 1; _t43 <= _209; _t43++)
                {
                    float _794 = float(_t43 + int(u_distribution));
                    float _814 = (fract(sin(_794 * 78.233001708984375) * 43758.546875) * 2.0) * 3.141592502593994140625;
                    vec2 _t47 = vec2(cos(_814), sin(_814)) * (fract(sin(_794 * 12.98980045318603515625) * 43758.546875) * u_distance);
                    float _t48 = 0.0;
                    float _t49 = 1.0;
                    if (_t43 == 1)
                    {
                        _t47 = vec2(0.0);
                        _t48 = 0.0;
                        _t49 = 1.0;
                    }
                    else
                    {
                        _t48 = mix(0.0, (((fract(sin(_794 * 167.2299957275390625) * 43758.546875) * 2.0) - 1.0) * 3.141592502593994140625) * 2.0, clamp(u_rotation, -360.0, 360.0) / 360.0);
                        _t49 = mix(1.0, mix(0.25, 2.5, abs(fract(sin((_794 * 3.1415159702301025390625) + 45.67800140380859375) * 43758.546875))), clamp(u_scale, 0.0, 1.0));
                    }
                    float _868 = _t49 * cos(_t48);
                    float _871 = sin(_t48);
                    vec2 _923 = (((_145 * mat3(vec3(_868, _t49 * _871, 0.0), vec3((-_t49) * _871, _868, 0.0), vec3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3((_t47.x - _t7.x) + 0.5, (_t47.y - _t7.y) + 0.5, 1.0))) * vec3(_t6 - vec2(0.5), 1.0)).xy + vec2(0.5);
                    vec2 _t52 = _923;
                    vec4 _t53 = vec4(0.0);
                    if (_t43 == 1)
                    {
                        _t53 = texture2D(u_inputTexture, _923) * clamp(u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _t53 = texture2D(u_inputTexture, _923) * clamp(u_endAlpha, 0.0, 1.0);
                    }
                    bool _945 = _t52.x < 0.0;
                    bool _952;
                    if (!_945)
                    {
                        _952 = _t52.x > 1.0;
                    }
                    else
                    {
                        _952 = _945;
                    }
                    bool _959;
                    if (!_952)
                    {
                        _959 = _t52.y < 0.0;
                    }
                    else
                    {
                        _959 = _952;
                    }
                    bool _966;
                    if (!_959)
                    {
                        _966 = _t52.y > 1.0;
                    }
                    else
                    {
                        _966 = _959;
                    }
                    if (_966)
                    {
                        _t53 = vec4(0.0);
                    }
                    _t1 += (_t53 * (1.0 - _t1.w));
                }
            }
        }
    }
    gl_FragData[0] = _t1;
}

