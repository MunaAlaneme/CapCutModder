#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4x4 uMVPMatrix;
    float4x4 uSTMatrix;
};

struct main0_out
{
    float2 v_texCoord [[user(locn0)]];
    float2 v_imageTexCoord [[user(locn1)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 attPosition [[attribute(0)]];
    float2 attUV [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    out.gl_Position = buffer.uMVPMatrix * float4(in.attPosition.xy, 0.0, 1.0);
    out.v_texCoord = (out.gl_Position.xy * 0.5) + float2(0.5);
    float4 _t0 = buffer.uSTMatrix * float4(in.attUV, 0.0, 1.0);
    out.v_imageTexCoord = float2(_t0.x, _t0.y);
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

