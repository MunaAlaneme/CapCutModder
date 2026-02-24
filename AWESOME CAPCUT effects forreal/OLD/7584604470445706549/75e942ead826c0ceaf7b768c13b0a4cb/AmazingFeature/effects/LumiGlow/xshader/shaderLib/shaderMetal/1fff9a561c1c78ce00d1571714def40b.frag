#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_threshold;
    int u_glowColors;
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
float _f0(thread const float3& _p0)
{
    return dot(_p0, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

static inline __attribute__((always_inline))
float3 _f2(thread const float4& _p0, constant float& u_threshold)
{
    float3 param = _p0.xyz;
    return smoothstep(float3(u_threshold - (0.119999997317790985107421875 * u_threshold)), float3(u_threshold + 0.070000000298023223876953125), float3(_f0(param)));
}

static inline __attribute__((always_inline))
float3 _f3(thread const float4& _p0, constant float& u_threshold)
{
    float _104 = fast::clamp(u_threshold, 0.00999999977648258209228515625, 1.0);
    float3 param = _p0.xyz;
    return smoothstep(float3(_104 - (0.119999997317790985107421875 * u_threshold)), float3(_104 + 0.0900000035762786865234375), float3(_f0(param)));
}

static inline __attribute__((always_inline))
float3 _f1(thread const float4& _p0, constant float& u_threshold)
{
    float4 _t0 = _p0;
    float _46 = fast::clamp(u_threshold, 0.00999999977648258209228515625, 1.0);
    float3 _59 = smoothstep(float3(_46 - (0.07500000298023223876953125 * u_threshold)), float3(_46 + 0.115000002086162567138671875), _p0.xyz);
    _t0.x = _59.x;
    _t0.y = _59.y;
    _t0.z = _59.z;
    return pow(_t0.xyz, float3(0.454545438289642333984375));
}

static inline __attribute__((always_inline))
float4 _f4(thread float4& _p0, constant float& u_threshold, constant int& u_glowColors)
{
    if (u_glowColors == 1)
    {
        float4 _t8 = _p0;
        float4 param = _p0;
        float3 _139 = _f2(param, u_threshold);
        _t8.x = _139.x;
        _t8.y = _139.y;
        _t8.z = _139.z;
        _t8.w = _t8.x;
        return _t8;
    }
    else
    {
        if (u_glowColors == 2)
        {
            float4 _t9 = _p0;
            float4 param_1 = _p0;
            float3 _162 = _f3(param_1, u_threshold);
            _t9.x = _162.x;
            _t9.y = _162.y;
            _t9.z = _162.z;
            _t9.w = _t9.x;
            return _t9;
        }
    }
    float4 param_2 = _p0;
    float3 _176 = _f1(param_2, u_threshold);
    _p0.x = _176.x;
    _p0.y = _176.y;
    _p0.z = _176.z;
    return _p0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 param = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _201 = _f4(param, buffer.u_threshold, buffer.u_glowColors);
    out.o_fragColor = _201;
    return out;
}

