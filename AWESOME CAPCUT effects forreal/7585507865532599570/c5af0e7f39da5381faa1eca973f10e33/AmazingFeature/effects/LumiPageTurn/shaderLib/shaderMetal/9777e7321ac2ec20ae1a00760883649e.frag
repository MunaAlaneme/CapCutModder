#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_renderFace;
    float2 u_inCornerPosition;
    float2 u_inFoldPosition;
    float u_foldRadius;
    float u_classicUi;
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
float3 _f4(thread const float2& _p0, thread const float2& _p1)
{
    return float3(_p0.y - _p1.y, _p1.x - _p0.x, (_p0.x * _p1.y) - (_p0.y * _p1.x));
}

static inline __attribute__((always_inline))
float4 _f5(thread const float3& _p0, thread const float& _p1)
{
    float _238 = sqrt((_p0.x * _p0.x) + (_p0.y * _p0.y));
    return float4(_p0.x, _p0.y, (_p1 * _238) + _p0.z, _p0.z - (_p1 * _238));
}

static inline __attribute__((always_inline))
float _f1(thread const float2& _p0, thread const float2& _p1)
{
    return (_p0.x * _p1.y) - (_p0.y * _p1.x);
}

static inline __attribute__((always_inline))
float _f2(thread const float2& _p0, thread const float3& _p1)
{
    return abs(((_p1.x * _p0.x) + (_p1.y * _p0.y)) + _p1.z) / sqrt((_p1.x * _p1.x) + (_p1.y * _p1.y));
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float2 _f3(thread const float2& _p0, thread const float3& _p1)
{
    float _130 = _p1.y * _p1.y;
    float _133 = _p1.x * _p1.x;
    float _155 = _133 + _130;
    return float2((((_130 - _133) * _p0.x) - ((2.0 * _p1.x) * ((_p1.y * _p0.y) + _p1.z))) / _155, (((_133 - _130) * _p0.y) - ((2.0 * _p1.y) * ((_p1.x * _p0.x) + _p1.z))) / _155);
}

static inline __attribute__((always_inline))
void _f6(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2, thread const float& _p3, thread const float& _p4, thread float4& _p5, texture2d<float> u_backTex, sampler u_backTexSmplr, texture2d<float> u_frontTex, sampler u_frontTexSmplr, constant int& u_renderFace)
{
    float2 _t15 = _p1;
    float2 _270 = float2(_p2.x + 9.9999999392252902907785028219223e-09, _p2.y + 9.9999999392252902907785028219223e-09);
    float2 _t16 = _270;
    if (_t15.y >= 1.0)
    {
        _t15.y = fast::max(_t16.y + 0.001000000047497451305389404296875, _t15.y);
    }
    if (_t15.y <= 0.0)
    {
        _t15.y = fast::min(_t16.y - 0.001000000047497451305389404296875, _t15.y);
    }
    if (_t15.x >= 1.0)
    {
        _t15.x = fast::max(_t16.x + 0.001000000047497451305389404296875, _t15.x);
    }
    if (_t15.x <= 0.0)
    {
        _t15.x = fast::min(_t16.x - 0.001000000047497451305389404296875, _t15.x);
    }
    float _323 = fast::max(_p3, 9.9999999392252902907785028219223e-09);
    float2 _t19 = (_t15 + _270) * 0.5;
    float _339 = (3.1415927410125732421875 * _323) * 0.5;
    float2 param = _t15;
    float2 param_1 = _270;
    float3 _t21 = _f4(param, param_1);
    float3 _t22 = float3(_t21.y, -_t21.x, (_t21.x * _t16.y) - (_t21.y * _t16.x));
    float _366 = _t22.x;
    float _368 = _t22.y;
    float _371 = sign(_366 / (_368 + 9.9999999392252902907785028219223e-09));
    float3 _389 = float3(_t21.y, -_t21.x, (_t21.x * _t19.y) - (_t21.y * _t19.x));
    if (_p4 > 0.5)
    {
        float3 param_2 = _389;
        float param_3 = 0.0;
        _t22 = _f5(param_2, param_3).xyw;
    }
    float3 param_4 = _389;
    float param_5 = _339;
    float3 _405 = _f5(param_4, param_5).xyw;
    float3 _t25 = _405;
    float3 param_6 = _405;
    float param_7 = _323;
    float _t27 = 0.0;
    if (_371 < 0.0)
    {
        if ((_t22.z - _t25.z) > 0.0)
        {
            _t25.z = _t22.z;
            float3 param_8 = _t25;
            float param_9 = _323;
            _t27 = 1.0;
        }
    }
    else
    {
        if ((_t25.z - _t22.z) < 0.0)
        {
            _t25.z = _t22.z;
            float3 param_10 = _t25;
            float param_11 = _323;
            _t27 = 1.0;
        }
    }
    float2 _t28 = float2(((-_t25.z) - (_t25.y * _t15.y)) / (_t25.x + 9.9999999392252902907785028219223e-09), _t15.y);
    float2 _t29 = float2(_t15.x, ((-_t25.z) - (_t25.x * _t15.x)) / (_t25.y + 9.9999999392252902907785028219223e-09));
    if (_371 > 0.0)
    {
        float2 _492 = _t28;
        _t28 = _t29;
        _t29 = _492;
    }
    float2 param_12 = _t28 - _t29;
    float2 param_13 = _t28 - _p0;
    float _506 = float(_f1(param_12, param_13) > 0.0);
    float2 param_14 = _p0;
    float3 param_15 = _t25;
    float _512 = _f2(param_14, param_15);
    float _521 = step(_512, _323 + 0.001000000047497451305389404296875);
    float2 _542 = fast::clamp(_p0 + (fast::normalize(-fast::normalize(_270 - _t15)) * (((asin(_512 / _323) * _521) * _323) - _512)), float2(-10.0), float2(10.0));
    float2 param_16 = _542;
    float4 _t37 = u_backTex.sample(u_backTexSmplr, mix(_542 * _f0(param_16), _p0, float2(_506)));
    float2 param_17 = _542;
    float4 _568 = _t37 * fast::clamp(_506 + _f0(param_17), 0.0, 1.0);
    float _574 = step(_512, _323 + 9.9999997473787516355514526367188e-05);
    _t37 = mix(_568 * _506, _568 * _574, float4(_574));
    float3 _t39 = _389;
    if (_t27 > 0.5)
    {
        float3 param_18 = _t25;
        float param_19 = _339;
        _t39 = _f5(param_18, param_19).xyz;
    }
    float2 param_20 = _p0;
    float3 param_21 = _t39;
    float2 _601 = _f3(param_20, param_21);
    float2 param_22 = _601;
    float2 param_23 = _542;
    float3 param_24 = _t39;
    float2 _613 = _f3(param_23, param_24);
    float2 param_25 = _613;
    float _626 = (_f0(param_25) * (1.0 - _506)) * _521;
    float4 _637 = u_frontTex.sample(u_frontTexSmplr, mix(_601, _613, float2(_626)));
    float4 _643 = _637 * fast::clamp(_626 + (_506 * _f0(param_22)), 0.0, 1.0);
    if (u_renderFace == 0)
    {
        _p5 = mix(_643, _p5, float4(_p5.w));
        _p5 = mix(_t37, _p5, float4(_p5.w));
    }
    else
    {
        if (u_renderFace == 1)
        {
            _p5 = mix(_643, _p5, float4(_p5.w));
        }
        else
        {
            if (u_renderFace == 2)
            {
                _p5 = mix(_t37, _p5, float4(_p5.w));
            }
        }
    }
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_backTex [[texture(0)]], texture2d<float> u_frontTex [[texture(1)]], sampler u_backTexSmplr [[sampler(0)]], sampler u_frontTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _t47 = float4(0.0);
    float2 param = in.v_uv0;
    float2 param_1 = buffer.u_inCornerPosition;
    float2 param_2 = buffer.u_inFoldPosition;
    float param_3 = buffer.u_foldRadius;
    float param_4 = buffer.u_classicUi;
    float4 param_5 = float4(0.0);
    _f6(param, param_1, param_2, param_3, param_4, param_5, u_backTex, u_backTexSmplr, u_frontTex, u_frontTexSmplr, buffer.u_renderFace);
    _t47 = param_5;
    float2 param_6 = in.v_uv0;
    float4 _718 = _t47;
    float4 _719 = _718 * _f0(param_6);
    _t47 = _719;
    out.o_fragColor = _719;
    return out;
}

