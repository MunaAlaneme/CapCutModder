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

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct buffer_t
{
    int u_fillModeX;
    int u_fillModeY;
    int u_frameCount;
    spvUnsafeArray<float4, 260> u_matricesR;
    spvUnsafeArray<float4, 260> u_matricesB;
    float u_step;
    spvUnsafeArray<float4, 260> u_matricesG;
    float2 u_spriteSize;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_p [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f0(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1, constant int& u_fillModeX, constant int& u_fillModeY)
{
    float _t0 = 1.0;
    if (u_fillModeX == 1)
    {
        _p1.x = fract(_p1.x);
    }
    else
    {
        if (u_fillModeX == 2)
        {
            _p1.x = abs(mod(_p1.x + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t0 = step(0.0, _p1.x) * step(_p1.x, 1.0);
        }
    }
    float _t1 = 1.0;
    if (u_fillModeY == 1)
    {
        _p1.y = fract(_p1.y);
    }
    else
    {
        if (u_fillModeY == 2)
        {
            _p1.y = abs(mod(_p1.y + 1.0, 2.0) - 1.0);
        }
        else
        {
            _t1 = step(0.0, _p1.y) * step(_p1.y, 1.0);
        }
    }
    return _p0.sample(_p0Smplr, _p1) * (_t0 * _t1);
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float4& _p1, thread const float2& _p2, constant int& u_fillModeX, constant int& u_fillModeY, constant int& u_frameCount, constant spvUnsafeArray<float4, 260>& u_matricesR, constant spvUnsafeArray<float4, 260>& u_matricesB, constant float& u_step)
{
    float4 _t2 = float4(0.0);
    float _t3 = 0.0;
    for (int _t4 = 0; _t4 < 64; _t4++)
    {
        if (_t4 >= u_frameCount)
        {
            break;
        }
        int _146 = _t4 * 4;
        float2 _192 = (float4x4(float4(u_matricesR[_146 + 0]), float4(u_matricesR[_146 + 1]), float4(u_matricesR[_146 + 2]), float4(u_matricesR[_146 + 3])) * _p1).xy;
        float2 _243 = (float4x4(float4(u_matricesB[_146 + 4]), float4(u_matricesB[_146 + 5]), float4(u_matricesB[_146 + 6]), float4(u_matricesB[_146 + 7])) * _p1).xy;
        float _257 = fast::clamp(ceil(length(_243 - _192) / u_step), 1.0, 8.0);
        float2 param = _192 * _p2;
        float4 _262 = _f0(_p0, _p0Smplr, param, u_fillModeX, u_fillModeY);
        _t2 += _262;
        _t3 += 1.0;
        for (int _t11 = 1; _t11 < 8; _t11++)
        {
            if (float(_t11) >= _257)
            {
                break;
            }
            float2 param_1 = mix(_192, _243, float2(float(_t11) / _257)) * _p2;
            float4 _296 = _f0(_p0, _p0Smplr, param_1, u_fillModeX, u_fillModeY);
            _t2 += _296;
            _t3 += 1.0;
        }
    }
    return _t2 / float4(_t3);
}

static inline __attribute__((always_inline))
float4 _f2(texture2d<float> _p0, sampler _p0Smplr, thread const float4& _p1, thread const float2& _p2, constant int& u_fillModeX, constant int& u_fillModeY, constant int& u_frameCount, constant spvUnsafeArray<float4, 260>& u_matricesB, constant float& u_step, constant spvUnsafeArray<float4, 260>& u_matricesG)
{
    float4 _t13 = float4(0.0);
    float _t14 = 0.0;
    for (int _t15 = 0; _t15 < 64; _t15++)
    {
        if (_t15 >= u_frameCount)
        {
            break;
        }
        int _330 = _t15 * 4;
        float2 _374 = (float4x4(float4(u_matricesG[_330 + 0]), float4(u_matricesG[_330 + 1]), float4(u_matricesG[_330 + 2]), float4(u_matricesG[_330 + 3])) * _p1).xy;
        float2 _421 = (float4x4(float4(u_matricesB[_330 + 4]), float4(u_matricesB[_330 + 5]), float4(u_matricesB[_330 + 6]), float4(u_matricesB[_330 + 7])) * _p1).xy;
        float _432 = fast::clamp(ceil(length(_421 - _374) / u_step), 1.0, 8.0);
        float2 param = _374 * _p2;
        float4 _437 = _f0(_p0, _p0Smplr, param, u_fillModeX, u_fillModeY);
        _t13 += _437;
        _t14 += 1.0;
        for (int _t22 = 1; _t22 < 8; _t22++)
        {
            if (float(_t22) >= _432)
            {
                break;
            }
            float2 param_1 = mix(_374, _421, float2(float(_t22) / _432)) * _p2;
            float4 _470 = _f0(_p0, _p0Smplr, param_1, u_fillModeX, u_fillModeY);
            _t13 += _470;
            _t14 += 1.0;
        }
    }
    return _t13 / float4(_t14);
}

static inline __attribute__((always_inline))
float4 _f3(texture2d<float> _p0, sampler _p0Smplr, thread const float4& _p1, thread const float2& _p2, constant int& u_fillModeX, constant int& u_fillModeY, constant int& u_frameCount, constant spvUnsafeArray<float4, 260>& u_matricesB, constant float& u_step)
{
    float4 _t24 = float4(0.0);
    float _t25 = 0.0;
    for (int _t26 = 0; _t26 < 64; _t26++)
    {
        if (_t26 >= u_frameCount)
        {
            break;
        }
        int _503 = _t26 * 4;
        float2 _547 = (float4x4(float4(u_matricesB[_503 + 0]), float4(u_matricesB[_503 + 1]), float4(u_matricesB[_503 + 2]), float4(u_matricesB[_503 + 3])) * _p1).xy;
        float2 _594 = (float4x4(float4(u_matricesB[_503 + 4]), float4(u_matricesB[_503 + 5]), float4(u_matricesB[_503 + 6]), float4(u_matricesB[_503 + 7])) * _p1).xy;
        float _605 = fast::clamp(ceil(length(_594 - _547) / u_step), 1.0, 8.0);
        for (int _t33 = 1; _t33 < 8; _t33++)
        {
            if (float(_t33) >= _605)
            {
                break;
            }
            float2 param = mix(_547, _594, float2(float(_t33) / _605)) * _p2;
            float4 _634 = _f0(_p0, _p0Smplr, param, u_fillModeX, u_fillModeY);
            _t24 += _634;
            _t25 += 1.0;
        }
        float2 param_1 = _547 * _p2;
        float4 _645 = _f0(_p0, _p0Smplr, param_1, u_fillModeX, u_fillModeY);
        _t24 += _645;
        _t25 += 1.0;
    }
    return _t24 / float4(_t25);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _664 = float4(in.v_p, 0.0, 1.0);
    float2 _670 = float2(1.0) / buffer.u_spriteSize;
    float4 param = _664;
    float2 param_1 = _670;
    float4 _t37 = _f1(u_inputTexture, u_inputTextureSmplr, param, param_1, buffer.u_fillModeX, buffer.u_fillModeY, buffer.u_frameCount, buffer.u_matricesR, buffer.u_matricesB, buffer.u_step);
    float4 param_2 = _664;
    float2 param_3 = _670;
    float4 _t38 = _f2(u_inputTexture, u_inputTextureSmplr, param_2, param_3, buffer.u_fillModeX, buffer.u_fillModeY, buffer.u_frameCount, buffer.u_matricesB, buffer.u_step, buffer.u_matricesG);
    float4 param_4 = _664;
    float2 param_5 = _670;
    float4 _t39 = _f3(u_inputTexture, u_inputTextureSmplr, param_4, param_5, buffer.u_fillModeX, buffer.u_fillModeY, buffer.u_frameCount, buffer.u_matricesB, buffer.u_step);
    out.o_fragColor = float4(_t37.x, _t38.y, _t39.z, fast::max(fast::max(_t37.w, _t38.w), _t39.w));
    return out;
}

