#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 u_center;
    float u_fovXScale;
    float u_fovYScale;
    int u_inverseLensDistortion;
    int u_googoosy;
    float u_distortParam1;
    float u_distortParam2;
    int u_fillBorders;
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
float _f0(thread float& _p0)
{
    _p0 = abs(_p0);
    return abs((floor(ceil(_p0) / 2.0) * 2.0) - _p0);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t0 = in.v_uv - buffer.u_center;
    float _43 = _t0.x * buffer.u_fovXScale;
    float _50 = _t0.y * buffer.u_fovYScale;
    float _58 = (_43 * _43) + (_50 * _50);
    float _61 = sqrt(_58);
    float _t5 = 1.0;
    if (buffer.u_inverseLensDistortion == 0 and buffer.u_googoosy == 1)
    {
        _t5 = 1.0 / ((1.0 - (buffer.u_distortParam1 * _61)) - (buffer.u_distortParam2));
    }
    else if (buffer.u_inverseLensDistortion == 1 and buffer.u_googoosy == 1)
    {
        _t5 = 1.0 / ((1.0 + (buffer.u_distortParam1 * _61)) + (buffer.u_distortParam2));
    }
    else if (buffer.u_inverseLensDistortion == 0 and buffer.u_googoosy == 0)
    {
        _t5 = 1.0 / ((1.0 - (buffer.u_distortParam1 * _61)) - (buffer.u_distortParam2 * _58));
    }
    else if (buffer.u_inverseLensDistortion == 1 and buffer.u_googoosy == 0)
    {
        _t5 = 1.0 / ((1.0 + (buffer.u_distortParam1 * _61)) + (buffer.u_distortParam2 * _58));
    }
    float4 _t6 = float4(0.0);
    _t0.x *= _t5;
    _t0.y *= _t5;
    _t0 += buffer.u_center;
    if (buffer.u_fillBorders == 1)
    {
        float param = _t0.x;
        float _121 = _f0(param);
        _t0.x = _121;
        float param_1 = _t0.y;
        float _126 = _f0(param_1);
        _t0.y = _126;
        _t6 = u_inputTexture.sample(u_inputTextureSmplr, _t0);
    }
    else
    {
        bool _137 = _t5 > 0.0;
        bool _143;
        if (_137)
        {
            _143 = _t0.x >= 0.0;
        }
        else
        {
            _143 = _137;
        }
        bool _149;
        if (_143)
        {
            _149 = _t0.x <= 1.0;
        }
        else
        {
            _149 = _143;
        }
        bool _155;
        if (_149)
        {
            _155 = _t0.y >= 0.0;
        }
        else
        {
            _155 = _149;
        }
        bool _161;
        if (_155)
        {
            _161 = _t0.y <= 1.0;
        }
        else
        {
            _161 = _155;
        }
        if (_161)
        {
            _t6 = u_inputTexture.sample(u_inputTextureSmplr, _t0);
        }
    }
    out.o_fragColor = _t6;
    return out;
}

