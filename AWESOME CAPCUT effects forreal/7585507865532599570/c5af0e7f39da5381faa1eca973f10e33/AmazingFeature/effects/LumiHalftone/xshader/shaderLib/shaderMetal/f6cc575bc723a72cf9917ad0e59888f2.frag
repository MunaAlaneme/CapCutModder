#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_stride;
    float4 u_ScreenParams;
    float u_angle;
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
float _f0(thread const float& _p0)
{
    return exp(((-0.5) * (_p0 * _p0)) / 0.0900000035762786865234375);
}

static inline __attribute__((always_inline))
float4 _f1(thread const int& _p0, thread const float2& _p1, thread float2& v_uv, constant float& u_stride, texture2d<float> u_inputTex, sampler u_inputTexSmplr)
{
    float4 _t0 = float4(0.0);
    float4 _t1 = float4(0.0);
    for (int _t2 = 0; _t2 < 1000; _t2++)
    {
        if (_t2 >= _p0)
        {
            break;
        }
        float _56 = float(_t2);
        float param = _56 / float(_p0);
        float _63 = _f0(param);
        _t0 += (((u_inputTex.sample(u_inputTexSmplr, (v_uv + ((_p1 * _56) * u_stride))) + u_inputTex.sample(u_inputTexSmplr, (v_uv + ((_p1 * (-_56)) * u_stride)))) * _63) / float4(2.0));
        _t1 += float4(_63);
    }
    return _t0 / fast::max(float4(_t1), float4(0.001000000047497451305389404296875));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    int param = buffer.u_steps;
    float2 param_1 = float2(cos(buffer.u_angle), sin(buffer.u_angle)) / ((buffer.u_ScreenParams.xy * 720.0) / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y)));
    out.o_fragColor = _f1(param, param_1, in.v_uv, buffer.u_stride, u_inputTex, u_inputTexSmplr);
    return out;
}

