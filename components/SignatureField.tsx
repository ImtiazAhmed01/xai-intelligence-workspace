"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easeInOutCubic } from "@/lib/utils";

const COUNT = 420;
const CLUSTERS = 4;
const CLUSTER_CENTERS = [
  new THREE.Vector3(-2.6, 1.4, 0),
  new THREE.Vector3(2.6, 1.2, -0.6),
  new THREE.Vector3(-2.2, -1.6, 0.4),
  new THREE.Vector3(2.4, -1.4, 0.2),
];
const CLUSTER_COLORS = ["#6ee7ff", "#f5b56a", "#9aa4b8", "#a7f3ff"];

interface SignatureFieldProps {
  progress: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

function buildScattered() {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < COUNT; i++) {
    positions.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      )
    );
  }
  return positions;
}

function buildClustered() {
  const positions: THREE.Vector3[] = [];
  const clusterOf: number[] = [];
  for (let i = 0; i < COUNT; i++) {
    const c = i % CLUSTERS;
    clusterOf.push(c);
    const center = CLUSTER_CENTERS[c];
    const r = 0.55 + Math.random() * 0.55;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      new THREE.Vector3(
        center.x + r * Math.sin(phi) * Math.cos(theta),
        center.y + r * Math.sin(phi) * Math.sin(theta),
        center.z + r * Math.cos(phi)
      )
    );
  }
  return { positions, clusterOf };
}

export default function SignatureField({ progress, pointer }: SignatureFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scattered = useMemo(() => buildScattered(), []);
  const { positions: clustered, clusterOf } = useMemo(() => buildClustered(), []);
  const smoothed = useRef(0);

  const colorArray = useMemo(() => {
    return clusterOf.map((c) => new THREE.Color(CLUSTER_COLORS[c]));
  }, [clusterOf]);

  useFrame((state, delta) => {
    const target = progress.current;
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 2.2);
    const eased = easeInOutCubic(smoothed.current);
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      for (let i = 0; i < COUNT; i++) {
        const from = scattered[i];
        const to = clustered[i];
        const x = THREE.MathUtils.lerp(from.x, to.x, eased);
        const y =
          THREE.MathUtils.lerp(from.y, to.y, eased) +
          Math.sin(t * 0.6 + i) * 0.03 * (1 - eased * 0.6);
        const z = THREE.MathUtils.lerp(from.z, to.z, eased);
        dummy.position.set(x, y, z);
        const scale = THREE.MathUtils.lerp(0.85, 1.15, eased) * (0.75 + 0.25 * Math.sin(t + i));
        dummy.scale.setScalar(0.11 * scale);
        dummy.rotation.set(t * 0.2 + i, t * 0.15, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, colorArray[i]);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.current.x * 0.35,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.current.y * 0.22,
        0.04
      );
      // Depth parallax: subtle push/pull as clusters resolve
      groupRef.current.position.z = THREE.MathUtils.lerp(0, 0.6, eased);
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          roughness={0.25}
          metalness={0.15}
          emissiveIntensity={0.4}
          toneMapped={false}
        />
      </instancedMesh>
      <pointLight position={[3, 3, 4]} intensity={20} color="#6ee7ff" />
      <pointLight position={[-3, -2, 3]} intensity={12} color="#f5b56a" />
      <ambientLight intensity={0.35} />
    </group>
  );
}
