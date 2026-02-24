#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float3 _f1(thread const float3& _p0, thread const float& _p1)
{
    return mix(_p0, float3(dot(float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625), _p0)), float3(_p1));
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, thread const float& _p1)
{
    float3 param = _p0.xyz;
    float param_1 = _p1;
    return float4(_f1(param, param_1), _p0.w);
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

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _101 = u_inputTex.sample(u_inputTexSmplr, in.v_uv);
    float4 _t1 = _101;
    float4 param = _101;
    float param_1 = 1.0;
    _t1 = _f2(param, param_1);
    float param_2 = _t1.x;
    float4 _110 = _f0(param_2);
    _t1 = _110;
    out.o_fragColor = _110;
    return out;
}

