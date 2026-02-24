#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_stride;
    float u_angle;
    float4 u_ScreenParams;
    int u_steps;
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
float _f2(thread const float& _p0)
{
    return exp(((-0.5) * (_p0 * _p0)) / 0.0900000035762786865234375);
}

static inline __attribute__((always_inline))
float _f1(thread const float4& _p0)
{
    return ((_p0.x + (_p0.y / 255.0)) + (_p0.z / 65025.0)) + (_p0.w / 16581375.0);
}

static inline __attribute__((always_inline))
float3 _f3(thread const int& _p0, thread const float2& _p1, thread float2& v_uv, constant float& u_stride, texture2d<float> u_inputTex, sampler u_inputTexSmplr)
{
    float _t2 = 0.0;
    float _t3 = 0.0;
    for (int _t4 = 0; _t4 < 1000; _t4++)
    {
        if (_t4 >= _p0)
        {
            break;
        }
        float _121 = float(_t4);
        float param = _121 / float(_p0);
        float _128 = _f2(param);
        float4 param_1 = u_inputTex.sample(u_inputTexSmplr, (v_uv + ((_p1 * _121) * u_stride)));
        float4 param_2 = u_inputTex.sample(u_inputTexSmplr, (v_uv + ((_p1 * (-_121)) * u_stride)));
        _t2 += (((_f1(param_1) + _f1(param_2)) * _128) / 2.0);
        _t3 += _128;
    }
    return float3(_t2) / fast::max(float3(_t3), float3(0.001000000047497451305389404296875));
}

static inline __attribute__((always_inline))
float4 _f0(thread float& _p0)
{
    float4 _t0 = float4(0.0);
    _p0 *= 255.0;
    _t0.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t0.w = _p0;
    return _t0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _197 = (buffer.u_angle / 180.0) * 3.141592502593994140625;
    int param = buffer.u_steps;
    float2 param_1 = float2(cos(_197), sin(_197)) / ((buffer.u_ScreenParams.xy * 720.0) / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y)));
    float3 _t14 = _f3(param, param_1, in.v_uv, buffer.u_stride, u_inputTex, u_inputTexSmplr);
    float param_2 = _t14.x;
    float4 _234 = _f0(param_2);
    out.o_fragColor = _234;
    return out;
}

