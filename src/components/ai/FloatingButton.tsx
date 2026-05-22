import { motion, useMotionValue, useSpring } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";

type FloatingButtonProps = {
  onClick: () => void;
  title: string;
};

const AIAvatar = lazy(() => import("./AIAvatar"));

function FloatingButton({ onClick, title }: FloatingButtonProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 180, damping: 18, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 180, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const xOffset = ((event.clientX / window.innerWidth) - 0.5) * 20;
      const yOffset = ((event.clientY / window.innerHeight) - 0.5) * 20;

      pointerX.set(xOffset);
      pointerY.set(yOffset);
    };

    const resetPosition = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", resetPosition);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPosition);
    };
  }, [pointerX, pointerY]);

  return (
    <motion.button
      type="button"
      aria-label={title}
      className="ai-fab group"
      style={{ x, y }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="ai-fab-ring" aria-hidden="true" />
      <span className="ai-fab-core">
        <span className="ai-fab-status" />
        <Suspense fallback={<span className="ai-fab-avatar-fallback" aria-hidden="true" />}>
          <AIAvatar
            mode="idle"
            className="ai-fab-avatar-shell"
            background="transparent"
          />
        </Suspense>
      </span>
    </motion.button>
  );
}

export default FloatingButton;
