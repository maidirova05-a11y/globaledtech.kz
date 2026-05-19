import { motion } from "framer-motion";

type FloatingButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

function FloatingButton({ isOpen, onClick }: FloatingButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      className="ai-fab group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <span className="ai-fab-ring" aria-hidden="true" />
      <span className="ai-fab-core">
        <span className="ai-fab-status" />
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-fab-icon">
          <path
            d="M12 2 5.2 5.9v6.2c0 4.2 2.9 8.1 6.8 9.1 3.9-1 6.8-4.9 6.8-9.1V5.9L12 2Zm0 3.1 3.9 2.2v4.6c0 2.6-1.6 5.1-3.9 6.1-2.3-1-3.9-3.5-3.9-6.1V7.3L12 5.1Zm0 2.5a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm-3.7 8.4a7.7 7.7 0 0 0 7.4 0"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="ai-fab-label">
        <span className="ai-fab-label-title">AI Assistant</span>
        <span className="ai-fab-label-subtitle">Online</span>
      </span>
    </motion.button>
  );
}

export default FloatingButton;
