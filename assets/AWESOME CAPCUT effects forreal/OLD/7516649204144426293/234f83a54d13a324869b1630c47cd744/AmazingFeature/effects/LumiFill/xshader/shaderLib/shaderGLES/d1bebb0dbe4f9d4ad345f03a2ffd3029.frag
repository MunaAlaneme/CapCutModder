precision highp float;
precision highp int;

uniform mediump int u_blendMode;
uniform mediump sampler2D u_InputTexture;
uniform mediump vec3 u_Color;
uniform mediump float u_Opacity;
uniform mediump float u_Reverse;
uniform mediump float u_Alpha;

varying vec2 v_uv;

mediump vec4 _f0(inout mediump vec4 _p0, inout mediump vec4 _p1)
{
    mediump float _18 = _p0.w;
    mediump vec4 _22 = _p0;
    mediump vec3 _25 = _22.xyz / vec3(max(_18, 0.001000000047497451305389404296875));
    _p0.x = _25.x;
    _p0.y = _25.y;
    _p0.z = _25.z;
    mediump float _36 = _p1.w;
    mediump vec4 _38 = _p1;
    mediump vec3 _41 = _38.xyz / vec3(max(_36, 0.001000000047497451305389404296875));
    _p1.x = _41.x;
    _p1.y = _41.y;
    _p1.z = _41.z;
    mediump vec4 _t0 = _p1;
    if (u_blendMode == 2)
    {
        mediump vec3 _63 = _p0.xyz + _p1.xyz;
        _t0.x = _63.x;
        _t0.y = _63.y;
        _t0.z = _63.z;
    }
    else
    {
        if (u_blendMode == 1)
        {
            mediump vec3 _80 = _p0.xyz * _p1.xyz;
            _t0.x = _80.x;
            _t0.y = _80.y;
            _t0.z = _80.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                mediump vec3 _103 = (_p0.xyz + _p1.xyz) - (_p0.xyz * _p1.xyz);
                _t0.x = _103.x;
                _t0.y = _103.y;
                _t0.z = _103.z;
            }
            else
            {
                _t0.x = _p0.xyz.x;
                _t0.y = _p0.xyz.y;
                _t0.z = _p0.xyz.z;
            }
        }
    }
    mediump vec4 _t1 = vec4(0.0);
    mediump vec3 _150 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t0.xyz * (_p0.w * _p1.w));
    _t1.x = _150.x;
    _t1.y = _150.y;
    _t1.z = _150.z;
    _t1.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t1;
}

void main()
{
    mediump vec4 _180 = texture2D(u_InputTexture, v_uv);
    mediump vec4 _t2 = _180;
    mediump vec4 param = vec4(vec4(u_Color * u_Opacity, 1.0).xyz, u_Opacity);
    mediump vec4 param_1 = _180;
    mediump vec4 _203 = _f0(param, param_1);
    gl_FragData[0] = _203 * (abs(u_Reverse - _t2.w) * u_Alpha);
}

