#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float3 u_blackColor;
    float3 u_whiteColor;
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
float _f0(thread const float3& _p0)
{
    return ((_p0.x * 0.2989999949932098388671875) + (_p0.y * 0.58700001239776611328125)) + (_p0.z * 0.114000000059604644775390625);
}

static inline __attribute__((always_inline))
float3 _f1(thread const float3& _p0, thread const float3& _p1, thread const float& _p2, texture2d<float> u_albedo, sampler u_albedoSmplr, thread float2& v_uv)
{
    float3 _56 = u_albedo.sample(u_albedoSmplr, v_uv).xyz;
    float3 param = _56;
    return mix(_56, mix(_p0, _p1, float3(_f0(param))), float3(_p2));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_albedo [[texture(0)]], sampler u_albedoSmplr [[sampler(0)]])
{
    main0_out out = {};
    float3 param = buffer.u_blackColor;
    float3 param_1 = buffer.u_whiteColor;
    float param_2 = buffer.u_amount;
    out.o_fragColor = float4(_f1(param, param_1, param_2, u_albedo, u_albedoSmplr, in.v_uv), 1.0);
    return out;
}

