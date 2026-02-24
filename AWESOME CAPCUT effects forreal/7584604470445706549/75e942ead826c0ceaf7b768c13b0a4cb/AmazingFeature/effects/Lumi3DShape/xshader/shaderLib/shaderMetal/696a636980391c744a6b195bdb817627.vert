#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float bendZbyY;
    float bendZbyX;
    float bendXbyY;
    float bendXbyZ;
    float bendYbyX;
    float bendYbyZ;
    float4x4 u_MVP;
};

struct main0_out
{
    float2 v_uv [[user(locn0)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 a_position [[attribute(0)]];
    float2 a_texcoord0 [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float3 _t1 = in.a_position;
    float _24 = 1.0 - (in.a_position.y * in.a_position.y);
    _t1.z += ((_24 * buffer.bendZbyY) * 0.00999999977648258209228515625);
    float _43 = 1.0 - (in.a_position.x * in.a_position.x);
    _t1.z += ((_43 * buffer.bendZbyX) * 0.00999999977648258209228515625);
    _t1.x += ((_24 * buffer.bendXbyY) * 0.00999999977648258209228515625);
    float _71 = 1.0 - (in.a_position.z * in.a_position.z);
    _t1.x += ((_71 * buffer.bendXbyZ) * 0.00999999977648258209228515625);
    _t1.y += ((_43 * buffer.bendYbyX) * 0.00999999977648258209228515625);
    _t1.y += ((_71 * buffer.bendYbyZ) * 0.00999999977648258209228515625);
    out.gl_Position = buffer.u_MVP * float4(_t1, 1.0);
    out.v_uv = in.a_texcoord0;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

