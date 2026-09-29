// Simplified from https://vgpu.sh/examples/holographic-card/source.md
struct Params {
  resolution: vec2f,
  tilt: vec2f,
  pointer: vec2f,
  hover: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn roundedBox(p: vec2f, halfSize: vec2f, radius: f32) -> f32 {
  let q = abs(p) - halfSize + radius;
  return length(max(q, vec2f(0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

fn pearlColor(phase: f32) -> vec3f {
  return vec3f(0.49, 0.69, 0.65) + vec3f(0.35, 0.24, 0.19)
    * cos(6.2831853 * (phase + vec3f(0.05, 0.38, 0.63)));
}

fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
}

fn diffraction(across: vec2f, lightAndView: vec2f, spacing: f32) -> vec3f {
  let pathDifference = spacing * abs(dot(lightAndView, across));
  let along = dot(lightAndView, vec2f(-across.y, across.x));
  let envelope = exp(-along * along / 0.36);
  var reflected = vec3f(0);
  for (var order = 1; order <= 3; order++) {
    let m = f32(order);
    reflected += wavelengthColor(pathDifference / m) / (m * m);
  }
  return reflected * envelope;
}

fn etchedPhase(p: vec2f) -> f32 {
  let warp = vec2f(sin(p.y * 7.0 + sin(p.x * 4.0)) * 0.085, sin(p.x * 6.0 - p.y * 3.0) * 0.07);
  let q = p + warp - vec2f(0.13, 0.08);
  let radius = length(q * vec2f(1.0, 0.76));
  return radius * 142.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let resolution = max(params.resolution, vec2f(1));
  let scale = min(resolution.y, resolution.x * 1.35);
  let screen = (uv - 0.5) * resolution / scale * 1.85;
  let sx = sin(params.tilt.y);
  let cx = cos(params.tilt.y);
  let sy = sin(params.tilt.x);
  let cy = cos(params.tilt.x);
  let right = vec3f(cy, 0, -sy);
  let down = vec3f(sy * sx, cx, cy * sx);
  let normal = cross(right, down);
  let eye = vec3f(0, 0, 4.5);
  let ray = normalize(vec3f(screen, -4.5));
  let hit = eye - ray * (dot(eye, normal) / dot(ray, normal));
  let p = vec2f(dot(hit, right), dot(hit, down));
  let aa = max(length(fwidth(p)), 0.0006);
  let edge = roundedBox(p, vec2f(0.64, 0.91), 0.055);
  let silhouette = 1.0 - smoothstep(-aa, aa, edge);

  let hover = clamp(params.hover, 0.0, 1.0);
  let lightCenter = params.pointer * vec2f(0.64, 0.91);
  let delta = p - lightCenter;
  let sweep = (delta.x * 0.72 + delta.y * 0.52 + sin(p.y * 4.0 + p.x * 3.0) * 0.08) / 0.36;
  let light = exp(-sweep * sweep) * exp(-dot(delta, delta) * 2.0) * hover;
  let contour = etchedPhase(p);
  let pearl = pearlColor(p.y * 0.3 + contour * 0.003 + delta.x * 0.2);
  let lightDirection = normalize(vec3f(lightCenter, 1.2) - hit);
  let viewDirection = normalize(eye - hit);
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let gradient = vec2f(dpdx(contour), dpdy(contour));
  let across = normalize(gradient + vec2f(0.00001));
  let spectrum = diffraction(across, lightAndView, 1.65) * illumination;
  var color = vec3f(0.046, 0.079, 0.139) + light * (pearl * 0.16 + vec3f(0.035, 0.075, 0.067));

  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = hover * (0.08 + 0.35 * exp(-dot(delta, delta) * 2.0) + light);
  color += contours * (pearl * 0.55 + spectrum * 0.2) * reveal * 0.4;
  color += pearl * light * 0.08;

  let rim = stroke(edge + 0.002, 0.0008, aa * 0.7);
  color = mix(color, vec3f(0.25, 0.49, 0.46) + pearl * light * 0.3, rim);
  return vec4f(color * silhouette, silhouette);
}
