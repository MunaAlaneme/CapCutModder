
uniform mat4 uMVPMatrix;
uniform mat4 uSTMatrix;

attribute vec3 attPosition;
varying vec2 v_texCoord;
attribute vec2 attUV;
varying vec2 v_imageTexCoord;

void main()
{
    gl_Position = uMVPMatrix * vec4(attPosition.xy, 0.0, 1.0);
    v_texCoord = (gl_Position.xy * 0.5) + vec2(0.5);
    vec4 _t0 = uSTMatrix * vec4(attUV, 0.0, 1.0);
    v_imageTexCoord = vec2(_t0.x, _t0.y);
}

