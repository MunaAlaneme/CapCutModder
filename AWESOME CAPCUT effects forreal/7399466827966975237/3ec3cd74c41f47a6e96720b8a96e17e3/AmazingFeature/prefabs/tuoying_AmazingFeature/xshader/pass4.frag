//horizonal ,by rcl
precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;    
uniform sampler2D firstBlurTexture;
uniform sampler2D inputImageTexture2;

uniform int imageWidth;
uniform int imageHeight;
uniform int blurRadius;
uniform vec2 blurStep;
uniform float k;

uniform float sharpness;
#ifdef blur_Radius
#else
#define blur_Radius 2
#endif

float gaussianWeight(float dist, float stdDev)
{
    return exp(-dist / (2.0 * stdDev));
}

vec4 gaussianBlur(sampler2D inputTexture, vec2 textureCoordinate, int radius, vec2 stepUV, vec2 screenSize)
{
    // vec4 sumColor       = vec4(0.0);
    // vec4 resultColor    = vec4(0.0);
    vec2 unitUV         = stepUV/screenSize;//vec2(blurSize/screenSize.x,blurSize/screenSize.y)*1.25;
    float stdDev        = 112.0;
    float sumWeight     = gaussianWeight(0.0,stdDev);
    vec4 curColor       = texture2D(inputTexture, textureCoordinate);    
    vec4 sumColor       = curColor*sumWeight;
    //horizontal
    for(int i=1;i<=blur_Radius;i++)
    {
        vec2 textureCoordinateA = textureCoordinate+float(i)*unitUV;
        vec2 textureCoordinateB = textureCoordinate+float(-i)*unitUV;
        vec4 colorA = texture2D(inputTexture,textureCoordinateA);
        vec4 colorB = texture2D(inputTexture,textureCoordinateB);
        float curWeight = gaussianWeight(float(i),stdDev);
        sumColor += colorA*curWeight;
        sumColor += colorB*curWeight;
        sumWeight+= curWeight*2.0;
    }
    
    vec4 resultColor = sumColor/sumWeight;

    return resultColor;
}

vec4 lm_take_effect_filter(sampler2D filterTex,vec4 inputColor,float uniAlpha)
{
  highp vec4 textureColor= inputColor;	//texture2D(inputTex,textureCoordinate);
  highp float blueColor=textureColor.b*63.;
  
  highp vec2 quad1;
  quad1.y=floor(floor(blueColor)/8.);
  quad1.x=floor(blueColor)-(quad1.y*8.);
  
  highp vec2 quad2;
  quad2.y=floor(ceil(blueColor)/8.);
  quad2.x=ceil(blueColor)-(quad2.y*8.);
  
  highp vec2 texPos1;
  texPos1.x=(quad1.x*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.r);
  texPos1.y=(quad1.y*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.g);
  
  highp vec2 texPos2;
  texPos2.x=(quad2.x*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.r);
  texPos2.y=(quad2.y*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.g);
  
  vec4 newColor1=texture2D(filterTex,texPos1);
  vec4 newColor2=texture2D(filterTex,texPos2);
  vec4 newColor=mix(newColor1,newColor2,fract(blueColor));
  newColor = mix(textureColor,vec4(newColor.rgb,textureColor.w),uniAlpha);

  return newColor;
}

void main()
{
    vec2 screenSize = vec2(imageWidth,imageHeight);
    vec4 curColor = texture2D(inputImageTexture,uv0);
    vec4 resultColor = curColor;

    resultColor = gaussianBlur(inputImageTexture,uv0,blurRadius,blurStep,screenSize);
    
    vec4 firstBlurColor = texture2D(firstBlurTexture,uv0);

    resultColor = clamp(firstBlurColor+(firstBlurColor-resultColor)*sharpness,0.,1.);
    resultColor = lm_take_effect_filter(inputImageTexture2,resultColor,k);
    gl_FragColor = resultColor;
}