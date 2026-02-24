#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_backgroundColor;
    float u_intensity;
    float u_opacity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_imageTexCoord [[user(locn1)]];
};

static inline __attribute__((always_inline))
float3 _f0(thread const float3& _p0, thread const float3& _p1)
{
    return _p0 * _p1;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_imageTexture [[texture(0)]], sampler u_imageTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _35 = u_imageTexture.sample(u_imageTextureSmplr, in.v_imageTexCoord);
    float4 _t1 = _35;
    float3 param = buffer.u_backgroundColor.xyz;
    float3 param_1 = fast::clamp(_35.xyz * (1.0 / fast::max(0.001000000047497451305389404296875, _t1.w)), float3(0.0), float3(1.0));
    out.o_fragColor = float4(mix(buffer.u_backgroundColor.xyz, mix(buffer.u_backgroundColor.xyz, _f0(param, param_1), float3(_t1.w)), float3(buffer.u_intensity * buffer.u_opacity)), _t1.w);
    return out;
}

