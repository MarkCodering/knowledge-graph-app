// Edge.tsx
'use client';
import React, { useRef } from 'react';
import { Tube } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

interface EdgeProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  delay: number;
}

export default function Edge({ start, end, delay }: EdgeProps) {
  const tubeRef = useRef<THREE.Mesh>(null!);
  const path = new THREE.LineCurve3(start, end);
  const baseColor = new THREE.Color(0x50505a);

  // Fade-in spring for the material's opacity
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    // react-spring delays are in milliseconds
    delay: (delay + 0.5) * 1000,
    config: { duration: 500 },
  });

  useFrame(({ clock }) => {
    if (tubeRef.current) {
      const t = clock.getElapsedTime() * 2;
      const pulse = (Math.sin(t + start.x) + 1) / 2; // 0 to 1
      (tubeRef.current.material as THREE.MeshBasicMaterial).color.setHSL(
        0.6,
        0.8,
        pulse * 0.2 + 0.1
      );
    }
  });

  return (
    <group>
      <Tube ref={tubeRef} args={[path, 1, 0.05, 8, false]}>
        {/* animated material */}
        <a.meshBasicMaterial
          color={baseColor}
          transparent
          opacity={opacity}
        />
      </Tube>
    </group>
  );
}
