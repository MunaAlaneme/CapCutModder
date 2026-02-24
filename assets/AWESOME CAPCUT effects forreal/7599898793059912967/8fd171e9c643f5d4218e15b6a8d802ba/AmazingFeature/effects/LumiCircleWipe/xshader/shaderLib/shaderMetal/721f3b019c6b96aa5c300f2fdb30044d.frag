#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 u_center;
    float u_feather;
    float u_radius;
    float u_reverse;
    float2 u_screenSize;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_xy [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _16 = distance(in.v_xy, buffer.u_center);
    float _22 = fast::min(_16, buffer.u_feather);
    float _32 = smoothstep(buffer.u_radius + _22, buffer.u_radius - _22, _16);
    out.o_fragColor = u_inputTex.sample(u_inputTexSmplr, (in.v_xy / buffer.u_screenSize)) * mix(_32, 1.0 - _32, buffer.u_reverse);
    return out;
}

