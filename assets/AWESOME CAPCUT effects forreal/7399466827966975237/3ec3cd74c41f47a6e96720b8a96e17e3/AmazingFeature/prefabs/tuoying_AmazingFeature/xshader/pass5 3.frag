precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform sampler2D inputImageTexture1;
uniform sampler2D _MainTex;//inputImageTexture2;


#ifdef blur_Radius
#else
#define blur_Radius 2
#endif
uniform float u_alpha;
uniform float u_alpha1;
uniform float u_weight;

float getGrey(vec4 color)
{
    return dot(vec3(0.2989,0.5870,0.1140),color.rgb);
}
vec3 rgb2hsl(vec3 c) {
    float h = 0.0;
    float s = 0.0;
    float l = 0.0;
    float r = c.r;
    float g = c.g;
    float b = c.b;
    float cMin = min(r, min(g, b));
    float cMax = max(r, max(g, b));
    l = (cMax + cMin) / 2.0;
    if (cMax > cMin) {
        float cDelta = cMax - cMin;
        s = l < .5 ? cDelta / (cMax + cMin) : cDelta / (2.0 - (cMax + cMin));
        if (r == cMax) {
            h = (g - b) / cDelta;
        } else if (g == cMax) {
            h = 2.0 + (b - r) / cDelta;
        } else {
            h = 4.0 + (r - g) / cDelta;
        }
        if (h < 0.0) {
            h += 6.0;
        }
        h = h / 6.0;
    }
    return vec3(h, s, l);
}
vec3 hsl2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

vec4 changeContrast(float saturation, vec4 inputColor)
{
    float saturation_tmp = saturation - 1.0;
    vec4 color = inputColor;
    color = clamp(mix(vec4(0.435), color, saturation), 0.0, 1.0);
    vec3 hsv = rgb2hsl(color.rgb);
    float tmp = hsv.g;
    hsv.g = tmp * (1.0 - saturation_tmp * 0.26);
    color.r = hsl2rgb(hsv).r;
    hsv.g = tmp * (1.0 - saturation_tmp * 0.25);
    color.g = hsl2rgb(hsv).g;
    hsv.g = tmp * (1.0 - saturation_tmp * 0.18);
    color.b = hsl2rgb(hsv).b;
    return color; 
}

// screen
float blendScreen(float base,float blend){
    return 1.-((1.-base)*(1.-blend));
}
vec4 blendScreen(vec4 base,vec4 blend){
    return vec4(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b),base.a);
}

vec4 blendOver(vec4 A, vec4 B)
{
    float outA = A.a + B.a * (1.0 - A.a);

    vec3 outRGB = (A.rgb * A.a +
                   B.rgb * B.a * (1.0 - A.a));

    if (outA > 0.0)
        outRGB /= outA;

    return vec4(outRGB, outA);
}

vec4 blendOverPremultiplied(vec4 A, vec4 B)
{
    // A and B must already have their RGB channels multiplied by their Alpha
    return A + B * (1.0 - A.a);
}
vec4 blendOverPremultipliedOpaque(vec4 A, vec4 B)
{
    // Blend RGB using pre-multiplied logic
    vec3 outRGB = A.rgb + B.rgb * (1.0 - A.a);
    
    // Force final alpha to 1.0
    return vec4(outRGB, 1.0);
}


void main(void)
{

    lowp vec4 baseColor= texture2D(inputImageTexture,uv0);
    lowp vec4 lastColor= texture2D(inputImageTexture1,uv0);
    gl_FragColor = vec4(baseColor.rgb - lastColor.rgb,  baseColor.a+lastColor.a+1.0);


}
