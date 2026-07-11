"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2200;
const GRID_COLS = 44;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface HeroFieldProps {
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function HeroField({ progressRef, pointerRef }: HeroFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const rand = useMemo(() => seededRandom(7), []);

  // Two position sets: chaotic "raw data" cloud, and an ordered grid ("structured intelligence")
  const { chaos, order, colors, sizes } = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3);
    const order = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const rows = Math.ceil(COUNT / GRID_COLS);
    const spacingX = 0.34;
    const spacingY = 0.34;
    const gridW = (GRID_COLS - 1) * spacingX;
    const gridH = (rows - 1) * spacingY;

    const signal = new THREE.Color("#5B8CFF");
    const paper = new THREE.Color("#EDEFF3");
    const insight = new THREE.Color("#F2A93B");

    for (let i = 0; i < COUNT; i++) {
      // Chaotic cloud: spherical-ish random distribution, deeper in Z
      const r = 3.2 + rand() * 2.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      chaos[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 1.2;

      // Ordered grid: rows x cols, centered
      const col = i % GRID_COLS;
      const row = Math.floor(i / GRID_COLS);
      order[i * 3] = col * spacingX - gridW / 2;
      order[i * 3 + 1] = row * spacingY - gridH / 2;
      order[i * 3 + 2] = 0;

      // Color: mostly paper/mist, accented with signal blue, rare insight amber
      const roll = rand();
      const c = roll > 0.94 ? insight : roll > 0.6 ? signal : paper;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = roll > 0.94 ? 2.4 : 0.9 + rand() * 1.1;
    }

    return { chaos, order, colors, sizes };
  }, [rand]);

  const positions = useMemo(() => new Float32Array(chaos), [chaos]);
  const delays = useMemo(() => {
    const d = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) d[i] = rand() * 0.5;
    return d;
  }, [rand]);

  useFrame((state, delta) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const t = progressRef.current;
    const pointer = pointerRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const local = THREE.MathUtils.clamp((t - delays[i] * 0.4) / (1 - delays[i] * 0.4), 0, 1);
      const eased = local * local * (3 - 2 * local); // smoothstep

      const cx = chaos[i * 3];
      const cy = chaos[i * 3 + 1];
      const cz = chaos[i * 3 + 2];
      const ox = order[i * 3];
      const oy = order[i * 3 + 1];
      const oz = order[i * 3 + 2];

      const drift = Math.sin(time * 0.4 + i) * 0.02 * (1 - eased);

      let x = THREE.MathUtils.lerp(cx, ox, eased) + drift;
      let y = THREE.MathUtils.lerp(cy, oy, eased) + drift * 0.6;
      let z = THREE.MathUtils.lerp(cz, oz, eased);

      // subtle cursor-driven parallax, strongest on the still-chaotic layer
      x += pointer.x * 0.35 * (0.3 + (1 - eased) * 0.7);
      y += pointer.y * 0.25 * (0.3 + (1 - eased) * 0.7);

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.rotation.y,
        pointer.x * 0.08,
        0.03
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
