struct Params {
  resolution: vec2f,
  pointer: vec2f,
  motion: vec2f,
  hover: f32,
  time: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let position = uv * max(params.resolution, vec2f(1));
  let delta = position - params.pointer;
  let influence = exp(-dot(delta, delta) / (230.0 * 230.0)) * params.hover;
  // Inverse sampling compresses the grid around the pointer. Rotation and
  // cursor velocity bend the nearby squares into a flowing wake.
  let flow = vec2f(-delta.y, delta.x) * (0.065 * influence) + params.motion * (1.4 * influence);
  let drift = vec2f(
    sin(position.y * 0.012 + params.time * 0.82) + sin(position.x * 0.009 - params.time * 0.47),
    cos(position.x * 0.011 + params.time * 0.72) + sin(position.y * 0.008 - params.time * 0.5)
  ) * (1.45 + params.hover * 0.4);
  let displaced = position + delta * (0.5 * influence) - flow - drift;
  let cell = floor(displaced / 12.0);
  let local = displaced - cell * 12.0;
  let noise = hash(cell);
  let center = params.resolution / 12.0 * vec2f(0.6, 0.5);
  let radius = length((cell - center) * vec2f(1.0, 0.85));
  let wave = sin(cell.x * 0.18 + sin(cell.y * 0.11 + params.time * 0.34) * 2.2) * 0.55
    + sin(radius * 0.24 - params.time * 0.58) * 0.45;
  let ripple = sin(length(delta) / 30.0 - params.time * 2.0) * influence * 0.16;
  let waveShape = smoothstep(-0.6, 0.7, wave + ripple);
  let shape = mix(waveShape, 1.0, min(influence * 1.2, 0.78));

  // Uneven amber squares, like a low-resolution dither texture rather than text.
  if (noise < 0.42 - influence * 0.3) { return vec4f(0); }
  let pulse = sin(params.time * 0.7 + cell.x * 0.08 + cell.y * 0.06) * influence * 0.25;
  let size = clamp(2.4 + shape * 6.1 + noise * 0.5 + influence * 1.6 + pulse, 2.4, 10.5);
  if (max(abs(local.x - 6.0), abs(local.y - 6.0)) > size * 0.5) {
    return vec4f(0);
  }
  let alpha = 0.06 + shape * 0.13 + noise * 0.035 + influence * 0.16;
  return vec4f(1.0, 0.7, 0.25, alpha);
}
