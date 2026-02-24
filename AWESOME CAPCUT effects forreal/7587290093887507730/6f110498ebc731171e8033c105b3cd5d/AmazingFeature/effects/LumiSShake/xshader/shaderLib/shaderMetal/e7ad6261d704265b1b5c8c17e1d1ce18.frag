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
    int u_fillModeX;
    int u_fillModeY;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uvR [[user(locn0)]];
    float2 v_uvG [[user(locn1)]];
    float2 v_uvB [[user(locn2)]];
};

static inline __attribute__((always_inline))
float4 _f0(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1, constant int& u_fillModeX, constant int& u_fillModeY)
{
    float _t0 = 1.0;
    if (u_fillModeX == 1)
    {
        _p1.x = fract(_p1.x);
    }
    else
    {
        if (u_fillModeX == 2)
        {
            _p1.x = abs(mod(_p1.x + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t0 = step(0.0, _p1.x) * step(_p1.x, 1.0);
        }
    }
    float _t1 = 1.0;
    if (u_fillModeY == 1)
    {
        _p1.y = fract(_p1.y);
    }
    else
    {
        if (u_fillModeY == 2)
        {
            _p1.y = abs(mod(_p1.y + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t1 = step(0.0, _p1.y) * step(_p1.y, 1.0);
        }
    }
    return _p0.sample(_p0Smplr, _p1) * (_t0 * _t1);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.v_uvR;
    float4 _106 = _f0(u_inputTexture, u_inputTextureSmplr, param, buffer.u_fillModeX, buffer.u_fillModeY);
    float4 _t2 = _106;
    float2 param_1 = in.v_uvG;
    float4 _111 = _f0(u_inputTexture, u_inputTextureSmplr, param_1, buffer.u_fillModeX, buffer.u_fillModeY);
    float4 _t3 = _111;
    float2 param_2 = in.v_uvB;
    float4 _116 = _f0(u_inputTexture, u_inputTextureSmplr, param_2, buffer.u_fillModeX, buffer.u_fillModeY);
    float4 _t4 = _116;
    out.o_fragColor = float4(_t2.x, _t3.y, _t4.z, fast::max(fast::max(_t2.w, _t3.w), _t4.w));
    return out;
}

