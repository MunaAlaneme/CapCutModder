#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_intensity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t0 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    float _t1 = 0.0;
    if (buffer.u_intensity > 0.0)
    {
        _t1 = 1.0 + (buffer.u_intensity * 5.0);
    }
    else
    {
        _t1 = 1.0 / (1.0 - (buffer.u_intensity * 2.5));
        float4 _46 = _t0;
        float3 _49 = _46.xyz - float3((-buffer.u_intensity) * 0.00999999977648258209228515625);
        _t0.x = _49.x;
        _t0.y = _49.y;
        _t0.z = _49.z;
    }
    float4 _60 = _t0;
    float3 _68 = float3(1.0) - pow(float3(1.0) - _60.xyz, float3(_t1));
    _t0.x = _68.x;
    _t0.y = _68.y;
    _t0.z = _68.z;
    out.o_fragColor = fast::clamp(_t0, float4(0.0), float4(1.0));
    return out;
}

