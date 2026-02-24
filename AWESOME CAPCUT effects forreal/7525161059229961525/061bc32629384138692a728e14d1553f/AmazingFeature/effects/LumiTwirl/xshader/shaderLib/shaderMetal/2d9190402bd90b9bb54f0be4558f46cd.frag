#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL radians() function
template<typename T>
inline T radians(T d)
{
    return d * T(0.01745329251);
}

struct buffer_t
{
    float4 u_ScreenParams;
    float2 center;
    float radius;
    float angle;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f0(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, thread float& _p3, thread const float& _p4, constant float4& u_ScreenParams)
{
    float2 _t0 = _p1 - _p2;
    float _38 = u_ScreenParams.x / u_ScreenParams.y;
    bool _42 = _38 < 1.0;
    if (_42)
    {
        _t0.x *= _38;
    }
    else
    {
        _t0.y /= _38;
    }
    float _58 = length(_t0);
    _p3 *= mix(1.0, 1.25, smoothstep(0.0, 0.449999988079071044921875, (1.77777779102325439453125 / fast::max(_38, 1.0 / _38)) - 1.0));
    if (_58 < _p3)
    {
        float _90 = (1.0 - smoothstep(0.0, 1.0, _58 / _p3)) * radians(_p4);
        float _93 = sin(_90);
        float _96 = cos(_90);
        _t0 = float2(dot(_t0, float2(_96, -_93)), dot(_t0, float2(_93, _96)));
    }
    if (_42)
    {
        _t0.x /= _38;
    }
    else
    {
        _t0.y *= _38;
    }
    float2 _125 = _t0;
    float2 _126 = _125 + _p2;
    _t0 = _126;
    return (((_p0.sample(_p0Smplr, _126) * step(_t0.x, 1.0)) * step(_t0.y, 1.0)) * step(0.0, _t0.x)) * step(0.0, _t0.y);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_albedo [[texture(0)]], sampler u_albedoSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.v_uv0;
    float2 param_1 = buffer.center;
    float param_2 = buffer.radius / 100.0;
    float param_3 = buffer.angle;
    float4 _167 = _f0(u_albedo, u_albedoSmplr, param, param_1, param_2, param_3, buffer.u_ScreenParams);
    out.o_fragColor = _167;
    return out;
}

