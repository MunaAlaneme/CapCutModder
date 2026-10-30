#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float filterIntensity;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 textureCoordinate [[user(textureCoordinate)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImageTexture [[texture(0)]], texture2d<float> inputImageTextureLookup [[texture(1)]], texture2d<float> inputImageTextureLast [[texture(2)]], sampler inputImageTextureSmplr [[sampler(0)]], sampler inputImageTextureLookupSmplr [[sampler(1)]], sampler inputImageTextureLastSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _25 = fast::clamp(inputImageTexture.sample(inputImageTextureSmplr, in.textureCoordinate), float4(0.0), float4(1.0));
    float4 _225 = fast::clamp(inputImageTextureLast.sample(inputImageTextureLastSmplr, in.textureCoordinate), float4(0.0), float4(1.0)); 
    float _33 = _25.z * 63.0;
    float _37 = floor(_33);
    float _40 = floor(_37 * 1.0);
    float _53 = ceil(_33);
    float _55 = floor(_53 * 1.0);
    float _73 = _25.x;
    float _82 = _25.y;
    out.gl_FragColor = float4( float3(_25.xyz * _25.w) + float3(_225.xyz*_225.w*(1.0-_25.w)) , _25.w + _225.w );
    return out;
}

