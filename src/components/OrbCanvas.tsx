import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle autonomous rotation
    mesh.current.rotation.y += 0.003;

    // Reactive easing toward cursor
    const targetX = state.pointer.x * 0.6;
    const targetY = state.pointer.y * 0.4;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetY, 0.05);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetX, 0.05);

    // Gentle pulsing
    const s = 1 + Math.sin(t * 1.5) * 0.02;
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        color="#22d3ee"
        metalness={0.1}
        roughness={0.1}
        reflectivity={1}
        transmission={0.65}
        thickness={0.7}
        envMapIntensity={1.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function OrbCanvas() {
  return (
    <div className="w-full h-[50vh] md:h-[65vh]">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 2, 5]} intensity={2} color="#a78bfa" />
        <directionalLight position={[-3, -2, -4]} intensity={1} color="#22d3ee" />
        <Orb />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
