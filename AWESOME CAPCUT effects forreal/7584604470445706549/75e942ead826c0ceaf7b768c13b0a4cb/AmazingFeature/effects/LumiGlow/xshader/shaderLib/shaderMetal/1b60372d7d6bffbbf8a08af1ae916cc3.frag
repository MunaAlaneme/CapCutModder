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
    float u_colorPhase;
    float u_colorLoops;
    float u_midpoint;
    int u_glowColors;
    float3 u_colorA;
    float3 u_colorB;
    int u_show;
    float u_intensity;
    int u_blendMode;
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
float _f1(thread const float& _p0, constant float& u_colorPhase, constant float& u_colorLoops, constant float& u_midpoint)
{
    float _55 = mod(_p0 + u_colorPhase, 1.0099999904632568359375) * u_colorLoops;
    float _t1 = ceil(_55) - _55;
    if (u_midpoint == 0.5)
    {
        return _t1;
    }
    float _74 = fast::clamp(u_midpoint, 0.00999999977648258209228515625, 0.9900000095367431640625);
    float _76 = _t1;
    float _91 = _76 / fast::max(2.0 * _74, 9.9999997473787516355514526367188e-05);
    _t1 = _91;
    if (_91 < 0.5)
    {
        return fast::clamp(_t1, 0.0, 0.5);
    }
    return fast::clamp(((_76 - 1.0) / (2.0 * fast::max(1.0 - _74, 9.9999997473787516355514526367188e-05))) + 1.0, 0.5, 1.0);
}

static inline __attribute__((always_inline))
float _f0(thread const float& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3, thread const float& _p4)
{
    return (((_p0 - _p1) * (_p4 - _p3)) / (_p2 - _p1)) + _p3;
}

static inline __attribute__((always_inline))
float _f2(thread float& _p0, constant float& u_colorPhase, constant float& u_colorLoops, constant float& u_midpoint)
{
    _p0 = mod(_p0 + u_colorPhase, 1.0);
    _p0 = mod(_p0, 1.0 / u_colorLoops);
    _p0 *= u_colorLoops;
    _p0 = (_p0 * 2.0) - 1.0;
    float _t4 = 0.0;
    float param = u_midpoint;
    float param_1 = 0.0;
    float param_2 = 1.0;
    float param_3 = 0.100000001490116119384765625;
    float param_4 = 0.89999997615814208984375;
    float _128 = _f0(param, param_1, param_2, param_3, param_4);
    if (_128 <= 0.5)
    {
        _t4 = 0.5 * (1.0 + cos(3.141592502593994140625 * pow(abs(_p0), 2.0 * _128)));
    }
    else
    {
        _t4 = 1.0 - (0.5 * (1.0 + cos(3.141592502593994140625 * pow(1.0 - abs(_p0), 2.0 * (1.0 - _128)))));
    }
    return _t4;
}

static inline __attribute__((always_inline))
float4 _f3(thread const float4& _p0, constant float& u_colorPhase, constant float& u_colorLoops, constant float& u_midpoint, constant int& u_glowColors, constant float3& u_colorA, constant float3& u_colorB)
{
    if (u_glowColors < 1)
    {
        return _p0;
    }
    if (u_glowColors == 1)
    {
        float4 _t6 = _p0;
        float param = _p0.x;
        float _191 = _t6.w;
        float3 _192 = mix(u_colorA, u_colorB, float3(_f1(param, u_colorPhase, u_colorLoops, u_midpoint))) * _191;
        _t6.x = _192.x;
        _t6.y = _192.y;
        _t6.z = _192.z;
        return _t6;
    }
    else
    {
        if (u_glowColors == 2)
        {
            float4 _t7 = _p0;
            float param_1 = _p0.x;
            float _216 = _f2(param_1, u_colorPhase, u_colorLoops, u_midpoint);
            float _220 = _t7.w;
            float3 _221 = mix(u_colorB, u_colorA, float3(_216)) * _220;
            _t7.x = _221.x;
            _t7.y = _221.y;
            _t7.z = _221.z;
            return _t7;
        }
    }
    return _p0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_blurTexture [[texture(1)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_blurTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _243 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t8 = _243;
    float4 _248 = u_blurTexture.sample(u_blurTextureSmplr, in.v_uv);
    if (buffer.u_show == 1)
    {
        out.o_fragColor = _248;
        return out;
    }
    float4 param = _248;
    float4 _t10 = _f3(param, buffer.u_colorPhase, buffer.u_colorLoops, buffer.u_midpoint, buffer.u_glowColors, buffer.u_colorA, buffer.u_colorB) * buffer.u_intensity;
    if (_t10.w > 1.0)
    {
        _t10 /= float4(_t10.w);
    }
    if ((buffer.u_show == 2) || (buffer.u_blendMode == 6))
    {
        out.o_fragColor = _t10;
        return out;
    }
    float4 _t11 = _243;
    if (buffer.u_blendMode == 1)
    {
        float4 _296 = _t10;
        float4 _297 = (float4(1.0) - _248) + _296;
        _t10 = _297;
        float3 _302 = _297.xyz * _243.xyz;
        _t11.x = _302.x;
        _t11.y = _302.y;
        _t11.z = _302.z;
    }
    else
    {
        if (buffer.u_blendMode == 2)
        {
            float3 _319 = abs(_t10.xyz - _243.xyz);
            _t11.x = _319.x;
            _t11.y = _319.y;
            _t11.z = _319.z;
        }
        else
        {
            if (buffer.u_blendMode == 3)
            {
                float3 _336 = fast::max(_t10.xyz, _243.xyz);
                _t11.x = _336.x;
                _t11.y = _336.y;
                _t11.z = _336.z;
            }
            else
            {
                if (buffer.u_blendMode == 4)
                {
                    float3 _352 = _243.xyz;
                    float3 _359 = (_t10.xyz + _352) - (_t10.xyz * _352);
                    _t11.x = _359.x;
                    _t11.y = _359.y;
                    _t11.z = _359.z;
                }
                else
                {
                    if (buffer.u_blendMode == 5)
                    {
                        float3 _373 = _243.xyz;
                        float3 _383 = (_373 + _t10.xyz) - ((_373 * 2.0) * _t10.xyz);
                        _t11.x = _383.x;
                        _t11.y = _383.y;
                        _t11.z = _383.z;
                    }
                    else
                    {
                        float3 _395 = _t10.xyz + _243.xyz;
                        _t11.x = _395.x;
                        _t11.y = _395.y;
                        _t11.z = _395.z;
                    }
                }
            }
        }
    }
    _t11.w = _t10.w + ((1.0 - _t10.w) * _t8.w);
    out.o_fragColor = _t11;
    return out;
}

