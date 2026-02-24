precision highp float;
precision highp int;

uniform mediump int u_hasFace;
uniform mediump sampler2D u_originalTex;
uniform mediump sampler2D u_maskImageTex;
uniform mediump int u_maskType;
uniform float u_reverseTaking;

varying vec2 v_uv;

vec3 _f0(vec3 _p0)
{
    float _26 = min(_p0.x, min(_p0.y, _p0.z));
    float _35 = max(_p0.x, max(_p0.y, _p0.z));
    float _39 = _35 - _26;
    float _43 = step(_39, 0.0);
    float _47 = 1.0 - _43;
    vec3 _t5 = (((_p0.yzx - _p0.zxy) / vec3(_39 + _43)) + vec3(0.0, 2.0, 4.0)) / vec3(6.0);
    float _70 = _35 + _26;
    return vec3(fract(mix(mix(_t5.z, _t5.y, step(_35, _p0.y)), _t5.x, step(_35, _p0.x))) * _47, mix(_39 / (_70 + step(_70, 0.0)), _39 / ((2.0 - _70) + step(2.0, _70)), step(1.0, _70)) * _47, _70 * 0.5);
}

void main()
{
    vec4 _t12;
    if (u_hasFace == 0)
    {
        _t12 = texture2D(u_originalTex, v_uv);
    }
    else
    {
        vec4 _t13 = texture2D(u_maskImageTex, v_uv);
        vec3 param = vec3(_t13.x, _t13.y, _t13.z);
        vec3 _t14 = _f0(param);
        float _t20;
        if (u_maskType == 0)
        {
            _t20 = _t14.z;
        }
        else
        {
            if (u_maskType == 1)
            {
                _t20 = _t13.x;
            }
            else
            {
                if (u_maskType == 2)
                {
                    _t20 = _t13.y;
                }
                else
                {
                    if (u_maskType == 3)
                    {
                        _t20 = _t13.z;
                    }
                    else
                    {
                        if (u_maskType == 4)
                        {
                            _t20 = _t13.w;
                        }
                    }
                }
            }
        }
        float _222;
        if (u_reverseTaking == 1.0)
        {
            _222 = 1.0 - _t20;
        }
        else
        {
            _222 = _t20;
        }
        _t20 = _222;
        _t12 = vec4(_222);
    }
    gl_FragData[0] = _t12;
}

