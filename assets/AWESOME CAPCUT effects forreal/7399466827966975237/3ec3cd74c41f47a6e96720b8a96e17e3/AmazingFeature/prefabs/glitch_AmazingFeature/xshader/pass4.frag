precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D oriImageTexture;
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
void main()
{
    vec4 col = texture2D(inputImageTexture, uv);
    //col.rgb=clamp(col.rgb/col.a,0.0,1.0);
    vec4 oriCol = texture2D(oriImageTexture, uv);
    vec4 resultCol = mix(oriCol,col,col.a);
    gl_FragColor = vec4(col);
}