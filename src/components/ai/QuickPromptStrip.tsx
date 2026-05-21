import { motion } from "framer-motion";
import type { AssistantQuickPrompt } from "./config";

type QuickPromptStripProps = {
  prompts: AssistantQuickPrompt[];
  title: string;
  hint: string;
  onSelect: (prompt: string) => void;
};

function QuickPromptStrip({ prompts, title, hint, onSelect }: QuickPromptStripProps) {
  return (
    <section className="ai-quick-strip" aria-label={title}>
      <div className="ai-quick-strip-head">
        <p className="ai-quick-strip-title">{title}</p>
        <p className="ai-quick-strip-hint">{hint}</p>
      </div>

      <div className="ai-quick-strip-list">
        {prompts.map((prompt, index) => (
          <motion.button
            key={prompt.id}
            type="button"
            className="ai-quick-strip-chip"
            onClick={() => onSelect(prompt.prompt)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.24 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {prompt.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export default QuickPromptStrip;
