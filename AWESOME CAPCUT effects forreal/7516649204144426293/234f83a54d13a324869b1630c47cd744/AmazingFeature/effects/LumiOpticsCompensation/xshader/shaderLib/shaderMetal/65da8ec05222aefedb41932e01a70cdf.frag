#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _24 = float2(1.0 / buffer.u_ScreenParams.x, 1.0 / buffer.u_ScreenParams.y);
    float4 _41 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (float2(-1.0) * _24)));
    float4 _50 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (float2(1.0, -1.0) * _24)));
    float4 _59 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (float2(-1.0, 1.0) * _24)));
    float4 _68 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (float2(1.0) * _24)));
    float _86 = dot(_41.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float _90 = dot(_50.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float _94 = dot(_59.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float _98 = dot(_68.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float _102 = dot(u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv * _24)).xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    float _126 = _86 + _90;
    float2 _t14;
    _t14.x = -(_126 - (_94 + _98));
    _t14.y = (_86 + _94) - (_90 + _98);
    float _155 = _t14.x;
    float _158 = _t14.y;
    float2 _168 = _t14;
    float2 _174 = fast::min(float2(8.0), fast::max(float2(-8.0), _168 * (1.0 / (fast::min(abs(_155), abs(_158)) + fast::max(((_126 + _94) + _98) * 0.03125, 0.0078125))))) * _24;
    _t14 = _174;
    float4 _184 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (_174 * (-0.16666667163372039794921875))));
    float4 _191 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (_174 * 0.16666667163372039794921875)));
    float4 _193 = (_184 + _191) * 0.5;
    float4 _204 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (_174 * (-0.5))));
    float4 _210 = u_inputTexture.sample(u_inputTextureSmplr, (in.v_uv + (_174 * 0.5)));
    float _218 = dot(_193.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    if ((_218 < fast::min(_102, fast::min(fast::min(_86, _90), fast::min(_94, _98)))) || (_218 > fast::max(_102, fast::max(fast::max(_86, _90), fast::max(_94, _98)))))
    {
        out.o_fragColor = _193;
    }
    else
    {
        out.o_fragColor = (_193 * 0.5) + ((_204 + _210) * 0.25);
    }
    return out;
}

