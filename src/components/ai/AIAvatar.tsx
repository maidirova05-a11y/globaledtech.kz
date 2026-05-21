import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  RoundedBox,
} from "@react-three/drei";
import { memo, useEffect, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

type AvatarMode = "idle" | "thinking" | "talking";

type AIAvatarProps = {
  mode?: AvatarMode;
  className?: string;
  background?: string;
};

function AvatarModel({ mode = "idle" }: AIAvatarProps) {
  const rootRef = useRef<Group | null>(null);
  const headRef = useRef<Group | null>(null);
  const torsoRef = useRef<Group | null>(null);
  const leftEyeRef = useRef<Mesh | null>(null);
  const rightEyeRef = useRef<Mesh | null>(null);
  const mouthRef = useRef<Mesh | null>(null);
  const chestCoreRef = useRef<Mesh | null>(null);
  const haloRef = useRef<Mesh | null>(null);
  const waveRef = useRef<Mesh | null>(null);
  const leftArmRef = useRef<Group | null>(null);
  const rightArmRef = useRef<Group | null>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const smoothedPointerRef = useRef({ x: 0, y: 0 });

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        position: [
          Math.sin(index * 1.4) * 1.5,
          0.2 + ((index % 7) - 3) * 0.28,
          Math.cos(index * 0.95) * 0.7,
        ] as [number, number, number],
        scale: 0.028 + (index % 3) * 0.016,
      })),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      pointerTargetRef.current = {
        x: Math.max(-0.32, Math.min(0.32, x * 0.18)),
        y: Math.max(-0.18, Math.min(0.18, -y * 0.12)),
      };
    };

    const handlePointerLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const blinkWave = Math.sin(time * 0.75);
    const blink = blinkWave > 0.96 ? 0.08 : 1;
    const talkingAmount = mode === "talking" ? 1 : 0;
    const thinkingAmount = mode === "thinking" ? 1 : 0;
    const breathing = 1 + Math.sin(time * 1.8) * 0.018;

    smoothedPointerRef.current.x += (pointerTargetRef.current.x - smoothedPointerRef.current.x) * 0.06;
    smoothedPointerRef.current.y += (pointerTargetRef.current.y - smoothedPointerRef.current.y) * 0.06;

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(time * 1.15) * 0.05;
      rootRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
    }

    if (torsoRef.current) {
      torsoRef.current.scale.y = breathing;
      torsoRef.current.rotation.z = Math.sin(time * 0.8) * 0.015;
    }

    if (headRef.current) {
      headRef.current.rotation.y =
        smoothedPointerRef.current.x + Math.sin(time * 0.6) * 0.04 + thinkingAmount * 0.03;
      headRef.current.rotation.x =
        smoothedPointerRef.current.y + Math.cos(time * 0.75) * 0.03 - thinkingAmount * 0.02;
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;

      leftEyeRef.current.position.x = -0.21 + smoothedPointerRef.current.x * 0.12;
      rightEyeRef.current.position.x = 0.21 + smoothedPointerRef.current.x * 0.12;
      leftEyeRef.current.position.y = 0.04 + smoothedPointerRef.current.y * 0.08;
      rightEyeRef.current.position.y = 0.04 + smoothedPointerRef.current.y * 0.08;
    }

    if (mouthRef.current) {
      const mouthPulse =
        mode === "talking" ? 0.58 + Math.abs(Math.sin(time * 8.5)) * 0.75 : 0.22 + thinkingAmount * 0.16;
      mouthRef.current.scale.y = mouthPulse;
      mouthRef.current.scale.x = mode === "talking" ? 1.1 : 0.8;
    }

    if (chestCoreRef.current) {
      const pulse =
        mode === "talking"
          ? 1.05 + Math.abs(Math.sin(time * 7.8)) * 0.28
          : mode === "thinking"
            ? 0.98 + Math.abs(Math.sin(time * 4.4)) * 0.18
            : 0.9 + Math.sin(time * 1.8) * 0.05;
      chestCoreRef.current.scale.setScalar(pulse);
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += mode === "thinking" ? 0.008 : 0.004;
      haloRef.current.scale.setScalar(mode === "talking" ? 1.04 : 1);
      haloRef.current.material.opacity = mode === "talking" ? 0.45 : mode === "thinking" ? 0.34 : 0.22;
    }

    if (waveRef.current) {
      waveRef.current.scale.x = mode === "talking" ? 1.1 + Math.abs(Math.sin(time * 9)) * 0.36 : 0.9;
      waveRef.current.scale.y = mode === "talking" ? 0.82 + Math.abs(Math.sin(time * 9)) * 0.24 : 0.45;
      waveRef.current.material.opacity = mode === "talking" ? 0.42 : mode === "thinking" ? 0.2 : 0.1;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = -0.34 + Math.sin(time * 3.6) * 0.08 * talkingAmount;
      rightArmRef.current.rotation.z = 0.34 - Math.sin(time * 3.2) * 0.1 * talkingAmount;
      leftArmRef.current.rotation.x = 0.06 + Math.cos(time * 3.8) * 0.05 * talkingAmount;
      rightArmRef.current.rotation.x = -0.06 + Math.sin(time * 3.5) * 0.05 * talkingAmount;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.18}>
      <group ref={rootRef} position={[0, -0.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.14, -0.42]}>
          <torusGeometry args={[1.44, 0.045, 16, 64]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.28} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, -0.68]}>
          <torusGeometry args={[0.76, 0.03, 16, 64]} />
          <meshBasicMaterial color="#ff2e7e" transparent opacity={0.2} />
        </mesh>

        <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.24, -0.2]}>
          <torusGeometry args={[1.06, 0.022, 16, 64]} />
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
              opacity={0.82}
            />
          </mesh>
        ))}

        <group ref={torsoRef} position={[0, -0.05, 0]}>
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.28, 32]} />
            <meshStandardMaterial color="#d5ecff" metalness={0.55} roughness={0.18} />
          </mesh>

          <group ref={leftArmRef} position={[-0.74, -1.08, 0]}>
            <mesh rotation={[0, 0, -0.2]} position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.09, 0.44, 8, 16]} />
              <meshStandardMaterial color="#dbeafe" metalness={0.4} roughness={0.18} />
            </mesh>
          </group>

          <group ref={rightArmRef} position={[0.74, -1.08, 0]}>
            <mesh rotation={[0, 0, 0.2]} position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.09, 0.44, 8, 16]} />
              <meshStandardMaterial color="#dbeafe" metalness={0.4} roughness={0.18} />
            </mesh>
          </group>

          <RoundedBox args={[1.35, 1.08, 0.65]} radius={0.18} smoothness={4} position={[0, -1.32, 0]}>
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

          <mesh ref={mouthRef} position={[0, -0.28, 0.58]} scale={[0.18, 0.28, 0.1]}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshBasicMaterial color="#ff2e7e" transparent opacity={0.85} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function AIAvatar({ mode = "idle", className = "ai-avatar-shell", background = "#091224" }: AIAvatarProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0.16, 4.9], fov: 30 }} dpr={[1, 1.75]}>
        <color attach="background" args={[background]} />
        <ambientLight intensity={1.45} />
        <directionalLight position={[2.5, 3.2, 3.2]} intensity={3.2} color="#d5ecff" />
        <pointLight position={[-2.2, 2.1, 1.8]} intensity={18} color="#67e8f9" />
        <pointLight position={[2.4, 1.6, 1.8]} intensity={12} color="#ff2e7e" />
        <AvatarModel mode={mode} />
        <Environment preset="city" />
        <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={5.5} blur={2.2} far={3.5} />
      </Canvas>
    </div>
  );
}

export default memo(AIAvatar);
