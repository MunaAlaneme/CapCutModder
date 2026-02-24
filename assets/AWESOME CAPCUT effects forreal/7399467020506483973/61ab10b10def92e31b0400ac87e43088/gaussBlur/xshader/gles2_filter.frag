precision highp float;
varying vec2 uv0;
#define textureCoordinate uv0

uniform float inputHeight;
uniform float inputWidth;
uniform float blurStep;
uniform float range;
uniform float Speed;
uniform float time;
uniform float region;
uniform float broken;
uniform float brokenbool;

uniform sampler2D _MainTex;
uniform vec2 blurDirection;
#define inputImageTexture _MainTex
#define num 10

#define PI 3.14159265358979323846264
float sinc(float x) {
    return (sin(x) / x);
}
void main()
{
    
    vec2 uv = textureCoordinate * 2.0 -1.0 ;
   
    float aspect = inputWidth / inputHeight;
    uv.x *= aspect;
    
    vec2 pos = vec2(0.0 ,0.0);
    float iTime = mod(time*Speed,2.0);
    float iTime2 = mod(time*Speed - 1.0,2.0);
    vec2 offset = uv * sinc(PI * (iTime - (length(uv - pos)*range) )/0.2 - 3.0) * 0.9 * (region - (length(uv - pos)*range));
    vec2 offset2 = uv * sinc(PI * (iTime2 - (length(uv - pos)*range) )/0.2 - 3.0) * 0.9 * (region - (length(uv - pos)*range));
    
    if (brokenbool >= 0.5) {
	uv += floor((offset + offset2)*broken)/broken;
    } else {
	uv += offset + offset2;
    }
    uv.x /= aspect;
    uv = (uv + 1.0) /2.;
    
    vec4 resultColor = texture2D(inputImageTexture, vec2(uv.x,uv.y));
    

	gl_FragColor = resultColor;
}
