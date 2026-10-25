precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D oriImageTexture;
varying vec2 uv;

uniform int inputWidth;
uniform int inputHeight;

uniform float iTime;
uniform float flag;
vec4 highPrecision(vec2 myuv){
    vec2 newUV=myuv*255.;
    return vec4(floor(newUV)/255.,fract(newUV));
}
vec2 lowPrecision(vec4 myuv){
    return myuv.xy+myuv.zw/255.;
}
void main()
{
    
    vec4 last = texture2D(inputImageTexture, uv);
    
    if(flag>0.5){
        last=vec4(0.0);
    }
    gl_FragColor = vec4(last);
}
