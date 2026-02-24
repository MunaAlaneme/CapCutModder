precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_inputTexture;
uniform float u_rotationAngle;
uniform vec2 u_dotsShift;
uniform float u_dotsRelativeWidth;
uniform float u_dotFreq;
uniform vec2 u_alternateShift;
uniform mediump int u_colorMode;
uniform mediump int u_useRings;
uniform mediump int u_blackDots;
uniform float u_dotsSharpen;
uniform float u_dotsLighten;
uniform float u_ringThickness;
uniform float u_ringCount;
uniform float u_ringPhase;
uniform float u_redOffsetX;
uniform float u_redOffsetY;
uniform float u_greenOffsetX;
uniform float u_greenOffsetY;
uniform float u_blueOffsetX;
uniform float u_blueOffsetY;
uniform vec3 u_color2;
uniform vec3 u_color1;

varying vec2 v_uv;

vec2 _f2(inout vec2 _p0, float _p1, vec2 _p2, vec2 _p3, vec2 _p4)
{
    _p0 -= _p2;
    _p0 -= vec2(0.5);
    _p0.x *= (u_ScreenParams.x / u_ScreenParams.y);
    float _132 = sin(_p1);
    float _135 = cos(_p1);
    _p0 = mat2(vec2(_135, _132), vec2(-_132, _135)) * _p0;
    _p0 *= _p4;
    _p0 += vec2(0.5);
    _p0 += _p3;
    return _p0;
}

float _f0(vec2 _p0, float _p1, mediump int _p2, float _p3, float _p4, float _p5, float _p6, float _p7)
{
    float _t0 = length(_p0 - vec2(0.5));
    if (_p2 == 1)
    {
        _t0 = 1.0 - _t0;
    }
    float _61 = fract(((_t0 * _p6) + _p7) * 0.5);
    return smoothstep(-_p3, _p3, (_p1 - (smoothstep(0.5 - _p5, 0.5, _61) - smoothstep(0.5, 0.5 + _p5, _61))) + _p4);
}

float _f1(vec2 _p0, float _p1, mediump int _p2, float _p3, float _p4)
{
    float _t3 = length(_p0 - vec2(0.5));
    if (_p2 == 1)
    {
        _t3 = 1.0 - _t3;
    }
    return smoothstep(-_p3, _p3, (_p1 - _t3) + _p4);
}

void main()
{
    mediump vec4 _173 = texture2D(u_inputTexture, v_uv);
    vec4 _t8 = _173;
    float _176 = _t8.w;
    vec3 _183 = _173.xyz / vec3(max(_176, 0.001000000047497451305389404296875));
    _t8.x = _183.x;
    _t8.y = _183.y;
    _t8.z = _183.z;
    float _198 = dot(_t8.xyz, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    vec2 param = v_uv;
    float param_1 = radians(u_rotationAngle);
    vec2 param_2 = u_dotsShift;
    vec2 param_3 = vec2(0.5);
    vec2 param_4 = vec2(u_dotsRelativeWidth, 1.0);
    vec2 _216 = _f2(param, param_1, param_2, param_3, param_4);
    vec2 _224 = vec2(1.0 / u_dotFreq);
    vec2 _t12 = floor(_216 / _224);
    vec2 _251 = fract((_216 + vec2(mod(_t12.y, 2.0) * u_alternateShift.x, mod(_t12.x, 2.0) * u_alternateShift.y)) / _224);
    vec3 _t15;
    if (u_colorMode == 0)
    {
        if (u_useRings == 1)
        {
            vec2 param_5 = _251;
            float param_6 = _198;
            mediump int param_7 = u_blackDots;
            float param_8 = u_dotsSharpen;
            float param_9 = u_dotsLighten;
            float param_10 = u_ringThickness;
            float param_11 = u_ringCount;
            float param_12 = u_ringPhase;
            _t15 = vec3(_f0(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12));
        }
        else
        {
            vec2 param_13 = _251;
            float param_14 = _198;
            mediump int param_15 = u_blackDots;
            float param_16 = u_dotsSharpen;
            float param_17 = u_dotsLighten;
            _t15 = vec3(_f1(param_13, param_14, param_15, param_16, param_17));
        }
    }
    else
    {
        vec2 _309 = vec2(u_redOffsetX, u_redOffsetY);
        vec2 _310 = vec2(0.5) * _309;
        vec2 _t18;
        vec3 _t20;
        for (mediump int _t17 = 0; _t17 < 3; _t17++)
        {
            if (_t17 == 0)
            {
                _t18 = _310 * _309;
            }
            else
            {
                if (_t17 == 1)
                {
                    _t18 = _310 * vec2(u_greenOffsetX, u_greenOffsetY);
                }
                else
                {
                    _t18 = _310 * vec2(u_blueOffsetX, u_blueOffsetY);
                }
            }
            int _353 = int(u_colorMode == 1);
            if (u_useRings == 1)
            {
                vec2 param_18 = _251 + _t18;
                float param_19 = _t8[_t17];
                mediump int param_20 = _353;
                float param_21 = u_dotsSharpen;
                float param_22 = u_dotsLighten;
                float param_23 = u_ringThickness;
                float param_24 = u_ringCount;
                float param_25 = u_ringPhase;
                _t20[_t17] = _f0(param_18, param_19, param_20, param_21, param_22, param_23, param_24, param_25);
            }
            else
            {
                vec2 param_26 = _251 + _t18;
                float param_27 = _t8[_t17];
                mediump int param_28 = _353;
                float param_29 = u_dotsSharpen;
                float param_30 = u_dotsLighten;
                _t20[_t17] = _f1(param_26, param_27, param_28, param_29, param_30);
            }
        }
        _t15 = _t20;
    }
    gl_FragData[0] = vec4(mix(u_color2, u_color1, _t15), 1.0) * _t8.w;
}

