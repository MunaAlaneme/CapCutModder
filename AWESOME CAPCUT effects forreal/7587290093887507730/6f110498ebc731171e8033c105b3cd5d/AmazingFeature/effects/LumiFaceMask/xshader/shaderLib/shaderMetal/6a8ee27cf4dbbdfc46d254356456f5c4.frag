#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_hasFace;
    int u_maskType;
    float u_reverseTaking;
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
float3 _f0(thread const float3& _p0)
{
    float _26 = fast::min(_p0.x, fast::min(_p0.y, _p0.z));
    float _35 = fast::max(_p0.x, fast::max(_p0.y, _p0.z));
    float _39 = _35 - _26;
    float _43 = step(_39, 0.0);
    float _47 = 1.0 - _43;
    float3 _t5 = (((_p0.yzx - _p0.zxy) / float3(_39 + _43)) + float3(0.0, 2.0, 4.0)) / float3(6.0);
    float _70 = _35 + _26;
    return float3(fract(mix(mix(_t5.z, _t5.y, step(_35, _p0.y)), _t5.x, step(_35, _p0.x))) * _47, mix(_39 / (_70 + step(_70, 0.0)), _39 / ((2.0 - _70) + step(2.0, _70)), step(1.0, _70)) * _47, _70 * 0.5);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_originalTex [[texture(0)]], texture2d<float> u_maskImageTex [[texture(1)]], sampler u_originalTexSmplr [[sampler(0)]], sampler u_maskImageTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _t12;
    if (buffer.u_hasFace == 0)
    {
        _t12 = u_originalTex.sample(u_originalTexSmplr, in.v_uv);
    }
    else
    {
        float4 _t13 = u_maskImageTex.sample(u_maskImageTexSmplr, in.v_uv);
        float3 param = float3(_t13.x, _t13.y, _t13.z);
        float3 _t14 = _f0(param);
        float _t20;
        if (buffer.u_maskType == 0)
        {
            _t20 = _t14.z;
        }
        else
        {
            if (buffer.u_maskType == 1)
            {
                _t20 = _t13.x;
            }
            else
            {
                if (buffer.u_maskType == 2)
                {
                    _t20 = _t13.y;
                }
                else
                {
                    if (buffer.u_maskType == 3)
                    {
                        _t20 = _t13.z;
                    }
                    else
                    {
                        if (buffer.u_maskType == 4)
                        {
                            _t20 = _t13.w;
                        }
                    }
                }
            }
        }
        float _222;
        if (buffer.u_reverseTaking == 1.0)
        {
            _222 = 1.0 - _t20;
        }
        else
        {
            _222 = _t20;
        }
        _t20 = _222;
        _t12 = float4(_222);
    }
    out.o_fragColor = _t12;
    return out;
}

