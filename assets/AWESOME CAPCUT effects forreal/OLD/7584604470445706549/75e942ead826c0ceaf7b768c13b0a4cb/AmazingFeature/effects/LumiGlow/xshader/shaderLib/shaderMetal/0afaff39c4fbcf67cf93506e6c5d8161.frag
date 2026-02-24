#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float u_sigma;
    float u_horzR;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f1(thread const float& _p0, constant float& u_sigma, constant float& u_horzR)
{
    return exp((-(_p0 * _p0)) / (((((2.0 * u_sigma) * u_sigma) * u_horzR) * u_horzR) / 100.0)) * 10.0;
}

static inline __attribute__((always_inline))
float4 _f0(thread const float& _p0, constant float4& u_ScreenParams, thread float2& uv0, texture2d<float> u_inputTexture, sampler u_inputTextureSmplr)
{
    float2 _49 = float2(1.0) / ((float2(u_ScreenParams.xy) / float2(fast::min(u_ScreenParams.x, u_ScreenParams.y))) * 800.0);
    float2 _59 = uv0 + (_49 * float2(_p0, 0.0));
    float2 _t2 = _59;
    float2 _66 = uv0 - (_49 * float2(_p0, 0.0));
    float2 _t3 = _66;
    return ((u_inputTexture.sample(u_inputTextureSmplr, _59) * step(_t2.x, 1.0)) * step(0.0, _t2.x)) + ((u_inputTexture.sample(u_inputTextureSmplr, _66) * step(_t3.x, 1.0)) * step(0.0, _t3.x));
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, constant float4& u_ScreenParams, thread float2& uv0, texture2d<float> u_inputTexture, sampler u_inputTextureSmplr, constant float& u_sigma, constant float& u_horzR)
{
    float4 _t5 = float4(0.0) + (_p0 * 10.0);
    float _t7 = 10.0;
    float _t8 = 0.0;
    for (float _t9 = 1.0; _t9 <= 100.0; _t9 += 1.0)
    {
        if (_t9 > (8.0 * (u_horzR / 10.0)))
        {
            break;
        }
        float param = _t9;
        _t8 = _f1(param, u_sigma, u_horzR);
        float param_1 = _t9;
        _t5 += (_f0(param_1, u_ScreenParams, uv0, u_inputTexture, u_inputTextureSmplr) * _t8);
        _t7 += (_t8 * 2.0);
    }
    float4 _166 = _t5;
    float4 _168 = _166 / float4(_t7);
    _t5 = _168;
    return _168;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 param = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    out.o_fragColor = _f2(param, buffer.u_ScreenParams, in.uv0, u_inputTexture, u_inputTextureSmplr, buffer.u_sigma, buffer.u_horzR);
    return out;
}

