"use client";

import { useEffect, useRef, useState } from "react";

type ShipViewerProps = {
  /** .glb under `public/`. */
  src: string;
  /** Accessible name, e.g. "Aurum … as a 3D model". */
  label: string;
  hint: string;
  loadingLabel: string;
  failedLabel: string;
};

type Status = "loading" | "ready" | "failed";

// Studio pose: nose toward the lower left, like the game's ship studio shots.
const START_YAW = -0.9;
const START_PITCH = 0.22;
const IDLE_SPIN = 0.35; // rad/s while nobody is dragging
const IDLE_AFTER_MS = 2500;

/**
 * Interactive 3D view of a ship model. three.js is imported only when this mounts (a visitor
 * picked "3D model"), so it never weighs on the page otherwise. Rendering pauses off screen and in
 * background tabs; with reduced motion the ship stays still until dragged.
 */
export function ShipViewer({
  src,
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

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        teardown.push(() => renderer.dispose());
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.NeutralToneMapping;
        const canvas = renderer.domElement;
        canvas.className = "absolute inset-0 size-full";
        canvas.setAttribute("aria-hidden", "true");

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        teardown.push(() => {
          env.dispose();
          pmrem.dispose();
        });
        scene.environment = env;
        scene.environmentIntensity = 0.55;
        scene.add(new THREE.HemisphereLight(0xd8d0ff, 0x2a1850, 1.1));
        const key = new THREE.DirectionalLight(0xffffff, 2.4);
        key.position.set(3, 5, 4);
        const rim = new THREE.DirectionalLight(0xb48cff, 2);
        rim.position.set(-4, 2, -5);
        scene.add(key, rim);

        const gltf = await new GLTFLoader().loadAsync(src);
        if (disposed) return;
        const ship = gltf.scene;
        teardown.push(() =>
          ship.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.geometry.dispose();
              (Array.isArray(o.material) ? o.material : [o.material]).forEach(
                (m) => m.dispose(),
              );
            }
          }),
        );

        // Centre the ship on its bounds and wrap it in a pivot we can turn.
        const box = new THREE.Box3().setFromObject(ship);
        const size = box.getSize(new THREE.Vector3());
        ship.position.sub(box.getCenter(new THREE.Vector3()));
        const pivot = new THREE.Group();
        pivot.add(ship);
        scene.add(pivot);

        const radius = size.length() / 2;
        const camera = new THREE.PerspectiveCamera(28, 19 / 9, 0.05, 100);
        const frame = () => {
          // Fit the bounding sphere to whichever of width and height is tighter.
          const vFov = THREE.MathUtils.degToRad(camera.fov);
          const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
          const dist = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.62;
          camera.position.set(0, dist * 0.18, dist);
          camera.lookAt(0, 0, 0);
        };

        let yaw = START_YAW;
        let pitch = START_PITCH;
        let lastInput = -Infinity;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

        const draw = () => {
          pivot.rotation.set(pitch, yaw, 0, "XYZ");
          renderer.render(scene, camera);
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
          frame();
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

        // ── drag and arrow keys turn the ship ──
        const turn = (dYaw: number, dPitch: number) => {
          yaw += dYaw;
          pitch = THREE.MathUtils.clamp(pitch + dPitch, -0.6, 0.9);
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
  }, [src]);

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
