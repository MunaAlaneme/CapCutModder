precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_albedo;
uniform float iTime;
uniform float scope;
uniform float scopev;
uniform float speed;
uniform float speedv;
uniform float rate;
uniform float ratev;
uniform float broken;
uniform float broken2;
uniform float broken3;

// #define PI = 3.14159;
// 
void main()
{
 float s = 1.0 - scope * 2.0;

  float ox = uv0.x;
  float oy = uv0.y;
    if (broken >= 0.5){
	ox = uv0.x + (sin(mod((floor(uv0.y*broken2)/broken2 * rate * 2.0)+(iTime/5.0), 2.0) * 3.14159) * scope);
	oy = uv0.y + (sin(mod((floor(uv0.x*broken3)/broken3 * ratev * 2.0)+(iTime/5.0), 2.0) * 3.14159) * scopev);
    }else{
	ox = uv0.x + (sin(mod((uv0.y * rate * 2.0)+(iTime/5.0), 2.0) * 3.14159) * scope);
	oy = uv0.y + (sin(mod((uv0.x * ratev * 2.0)+(iTime/5.0), 2.0) * 3.14159) * scopev);
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
