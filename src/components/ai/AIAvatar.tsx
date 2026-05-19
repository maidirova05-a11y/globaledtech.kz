import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { memo, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

type AIAvatarProps = {
  isSpeaking?: boolean;
};

function AvatarModel({ isSpeaking = false }: AIAvatarProps) {
  const rootRef = useRef<Group | null>(null);
  const headRef = useRef<Group | null>(null);
  const leftEyeRef = useRef<Mesh | null>(null);
  const rightEyeRef = useRef<Mesh | null>(null);
  const mouthRef = useRef<Mesh | null>(null);
  const chestCoreRef = useRef<Mesh | null>(null);
  const haloRef = useRef<Mesh | null>(null);
  const waveRef = useRef<Mesh | null>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        position: [
          Math.sin(index * 1.7) * 1.45,
          0.3 + ((index % 6) - 2.5) * 0.32,
          Math.cos(index * 1.1) * 0.65,
        ] as [number, number, number],
        scale: 0.03 + (index % 3) * 0.015,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const blink = 0.15 + Math.abs(Math.sin(time * 0.9)) * 0.85;
    const speaking = isSpeaking ? 0.88 + Math.abs(Math.sin(time * 8)) * 1.1 : 0.35;

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(time * 1.3) * 0.06;
      rootRef.current.rotation.y = Math.sin(time * 0.45) * 0.08;
    }

    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.2;
      headRef.current.rotation.x = Math.cos(time * 0.8) * 0.04;
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }

    if (mouthRef.current) {
      mouthRef.current.scale.y = speaking;
      mouthRef.current.scale.x = isSpeaking ? 1.15 : 0.85;
    }

    if (chestCoreRef.current) {
      const pulse = isSpeaking ? 1.05 + Math.abs(Math.sin(time * 7.5)) * 0.28 : 0.92 + Math.sin(time * 1.8) * 0.05;
      chestCoreRef.current.scale.setScalar(pulse);
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += 0.004;
      haloRef.current.material.opacity = isSpeaking ? 0.42 : 0.24;
    }

    if (waveRef.current) {
      waveRef.current.scale.x = isSpeaking ? 1.08 + Math.abs(Math.sin(time * 9)) * 0.35 : 0.82;
      waveRef.current.scale.y = isSpeaking ? 0.8 + Math.abs(Math.sin(time * 9)) * 0.24 : 0.42;
      waveRef.current.material.opacity = isSpeaking ? 0.42 : 0.12;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={rootRef} position={[0, -0.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.15, -0.4]}>
          <torusGeometry args={[1.42, 0.045, 16, 64]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.28} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, -0.65]}>
          <torusGeometry args={[0.72, 0.03, 16, 64]} />
          <meshBasicMaterial color="#ff2e7e" transparent opacity={0.22} />
        </mesh>

        <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.22, -0.2]}>
          <torusGeometry args={[1.05, 0.022, 16, 64]} />
          <meshBasicMaterial color="#d5ecff" transparent opacity={0.24} />
        </mesh>

        {particles.map((particle, index) => (
          <mesh
            key={particle.id}
            position={particle.position}
            scale={particle.scale}
            rotation={[0, 0, index * 0.3]}
          >
            <sphereGeometry args={[1, 18, 18]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#67e8f9" : "#f472b6"}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        <group position={[0, -0.05, 0]}>
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.28, 32]} />
            <meshStandardMaterial color="#d5ecff" metalness={0.55} roughness={0.18} />
          </mesh>

          <RoundedBox args={[1.35, 1.05, 0.65]} radius={0.18} smoothness={4} position={[0, -1.32, 0]}>
            <MeshTransmissionMaterial
              color="#dbeafe"
              transmission={0.88}
              thickness={0.4}
              roughness={0.08}
              chromaticAberration={0.08}
              ior={1.18}
            />
          </RoundedBox>

          <mesh position={[0, -1.05, 0.35]}>
            <planeGeometry args={[0.78, 0.18]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.42} />
          </mesh>

          <mesh ref={waveRef} position={[0, -1.06, 0.37]}>
            <planeGeometry args={[0.95, 0.28]} />
            <meshBasicMaterial color="#ff2e7e" transparent opacity={0.16} />
          </mesh>

          <mesh ref={chestCoreRef} position={[0, -1.06, 0.4]} scale={[0.36, 0.36, 0.36]}>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.88} />
          </mesh>
        </group>

        <group ref={headRef} position={[0, 0.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.72, 48, 48]} />
            <MeshTransmissionMaterial
              color="#f8fafc"
              transmission={0.96}
              thickness={0.52}
              roughness={0.03}
              chromaticAberration={0.12}
              ior={1.1}
            />
          </mesh>

          <mesh position={[0, -0.06, 0.53]} scale={[0.9, 1.04, 0.5]}>
            <sphereGeometry args={[0.45, 40, 40]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.72} roughness={0.18} />
          </mesh>

          <mesh position={[0, 0.3, 0.42]} scale={[0.55, 0.24, 0.16]}>
            <sphereGeometry args={[0.46, 32, 32]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
          </mesh>

          <mesh ref={leftEyeRef} position={[-0.21, 0.04, 0.58]} scale={[1, 1, 0.8]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshBasicMaterial color="#0b0f2a" />
          </mesh>

          <mesh ref={rightEyeRef} position={[0.21, 0.04, 0.58]} scale={[1, 1, 0.8]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshBasicMaterial color="#0b0f2a" />
          </mesh>

          <mesh position={[0, -0.08, 0.62]} scale={[0.12, 0.12, 0.08]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.85} />
          </mesh>

          <mesh ref={mouthRef} position={[0, -0.28, 0.58]} scale={[0.18, 0.35, 0.1]}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshBasicMaterial color="#ff2e7e" transparent opacity={0.85} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function AIAvatar({ isSpeaking = false }: AIAvatarProps) {
  return (
    <div className="ai-avatar-shell">
      <Canvas camera={{ position: [0, 0.2, 4.8], fov: 30 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#091224"]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[2.5, 3.2, 3.2]} intensity={3.5} color="#d5ecff" />
        <pointLight position={[-2.2, 2.1, 1.8]} intensity={18} color="#67e8f9" />
        <pointLight position={[2.4, 1.6, 1.8]} intensity={12} color="#ff2e7e" />
        <AvatarModel isSpeaking={isSpeaking} />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.35}
          scale={5.5}
          blur={2.2}
          far={3.5}
        />
      </Canvas>
    </div>
  );
}

export default memo(AIAvatar);
