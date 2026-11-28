"use client";

import { useEffect, useRef, useState } from "react";

type ShipViewerProps = {
  /** Ship .glb under `public/`. */
  src: string;
  /** Equirectangular sky image from the game (optional). */
  sky?: string;
  /** .glb of props from the game: nodes `ring`, `coin`, `bennu`, `eros` (optional; any may be missing). */
  props?: string;
  /** Accessible name, e.g. "Aurum … as a 3D model". */
  label: string;
  hint: string;
  loadingLabel: string;
  failedLabel: string;
};

type Status = "loading" | "ready" | "failed";

// The camera orbits the ship. Start behind it and to its right, a little above, like the game's
// chase camera: the ring it is flying toward sits beyond it, coins lead the way, rocks drift by.
const START_YAW = 2.6;
const START_PITCH = 0.22;
const IDLE_SPIN = 0.2; // rad/s while nobody is dragging
const IDLE_AFTER_MS = 2500;

// Ion Storm lighting (NebulaDashSkies.cs): magenta rim, violet ambient.
const KEY = [1, 0.97, 0.94] as const; // the game's is lavender (0.85, 0.8, 1); white keeps the gold gold without bloom
const RIM = [1, 0.3, 0.95] as const;
const AMBIENT = [0.2, 0.12, 0.32] as const;

// Where the game props sit around the ship (ship ≈ 3 units long, nose +Z, centred at the origin).
// Ring: the next ring ahead (torus radius 1, so scale = hole radius / 0.9).
// Coins: a short trail curving toward it. Rocks: scaled like the game's Obstacle does.
const LAYOUT = {
  ring: [{ pos: [0.6, -2, 17], scale: 3 }],
  coin: [
    { pos: [0.2, -0.5, 6], scale: 0.7 },
    { pos: [0.3, -0.95, 9.4], scale: 0.7 },
    { pos: [0.45, -1.4, 12.8], scale: 0.7 },
  ],
  bennu: [
    { pos: [6.5, 1.6, 12], scale: 2 },
    { pos: [-3, 2.8, 20], scale: 1.6 },
  ],
  eros: [{ pos: [-4, -1.6, 9], scale: 2.6 }],
} as const;

/**
 * Interactive 3D view of a ship from Nebula Dash, in the game's own sky with a few of its objects.
 * three.js is imported only when this mounts (a visitor picked "3D model"), so it never weighs on
 * the page otherwise. Rendering pauses off screen and in background tabs; with reduced motion
 * nothing moves until dragged. The sky and props are optional: if they fail, the ship still shows.
 */
export function ShipViewer({
  src,
  sky,
  props,
  label,
  hint,
  loadingLabel,
  failedLabel,
}: ShipViewerProps) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const teardown: (() => void)[] = [];

    (async () => {
      try {
        const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;

        const loader = new GLTFLoader();
        const [shipRes, propsRes, skyRes] = await Promise.allSettled([
          loader.loadAsync(src),
          props ? loader.loadAsync(props) : Promise.reject(new Error("no props")),
          sky ? new THREE.TextureLoader().loadAsync(sky) : Promise.reject(new Error("no sky")),
        ]);
        if (disposed) {
          if (skyRes.status === "fulfilled") skyRes.value.dispose();
          return;
        }
        if (shipRes.status === "rejected") throw shipRes.reason;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        teardown.push(() => renderer.dispose());
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.NeutralToneMapping;
        const canvas = renderer.domElement;
        canvas.className = "absolute inset-0 size-full";
        canvas.setAttribute("aria-hidden", "true");

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        teardown.push(() => pmrem.dispose());
        if (skyRes.status === "fulfilled") {
          // The game's panorama is both the backdrop and what the gold hull reflects.
          const tex = skyRes.value;
          tex.mapping = THREE.EquirectangularReflectionMapping;
          tex.colorSpace = THREE.SRGBColorSpace;
          const env = pmrem.fromEquirectangular(tex).texture;
          teardown.push(() => {
            tex.dispose();
            env.dispose();
          });
          scene.background = tex;
          scene.environment = env;
          scene.environmentIntensity = 0.4;
        } else {
          const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          teardown.push(() => env.dispose());
          scene.environment = env;
          scene.environmentIntensity = 0.55;
        }
        const color = (c: readonly number[]) => new THREE.Color().setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
        scene.add(new THREE.AmbientLight(color(AMBIENT), 1.6));
        const key = new THREE.DirectionalLight(color(KEY), 3.4);
        key.position.set(4, 6, -2);
        const rim = new THREE.DirectionalLight(color(RIM), 0.4);
        rim.position.set(-4, 2, 6);
        // White fill on the side the key misses, so shaded faces aren't only the violet ambient.
        const fill = new THREE.DirectionalLight(0xffffff, 1.2);
        fill.position.set(-5, 3, -3);
        scene.add(key, rim, fill);

        const disposeTree = (root: import("three").Object3D) =>
          root.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.geometry.dispose();
              (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
            }
          });

        // Ship, centred on its bounds.
        const ship = shipRes.value.scene;
        teardown.push(() => disposeTree(ship));
        // Without the game's bloom and bright fog, a metallic hull mirrors the dark sky and the gold
        // reads brown. Soften the body's metal so it stays the pale gold seen in the screenshot.
        ship.traverse((o) => {
          if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.material.name === "body")
            o.material.metalness = Math.min(o.material.metalness, 0.2);
        });
        const box = new THREE.Box3().setFromObject(ship);
        const size = box.getSize(new THREE.Vector3());
        ship.position.sub(box.getCenter(new THREE.Vector3()));
        const shipRig = new THREE.Group();
        shipRig.add(ship);
        scene.add(shipRig);

        // Props from the game, placed by LAYOUT.
        type Prop = { obj: import("three").Object3D; kind: keyof typeof LAYOUT; spin: import("three").Vector3 };
        const placed: Prop[] = [];
        let ringMats: { m: import("three").MeshStandardMaterial; base: number }[] = [];
        if (propsRes.status === "fulfilled") {
          const lib = propsRes.value.scene;
          teardown.push(() => disposeTree(lib));
          // Same as the hull: fully metallic gold mirrors the dark sky. The game's coins read bright.
          lib.traverse((o) => {
            if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial && o.material.name.startsWith("coin"))
              o.material.metalness = 0.35;
          });
          (Object.keys(LAYOUT) as (keyof typeof LAYOUT)[]).forEach((kind, k) => {
            const src = lib.getObjectByName(kind);
            if (!src) return;
            LAYOUT[kind].forEach((spot, i) => {
              const obj = src.clone();
              obj.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
              obj.scale.setScalar(spot.scale);
              if (kind === "bennu" || kind === "eros") obj.rotation.set(k + i, k * 2 + i, i);
              if (kind === "coin") obj.rotation.y = i * 0.9;
              scene.add(obj);
              const r = (n: number) => Math.sin(n * 12.9898 + k * 78.233) * 0.5;
              placed.push({ obj, kind, spin: new THREE.Vector3(r(i + 1), r(i + 2), r(i + 3)).multiplyScalar(0.5) });
            });
          });
          ringMats = placed
            .filter((p) => p.kind === "ring")
            .flatMap((p) => {
              const mats: { m: import("three").MeshStandardMaterial; base: number }[] = [];
              p.obj.traverse((o) => {
                if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial)
                  mats.push({ m: o.material, base: o.material.emissiveIntensity });
              });
              return mats;
            });
          // Clones share materials; keep each once.
          ringMats = ringMats.filter((r, i) => ringMats.findIndex((q) => q.m === r.m) === i);
        }

        const radius = size.length() / 2;
        const camera = new THREE.PerspectiveCamera(28, 19 / 9, 0.05, 200);
        let dist = 10;
        const fit = () => {
          // Fit the ship's bounding sphere to whichever of width and height is tighter.
          const vFov = THREE.MathUtils.degToRad(camera.fov);
          const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
          dist = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.68;
        };

        let yaw = START_YAW;
        let pitch = START_PITCH;
        let lastInput = -Infinity;
        let clock = 0;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

        const draw = () => {
          const c = Math.cos(pitch);
          camera.position.set(Math.sin(yaw) * c * dist, Math.sin(pitch) * dist, Math.cos(yaw) * c * dist);
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
        };

        // Gentle motion: the ship floats and banks, coins spin, rocks tumble, the next ring pulses (Ring.cs).
        const animate = (dt: number) => {
          clock += dt;
          shipRig.position.y = Math.sin(clock * 1.1) * 0.08;
          shipRig.rotation.z = Math.sin(clock * 0.7) * 0.06;
          for (const p of placed) {
            if (p.kind === "coin") p.obj.rotation.y += dt * 2.4;
            else if (p.kind !== "ring") {
              p.obj.rotation.x += p.spin.x * dt;
              p.obj.rotation.y += p.spin.y * dt;
            }
          }
          const pulse = 0.5 + 0.5 * Math.sin(clock * 5);
          for (const r of ringMats) r.m.emissiveIntensity = r.base * (0.73 + 0.64 * pulse);
        };

        // ── render loop: only while visible and spinning ──
        let raf = 0;
        let last = 0;
        let onScreen = true;
        const spinning = () => !reduce.matches && onScreen && !document.hidden;
        const tick = (now: number) => {
          raf = 0;
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          if (now - lastInput > IDLE_AFTER_MS) yaw += dt * IDLE_SPIN;
          animate(dt);
          draw();
          if (spinning()) raf = requestAnimationFrame(tick);
        };
        const schedule = () => {
          if (spinning() && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(tick);
          }
        };
        teardown.push(() => cancelAnimationFrame(raf));

        const resize = () => {
          const w = el.clientWidth;
          const h = el.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          fit();
          draw();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        const io = new IntersectionObserver(([e]) => {
          onScreen = e.isIntersecting;
          schedule();
        });
        io.observe(el);
        document.addEventListener("visibilitychange", schedule);
        reduce.addEventListener("change", schedule);
        teardown.push(() => {
          ro.disconnect();
          io.disconnect();
          document.removeEventListener("visibilitychange", schedule);
          reduce.removeEventListener("change", schedule);
        });

        // ── drag and arrow keys orbit the camera (the ship appears to turn the same way) ──
        const turn = (dYaw: number, dPitch: number) => {
          yaw -= dYaw;
          pitch = THREE.MathUtils.clamp(pitch + dPitch, -0.5, 1);
          lastInput = performance.now();
          if (!raf) draw();
        };
        let drag: { id: number; x: number; y: number } | null = null;
        const down = (e: PointerEvent) => {
          drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
          el.setPointerCapture(e.pointerId);
          el.dataset.dragging = "";
        };
        const move = (e: PointerEvent) => {
          if (!drag || e.pointerId !== drag.id) return;
          turn((e.clientX - drag.x) * 0.01, (e.clientY - drag.y) * 0.006);
          drag.x = e.clientX;
          drag.y = e.clientY;
        };
        const up = () => {
          drag = null;
          delete el.dataset.dragging;
          lastInput = performance.now();
        };
        const onKey = (e: KeyboardEvent) => {
          const step = {
            ArrowLeft: [-0.25, 0],
            ArrowRight: [0.25, 0],
            ArrowUp: [0, -0.15],
            ArrowDown: [0, 0.15],
          }[e.key];
          if (!step) return;
          e.preventDefault();
          turn(step[0], step[1]);
        };
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        el.addEventListener("keydown", onKey);
        teardown.push(() => {
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          el.removeEventListener("keydown", onKey);
        });

        el.append(canvas);
        teardown.push(() => canvas.remove());
        resize();
        setStatus("ready");
        schedule();
      } catch {
        if (!disposed) setStatus("failed");
      }
    })();

    return () => {
      disposed = true;
      teardown.reverse().forEach((f) => f());
    };
  }, [src, sky, props]);

  return (
    <>
      <div
        ref={host}
        role="img"
        aria-label={`${label}. ${hint}`}
        tabIndex={status === "ready" ? 0 : -1}
        className="absolute inset-0 cursor-grab touch-pan-y select-none data-dragging:cursor-grabbing"
      />
      <p
        role="status"
        className="pointer-events-none absolute inset-0 m-0 flex items-center justify-center p-3 text-center font-mono text-label"
      >
        {status !== "ready" && (
          <span className="rounded-[6px] bg-code/80 px-2.5 py-1 text-code-fg">
            {status === "loading" ? loadingLabel : failedLabel}
          </span>
        )}
      </p>
    </>
  );
}
