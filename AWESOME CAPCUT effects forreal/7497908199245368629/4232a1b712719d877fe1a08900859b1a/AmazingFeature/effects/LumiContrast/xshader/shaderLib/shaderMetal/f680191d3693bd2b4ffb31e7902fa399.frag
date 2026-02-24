#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_pivotSlope;
    float u_leftSlopeDiff;
    float u_leftDiff;
    float u_rightSlopeDiff;
    float u_rightDiff;
    float u_intensity;
    float u_pivot;
    float u_xFactor;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f0(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    return ((1.0 / (1.0 + exp((-_p1) * (_p0 - _p2)))) + _p2) - 0.5;
}

static inline __attribute__((always_inline))
float _f1(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    float _49 = 1.0 / (1.0 + exp((-_p1) * (_p0 - _p2)));
    return (_p1 * _49) * (1.0 - _49);
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0, thread const float& _p1, thread const float& _p2, constant float& u_pivotSlope, constant float& u_leftSlopeDiff, constant float& u_leftDiff, constant float& u_rightSlopeDiff, constant float& u_rightDiff)
{
    float param = _p0;
    float param_1 = _p1;
    float param_2 = _p2;
    float _t2 = _f0(param, param_1, param_2);
    float param_3 = _p0;
    float param_4 = _p1;
    float param_5 = _p2;
    float _75 = _f1(param_3, param_4, param_5);
    if (_p0 <= _p2)
    {
        float _90 = (u_pivotSlope - _75) / u_leftSlopeDiff;
        _t2 += ((_90 * _90) * u_leftDiff);
    }
    else
    {
        float _107 = (u_pivotSlope - _75) / u_rightSlopeDiff;
        _t2 += ((_107 * _107) * u_rightDiff);
    }
    return _t2;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t6 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    if (buffer.u_intensity <= 1.0)
    {
        float4 _140 = _t6;
        float3 _144 = float3(buffer.u_pivot);
        float3 _149 = ((_140.xyz - _144) * buffer.u_intensity) + _144;
        _t6.x = _149.x;
        _t6.y = _149.y;
        _t6.z = _149.z;
    }
    else
    {
        float param = _t6.x;
        float param_1 = buffer.u_xFactor;
        float param_2 = buffer.u_pivot;
        _t6.x = _f2(param, param_1, param_2, buffer.u_pivotSlope, buffer.u_leftSlopeDiff, buffer.u_leftDiff, buffer.u_rightSlopeDiff, buffer.u_rightDiff);
        float param_3 = _t6.y;
        float param_4 = buffer.u_xFactor;
        float param_5 = buffer.u_pivot;
        _t6.y = _f2(param_3, param_4, param_5, buffer.u_pivotSlope, buffer.u_leftSlopeDiff, buffer.u_leftDiff, buffer.u_rightSlopeDiff, buffer.u_rightDiff);
        float param_6 = _t6.z;
        float param_7 = buffer.u_xFactor;
        float param_8 = buffer.u_pivot;
        _t6.z = _f2(param_6, param_7, param_8, buffer.u_pivotSlope, buffer.u_leftSlopeDiff, buffer.u_leftDiff, buffer.u_rightSlopeDiff, buffer.u_rightDiff);
    }
    out.o_fragColor = fast::clamp(_t6, float4(0.0), float4(1.0));
    return out;
}

