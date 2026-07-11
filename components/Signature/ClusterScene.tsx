// "use client";

// import { useMemo, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";

// const NODE_COUNT = 72;
// const RING_GROUPS = 3;
// const LABEL_NODE_INDICES = [3, 17, 34, 51, 63];

// function seededRandom(seed: number) {
//   let s = seed;
//   return () => {
//     s = (s * 9301 + 49297) % 233280;
//     return s / 233280;
//   };
// }

// interface Node {
//   scattered: THREE.Vector3;
//   structured: THREE.Vector3;
//   group: number;
// }

// function buildNodes(): Node[] {
//   const rand = seededRandom(42);
//   const nodes: Node[] = [];

//   for (let i = 0; i < NODE_COUNT; i++) {
//     // scattered: loose cloud, "raw" cluster
//     const r = 2.6 + rand() * 1.6;
//     const theta = rand() * Math.PI * 2;
//     const phi = Math.acos(2 * rand() - 1);
//     const scattered = new THREE.Vector3(
//       r * Math.sin(phi) * Math.cos(theta),
//       r * Math.sin(phi) * Math.sin(theta),
//       r * Math.cos(phi)
//     );

//     // structured: concentric rings by group, evenly spaced — a legible graph
//     const group = i % RING_GROUPS;
//     const ringRadius = 1.3 + group * 1.15;
//     const countInRing = Math.floor(NODE_COUNT / RING_GROUPS);
//     const idxInRing = Math.floor(i / RING_GROUPS);
//     const angle = (idxInRing / countInRing) * Math.PI * 2 + group * 0.4;
//     const structured = new THREE.Vector3(
//       ringRadius * Math.cos(angle),
//       ringRadius * Math.sin(angle) * 0.55,
//       group * 0.5 - 0.5
//     );

//     nodes.push({ scattered, structured, group });
//   }
//   return nodes;
// }

// // precompute nearest-neighbor edges within the structured layout so the
// // "wiring" reads as a coherent graph once the nodes settle
// function buildEdges(nodes: Node[]): [number, number][] {
//   const edges: [number, number][] = [];
//   for (let i = 0; i < nodes.length; i++) {
//     const distances = nodes
//       .map((n, j) => ({ j, d: nodes[i].structured.distanceTo(n.structured) }))
//       .filter((e) => e.j !== i)
//       .sort((a, b) => a.d - b.d);
//     const neighbors = distances.slice(0, 2);
//     for (const n of neighbors) {
//       const pair: [number, number] = i < n.j ? [i, n.j] : [n.j, i];
//       if (!edges.some(([a, b]) => a === pair[0] && b === pair[1])) edges.push(pair);
//     }
//   }
//   return edges;
// }

// interface ClusterSceneProps {
//   progressRef: React.MutableRefObject<number>;
//   pointerRef: React.MutableRefObject<{ x: number; y: number }>;
// }

// const GROUP_COLORS = ["#5B8CFF", "#EDEFF3", "#F2A93B"];

// export default function ClusterScene({ progressRef, pointerRef }: ClusterSceneProps) {
//   const nodes = useMemo(() => buildNodes(), []);
//   const edges = useMemo(() => buildEdges(nodes), [nodes]);
//   const groupRef = useRef<THREE.Group>(null);

//   const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
//   const linesRef = useRef<THREE.LineSegments>(null);

//   const edgePositions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges]);

//   const currentPositions = useMemo(
//     () => nodes.map((n) => n.scattered.clone()),
//     [nodes]
//   );

//   useFrame((state) => {
//     const t = progressRef.current;
//     const eased = t * t * (3 - 2 * t);
//     const pointer = pointerRef.current;
//     const time = state.clock.elapsedTime;

//     nodes.forEach((n, i) => {
//       const target = new THREE.Vector3().lerpVectors(n.scattered, n.structured, eased);
//       const wobble = (1 - eased) * 0.08;
//       target.x += Math.sin(time * 0.6 + i) * wobble;
//       target.y += Math.cos(time * 0.5 + i * 1.3) * wobble;
//       currentPositions[i].lerp(target, 0.12);

//       const mesh = nodeRefs.current[i];
//       if (mesh) {
//         mesh.position.copy(currentPositions[i]);
//         const scale = 0.05 + (i % 5 === 0 ? 0.03 : 0) + eased * 0.015;
//         mesh.scale.setScalar(scale);
//       }
//     });

//     // update edge line geometry to follow current node positions,
//     // fading edges in as the graph becomes legible
//     const geo = linesRef.current?.geometry;
//     if (geo) {
//       edges.forEach(([a, b], i) => {
//         const pa = currentPositions[a];
//         const pb = currentPositions[b];
//         edgePositions[i * 6] = pa.x;
//         edgePositions[i * 6 + 1] = pa.y;
//         edgePositions[i * 6 + 2] = pa.z;
//         edgePositions[i * 6 + 3] = pb.x;
//         edgePositions[i * 6 + 4] = pb.y;
//         edgePositions[i * 6 + 5] = pb.z;
//       });
//       const attr = geo.getAttribute("position") as THREE.BufferAttribute;
//       attr.needsUpdate = true;
//       const mat = (linesRef.current as THREE.LineSegments)
//         .material as THREE.LineBasicMaterial;
//       mat.opacity = 0.08 + eased * 0.34;
//     }

//     if (groupRef.current) {
//       groupRef.current.rotation.y = THREE.MathUtils.lerp(
//         groupRef.current.rotation.y,
//         pointer.x * 0.3 + time * 0.02,
//         0.04
//       );
//       groupRef.current.rotation.x = THREE.MathUtils.lerp(
//         groupRef.current.rotation.x,
//         pointer.y * -0.12,
//         0.04
//       );
//     }
//   });

//   return (
//     <group ref={groupRef}>
//       <lineSegments ref={linesRef}>
//         <bufferGeometry>
//           <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
//         </bufferGeometry>
//         <lineBasicMaterial color="#5B8CFF" transparent opacity={0.1} />
//       </lineSegments>

//       {nodes.map((n, i) => (
//         <mesh
//           key={i}
//           ref={(el) => {
//             nodeRefs.current[i] = el;
//           }}
//         >
//           <sphereGeometry args={[1, 12, 12]} />
//           <meshBasicMaterial color={GROUP_COLORS[n.group]} />
//           {LABEL_NODE_INDICES.includes(i) && (
//             <Html distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
//               <CoordinateTag getPosition={() => currentPositions[i]} />
//             </Html>
//           )}
//         </mesh>
//       ))}
//     </group>
//   );
// }

// function CoordinateTag({ getPosition }: { getPosition: () => THREE.Vector3 }) {
//   const ref = useRef<HTMLDivElement>(null);

//   useFrame(() => {
//     const p = getPosition();
//     if (ref.current) {
//       ref.current.textContent = `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
//     }
//   });

//   return (
//     <div
//       ref={ref}
//       className="whitespace-nowrap rounded border border-signal-500/30 bg-ink-950/70 px-1.5 py-0.5 font-mono text-[9px] text-signal-300 mono-tick"
//     >
//       0.00, 0.00, 0.00
//     </div>
//   );
// }

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 72;
const RING_GROUPS = 3;
const LABEL_NODE_INDICES = [3, 17, 34, 51, 63];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Node {
  scattered: THREE.Vector3;
  structured: THREE.Vector3;
  group: number;
}

function buildNodes(): Node[] {
  const rand = seededRandom(42);
  const nodes: Node[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    // scattered: loose cloud, "raw" cluster
    const r = 2.6 + rand() * 1.6;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const scattered = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // structured: concentric rings by group, evenly spaced — a legible graph
    const group = i % RING_GROUPS;
    const ringRadius = 1.3 + group * 1.15;
    const countInRing = Math.floor(NODE_COUNT / RING_GROUPS);
    const idxInRing = Math.floor(i / RING_GROUPS);
    const angle = (idxInRing / countInRing) * Math.PI * 2 + group * 0.4;
    const structured = new THREE.Vector3(
      ringRadius * Math.cos(angle),
      ringRadius * Math.sin(angle) * 0.55,
      group * 0.5 - 0.5
    );

    nodes.push({ scattered, structured, group });
  }
  return nodes;
}

function buildEdges(nodes: Node[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const distances = nodes
      .map((n, j) => ({ j, d: nodes[i].structured.distanceTo(n.structured) }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d);
    const neighbors = distances.slice(0, 2);
    for (const n of neighbors) {
      const pair: [number, number] = i < n.j ? [i, n.j] : [n.j, i];
      if (!edges.some(([a, b]) => a === pair[0] && b === pair[1])) edges.push(pair);
    }
  }
  return edges;
}

interface ClusterSceneProps {
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const GROUP_COLORS = ["#5B8CFF", "#EDEFF3", "#F2A93B"];

export default function ClusterScene({ progressRef, pointerRef }: ClusterSceneProps) {
  const nodes = useMemo(() => buildNodes(), []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Array of DOM references to hold our HTML label elements safely
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const edgePositions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges]);

  const currentPositions = useMemo(
    () => nodes.map((n) => n.scattered.clone()),
    [nodes]
  );

  useFrame((state) => {
    const t = progressRef.current;
    const eased = t * t * (3 - 2 * t);
    const pointer = pointerRef.current;
    const time = state.clock.elapsedTime;

    // 1. Move nodes and handle individual scaling
    nodes.forEach((n, i) => {
      const target = new THREE.Vector3().lerpVectors(n.scattered, n.structured, eased);
      const wobble = (1 - eased) * 0.08;
      target.x += Math.sin(time * 0.6 + i) * wobble;
      target.y += Math.cos(time * 0.5 + i * 1.3) * wobble;
      currentPositions[i].lerp(target, 0.12);

      const mesh = nodeRefs.current[i];
      if (mesh) {
        mesh.position.copy(currentPositions[i]);
        const scale = 0.05 + (i % 5 === 0 ? 0.03 : 0) + eased * 0.015;
        mesh.scale.setScalar(scale);
      }
    });

    // 2. Direct mutation of text content inside the HTML overlay wrappers
    LABEL_NODE_INDICES.forEach((nodeIdx) => {
      const el = labelRefs.current[nodeIdx];
      if (el) {
        const p = currentPositions[nodeIdx];
        el.textContent = `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
      }
    });

    // 3. Update edge line geometries
    const geo = linesRef.current?.geometry;
    if (geo) {
      edges.forEach(([a, b], i) => {
        const pa = currentPositions[a];
        const pb = currentPositions[b];
        edgePositions[i * 6] = pa.x;
        edgePositions[i * 6 + 1] = pa.y;
        edgePositions[i * 6 + 2] = pa.z;
        edgePositions[i * 6 + 3] = pb.x;
        edgePositions[i * 6 + 4] = pb.y;
        edgePositions[i * 6 + 5] = pb.z;
      });
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
      const mat = (linesRef.current as THREE.LineSegments)
        .material as THREE.LineBasicMaterial;
      mat.opacity = 0.08 + eased * 0.34;
    }

    // 4. Update scene rotations based on cursor parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.3 + time * 0.02,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * -0.12,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#5B8CFF" transparent opacity={0.1} />
      </lineSegments>

      {nodes.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={GROUP_COLORS[n.group]} />

          {LABEL_NODE_INDICES.includes(i) && (
            <Html distanceFactor={8} zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="whitespace-nowrap rounded border border-signal-500/30 bg-ink-950/70 px-1.5 py-0.5 font-mono text-[9px] text-signal-300 mono-tick"
              >
                0.00, 0.00, 0.00
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
}