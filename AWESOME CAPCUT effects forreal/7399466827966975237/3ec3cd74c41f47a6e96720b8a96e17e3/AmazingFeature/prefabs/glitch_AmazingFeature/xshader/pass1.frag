precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D oriImageTexture;
varying vec2 uv;

uniform int inputWidth;
uniform int inputHeight;

uniform float iTime;
uniform float flag;
#define R iResolution.xy
#define A(U) texture2D(inputImageTexture, U)
#define B(U) texture2D(oriImageTexture, U)

vec4 T(vec2 U){return A(U-A(U).xy);}

vec3 getVid(vec2 uv){
    vec3 vid = texture2D(oriImageTexture, uv).rgb;
    float start = 0.2;
    float stp = 1.-start;
    //col = vec3(.999);
    vec3 col = 1. * vid * smoothstep(start,start+stp,length(vid.rgb)*0.3);
    return col;//col = fract(col);
}

float noise1(float a, float b){return 0.1*(fract(sin(a*123.3+b*134.2+iTime*213.3)*322.1)*2.0-1.0);}

vec2 noise2(vec2 v, vec2 w){return vec2(noise1(v.x, w.y), noise1(v.y, w.x));}
vec4 highPrecision(vec2 myuv){
    vec2 newUV=myuv*255.;
    return vec4(floor(newUV)/255.,fract(newUV));
}
vec2 lowPrecision(vec4 myuv){
    return myuv.xy+myuv.zw/255.;
}
void main()
{
    // vec3 col = getVid(uv);
    
    vec4 last = texture2D(inputImageTexture, uv-lowPrecision(texture2D(inputImageTexture, uv)));
    vec2 lastUV= lowPrecision(last);
    // last.z *= 0.99;
    // last.z += 0.03*length(col);
    
    vec2 cons = lastUV;
    lastUV = 0.01*noise2(uv, lastUV);
    //last.xy /= (smoothstep(0.,.2,last.w)+0.1);
    lastUV = (2.*cons + 2.*lastUV)/4.;
    if(flag>0.5){
        last=vec4(highPrecision(uv));
    }
    gl_FragColor = vec4(highPrecision(lastUV));
}