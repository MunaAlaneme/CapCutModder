
uniform float bendZbyY;
uniform float bendZbyX;
uniform float bendXbyY;
uniform float bendXbyZ;
uniform float bendYbyX;
uniform float bendYbyZ;
uniform mat4 u_MVP;

attribute vec3 a_position;
varying vec2 v_uv;
attribute vec2 a_texcoord0;

void main()
{
    vec3 _t1 = a_position;
    float _24 = 1.0 - (a_position.y * a_position.y);
    _t1.z += ((_24 * bendZbyY) * 0.00999999977648258209228515625);
    float _43 = 1.0 - (a_position.x * a_position.x);
    _t1.z += ((_43 * bendZbyX) * 0.00999999977648258209228515625);
    _t1.x += ((_24 * bendXbyY) * 0.00999999977648258209228515625);
    float _71 = 1.0 - (a_position.z * a_position.z);
    _t1.x += ((_71 * bendXbyZ) * 0.00999999977648258209228515625);
    _t1.y += ((_43 * bendYbyX) * 0.00999999977648258209228515625);
    _t1.y += ((_71 * bendYbyZ) * 0.00999999977648258209228515625);
    gl_Position = u_MVP * vec4(_t1, 1.0);
    v_uv = a_texcoord0;
}

