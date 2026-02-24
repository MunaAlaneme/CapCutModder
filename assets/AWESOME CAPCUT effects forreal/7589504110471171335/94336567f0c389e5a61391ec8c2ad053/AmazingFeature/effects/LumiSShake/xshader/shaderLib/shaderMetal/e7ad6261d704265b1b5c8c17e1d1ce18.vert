#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4x4 u_uvMatR;
    float4x4 u_uvMatG;
    float4x4 u_uvMatB;
};

struct main0_out
{
    float2 v_uvR [[user(locn0)]];
    float2 v_uvG [[user(locn1)]];
    float2 v_uvB [[user(locn2)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float4 a_position [[attribute(0)]];
    float2 a_texcoord0 [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    out.gl_Position = in.a_position;
    float4 _27 = float4(in.a_texcoord0, 0.0, 1.0);
    out.v_uvR = (buffer.u_uvMatR * _27).xy;
    out.v_uvG = (buffer.u_uvMatG * _27).xy;
    out.v_uvB = (buffer.u_uvMatB * _27).xy;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

