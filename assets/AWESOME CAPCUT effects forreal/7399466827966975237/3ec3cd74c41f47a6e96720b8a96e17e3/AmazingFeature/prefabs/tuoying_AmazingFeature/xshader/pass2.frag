precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform sampler2D blurTexture;
uniform int imageWidth;
uniform int imageHeight;
// uniform float timer;

float blendScreen(float base, float blend) {
    return 1.0-((1.0-base)*(1.0-blend));
}

vec4 blendScreen(vec4 base, vec4 blend) {
    return vec4(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b),base.a);
}


void main()
{
    vec4 curColor = texture2D(inputImageTexture,uv0);
    vec4 blurColor = texture2D(blurTexture,uv0);
    vec4 resultColor = blurColor+(curColor-blurColor)*2.5;
    gl_FragColor = resultColor;
}