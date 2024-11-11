import { ShaderMaterial } from "three"

const VERTEX_SHADER = `
  varying float vDistance;
  uniform float radiusMultiplier;
  
  attribute vec3 color;

  #define USE_COLOR
  #include <color_pars_vertex>

  void main() {
    #include <color_vertex>

    vec4 cs_position = modelViewMatrix * vec4(position, 1.0);
    vDistance = -cs_position.z;

    gl_PointSize = radiusMultiplier / vDistance;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    vColor = color;
  }
`;

const FRAGMENT_SHADER = `
  varying float vDistance;
  varying vec3 vColor;
  uniform vec3 borderColor;

  void main() {
    float radius = 0.5;
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > radius) {
      discard;
    }
    if (length(coord) > 0.4) {
      gl_FragColor = vec4(borderColor, 1.0);
    }
    else {
      gl_FragColor = vec4(vColor, 1.0);
    }
  }
`;

export const pointCloudMaterial = new ShaderMaterial({
  vertexShader: VERTEX_SHADER,
  fragmentShader: FRAGMENT_SHADER,
  uniforms: {
    radiusMultiplier: { value: 50.0 },
    borderColor: { value: [0.2, 0.2, 0.2] },
  }
})
