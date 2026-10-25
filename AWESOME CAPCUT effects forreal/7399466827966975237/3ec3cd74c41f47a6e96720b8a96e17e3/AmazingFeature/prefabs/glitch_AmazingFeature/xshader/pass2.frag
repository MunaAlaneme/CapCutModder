precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D uvImageTexture;
uniform sampler2D oriImageTexture;
uniform sampler2D mattingImg;
varying vec2 uv;

uniform int inputWidth;
uniform int inputHeight;
vec4 highPrecision(vec2 myuv){
    vec2 newUV=myuv*255.;
    return vec4(floor(newUV)/255.,fract(newUV));
}
vec2 lowPrecision(vec4 myuv){
    return myuv.xy+myuv.zw/255.;
}
vec4 getVid(vec2 uv){
    vec3 vid = texture2D(oriImageTexture, uv).rgb;
    float alpha = texture2D(mattingImg,vec2(uv.x,1.0-uv.y)).r;
    float start = 0.2;
    float stp = 1.-start;
    //col = vec3(.999);
    vec3 col = 1. * vid ;
    return vec4(col,alpha);//col = fract(col);
}
void main()
{
    vec4 noiseCol = texture2D(uvImageTexture, uv);
    vec2 noiseUV = lowPrecision(noiseCol);

    vec4 oriCol = getVid(uv);
    vec4 d = texture2D(inputImageTexture, uv-noiseUV);
    // d=mix(d,oriCol,0.125);
    d*=0.97;
    d+=0.03*oriCol;
    gl_FragColor = vec4(d);
}