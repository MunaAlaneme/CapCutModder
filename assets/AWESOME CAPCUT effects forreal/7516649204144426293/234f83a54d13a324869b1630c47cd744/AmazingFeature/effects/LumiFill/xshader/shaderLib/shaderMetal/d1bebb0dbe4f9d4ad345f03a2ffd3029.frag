#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_blendMode;
    float3 u_Color;
    float u_Opacity;
    float u_Reverse;
    float u_Alpha;
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
float4 _f0(thread float4& _p0, thread float4& _p1, constant int& u_blendMode)
{
    float _18 = _p0.w;
    float4 _22 = _p0;
    float3 _25 = _22.xyz / float3(fast::max(_18, 0.001000000047497451305389404296875));
    _p0.x = _25.x;
    _p0.y = _25.y;
    _p0.z = _25.z;
    float _36 = _p1.w;
    float4 _38 = _p1;
    float3 _41 = _38.xyz / float3(fast::max(_36, 0.001000000047497451305389404296875));
    _p1.x = _41.x;
    _p1.y = _41.y;
    _p1.z = _41.z;
    float4 _t0 = _p1;
    if (u_blendMode == 2)
    {
        float3 _63 = _p0.xyz + _p1.xyz;
        _t0.x = _63.x;
        _t0.y = _63.y;
        _t0.z = _63.z;
    }
    else
    {
        if (u_blendMode == 1)
        {
            float3 _80 = _p0.xyz * _p1.xyz;
            _t0.x = _80.x;
            _t0.y = _80.y;
            _t0.z = _80.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                float3 _103 = (_p0.xyz + _p1.xyz) - (_p0.xyz * _p1.xyz);
                _t0.x = _103.x;
                _t0.y = _103.y;
                _t0.z = _103.z;
            }
            else
            {
                _t0.x = _p0.xyz.x;
                _t0.y = _p0.xyz.y;
                _t0.z = _p0.xyz.z;
            }
        }
    }
    float4 _t1 = float4(0.0);
    float3 _150 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t0.xyz * (_p0.w * _p1.w));
    _t1.x = _150.x;
    _t1.y = _150.y;
    _t1.z = _150.z;
    _t1.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t1;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTexture [[texture(0)]], sampler u_InputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _180 = u_InputTexture.sample(u_InputTextureSmplr, in.v_uv);
    float4 _t2 = _180;
    float4 param = float4(float4(buffer.u_Color * buffer.u_Opacity, 1.0).xyz, buffer.u_Opacity);
    float4 param_1 = _180;
    float4 _203 = _f0(param, param_1, buffer.u_blendMode);
    out.o_fragColor = _203 * (abs(buffer.u_Reverse - _t2.w) * buffer.u_Alpha);
    return out;
}

