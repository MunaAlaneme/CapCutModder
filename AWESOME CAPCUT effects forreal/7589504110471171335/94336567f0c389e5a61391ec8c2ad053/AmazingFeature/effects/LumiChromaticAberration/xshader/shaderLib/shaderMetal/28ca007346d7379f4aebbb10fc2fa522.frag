#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_offsetX;
    float u_offsetY;
    float u_offsetRot;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t0 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float2 _34 = (float2( buffer.u_offsetX * sqrt(2.0) * sin(buffer.u_offsetRot), buffer.u_offsetY * sqrt(2.0) * cos(buffer.u_offsetRot) ) * (float2(1.0) - in.v_uv)) * in.v_uv;
    float4 _t3 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + _34));
    _t0.x = _t3.x;
    float4 _t5 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv - _34));
    _t0.z = _t5.z;
    _t0.w = ((_t3.w + _t0.w) + _t5.w) / 3.0;
    out.o_fragColor = _t0;
    return out;
}

