//vertical ,by rcl
precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;

uniform int imageWidth;
uniform int imageHeight;
uniform int blurRadius;
uniform vec2 blurStep;
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

void main(void) 
{
    vec2 screenSize = vec2(imageWidth,imageHeight);
    vec4 curColor = texture2D(inputImageTexture,uv0);
    vec4 resultColor = curColor;

    resultColor = gaussianBlur(inputImageTexture,uv0,blurRadius,blurStep,screenSize);
    gl_FragColor = resultColor;
}
