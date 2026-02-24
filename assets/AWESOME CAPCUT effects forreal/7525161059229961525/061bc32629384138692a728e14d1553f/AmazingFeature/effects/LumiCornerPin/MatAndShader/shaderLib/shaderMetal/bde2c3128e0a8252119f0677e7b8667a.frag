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
    float2 u_downLeftVertex;
    float2 u_downRightVertex;
    float2 u_upRightVertex;
    float2 u_upLeftVertex;
    int u_motionTileType;
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
float3x3 _f0(thread const float3x3& _p0)
{
    return float3x3(float3(float3((_p0[1].y * _p0[2].z) - (_p0[2].y * _p0[1].z), (_p0[2].y * _p0[0].z) - (_p0[0].y * _p0[2].z), (_p0[0].y * _p0[1].z) - (_p0[1].y * _p0[0].z))), float3(float3((_p0[2].x * _p0[1].z) - (_p0[1].x * _p0[2].z), (_p0[0].x * _p0[2].z) - (_p0[2].x * _p0[0].z), (_p0[1].x * _p0[0].z) - (_p0[0].x * _p0[1].z))), float3(float3((_p0[1].x * _p0[2].y) - (_p0[2].x * _p0[1].y), (_p0[2].x * _p0[0].y) - (_p0[0].x * _p0[2].y), (_p0[0].x * _p0[1].y) - (_p0[1].x * _p0[0].y))));
}

static inline __attribute__((always_inline))
float3x3 _f1(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3)
{
    float3x3 _200 = float3x3(float3(float3(_p0, 1.0)), float3(float3(_p1, 1.0)), float3(float3(_p2, 1.0)));
    float3x3 param = _200;
    float3 _t2 = _f0(param) * float3(_p3, 1.0);
    return _200 * float3x3(float3(float3(_t2.x, 0.0, 0.0)), float3(float3(0.0, _t2.y, 0.0)), float3(float3(0.0, 0.0, _t2.z)));
}

static inline __attribute__((always_inline))
float3x3 _f2(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, thread const float2& _p4, thread const float2& _p5, thread const float2& _p6, thread const float2& _p7)
{
    float2 param = _p0;
    float2 param_1 = _p2;
    float2 param_2 = _p4;
    float2 param_3 = _p6;
    float2 param_4 = _p1;
    float2 param_5 = _p3;
    float2 param_6 = _p5;
    float2 param_7 = _p7;
    float3x3 param_8 = _f1(param, param_1, param_2, param_3);
    return _f1(param_4, param_5, param_6, param_7) * _f0(param_8);
}

static inline __attribute__((always_inline))
void _f3(thread float2& _p0, thread const float3x3& _p1)
{
    float3 _274 = _p1 * float3(_p0, 1.0);
    float3 _t6 = _274;
    _p0 = _274.xy / float2(_t6.z);
}

static inline __attribute__((always_inline))
float _f5(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float2 _f4(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTex [[texture(0)]], sampler u_InputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = buffer.u_downLeftVertex;
    float2 param_1 = float2(0.0);
    float2 param_2 = buffer.u_downRightVertex;
    float2 param_3 = float2(1.0, 0.0);
    float2 param_4 = buffer.u_upRightVertex;
    float2 param_5 = float2(1.0);
    float2 param_6 = buffer.u_upLeftVertex;
    float2 param_7 = float2(0.0, 1.0);
    float2 _t12 = in.v_uv;
    float2 param_8 = in.v_uv;
    float3x3 param_9 = _f2(param, param_1, param_2, param_3, param_4, param_5, param_6, param_7);
    _f3(param_8, param_9);
    _t12 = param_8;
    float _t13 = 1.0;
    if (buffer.u_motionTileType == 0)
    {
        float2 param_10 = _t12;
        _t13 = _f5(param_10);
    }
    else
    {
        if (buffer.u_motionTileType == 1)
        {
            float2 param_11 = _t12;
            _t12 = _f4(param_11);
        }
        else
        {
            if (buffer.u_motionTileType == 2)
            {
                _t12 = fract(_t12);
            }
        }
    }
    out.o_fragColor = u_InputTex.sample(u_InputTexSmplr, _t12) * _t13;
    return out;
}

