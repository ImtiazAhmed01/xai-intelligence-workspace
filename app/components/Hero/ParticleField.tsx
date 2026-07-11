"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { easeInOutCubic } from "@/lib/utils";

const COUNT = 2800;
const GRID_DIM = 14; // 14 x 14 x ~14 grid slots (COUNT truncated to fit)

interface ParticleFieldProps {
  /** 0 = raw chaotic data, 1 = fully structured grid */
  progress: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

function buildChaosPositions() {
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // Distribute in a rough sphere shell with noise -> feels like "raw, unstructured data"
    const radius = 4.2 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    positions[i * 3] = x + (Math.random() - 0.5) * 1.4;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 1.4;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 1.4;
  }
  return positions;
}

function buildGridPositions() {
  const positions = new Float32Array(COUNT * 3);
  const spacing = 0.62;
  const half = (GRID_DIM - 1) / 2;
  let i = 0;
  outer: for (let layer = 0; layer < 6; layer++) {
    for (let gx = 0; gx < GRID_DIM; gx++) {
      for (let gy = 0; gy < GRID_DIM; gy++) {
        if (i >= COUNT) break outer;
        // Only populate a sparse, deliberate subset per layer to read as "structured panels", not a solid block
        if ((gx + gy + layer) % 2 !== 0) continue;
        const x = (gx - half) * spacing;
        const y = (gy - half) * spacing;
        const z = (layer - 2.5) * spacing * 1.4;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        i++;
      }
    }
  }
  // Fill any remainder along a thin outline so the grid silhouette reads cleanly
  for (; i < COUNT; i++) {
    const t = i / COUNT;
    positions[i * 3] = Math.cos(t * Math.PI * 8) * half * spacing;
    positions[i * 3 + 1] = Math.sin(t * Math.PI * 8) * half * spacing;
    positions[i * 3 + 2] = (t - 0.5) * 6;
  }
  return positions;
}

export default function ParticleField({ progress, pointer }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const chaos = useMemo(() => buildChaosPositions(), []);
  const grid = useMemo(() => buildGridPositions(), []);
  const current = useMemo(() => new Float32Array(COUNT * 3), []);
  const colorArray = useMemo(() => {
    const colors = new Float32Array(COUNT * 3);
    const cA = new THREE.Color("#6ee7ff");
    const cB = new THREE.Color("#9aa4b8");
    for (let i = 0; i < COUNT; i++) {
      const c = cA.clone().lerp(cB, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
  }, []);

  const smoothed = useRef(0);

  useFrame((state, delta) => {
    const target = progress.current;
    // Critically-damped-feeling smoothing so the morph never feels jumpy
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 2.4);
    const eased = easeInOutCubic(smoothed.current);

    const geo = pointsRef.current?.geometry;
    if (geo) {
      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        current[ix] = chaos[ix] + (grid[ix] - chaos[ix]) * eased;
        current[ix + 1] = chaos[ix + 1] + (grid[ix + 1] - chaos[ix + 1]) * eased;
        current[ix + 2] = chaos[ix + 2] + (grid[ix + 2] - chaos[ix + 2]) * eased;
      }
      posAttr.array = current;
      posAttr.needsUpdate = true;
    }

    if (groupRef.current) {
      // Gentle continuous rotation, calmer as it structures (confidence, not spectacle)
      groupRef.current.rotation.y += delta * (0.09 - eased * 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.current.y * 0.18,
        0.04
      );
      groupRef.current.rotation.y += pointer.current.x * 0.0006;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={current}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={COUNT}
            array={colorArray}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
