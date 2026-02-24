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
    int u_fine;
    float u_rotateWarpDir;
    float u_amountRelX;
    float u_amountRelY;
    int u_wrapModeX;
    int u_wrapModeY;
    float4 u_ScreenParams;
    float u_amount;
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
float _f0(thread const float4& _p0)
{
    return ((_p0.x + (_p0.y / 255.0)) + (_p0.z / 65025.0)) + (_p0.w / 16581375.0);
}

static inline __attribute__((always_inline))
float2 _f4(thread const float2& _p0, thread const float& _p1, thread const float2& _p2, texture2d<float> u_lens, sampler u_lensSmplr)
{
    float2 _t7 = float2(abs(_p1)) / (_p2 * 1080.0);
    float4 param = u_lens.sample(u_lensSmplr, (_p0 + float2(_t7.x, 0.0)));
    float4 param_1 = u_lens.sample(u_lensSmplr, (_p0 - float2(_t7.x, 0.0)));
    float4 param_2 = u_lens.sample(u_lensSmplr, (_p0 + float2(0.0, _t7.y)));
    float4 param_3 = u_lens.sample(u_lensSmplr, (_p0 - float2(0.0, _t7.y)));
    return float2(_f0(param) - _f0(param_1), _f0(param_2) - _f0(param_3));
}

static inline __attribute__((always_inline))
float2 _f1(thread const float2& _p0, thread const float& _p1)
{
    float _84 = sin(_p1);
    float _87 = cos(_p1);
    return float2((_p0.x * _87) - (_p0.y * _84), (_p0.x * _84) + (_p0.y * _87));
}

static inline __attribute__((always_inline))
float2 _f5(thread const float2& _p0, thread float2& _p1, thread const float& _p2, constant int& u_fine, constant float& u_rotateWarpDir, constant float& u_amountRelX, constant float& u_amountRelY)
{
    if (u_fine == 1)
    {
        _p1 *= 0.00999999977648258209228515625;
    }
    float2 param = _p1;
    float param_1 = radians(u_rotateWarpDir);
    _p1 = _f1(param, param_1);
    return _p0 + ((_p1 * _p2) * float2(u_amountRelX, u_amountRelY));
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0)
{
    float _111 = fract(_p0);
    float _116 = floor(mod(_p0, 2.0));
    return (_111 + _116) - ((_111 * _116) * 2.0);
}

static inline __attribute__((always_inline))
float2 _f3(thread float2& _p0, thread const int& _p1, thread const int& _p2, thread const float2& _p3)
{
    if (_p1 == 0)
    {
        _p0.x = fast::clamp(_p0.x, 0.0, 1.0);
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
        _p0.y = fast::clamp(_p0.y, 0.0, 1.0);
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

static inline __attribute__((always_inline))
float4 _f6(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1, thread const float2& _p2, constant int& u_wrapModeX, constant int& u_wrapModeY)
{
    float2 param = _p1;
    int param_1 = u_wrapModeX;
    int param_2 = u_wrapModeY;
    float2 param_3 = _p2;
    float2 _309 = _f3(param, param_1, param_2, param_3);
    _p1 = _309;
    return _p0.sample(_p0Smplr, _p1);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_lens [[texture(0)]], texture2d<float> u_source [[texture(1)]], sampler u_lensSmplr [[sampler(0)]], sampler u_sourceSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 _328 = buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y));
    float2 param = in.v_uv;
    float param_1 = buffer.u_amount;
    float2 param_2 = _328;
    float2 param_3 = in.v_uv;
    float2 param_4 = _f4(param, param_1, param_2, u_lens, u_lensSmplr);
    float param_5 = buffer.u_amount;
    float2 _347 = _f5(param_3, param_4, param_5, buffer.u_fine, buffer.u_rotateWarpDir, buffer.u_amountRelX, buffer.u_amountRelY);
    float2 param_6 = _347;
    float2 param_7 = _328;
    float4 _355 = _f6(u_source, u_sourceSmplr, param_6, param_7, buffer.u_wrapModeX, buffer.u_wrapModeY);
    out.o_fragColor = _355;
    return out;
}

