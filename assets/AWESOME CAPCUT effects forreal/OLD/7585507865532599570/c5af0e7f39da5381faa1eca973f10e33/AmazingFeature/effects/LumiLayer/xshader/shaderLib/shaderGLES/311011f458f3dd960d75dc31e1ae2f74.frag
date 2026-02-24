precision highp float;
precision highp int;

uniform mediump int u_enableMatte;
uniform mediump sampler2D u_maskTexture;
uniform mediump int u_matteMode;
uniform mediump int u_layerType;
uniform mediump int u_hasMatte;
uniform float u_layerOpacity;
uniform mediump int u_hasBlend;
uniform mediump int u_hasBaseTexture;
uniform mediump sampler2D u_baseTexure;
uniform mediump int u_hasSourceTexture;
uniform mediump int u_hasTrs;
uniform mat4 u_mvMat;
uniform mat4 u_pMat;
uniform float u_mirrorEdge;
uniform mediump sampler2D u_sourceTexture;
uniform float u_alpha;

varying vec2 uv0;

vec4 _f1(vec3 _p0, vec3 _p1, vec3 _p2, vec3 _p3, vec3 _p4)
{
    vec3 _61 = _p3 - _p2;
    vec3 _65 = _p4 - _p2;
    vec3 _69 = cross(_p1, _65);
    float _74 = dot(_61, _69);
    if (_74 <= 1.0000000116860974230803549289703e-07)
    {
        return vec4(-1.0);
    }
    vec3 _87 = _p0 - _p2;
    float _93 = dot(_87, _69) / _74;
    if ((_93 < 0.0) || (_93 > 1.0))
    {
        return vec4(-1.0);
    }
    vec3 _107 = cross(_87, _61);
    float _113 = dot(_p1, _107) / _74;
    bool _115 = _113 < 0.0;
    bool _123;
    if (!_115)
    {
        _123 = (_93 + _113) > 1.0;
    }
    else
    {
        _123 = _115;
    }
    if (_123)
    {
        return vec4(-1.0);
    }
    return vec4(_93, _113, dot(_65, _107) / _74, 1.0);
}

vec2 _f2(mat4 _p0, mat4 _p1, vec2 _p2)
{
    vec3 _162 = (_p0 * vec4(10.0000095367431640625, -10.0, 0.0, 1.0)).xyz;
    vec3 _168 = (_p0 * vec4(10.0, -10.0000095367431640625, 0.0, 1.0)).xyz;
    vec3 _173 = (_p0 * vec4(-10.0, 10.0000095367431640625, 0.0, 1.0)).xyz;
    vec3 _178 = (_p0 * vec4(-10.0000095367431640625, 10.0, 0.0, 1.0)).xyz;
    vec4 _189 = _p1 * vec4((_p2 * 2.0) - vec2(1.0), 0.0, 1.0);
    vec4 _t17 = _189;
    vec3 _206 = normalize((_189.xyz / vec3(_t17.w)) - vec3(0.0));
    vec3 param = vec3(0.0);
    vec3 param_1 = _206;
    vec3 _214 = (_p0 * vec4(-10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 param_2 = _214;
    vec3 param_3 = _162;
    vec3 param_4 = _173;
    vec4 _t21 = _f1(param, param_1, param_2, param_3, param_4);
    vec3 param_5 = vec3(0.0);
    vec3 param_6 = _206;
    vec3 param_7 = _178;
    vec3 param_8 = _168;
    vec3 _231 = (_p0 * vec4(10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 param_9 = _231;
    vec4 _t22 = _f1(param_5, param_6, param_7, param_8, param_9);
    vec3 param_10 = vec3(0.0);
    vec3 param_11 = _206;
    vec3 param_12 = _214;
    vec3 param_13 = _173;
    vec3 param_14 = _162;
    vec4 _t23 = _f1(param_10, param_11, param_12, param_13, param_14);
    vec3 param_15 = vec3(0.0);
    vec3 param_16 = _206;
    vec3 param_17 = _178;
    vec3 param_18 = _231;
    vec3 param_19 = _168;
    vec4 _t24 = _f1(param_15, param_16, param_17, param_18, param_19);
    vec2 _397 = (((((((vec2(-4.5) * ((1.0 - _t21.x) - _t21.y)) + (vec2(5.5, -4.5) * _t21.x)) + (vec2(-4.5, 5.5) * _t21.y)) * step(0.0, _t21.w)) + ((((vec2(-4.5, 5.5) * ((1.0 - _t22.x) - _t22.y)) + (vec2(5.5, -4.5) * _t22.x)) + (vec2(5.5) * _t22.y)) * (step(_t21.w, 0.0) * step(0.0, _t22.w)))) + ((((vec2(-4.5) * ((1.0 - _t23.x) - _t23.y)) + (vec2(-4.5, 5.5) * _t23.x)) + (vec2(5.5, -4.5) * _t23.y)) * ((step(_t21.w, 0.0) * step(_t22.w, 0.0)) * step(0.0, _t23.w)))) + ((((vec2(-4.5, 5.5) * ((1.0 - _t24.x) - _t24.y)) + (vec2(5.5) * _t24.x)) + (vec2(5.5, -4.5) * _t24.y)) * (((step(_t21.w, 0.0) * step(_t22.w, 0.0)) * step(_t23.w, 0.0)) * step(0.0, _t24.w)))) + (vec2(-10000.0) * (((step(_t21.w, 0.0) * step(_t22.w, 0.0)) * step(_t23.w, 0.0)) * step(_t24.w, 0.0)));
    return _397;
}

vec2 _f4(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

float _f3(vec2 _p0)
{
    vec2 _t30 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t30.x * _t30.y;
}

float _f0(vec3 _p0)
{
    return dot(_p0, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

vec4 _f5(vec4 _p0)
{
    vec4 _t31 = vec4(0.0);
    if (u_enableMatte == 1)
    {
        _t31 = texture2D(u_maskTexture, uv0);
    }
    float _t32 = _t31.w;
    if (u_matteMode == 1)
    {
        vec3 param = _t31.xyz;
        _t32 = _f0(param);
    }
    else
    {
        if (u_matteMode == 2)
        {
            _t32 = 1.0 - _t31.w;
        }
        else
        {
            if (u_matteMode == 3)
            {
                vec3 param_1 = _t31.xyz;
                _t32 = 1.0 - _f0(param_1);
            }
        }
    }
    return _p0 * _t32;
}

vec4 _f6(inout vec4 _p0, inout vec4 _p1)
{
    float _483 = _p0.w;
    vec4 _486 = _p0;
    vec3 _489 = _486.xyz / vec3(max(_483, 9.9999997473787516355514526367188e-06));
    _p0.x = _489.x;
    _p0.y = _489.y;
    _p0.z = _489.z;
    float _498 = _p1.w;
    vec4 _500 = _p1;
    vec3 _503 = _500.xyz / vec3(max(_498, 9.9999997473787516355514526367188e-06));
    _p1.x = _503.x;
    _p1.y = _503.y;
    _p1.z = _503.z;
    vec4 _t33 = _p1;
    _t33.x = _p0.xyz.x;
    _t33.y = _p0.xyz.y;
    _t33.z = _p0.xyz.z;
    vec4 _t34 = vec4(0.0);
    if (u_layerType == 1)
    {
        float _t35 = 1.0;
        if (u_hasMatte == 1)
        {
            vec4 param = vec4(1.0);
            _t35 = _f5(param).w;
        }
        vec4 _551 = mix(_p1, vec4(_t33.xyz, _p0.w), vec4(u_layerOpacity * _t35));
        _t34 = _551;
        float _553 = _t34.w;
        vec3 _556 = _551.xyz * _553;
        _t34.x = _556.x;
        _t34.y = _556.y;
        _t34.z = _556.z;
    }
    else
    {
        vec3 _591 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t33.xyz * (_p0.w * _p1.w));
        _t34.x = _591.x;
        _t34.y = _591.y;
        _t34.z = _591.z;
        _t34.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t34;
}

void main()
{
    vec4 _t36 = vec4(0.0);
    bool _614 = u_hasBlend == 1;
    if (_614)
    {
        if (u_hasBaseTexture == 1)
        {
            _t36 = texture2D(u_baseTexure, uv0);
        }
        if (u_hasSourceTexture == 0)
        {
            gl_FragData[0] = _t36;
            return;
        }
    }
    vec4 _t37 = vec4(0.0);
    if (u_hasTrs == 1)
    {
        mat4 param = u_mvMat;
        mat4 param_1 = u_pMat;
        vec2 param_2 = uv0;
        vec2 _652 = _f2(param, param_1, param_2);
        float _656 = step(u_mirrorEdge, 0.5);
        vec2 param_3 = _652;
        vec2 _666 = (_652 * _656) + (_f4(param_3) * (1.0 - _656));
        vec2 param_4 = _666;
        _t37 = (texture2D(u_sourceTexture, _666) * u_alpha) * _f3(param_4);
    }
    else
    {
        if (u_hasSourceTexture == 1)
        {
            _t37 = texture2D(u_sourceTexture, uv0);
        }
    }
    if ((u_layerType != 1) && (u_hasMatte == 1))
    {
        vec4 param_5 = _t37;
        _t37 = _f5(param_5);
    }
    if (_614)
    {
        vec4 param_6 = _t37;
        vec4 param_7 = _t36;
        vec4 _704 = _f6(param_6, param_7);
        _t37 = _704;
    }
    gl_FragData[0] = _t37;
}

