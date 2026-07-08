'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function DataScene() {
    const pointsRef = useRef<THREE.Points>(null!);
    const count = 600;

    const rawPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 20;
            pos[i + 1] = (Math.random() - 0.5) * 20;
            pos[i + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    const targetPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        let idx = 0;
        for (let x = -5; x <= 5; x++) {
            for (let y = -4; y <= 4; y++) {
                for (let z = -3; z <= 3; z++) {
                    if (idx >= count) break;
                    pos[idx * 3] = x * 2.2;
                    pos[idx * 3 + 1] = y * 2.2;
                    pos[idx * 3 + 2] = z * 2.0;
                    idx++;
                }
            }
        }
        return pos;
    }, []);

    const colors = useMemo(() => new Float32Array(count * 3).map((_, i) =>
        i % 3 === 0 ? 0.6 : 0.9), []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const t = Math.min(state.clock.elapsedTime * 0.1, 1);
        const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < count * 3; i += 3) {
            positions.array[i] = THREE.MathUtils.lerp(rawPositions[i], targetPositions[i], t);
            positions.array[i + 1] = THREE.MathUtils.lerp(rawPositions[i + 1], targetPositions[i + 1], t);
            positions.array[i + 2] = THREE.MathUtils.lerp(rawPositions[i + 2], targetPositions[i + 2], t);
        }
        positions.needsUpdate = true;

        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.8} color="#67e8f9" />

            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[rawPositions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.08} vertexColors transparent opacity={0.95} />
            </points>

            <Stars radius={100} depth={30} count={80} factor={1} fade />
        </>
    );
}

export default function DataTransformationCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 0, 28], fov: 40 }}
            style={{ background: '#05070f' }}
            gl={{ alpha: true }}
        >
            <DataScene />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={15} maxDistance={45} />
        </Canvas>
    );
}