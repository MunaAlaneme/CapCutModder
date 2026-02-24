precision highp float;
varying vec2 uv0;
uniform sampler2D inputImageTexture;
uniform vec4 u_ScreenParams;
uniform float radius;

vec4 rotateBlur(sampler2D tex, vec2 center, vec2 curCoord)
{
    vec2 dxy = curCoord - center;
    float r = length(dxy);
    float angle = atan(dxy.y, dxy.x);
    int num = 1;

    vec4 color = vec4(0.0);
    float step = 0.0;
    float newX = r * cos(angle) + center.x;
    float newY = r * sin(angle) + center.y;
    color += texture2D(tex, vec2(newX, newY));
    return color;
}

uniform float _Angle;

void main()
{
    vec2 uv1 = uv0;

    vec2 uv = uv0;
    if (u_ScreenParams.y > u_ScreenParams.x)
    {
        uv.y = (uv.y - 0.5) * u_ScreenParams.y / u_ScreenParams.x + 0.5;
    } else
    {
        uv.x = (uv.x - 0.5) * u_ScreenParams.x / u_ScreenParams.y + 0.5;
    }
    uv -= 0.5;
    float f = distance(uv, vec2(0, 0));

    float mixAngle = mix(_Angle, radians(180.00)*2.0, smoothstep(0.0, 1.0, pow(f / radius,2.0)));
    if (f > radius)
        mixAngle = radians(180.00)*2.0;

    float s = sin(mixAngle);
    float c = cos(mixAngle);

    uv = vec2(-uv.x * c + uv.y * s, uv.x * s + uv.y * c);
    uv += 0.5;

    if (u_ScreenParams.y > u_ScreenParams.x)
    {
        uv.y = (uv.y - 0.5) * u_ScreenParams.x / u_ScreenParams.y + 0.5;
    } else
    {
        uv.x = (uv.x - 0.5) * u_ScreenParams.y / u_ScreenParams.x + 0.5;
    }

    uv.x = 1.0 - uv.x;
    vec4 col = texture2D(inputImageTexture, uv);
    vec4 src = texture2D(inputImageTexture, uv0);
    vec4 mask = texture2D(inputImageTexture, vec2(0,0));
    vec4 result = vec4(rotateBlur(inputImageTexture, vec2(0), uv));
    result = mix(src, result, 1.0);
    gl_FragColor = mix(result, vec4(0.0), vec4(0.0));
}
