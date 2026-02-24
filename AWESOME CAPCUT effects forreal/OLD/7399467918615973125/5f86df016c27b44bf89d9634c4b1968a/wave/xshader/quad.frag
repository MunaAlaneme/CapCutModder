precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_albedo;
uniform float iTime;
uniform float offx;
uniform float offy;
uniform float tilew;
uniform float tileh;
uniform float speedx;
uniform float speedy;
uniform float repeatx;
uniform float repeaty;

// #define PI = 3.14159;
// 
void main()
{

  float ox = uv0.x;
  float oy = uv0.y;
    if (repeatx >= 0.5) {
      ox = mod((uv0.x*tilew + offx) + iTime*speedx,2.0);
    } else {
      ox = mod((uv0.x*tilew + offx) + iTime*speedx,1.0);
    }
    if (repeaty >= 0.5) {
      oy = mod((uv0.y*tileh + offy) + iTime*speedy,2.0);
    } else {
      oy = mod((uv0.y*tileh + offy) + iTime*speedy,1.0);
    }

    if (ox < 0.0){
      ox = -ox;
    }else if(ox > 1.0){
      ox = 2.0 - ox;
    }if (oy < 0.0){
      oy = -oy;
    }else if(oy > 1.0){
      oy = 2.0 - oy;

  }

  vec2 uv = vec2(ox, oy);

  vec4 color = texture2D(u_albedo, uv);

  gl_FragColor = color;
}
