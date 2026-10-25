precision highp float;

uniform sampler2D inputImageTexture;
varying vec2 uv;
uniform float flag;
uniform int inputWidth;
uniform int inputHeight;
vec4 highPrecision(vec2 myuv){
    vec2 newUV=myuv*255.;
    return vec4(floor(newUV)/255.,fract(newUV));
}
vec2 lowPrecision(vec4 myuv){
    return myuv.xy+myuv.zw/255.;
}

void main()
{
    vec4 col =texture2D(inputImageTexture, uv);
    if(flag>0.5){
        col=vec4(0.0);
    }
    gl_FragColor = vec4(col);
}