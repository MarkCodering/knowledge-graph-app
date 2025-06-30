// --- file: components/Node.tsx ---
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import { useRef } from 'react';
import * as THREE from 'three';

interface NodeProps {
    position: THREE.Vector3;
    label: string;
    delay: number;
}

export default function Node({ position, label, delay }: NodeProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const lightRef = useRef<THREE.PointLight>(null!);
    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const pulse = Math.sin(time * 2 + position.x) * 0.25 + 0.75;
        if(meshRef.current) (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse * 1.5;
        if(lightRef.current) lightRef.current.intensity = pulse * 2.0;
    });

    return (
        <motion.group
            position={position}
            motion={{
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { type: 'spring', stiffness: 200, damping: 15, delay: delay }
            }}
        >
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    metalness={0.1}
                    roughness={0.2}
                />
            </mesh>
            <pointLight ref={lightRef} color={color} distance={10} />
            <Text position={[0, 1.0, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                {label}
            </Text>
        </motion.group>
    );
}