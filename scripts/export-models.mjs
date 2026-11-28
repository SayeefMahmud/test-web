// Turns Nebula Dash meshes (Unity `Mesh` .asset files the game's generator writes) into .glb files
// for the portfolio's 3D project view, as listed in scripts/models.config.mjs. Reads the assets
// as text, so neither Unity nor the game repo changes.
//
//   node scripts/export-models.mjs [path/to/space-racer/Assets]   (default ../games/space-racer/Assets)
//
// The sky panorama is not handled here; see docs/plan.md for how it was made.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import config from "./models.config.mjs";

const gameAssets = process.argv[2] ?? "../games/space-racer/Assets";

const toLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/** Unity mesh asset → mirrored (right-handed) vertex buffer + per-submesh triangle indices. */
function readMesh(path) {
  const text = readFileSync(path, "utf8");
  const num = (re) => {
    const m = text.match(re);
    if (!m) throw new Error(`${path}: not found ${re}`);
    return Number(m[1]);
  };
  const hex = (key) => {
    const m = text.match(new RegExp(`${key}: ([0-9a-f]*)`));
    if (!m) throw new Error(`${path}: not found ${key}`);
    return Buffer.from(m[1], "hex");
  };

  const subMeshes = [
    ...text.matchAll(/firstByte: (\d+)\s+indexCount: (\d+)\s+topology: (\d+)/g),
  ].map((m) => ({
    firstByte: +m[1],
    indexCount: +m[2],
    topology: +m[3],
  }));
  if (subMeshes.some((s) => s.topology !== 0))
    throw new Error(`${path}: only triangle submeshes are supported`);

  const indexFormat = num(/m_IndexFormat: (\d+)/); // 0 = uint16, 1 = uint32
  const indexBuf = hex("m_IndexBuffer");
  const vertexCount = num(/m_VertexCount: (\d+)/);
  const vertexData = hex("_typelessdata");

  // Position + normal, float32 x3 each, in stream 0; no other channels.
  const channels = [
    ...text.matchAll(
      /- stream: (\d+)\s+offset: (\d+)\s+format: (\d+)\s+dimension: (\d+)/g,
    ),
  ].map((m) => ({ offset: +m[2], format: +m[3], dimension: +m[4] }));
  const [pos, nrm, ...others] = channels;
  const ok =
    pos.dimension === 3 &&
    pos.format === 0 &&
    pos.offset === 0 &&
    nrm.dimension === 3 &&
    nrm.format === 0 &&
    nrm.offset === 12 &&
    others.every((c) => c.dimension === 0) &&
    vertexData.length === vertexCount * 24;
  if (!ok)
    throw new Error(
      `${path}: unexpected vertex layout (want float3 position + float3 normal)`,
    );

  // Unity is left-handed; glTF is right-handed. Mirror X and flip each triangle's winding.
  const vb = Buffer.alloc(vertexCount * 24);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let v = 0; v < vertexCount; v++) {
    for (let c = 0; c < 6; c++) {
      let f = vertexData.readFloatLE(v * 24 + c * 4);
      if (c === 0 || c === 3) f = -f;
      vb.writeFloatLE(f, v * 24 + c * 4);
      if (c < 3) {
        min[c] = Math.min(min[c], f);
        max[c] = Math.max(max[c], f);
      }
    }
  }

  const idxSize = indexFormat === 1 ? 4 : 2;
  const readIndex = (byte) =>
    indexFormat === 1
      ? indexBuf.readUInt32LE(byte)
      : indexBuf.readUInt16LE(byte);
  const parts = subMeshes.map((s) => {
    const ids = [];
    for (let i = 0; i < s.indexCount; i += 3) {
      const [a, b, c] = [0, 1, 2].map((k) =>
        readIndex(s.firstByte + (i + k) * idxSize),
      );
      ids.push(a, c, b);
    }
    return ids;
  });
  return { vertexCount, vb, min, max, parts };
}

/** Config material → glTF material. HDR emission becomes a 0..1 factor plus a strength. */
function material({ name, color, metal, smooth, emission }) {
  const m = {
    name,
    pbrMetallicRoughness: {
      baseColorFactor: [...color.map(toLinear), 1],
      metallicFactor: metal,
      roughnessFactor: 1 - smooth,
    },
  };
  if (emission && emission.some((c) => c > 0)) {
    const strength = Math.max(1, ...emission);
    m.emissiveFactor = emission.map((c) => toLinear(c / strength));
    if (strength > 1)
      m.extensions = {
        KHR_materials_emissive_strength: { emissiveStrength: strength },
      };
  }
  return m;
}

function writeGlb(out, meshes) {
  const pad4 = (b, fill = 0) =>
    b.length % 4
      ? Buffer.concat([b, Buffer.alloc(4 - (b.length % 4), fill)])
      : b;
  const chunks = [];
  const bufferViews = [];
  const accessors = [];
  const materials = [];
  const gltfMeshes = [];
  let offset = 0;
  const addView = (buf, extra) => {
    const padded = pad4(buf);
    bufferViews.push({
      buffer: 0,
      byteOffset: offset,
      byteLength: buf.length,
      ...extra,
    });
    chunks.push(padded);
    offset += padded.length;
    return bufferViews.length - 1;
  };

  let triangles = 0;
  for (const { name, asset, materials: mats } of meshes) {
    const mesh = readMesh(join(gameAssets, asset));
    const used = mesh.parts
      .map((ids, i) => ({ ids, i }))
      .filter((p) => p.ids.length > 0);
    if (used.some((p) => !mats[p.i]))
      throw new Error(
        `${name}: no material for submesh ${used.find((p) => !mats[p.i]).i}`,
      );

    const vView = addView(mesh.vb, { byteStride: 24, target: 34962 });
    const posAcc =
      accessors.push({
        bufferView: vView,
        byteOffset: 0,
        componentType: 5126,
        count: mesh.vertexCount,
        type: "VEC3",
        min: mesh.min,
        max: mesh.max,
      }) - 1;
    const nrmAcc =
      accessors.push({
        bufferView: vView,
        byteOffset: 12,
        componentType: 5126,
        count: mesh.vertexCount,
        type: "VEC3",
      }) - 1;
    const u16 = mesh.vertexCount < 65536;

    const primitives = used.map(({ ids, i }) => {
      const buf = Buffer.alloc(ids.length * (u16 ? 2 : 4));
      ids.forEach((n, k) =>
        u16 ? buf.writeUInt16LE(n, k * 2) : buf.writeUInt32LE(n, k * 4),
      );
      const view = addView(buf, { target: 34963 });
      let lo = Infinity,
        hi = -Infinity;
      for (const n of ids) {
        if (n < lo) lo = n;
        if (n > hi) hi = n;
      }
      const acc =
        accessors.push({
          bufferView: view,
          componentType: u16 ? 5123 : 5125,
          count: ids.length,
          type: "SCALAR",
          min: [lo],
          max: [hi],
        }) - 1;
      const mat = materials.push(material(mats[i])) - 1;
      triangles += ids.length / 3;
      return {
        attributes: { POSITION: posAcc, NORMAL: nrmAcc },
        indices: acc,
        material: mat,
      };
    });
    gltfMeshes.push({ name, primitives });
  }

  const bin = Buffer.concat(chunks);
  const gltf = {
    asset: {
      version: "2.0",
      generator: "sayeefmahmud.com scripts/export-models.mjs",
    },
    extensionsUsed: materials.some((m) => m.extensions)
      ? ["KHR_materials_emissive_strength"]
      : undefined,
    scene: 0,
    scenes: [{ nodes: gltfMeshes.map((_, i) => i) }],
    nodes: gltfMeshes.map((m, i) => ({ name: m.name, mesh: i })),
    meshes: gltfMeshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: bin.length }],
  };
  const json = pad4(Buffer.from(JSON.stringify(gltf)), 0x20);
  const chunkHeader = (len, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(len, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);
  mkdirSync(dirname(out), { recursive: true });
  const glb = Buffer.concat([
    header,
    chunkHeader(json.length, 0x4e4f534a),
    json,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
  writeFileSync(out, glb);
  console.log(
    `${out}: ${meshes.map((m) => m.name).join(", ")} · ${triangles} triangles · ${(glb.length / 1024) | 0} KB`,
  );
}

for (const [out, meshes] of Object.entries(config)) writeGlb(out, meshes);
