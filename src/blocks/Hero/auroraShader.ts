/**
 * Shader de la aurora del hero.
 *
 * Cortinas verticales que se mecen lento, con estrías finas adentro y un borde
 * inferior ondulado. Solo usa tonos del manual: Verde en el borde, Teal al
 * medio y un Boreas empolvado arriba. La salida es premultiplicada, así que se
 * compone sobre la foto como un velo translúcido.
 *
 * El borde inferior queda a la altura de la línea de cumbres: con primer plano
 * recortado, ese borde se esconde detrás de las montañas.
 */

export const AURORA_VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

export const AURORA_FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime;
  float x = uv.x * (uRes.x / uRes.y) * 0.6 + uPointer.x * 0.05;

  // Cortinas que se mecen y estrías verticales dentro de ellas.
  float sway = fbm(vec2(x * 1.3 + t * 0.018, t * 0.025));
  float xs = x + sway * 0.35;
  float sheets = smoothstep(0.28, 0.72, fbm(vec2(xs * 3.2 + t * 0.012, 3.1 + t * 0.02)));
  float rays = pow(fbm(vec2(xs * 34.0, uv.y * 0.8 - t * 0.05)), 2.0) * 2.1;

  // Perfil vertical: borde ondulado a la altura de las cumbres, desvanecido hacia arriba.
  float hem = 0.40 + 0.10 * sin(xs * 4.0 + t * 0.1) + 0.12 * fbm(vec2(xs * 2.0, t * 0.04)) + uPointer.y * 0.02;
  float lower = smoothstep(hem - 0.06, hem + 0.07, uv.y);
  float upper = exp(-max(uv.y - hem, 0.0) * 1.3);
  float hemGlow = exp(-abs(uv.y - hem - 0.03) * 18.0) * 0.6;
  float a = sheets * lower * (upper * (0.4 + rays) + hemGlow);
  a *= 0.85 + 0.15 * sin(t * 0.35);

  // Verde #7c9c80 · Teal medio #90c1c6 · Boreas medio con Boreas base.
  float h = clamp((uv.y - hem) * 1.4 + 0.25 * sin(xs * 1.7 + t * 0.05), 0.0, 1.0);
  vec3 verde  = vec3(0.486, 0.612, 0.502);
  vec3 teal   = vec3(0.565, 0.757, 0.776);
  vec3 boreas = vec3(0.606, 0.461, 0.672);
  vec3 col = mix(verde, teal, smoothstep(0.0, 0.45, h));
  col = mix(col, boreas, smoothstep(0.4, 0.95, h));

  float k = clamp(a * 1.6, 0.0, 0.7);
  gl_FragColor = vec4(col * k, k);
}
`
