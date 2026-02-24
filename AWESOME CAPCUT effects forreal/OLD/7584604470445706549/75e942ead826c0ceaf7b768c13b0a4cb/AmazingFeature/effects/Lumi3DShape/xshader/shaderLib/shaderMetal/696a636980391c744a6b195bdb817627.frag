#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct buffer_t
{
    float2 u_uvScale;
    int u_uvWrapMode;
    int u_maskChannel;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_mask [[texture(1)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_maskSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 _t0 = ((in.v_uv - float2(0.5)) * buffer.u_uvScale) + float2(0.5);
    if (buffer.u_uvWrapMode == 1)
    {
        _t0 = fract(_t0);
    }
    else
    {
        if (buffer.u_uvWrapMode == 2)
        {
            _t0 = abs(mod(_t0 + float2(1.0), float2(2.0)) - float2(1.0));
        }
    }
    float4 _t1 = u_inputTexture.sample(u_inputTextureSmplr, _t0);
    float4 _t2 = u_mask.sample(u_maskSmplr, in.v_uv);
    bool _68 = _t0.x > 1.0;
    bool _76;
    if (!_68)
    {
        _76 = _t0.x < 0.0;
    }
    else
    {
        _76 = _68;
    }
    bool _84;
    if (!_76)
    {
        _84 = _t0.y > 1.0;
    }
    else
    {
        _84 = _76;
    }
    bool _91;
    if (!_84)
    {
        _91 = _t0.y < 0.0;
    }
    else
    {
        _91 = _84;
    }
    if (_91)
    {
        if (buffer.u_uvWrapMode == 3)
        {
            _t1 = float4(0.0);
        }
        else
        {
            if (buffer.u_uvWrapMode == 4)
            {
                _t1 = float4(1.0);
            }
            else
            {
                if (buffer.u_uvWrapMode == 5)
                {
                    _t1 = float4(0.0);
                    _t2 = float4(0.0);
                }
            }
        }
    }
    out.o_fragColor = float4(_t1.xyz, _t2[buffer.u_maskChannel]);
    return out;
}

