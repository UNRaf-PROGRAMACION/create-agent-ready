struct Params {
  resolution: vec2f,
  pointer: vec2f,
  motion: vec2f,
  hover: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

// Five-bit rows for a small monospace alphabet: 0, 1, dot, middle dot, colon, *, x, +.
fn glyphRow(glyph: u32, row: u32) -> u32 {
  switch glyph {
    case 0u: { let rows = array<u32, 7>(14u, 17u, 19u, 21u, 25u, 17u, 14u); return rows[row]; }
    case 1u: { let rows = array<u32, 7>(4u, 12u, 4u, 4u, 4u, 4u, 14u); return rows[row]; }
    case 2u: { let rows = array<u32, 7>(0u, 0u, 0u, 0u, 0u, 4u, 4u); return rows[row]; }
    case 3u: { let rows = array<u32, 7>(0u, 0u, 0u, 4u, 0u, 0u, 0u); return rows[row]; }
    case 4u: { let rows = array<u32, 7>(0u, 4u, 4u, 0u, 4u, 4u, 0u); return rows[row]; }
    case 5u: { let rows = array<u32, 7>(0u, 21u, 14u, 31u, 14u, 21u, 0u); return rows[row]; }
    case 6u: { let rows = array<u32, 7>(0u, 17u, 10u, 4u, 10u, 17u, 0u); return rows[row]; }
    default: { let rows = array<u32, 7>(0u, 4u, 4u, 31u, 4u, 4u, 0u); return rows[row]; }
  }
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let position = uv * max(params.resolution, vec2f(1));
  let delta = position - params.pointer;
  let influence = exp(-dot(delta, delta) / (200.0 * 200.0));
  // Sample the fixed grid from a displaced coordinate so nearby glyphs follow
  // the pointer's movement, then settle back as motion decays.
  let displaced = position - params.motion * influence;
  let cell = floor(displaced / 16.0);
  let local = displaced - cell * 16.0;
  let random = hash(cell);
  let light = (1.0 - smoothstep(0.0, 400.0, distance(position, params.pointer))) * params.hover;

  // Most cells remain empty; the brighter symbols appear near the pointer.
  if (random < 0.4) { return vec4f(0); }
  let glyph = u32(floor(hash(cell + vec2f(37.0, 91.0)) * 8.0));
  let pixel = floor((local - vec2f(3.375, 2.2)) / vec2f(1.85, 1.65));
  if (pixel.x < 0.0 || pixel.x >= 5.0 || pixel.y < 0.0 || pixel.y >= 7.0) {
    return vec4f(0);
  }
  let bit = (glyphRow(glyph, u32(pixel.y)) >> (4u - u32(pixel.x))) & 1u;
  let brightness = (0.17 + light * 0.54) * f32(bit);
  return vec4f(1.0, 0.7, 0.12, brightness);
}
