// File: components/GraphScene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useMemo } from 'react';
import { Vector3 } from 'three';
import { GraphData } from '../app/page';
import Node from './Node';
import Edge from './Edge';

interface GraphSceneProps {
  graphData: GraphData | null;
  isLoading: boolean;
  progress: number;
}

export default function GraphScene({
  graphData,
  isLoading,
  progress,
}: GraphSceneProps) {
  const nodePositions = useMemo(() => {
    const positions: Record<string, Vector3> = {};
    if (!graphData) return positions;

    const nodeCount = graphData.nodes.length;
    const radius = Math.max(6, nodeCount * 0.9);

    graphData.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2 + Math.random() * 0.2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (Math.random() - 0.5) * 6;
      positions[node.id] = new Vector3(x, y, z);
    });
    return positions;
  }, [graphData]);

  return (
    <div className="w-full h-full relative bg-dark-secondary">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-secondary/80 backdrop-blur-sm">
          <div className="text-text-secondary mb-4">Generating Graph...</div>
          <div className="w-1/2 bg-panel rounded-full h-2.5">
            <div
              className="bg-accent-primary h-2.5 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 7.5]} intensity={0.5} />
        <color attach="background" args={['#18181c']} />
        <fog attach="fog" args={['#18181c', 15, 40]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
        />

        <Suspense fallback={null}>
          {graphData && (
            <group>
              {graphData.nodes.map((node, i) => (
                <Node
                  key={node.id}
                  position={nodePositions[node.id]}
                  label={node.id}
                  delay={i * 0.15}
                />
              ))}
              {graphData.edges.map((edge, i) => {
                const a = nodePositions[edge.from];
                const b = nodePositions[edge.to];
                if (!a || !b) return null;
                return <Edge key={i} start={a} end={b} delay={graphData.nodes.length * 0.15} />;
              })}
            </group>
          )}
        </Suspense>

        <EffectComposer>
          <Bloom luminanceThreshold={0.1} intensity={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
