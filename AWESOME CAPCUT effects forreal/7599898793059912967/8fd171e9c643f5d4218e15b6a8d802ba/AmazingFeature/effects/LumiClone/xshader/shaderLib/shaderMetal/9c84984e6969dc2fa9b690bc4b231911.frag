#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

// Implementation of the GLSL radians() function
template<typename T>
inline T radians(T d)
{
    return d * T(0.01745329251);
}

float3 HueRotate(float3 color, float angle)
{
    const float3 k = float3(0.57735, 0.57735, 0.57735); // normalized (1,1,1)
    float cosA = cos(angle);
    float sinA = sin(angle);

    return color * cosA
         + cross(k, color) * sinA
         + k * dot(k, color) * (1.0 - cosA);
}

struct buffer_t
{
    int u_type;
    int u_reverseLayer;
    float u_angle;
    float u_hueChange;
    float u_initHue;
    float4 u_ScreenParams;
    float u_initialScale;
    float2 u_center;
    int u_count;
    float u_distance;
    float u_scale;
    float u_rotation;
    float u_startAlpha;
    float u_endAlpha;
    spvUnsafeArray<float, 20> u_sortedIndices;
    float u_distribution;
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
float4 _f0(thread const float2& _p0, thread const float& _p1, texture2d<float> u_inputTexture, sampler u_inputTextureSmplr)
{
    float4 _29 = u_inputTexture.sample(u_inputTextureSmplr, _p0);
    bool _38 = _p0.x < 0.0;
    bool _46;
    if (!_38)
    {
        _46 = _p0.x > 1.0;
    }
    else
    {
        _46 = _38;
    }
    bool _54;
    if (!_46)
    {
        _54 = _p0.y < 0.0;
    }
    else
    {
        _54 = _46;
    }
    bool _61;
    if (!_54)
    {
        _61 = _p0.y > 1.0;
    }
    else
    {
        _61 = _54;
    }
    return select(_29 * _p1, float4(0.0), bool4(_61));
}

static inline __attribute__((always_inline))
float4 _f1(thread const float4& _p0, thread const float4& _p1, constant int& u_type, constant int& u_reverseLayer)
{
    if (u_type == 0)
    {
        float4 _80;
        if (u_reverseLayer == 0)
        {
            _80 = _p0 + (_p1 * (1.0 - _p0.w));
        }
        else
        {
            _80 = (_p1 * _p1.w) + (_p0 * (1.0 - _p1.w));
        }
        return _80;
    }
    else
    {
        return _p0 + (_p1 * (1.0 - _p0.w));
    }
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t1 = float4(0.0);
    float _120 = radians(-buffer.u_angle);
    float2 _t3 = float2(sin(_120), -cos(_120));
    float _135 = buffer.u_ScreenParams.x / buffer.u_ScreenParams.y;
    float3x3 _145 = float3x3(float3(1.0 / _135, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0));
    float2 _t6 = in.v_uv - float2(0.5);
    float2 _156;
    if (_135 > 1.0)
    {
        _156 = float2(_t6.x * _135, _t6.y);
    }
    else
    {
        _156 = float2(_t6.x, _t6.y / _135) * _135;
    }
    _t6 = (((_156 + float2(0.5)) - float2(0.5)) / float2((buffer.u_initialScale == 0.0) ? 1.0 : buffer.u_initialScale)) + float2(0.5);
    float2 _t7 = ((buffer.u_center - float2(0.5)) / float2(1.0)) + float2(0.5);
    int _209 = buffer.u_count + 1;
    bool _212 = _209 > 1;
    float _213;
    if (_212)
    {
        _213 = 6.28318500518798828125 / float(_209 - 1);
    }
    else
    {
        _213 = 0.0;
    }
    if (buffer.u_type == 0)
    {
        float _239;
        float _254;
        float _274;
        float _286;
        for (int _t10 = 1; _t10 <= _209; _t10++)
        {
            if (_t10 == 1)
            {
                _239 = 0.0;
            }
            else
            {
                _239 = float(_t10 - 1) / float(_209 - 1);
            }
            if (_t10 == 1)
            {
                _254 = 0.0;
            }
            else
            {
                _254 = _239 * buffer.u_distance;
            }
            float2 _t12 = float2(_254);
            float _t13 = (buffer.u_scale == (-1.0)) ? (-0.9900000095367431640625) : buffer.u_scale;
            if (_t10 == 1)
            {
                _274 = 1.0;
            }
            else
            {
                _274 = 1.0 / mix(1.0, _t13, _239);
            }
            _t13 = _274;
            if (_t10 == 1)
            {
                _286 = 0.0;
            }
            else
            {
                _286 = radians(_239 * buffer.u_rotation);
            }
            float _310 = _t13 * cos(_286);
            float _313 = sin(_286);
            float2 param = (((_145 * float3x3(float3(_310, _t13 * _313, 0.0), float3((-_t13) * _313, _310, 0.0), float3(_t7.x - 0.5, _t7.y - 0.5, 1.0))) * float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(((_t3.x * _t12.x) - _t7.x) + 0.5, ((_t3.y * _t12.y) - _t7.y) + 0.5, 1.0))) * float3(_t6 - float2(0.5), 1.0)).xy + float2(0.5);
            float param_1 = mix(fast::clamp(buffer.u_startAlpha, 0.0, 1.0), fast::clamp(buffer.u_endAlpha, 0.0, 1.0), _239);
            float4 param_2 = float4(_t1.x, _t1.y, _t1.z, _t1.w);
            param_2.rgb = HueRotate(param_2.rgb, radians(buffer.u_hueChange));
            float4 param_3 = _f0(param, param_1, u_inputTexture, u_inputTextureSmplr);
            _t1 = _f1(param_2, param_3, buffer.u_type, buffer.u_reverseLayer);
        }
    }
    else
    {
        if (buffer.u_type == 1)
        {
            if (_212)
            {
                float _500;
                for (int _t18 = 1; _t18 <= _209; _t18++)
                {
                    int _405 = _t18 - 1;
                    float2 _t20 = float2(0.0);
                    float _t21 = 1.0 / buffer.u_scale;
                    float _415 = radians(buffer.u_rotation);
                    bool _417 = buffer.u_sortedIndices[_405] == 1.0;
                    if (_417)
                    {
                        _t20 = float2(0.0);
                        _t21 = 1.0;
                    }
                    else
                    {
                        float _428 = _120 + (_213 * (buffer.u_sortedIndices[_405] - 2.0));
                        _t20 = float2(cos(_428), sin(_428)) * buffer.u_distance;
                    }
                    float _441 = _t21 * cos(_415);
                    float _444 = sin(_415);
                    if (_417)
                    {
                        _500 = fast::clamp(buffer.u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _500 = fast::clamp(buffer.u_endAlpha, 0.0, 1.0);
                    }
                    float2 param_4 = (((_145 * float3x3(float3(_441, _t21 * _444, 0.0), float3((-_t21) * _444, _441, 0.0), float3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3((_t20.x - _t7.x) + 0.5, (_t20.y - _t7.y) + 0.5, 1.0))) * float3(_t6 - float2(0.5), 1.0)).xy + float2(0.5);
                    float param_5 = _500;
                    float4 param_6 = _t1;
                    float4 param_7 = _f0(param_4, param_5, u_inputTexture, u_inputTextureSmplr);
                    _t1 = _f1(param_6, param_7, buffer.u_type, buffer.u_reverseLayer);
                }
            }
            else
            {
                int _t27 = 0;
                float _525;
                if (_212)
                {
                    _525 = 6.28318500518798828125 / float(_209 - 1);
                }
                else
                {
                    _525 = 0.0;
                }
                float2 _t32;
                spvUnsafeArray<float2, 20> _t36;
                spvUnsafeArray<float4, 20> _t37;
                float _653;
                for (int _t29 = 1; _t29 <= _209; _t29++)
                {
                    if (_t29 > 20)
                    {
                        break;
                    }
                    float _551 = 1.0 / buffer.u_scale;
                    float _554 = radians(buffer.u_rotation);
                    if (_t29 == 1)
                    {
                        _t32 = float2(0.0);
                    }
                    else
                    {
                        float _569 = _120 + (_525 * float(_t29 - 2));
                        _t32 = float2(cos(_569), sin(_569)) * buffer.u_distance;
                    }
                    float _582 = _551 * cos(_554);
                    float _585 = sin(_554);
                    float2 _637 = (((_145 * float3x3(float3(_582, _551 * _585, 0.0), float3((-_551) * _585, _582, 0.0), float3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3((_t32.x - _t7.x) + 0.5, (_t32.y - _t7.y) + 0.5, 1.0))) * float3(_t6 - float2(0.5), 1.0)).xy + float2(0.5);
                    float2 _t35 = _637;
                    _t36[_t27] = _637;
                    float4 _650 = u_inputTexture.sample(u_inputTextureSmplr, _637);
                    if (_t29 == 1)
                    {
                        _653 = fast::clamp(buffer.u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _653 = fast::clamp(buffer.u_endAlpha, 0.0, 1.0);
                    }
                    _t37[_t27] = _650 * _653;
                    bool _666 = _t35.x < 0.0;
                    bool _673;
                    if (!_666)
                    {
                        _673 = _t35.x > 1.0;
                    }
                    else
                    {
                        _673 = _666;
                    }
                    bool _680;
                    if (!_673)
                    {
                        _680 = _t35.y < 0.0;
                    }
                    else
                    {
                        _680 = _673;
                    }
                    bool _687;
                    if (!_680)
                    {
                        _687 = _t35.y > 1.0;
                    }
                    else
                    {
                        _687 = _680;
                    }
                    if (_687)
                    {
                        _t37[_t27] = float4(0.0);
                    }
                    _t27++;
                }
                for (int _t38 = 1; _t38 < _t27; _t38++)
                {
                    float2 _708 = _t36[_t38];
                    float2 _t39 = _708;
                    float4 _712 = _t37[_t38];
                    int _t41 = _t38 - 1;
                    for (;;)
                    {
                        bool _722 = _t41 >= 0;
                        bool _731;
                        if (_722)
                        {
                            _731 = _t36[_t41].y < _t39.y;
                        }
                        else
                        {
                            _731 = _722;
                        }
                        if (_731)
                        {
                            int _733 = _t41 + 1;
                            _t36[_733] = _t36[_t41];
                            _t37[_733] = _t37[_t41];
                            _t41--;
                            continue;
                        }
                        else
                        {
                            break;
                        }
                    }
                    int _747 = _t41 + 1;
                    _t36[_747] = _708;
                    _t37[_747] = _712;
                }
                for (int _t42 = 0; _t42 < _t27; _t42++)
                {
                    float4 param_8 = _t1;
                    float4 param_9 = _t37[_t42];
                    _t1 = _f1(param_8, param_9, buffer.u_type, buffer.u_reverseLayer);
                }
            }
        }
        else
        {
            if (buffer.u_type == 2)
            {
                for (int _t43 = 1; _t43 <= _209; _t43++)
                {
                    float _794 = float(_t43 + int(buffer.u_distribution));
                    float _814 = (fract(sin(_794 * 78.233001708984375) * 43758.546875) * 2.0) * 3.141592502593994140625;
                    float2 _t47 = float2(cos(_814), sin(_814)) * (fract(sin(_794 * 12.98980045318603515625) * 43758.546875) * buffer.u_distance);
                    float _t48 = 0.0;
                    float _t49 = 1.0;
                    if (_t43 == 1)
                    {
                        _t47 = float2(0.0);
                        _t48 = 0.0;
                        _t49 = 1.0;
                    }
                    else
                    {
                        _t48 = mix(0.0, (((fract(sin(_794 * 167.2299957275390625) * 43758.546875) * 2.0) - 1.0) * 3.141592502593994140625) * 2.0, buffer.u_rotation / 360.0);
                        _t49 = mix(1.0, mix(0.25, 2.5, abs(fract(sin((_794 * 3.1415159702301025390625) + 45.67800140380859375) * 43758.546875))), buffer.u_scale);
                    }
                    float _868 = _t49 * cos(_t48);
                    float _871 = sin(_t48);
                    float2 _923 = (((_145 * float3x3(float3(_868, _t49 * _871, 0.0), float3((-_t49) * _871, _868, 0.0), float3((0.0 + _t7.x) - 0.5, (0.0 + _t7.y) - 0.5, 1.0))) * float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3((_t47.x - _t7.x) + 0.5, (_t47.y - _t7.y) + 0.5, 1.0))) * float3(_t6 - float2(0.5), 1.0)).xy + float2(0.5);
                    float2 _t52 = _923;
                    float4 _t53 = float4(0.0);
                    if (_t43 == 1)
                    {
                        _t53 = u_inputTexture.sample(u_inputTextureSmplr, _923) * fast::clamp(buffer.u_startAlpha, 0.0, 1.0);
                    }
                    else
                    {
                        _t53 = u_inputTexture.sample(u_inputTextureSmplr, _923) * fast::clamp(buffer.u_endAlpha, 0.0, 1.0);
                    }
                    bool _945 = _t52.x < 0.0;
                    bool _952;
                    if (!_945)
                    {
                        _952 = _t52.x > 1.0;
                    }
                    else
                    {
                        _952 = _945;
                    }
                    bool _959;
                    if (!_952)
                    {
                        _959 = _t52.y < 0.0;
                    }
                    else
                    {
                        _959 = _952;
                    }
                    bool _966;
                    if (!_959)
                    {
                        _966 = _t52.y > 1.0;
                    }
                    else
                    {
                        _966 = _959;
                    }
                    if (_966)
                    {
                        _t53 = float4(0.0);
                    }
                    _t1 += (_t53 * (1.0 - _t1.w));
                }
            }
        }
    }
    out.o_fragColor = float4(_t1.x, _t1.y, _t1.z, _t1.w);
    out.o_fragColor.rgb = HueRotate(out.o_fragColor.rgb, radians(buffer.u_initHue));
    return out;
}

