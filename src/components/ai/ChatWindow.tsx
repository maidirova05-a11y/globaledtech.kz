import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";
import AIAvatar from "./AIAvatar";
import type { AIMessage, SuggestedQuestion, AILocale } from "../../lib/ai";

type ChatWindowProps = {
  isOpen: boolean;
  locale: AILocale;
  messages: AIMessage[];
  inputValue: string;
  isTyping: boolean;
  isSpeaking: boolean;
  suggestedQuestions: SuggestedQuestion[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
};

const labels = {
  ru: {
    title: "AI-консультант",
    subtitle: "Digital assistant форума",
    status: "Online",
    placeholder: "Задайте вопрос о форуме...",
    send: "Отправить",
    close: "Закрыть чат",
    typing: "AI Assistant печатает",
    quickActions: "Быстрые вопросы",
  },
  kk: {
    title: "AI-кеңесші",
    subtitle: "Форумның digital assistant-ы",
    status: "Online",
    placeholder: "Форум туралы сұрақ жазыңыз...",
    send: "Жіберу",
    close: "Чатты жабу",
    typing: "AI Assistant жауап дайындап жатыр",
    quickActions: "Жылдам сұрақтар",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Digital forum assistant",
    status: "Online",
    placeholder: "Ask a question about the forum...",
    send: "Send",
    close: "Close chat",
    typing: "AI Assistant is typing",
    quickActions: "Suggested questions",
  },
} as const;

function ChatWindow({
  isOpen,
  locale,
  messages,
  inputValue,
  isTyping,
  isSpeaking,
  suggestedQuestions,
  onClose,
  onInputChange,
  onSend,
}: ChatWindowProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const copy = labels[locale];

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend(inputValue);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="ai-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="ai-overlay-backdrop" aria-label={copy.close} onClick={onClose} />

          <motion.section
            className="ai-chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="ai-chat-holo" aria-hidden="true" />

            <header className="ai-chat-header">
              <div>
                <div className="ai-chat-status">
                  <span className="ai-chat-status-dot" />
                  {copy.status}
                </div>
                <h3 className="ai-chat-title">{copy.title}</h3>
                <p className="ai-chat-subtitle">{copy.subtitle}</p>
              </div>

              <button type="button" className="ai-chat-close" aria-label={copy.close} onClick={onClose}>
                ×
              </button>
            </header>

            <div className="ai-avatar-wrap">
              <AIAvatar isSpeaking={isSpeaking || isTyping} />
            </div>

            <div className="ai-quick-row">
              <p className="ai-quick-title">{copy.quickActions}</p>
              <div className="ai-quick-grid">
                {suggestedQuestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="ai-quick-button"
                    onClick={() => onSend(item.prompt)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div ref={contentRef} className="ai-messages">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`ai-message ${message.role === "assistant" ? "ai-message-assistant" : "ai-message-user"}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="ai-message-bubble">{message.content}</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping ? (
                <motion.div
                  className="ai-message ai-message-assistant"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <div className="ai-message-bubble ai-typing">
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                    <span className="sr-only">{copy.typing}</span>
                  </div>
                </motion.div>
              ) : null}
            </div>

            <form className="ai-input-row" onSubmit={handleSubmit}>
              <textarea
                value={inputValue}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="ai-input"
                placeholder={copy.placeholder}
              />
              <button type="submit" className="ai-send-button" disabled={!inputValue.trim()}>
                {copy.send}
              </button>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ChatWindow;
