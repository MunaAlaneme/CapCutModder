#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

// Implementation of the GLSL radians() function
template<typename T>
inline T radians(T d)
{
    return d * T(0.01745329251);
}

struct buffer_t
{
    float4 u_ScreenParams;
    float u_rotationAngle;
    float2 u_dotsShift;
    float u_dotsRelativeWidth;
    float u_dotFreq;
    float2 u_alternateShift;
    int u_colorMode;
    int u_useRings;
    int u_blackDots;
    float u_dotsSharpen;
    float u_dotsLighten;
    float u_ringThickness;
    float u_ringCount;
    float u_ringPhase;
    float u_redOffsetX;
    float u_redOffsetY;
    float u_greenOffsetX;
    float u_greenOffsetY;
    float u_blueOffsetX;
    float u_blueOffsetY;
    float3 u_color2;
    float3 u_color1;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float2 _f2(thread float2& _p0, thread const float& _p1, thread const float2& _p2, thread const float2& _p3, thread const float2& _p4, constant float4& u_ScreenParams)
{
    _p0 -= _p2;
    _p0 -= float2(0.5);
    _p0.x *= (u_ScreenParams.x / u_ScreenParams.y);
    float _132 = sin(_p1);
    float _135 = cos(_p1);
    _p0 = float2x2(float2(_135, _132), float2(-_132, _135)) * _p0;
    _p0 *= _p4;
    _p0 += float2(0.5);
    _p0 += _p3;
    return _p0;
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0, thread const float& _p1, thread const int& _p2, thread const float& _p3, thread const float& _p4, thread const float& _p5, thread const float& _p6, thread const float& _p7)
{
    float _t0 = length(_p0 - float2(0.5));
    if (_p2 == 1)
    {
        _t0 = 1.0 - _t0;
    }
    float _61 = fract(((_t0 * _p6) + _p7) * 0.5);
    return smoothstep(-_p3, _p3, (_p1 - (smoothstep(0.5 - _p5, 0.5, _61) - smoothstep(0.5, 0.5 + _p5, _61))) + _p4);
}

static inline __attribute__((always_inline))
float _f1(thread const float2& _p0, thread const float& _p1, thread const int& _p2, thread const float& _p3, thread const float& _p4)
{
    float _t3 = length(_p0 - float2(0.5));
    if (_p2 == 1)
    {
        _t3 = 1.0 - _t3;
    }
    return smoothstep(-_p3, _p3, (_p1 - _t3) + _p4);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _173 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t8 = _173;
    float _176 = _t8.w;
    float3 _183 = _173.xyz / float3(fast::max(_176, 0.001000000047497451305389404296875));
    _t8.x = _183.x;
    _t8.y = _183.y;
    _t8.z = _183.z;
    float _198 = dot(_t8.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float2 param = in.v_uv;
    float param_1 = radians(buffer.u_rotationAngle);
    float2 param_2 = buffer.u_dotsShift;
    float2 param_3 = float2(0.5);
    float2 param_4 = float2(buffer.u_dotsRelativeWidth, 1.0);
    float2 _216 = _f2(param, param_1, param_2, param_3, param_4, buffer.u_ScreenParams);
    float2 _224 = float2(1.0 / buffer.u_dotFreq);
    float2 _t12 = floor(_216 / _224);
    float2 _251 = fract((_216 + float2(mod(_t12.y, 2.0) * buffer.u_alternateShift.x, mod(_t12.x, 2.0) * buffer.u_alternateShift.y)) / _224);
    float3 _t15;
    if (buffer.u_colorMode == 0)
    {
        if (buffer.u_useRings == 1)
        {
            float2 param_5 = _251;
            float param_6 = _198;
            int param_7 = buffer.u_blackDots;
            float param_8 = buffer.u_dotsSharpen;
            float param_9 = buffer.u_dotsLighten;
            float param_10 = buffer.u_ringThickness;
            float param_11 = buffer.u_ringCount;
            float param_12 = buffer.u_ringPhase;
            _t15 = float3(_f0(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12));
        }
        else
        {
            float2 param_13 = _251;
            float param_14 = _198;
            int param_15 = buffer.u_blackDots;
            float param_16 = buffer.u_dotsSharpen;
            float param_17 = buffer.u_dotsLighten;
            _t15 = float3(_f1(param_13, param_14, param_15, param_16, param_17));
        }
    }
    else
    {
        float2 _309 = float2(buffer.u_redOffsetX, buffer.u_redOffsetY);
        float2 _310 = float2(0.5) * _309;
        float2 _t18;
        float3 _t20;
        for (int _t17 = 0; _t17 < 3; _t17++)
        {
            if (_t17 == 0)
            {
                _t18 = _310 * _309;
            }
            else
            {
                if (_t17 == 1)
                {
                    _t18 = _310 * float2(buffer.u_greenOffsetX, buffer.u_greenOffsetY);
                }
                else
                {
                    _t18 = _310 * float2(buffer.u_blueOffsetX, buffer.u_blueOffsetY);
                }
            }
            int _353 = int(buffer.u_colorMode == 1);
            if (buffer.u_useRings == 1)
            {
                float2 param_18 = _251 + _t18;
                float param_19 = _t8[_t17];
                int param_20 = _353;
                float param_21 = buffer.u_dotsSharpen;
                float param_22 = buffer.u_dotsLighten;
                float param_23 = buffer.u_ringThickness;
                float param_24 = buffer.u_ringCount;
                float param_25 = buffer.u_ringPhase;
                _t20[_t17] = _f0(param_18, param_19, param_20, param_21, param_22, param_23, param_24, param_25);
            }
            else
            {
                float2 param_26 = _251 + _t18;
                float param_27 = _t8[_t17];
                int param_28 = _353;
                float param_29 = buffer.u_dotsSharpen;
                float param_30 = buffer.u_dotsLighten;
                _t20[_t17] = _f1(param_26, param_27, param_28, param_29, param_30);
            }
        }
        _t15 = _t20;
    }
    out.o_fragColor = float4(mix(buffer.u_color2, buffer.u_color1, _t15), 1.0) * _t8.w;
    return out;
}

