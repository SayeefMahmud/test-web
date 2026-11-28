// Turns a Nebula Dash ship mesh (a Unity `Mesh` .asset written by ShipForge) into a .glb for the
// portfolio's 3D project view. Reads the asset as text, so neither Unity nor the game repo changes.
//
//   node scripts/export-ship.mjs <path/to/Ship_<id>.asset> <out.glb> --body r,g,b --accent r,g,b \
//     --glow r,g,b --trim r,g,b --glass r,g,b [--metal 0.55] [--smooth 0.75] [--accent-emissive]
//
// Colours are the 0..1 sRGB values from ShipCatalog.cs (body/accent/glow) and ShipForge.Design
// (trim/glass, bodyMetal/bodySmooth, accentEmissive). The submesh order is ShipForge's:
// 0 body, 1 accent, 2 trim, 3 glass, 4 engine glow. Material values copy NebulaDashSetup.BuildForgeShip.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [, , src, out, ...rest] = process.argv;
if (!src || !out) {
  console.error(
    "usage: node scripts/export-ship.mjs <Ship_<id>.asset> <out.glb> --body r,g,b ...",
  );
  process.exit(1);
}
const opt = {};
for (let i = 0; i < rest.length; i++) {
  const k = rest[i].replace(/^--/, "");
  if (k === "accent-emissive") opt[k] = true;
  else opt[k] = rest[++i];
}
const rgb = (k) => {
  if (!opt[k]) throw new Error(`missing --${k}`);
  const v = opt[k].split(",").map(Number);
  if (v.length !== 3 || v.some((n) => !(n >= 0))) throw new Error(`bad --${k}`);
  return v;
};
const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lin = (v) => v.map(toLinear);

// ---------- parse the Unity mesh asset ----------
const text = readFileSync(src, "utf8");
const num = (re) => {
  const m = text.match(re);
  if (!m) throw new Error(`not found: ${re}`);
  return Number(m[1]);
};
const hex = (key) => {
  const m = text.match(new RegExp(`${key}: ([0-9a-f]*)`));
  if (!m) throw new Error(`not found: ${key}`);
  return Buffer.from(m[1], "hex");
};

const subMeshes = [
  ...text.matchAll(/firstByte: (\d+)\s+indexCount: (\d+)\s+topology: (\d+)/g),
].map((m) => ({ firstByte: +m[1], indexCount: +m[2], topology: +m[3] }));
if (subMeshes.length !== 5)
  throw new Error(`expected 5 submeshes, got ${subMeshes.length}`);
if (subMeshes.some((s) => s.topology !== 0))
  throw new Error("only triangle submeshes are supported");

const indexFormat = num(/m_IndexFormat: (\d+)/); // 0 = uint16, 1 = uint32
const indexBuf = hex("m_IndexBuffer");
const vertexCount = num(/m_VertexCount: (\d+)/);
const vertexData = hex("_typelessdata");

// Channels 0 (position) and 1 (normal) must be float32 x3 in stream 0; nothing else may be present.
const channels = [
  ...text.matchAll(
    /- stream: (\d+)\s+offset: (\d+)\s+format: (\d+)\s+dimension: (\d+)/g,
  ),
].map((m) => ({
  stream: +m[1],
  offset: +m[2],
  format: +m[3],
  dimension: +m[4],
}));
const [pos, nrm, ...others] = channels;
if (!(
  pos.dimension === 3 &&
  pos.format === 0 &&
  pos.offset === 0 &&
  nrm.dimension === 3 &&
  nrm.format === 0 &&
  nrm.offset === 12
))
  throw new Error(
    "unexpected vertex layout (want float3 position + float3 normal)",
  );
if (others.some((c) => c.dimension !== 0))
  throw new Error("unexpected extra vertex channels");
const stride = 24;
if (vertexData.length !== vertexCount * stride)
  throw new Error("vertex data size mismatch");

// Unity is left-handed; glTF is right-handed. Mirror X and flip each triangle's winding.
const vb = Buffer.alloc(vertexCount * stride);
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let v = 0; v < vertexCount; v++) {
  for (let c = 0; c < 6; c++) {
    let f = vertexData.readFloatLE(v * stride + c * 4);
    if (c === 0 || c === 3) f = -f;
    vb.writeFloatLE(f, v * stride + c * 4);
    if (c < 3) {
      min[c] = Math.min(min[c], f);
      max[c] = Math.max(max[c], f);
    }
  }
}

const readIndex = (byte) =>
  indexFormat === 1 ? indexBuf.readUInt32LE(byte) : indexBuf.readUInt16LE(byte);
const idxSize = indexFormat === 1 ? 4 : 2;
const useU16 = vertexCount < 65536;
const parts = subMeshes.map((s) => {
  const ids = [];
  for (let i = 0; i < s.indexCount; i += 3) {
    const a = readIndex(s.firstByte + i * idxSize);
    const b = readIndex(s.firstByte + (i + 1) * idxSize);
    const c = readIndex(s.firstByte + (i + 2) * idxSize);
    ids.push(a, c, b);
  }
  const buf = Buffer.alloc(ids.length * (useU16 ? 2 : 4));
  ids.forEach((n, i) =>
    useU16 ? buf.writeUInt16LE(n, i * 2) : buf.writeUInt32LE(n, i * 4),
  );
  return {
    buf,
    count: ids.length,
    min: Math.min(...ids),
    max: Math.max(...ids),
  };
});

// ---------- materials (NebulaDashSetup.BuildForgeShip) ----------
const metal = Number(opt.metal ?? 0.6);
const smooth = Number(opt.smooth ?? 0.75);
const body = rgb("body"),
  accent = rgb("accent"),
  glow = rgb("glow"),
  trim = rgb("trim"),
  glass = rgb("glass");
const mat = (name, color, metallic, smoothness, emissive, strength = 1) => ({
  name,
  pbrMetallicRoughness: {
    baseColorFactor: [...lin(color), 1],
    metallicFactor: metallic,
    roughnessFactor: 1 - smoothness,
  },
  ...(emissive && {
    emissiveFactor: lin(emissive),
    ...(strength !== 1 && {
      extensions: {
        KHR_materials_emissive_strength: { emissiveStrength: strength },
      },
    }),
  }),
});
const materials = [
  mat("body", body, metal, smooth),
  mat("accent", accent, 0.3, 0.7, opt["accent-emissive"] ? accent : null, 0.85),
  mat("trim", trim, 0.6, 0.4),
  mat(
    "glass",
    glass,
    0.9,
    0.95,
    glass.map((c) => c * 0.25),
  ),
  mat("glow", [0, 0, 0], 0, 0.5, glow, 1.5),
];

// ---------- write the glb ----------
const pad4 = (b, fill = 0) =>
  b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - (b.length % 4), fill)]) : b;
const chunks = [vb, ...parts.map((p) => p.buf)].map((b) => pad4(b));
const bin = Buffer.concat(chunks);
let offset = 0;
const bufferViews = chunks.map((c, i) => {
  const view = {
    buffer: 0,
    byteOffset: offset,
    byteLength: i === 0 ? vb.length : parts[i - 1].buf.length,
  };
  if (i === 0) Object.assign(view, { byteStride: stride, target: 34962 });
  else view.target = 34963;
  offset += c.length;
  return view;
});
const accessors = [
  {
    bufferView: 0,
    byteOffset: 0,
    componentType: 5126,
    count: vertexCount,
    type: "VEC3",
    min,
    max,
  },
  {
    bufferView: 0,
    byteOffset: 12,
    componentType: 5126,
    count: vertexCount,
    type: "VEC3",
  },
  ...parts.map((p, i) => ({
    bufferView: i + 1,
    componentType: useU16 ? 5123 : 5125,
    count: p.count,
    type: "SCALAR",
    min: [p.min],
    max: [p.max],
  })),
];
const name = src.match(/Ship_([\w-]+)\.asset$/)?.[1] ?? "ship";
const gltf = {
  asset: {
    version: "2.0",
    generator: "sayeefmahmud.com scripts/export-ship.mjs",
  },
  extensionsUsed: ["KHR_materials_emissive_strength"],
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name, mesh: 0 }],
  meshes: [
    {
      name,
      primitives: parts.map((_, i) => ({
        attributes: { POSITION: 0, NORMAL: 1 },
        indices: i + 2,
        material: i,
      })),
    },
  ],
  materials,
  accessors,
  bufferViews,
  buffers: [{ byteLength: bin.length }],
};
const json = pad4(Buffer.from(JSON.stringify(gltf)), 0x20);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);
const chunkHeader = (len, type) => {
  const b = Buffer.alloc(8);
  b.writeUInt32LE(len, 0);
  b.writeUInt32LE(type, 4);
  return b;
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  Buffer.concat([
    header,
    chunkHeader(json.length, 0x4e4f534a),
    json,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]),
);
console.log(
  `${out}: ${vertexCount} vertices, ${parts.reduce((n, p) => n + p.count / 3, 0)} triangles, ${((12 + 16 + json.length + bin.length) / 1024) | 0} KB`,
);
