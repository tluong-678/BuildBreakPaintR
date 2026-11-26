"use client";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import type { BlockData } from "./types";

function Block({ block, onClick }: { block: BlockData; onClick: (id: string) => void }) {
  return <mesh position={[block.x, block.y, block.z]} castShadow receiveShadow
    onClick={e => { e.stopPropagation(); onClick(block.id); }}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={block.color} />
  </mesh>;
}

export default function GameCanvas({ blocks, onBlockClick, onGroundClick, fov = 55 }: {
  blocks: BlockData[];
  onBlockClick: (id: string) => void;
  onGroundClick: (point: [number, number, number]) => void;
  fov?: number;
}) {
  return <Canvas shadows camera={{ position: [9, 8, 11], fov }}>
    <color attach="background" args={["#b9dcf5"]} />
    <ambientLight intensity={0.75} />
    <directionalLight position={[8, 12, 5]} intensity={1.4} castShadow />
    {blocks.map(block => <Block key={block.id} block={block} onClick={onBlockClick} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} receiveShadow
      onClick={e => { e.stopPropagation(); onGroundClick([Math.round(e.point.x), 0, Math.round(e.point.z)]); }}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#83b96d" />
    </mesh>
    <Grid args={[100, 100]} position={[0, -0.5, 0]} cellSize={1} cellThickness={0.5} sectionSize={5} sectionThickness={1} fadeDistance={45} />
    <OrbitControls makeDefault minDistance={3} maxDistance={35} maxPolarAngle={Math.PI / 2.05} />
  </Canvas>;
}
