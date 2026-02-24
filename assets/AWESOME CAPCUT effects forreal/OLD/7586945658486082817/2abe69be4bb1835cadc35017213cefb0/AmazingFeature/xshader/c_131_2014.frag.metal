#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 center;
    float quality;
    float amount;
    float blurType;
    float weightDecay;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 vUv [[user(vUv)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> tDiffuse [[texture(0)]], sampler tDiffuseSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 uv = in.vUv;
    float4 original = tDiffuse.sample(tDiffuseSmplr, uv);
    float2 direction = uv - buffer.center;
    float _distance = length(direction);
    float2 normalizedDir = fast::normalize(direction);
    float4 blurredColor = float4(0.0);
    float totalWeight = 0.0;
    int samples = int(20.0 + (60.0 * buffer.quality));
    float _step = buffer.amount / 1000.0;
    for (int i = 0; i < 80; i++)
    {
        if (i >= samples)
        {
            break;
        }
        float t = float(i) / float(samples - 1);
        float2 sampleUv = uv;
        if (buffer.blurType < 0.5)
        {
            sampleUv = buffer.center + (direction * (1.0 - (t * _step)));
        }
        else
        {
            if (buffer.blurType < 1.5)
            {
                float fade = 1.0 - _distance;
                sampleUv = buffer.center + (direction * (1.0 - ((t * _step) * fade)));
            }
            else
            {
                if (buffer.blurType < 2.5)
                {
                    sampleUv = buffer.center + (direction * (1.0 + (t * _step)));
                }
                else
                {
                    if (buffer.blurType < 3.5)
                    {
                        float angle = (t * _step) * 10.0;
                        float c = cos(angle);
                        float s = sin(angle);
                        float2x2 rotMat = float2x2(float2(c, -s), float2(s, c));
                        sampleUv = buffer.center + (rotMat * direction);
                    }
                    else
                    {
                        sampleUv = buffer.center + (direction * (1.0 - ((t * _step) * 0.5)));
                    }
                }
            }
        }
        bool _179 = sampleUv.x >= 0.0;
        bool _185;
        if (_179)
        {
            _185 = sampleUv.x <= 1.0;
        }
        else
        {
            _185 = _179;
        }
        bool _192;
        if (_185)
        {
            _192 = sampleUv.y >= 0.0;
        }
        else
        {
            _192 = _185;
        }
        bool _198;
        if (_192)
        {
            _198 = sampleUv.y <= 1.0;
        }
        else
        {
            _198 = _192;
        }
        if (_198)
        {
            float weight = pow(buffer.weightDecay, float(i));
            blurredColor += (tDiffuse.sample(tDiffuseSmplr, sampleUv) * weight);
            totalWeight += weight;
        }
    }
    if (totalWeight > 0.0)
    {
        blurredColor /= float4(totalWeight);
    }
    else
    {
        blurredColor = original;
    }
    out.gl_FragColor = blurredColor;
    return out;
}

