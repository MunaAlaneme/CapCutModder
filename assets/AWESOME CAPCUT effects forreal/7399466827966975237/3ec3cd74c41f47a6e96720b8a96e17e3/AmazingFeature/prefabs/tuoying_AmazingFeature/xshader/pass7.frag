precision highp float;
varying vec2 uv0;
varying vec2 uv1;

uniform sampler2D inputImageTexture;
uniform sampler2D inputImageTexture1;
uniform sampler2D inputImageTexture2;
uniform sampler2D _MainTex;
// uniform float k;

#ifdef blur_Radius
#else
#define blur_Radius 2
#endif
uniform vec4 u_ScreenParams;
uniform float u_colorChange;
uniform vec2 u_direction;
uniform float u_filter;
uniform float u_first;
uniform float u_alpha;
uniform float u_alpha1;
uniform float u_alpha2;
uniform float u_contrast;
uniform float u_colorDiv;
uniform float u_lightness;
uniform float u_lightnessMin;
uniform float u_lightnessRange;
uniform float u_srcColorAlpha;


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

vec4 changeContrast(float contrast, vec4 inputColor)
{
    float saturation_tmp = contrast - 1.0;
    vec4 color = inputColor;
    color = clamp(mix(vec4(0.435), color, contrast), 0.0, 1.0);
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

vec4 changeLightness(float lightness, vec4 inputColor)
{
    vec4 col = inputColor;
    float flag;
    float mylight=lightness;
    if(mylight>0.){
        mylight*=5.;
        flag=1.0+mylight;
    }
    else{
        mylight*=2.5;
        flag= 1.0/(1.0-mylight);
        col.rgb-=abs(lightness)*0.005*2.;
    }
    return vec4(clamp(1.0-pow(1.-col.rgb,vec3(flag)),0.0,1.0),col.a);
}

float getGrey(vec4 color)
{
    return dot(vec3(0.2989,0.5870,0.1140),color.rgb);
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

void main()
{
    vec4 inputTexColor = texture2D(inputImageTexture2,uv0);
    // vec4 baseColor = changeContrast(u_contrast,inputTexColor);
    // vec4 curColor = 1.-texture2D(inputImageTexture,uv0);
    vec4 blurTexColor = (texture2D(inputImageTexture1,uv0));
    vec4 lastTexColor = texture2D(inputImageTexture,uv0);
    vec4 resultColor = mix(inputTexColor,lastTexColor,u_alpha);
    resultColor = mix(resultColor,inputTexColor,u_first);
    gl_FragColor = mix(lastTexColor,inputTexColor,u_srcColorAlpha)*inputTexColor.a;
    gl_FragColor.a = inputTexColor.a;
    // gl_FragColor = vec4(1,0,0,inputTexColor.a);
}