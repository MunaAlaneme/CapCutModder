#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 u_Center;
    float4 u_ScreenParams;
    float u_Radius;
    float u_Convergence;
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
float3 _f1(thread const float2& _p0, thread const float& _p1, thread const float& _p2, constant float2& u_Center, constant float4& u_ScreenParams)
{
    float2 _t1 = _p0 - u_Center;
    _t1.x *= (u_ScreenParams.x / u_ScreenParams.y);
    float _68 = length(_t1);
    float _74 = _68 * _68;
    float _85 = _68 * ((1.0 + ((((-_p2) * 203.087493896484375) / pow(_p1, 2.0)) * _74)) + (0.0 * (_74 * _68)));
    float _91 = precise::atan2(_t1.x, _t1.y);
    float2 _t9 = float2((sin(_91) * _85) * 1.0, (cos(_91) * _85) * 1.0);
    _t9.x *= (u_ScreenParams.y / u_ScreenParams.x);
    float2 _118 = _t9;
    float2 _119 = _118 + u_Center;
    _t9 = _119;
    return float3(_119, _68);
}

static inline __attribute__((always_inline))
float2 _f0(thread const float2& _p0)
{
    return step(float2(0.0), _p0) * step(_p0, float2(1.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTex [[texture(0)]], sampler u_InputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t10 = in.uv0;
    float _142 = buffer.u_Radius * pow(1.60000002384185791015625, (buffer.u_ScreenParams.x / buffer.u_ScreenParams.y) - 1.0);
    float2 param = in.uv0;
    float param_1 = _142;
    float param_2 = buffer.u_Convergence;
    float3 _152 = _f1(param, param_1, param_2, buffer.u_Center, buffer.u_ScreenParams);
    float3 _t12 = _152;
    float2 _154 = _152.xy;
    _t10 = _154;
    float2 param_3 = _154;
    float2 _t13 = _f0(param_3);
    float _176 = _142 * 0.007000000216066837310791015625;
    out.o_fragColor = ((u_InputTex.sample(u_InputTexSmplr, _t10) * _t13.x) * _t13.y) * smoothstep(_176 + 0.001000000047497451305389404296875, _176 - 0.001000000047497451305389404296875, _t12.z);
    return out;
}

