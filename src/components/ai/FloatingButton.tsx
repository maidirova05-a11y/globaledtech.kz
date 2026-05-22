import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

type FloatingButtonProps = {
  onClick: () => void;
  title: string;
};

const AIAvatar = lazy(() => import("./AIAvatar"));

function FloatingButton({ onClick, title }: FloatingButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={title}
      className="ai-fab group"
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
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
