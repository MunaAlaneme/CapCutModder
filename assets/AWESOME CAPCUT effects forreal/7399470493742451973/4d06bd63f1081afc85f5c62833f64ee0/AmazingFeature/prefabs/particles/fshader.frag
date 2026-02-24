precision highp float;
varying vec2 uv0;
uniform sampler2D u_inputSrcMergeMatting;
void main()
{
    gl_FragColor = texture2D(u_inputSrcMergeMatting, uv0);
}
