import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import QuickPromptStrip from "./QuickPromptStrip";
import { assistantUiCopy, type AssistantQuickPrompt } from "./config";
import type { AIMessage, AILocale } from "../../lib/ai";

const URL_PATTERN = /https?:\/\/[^\s]+/g;
type ChatWindowProps = {
  isOpen: boolean;
  locale: AILocale;
  messages: AIMessage[];
  inputValue: string;
  isTyping: boolean;
  isThinking: boolean;
  thinkingText: string;
  quickPrompts: AssistantQuickPrompt[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onQuickPrompt: (value: string) => void;
  onClearChat: () => void;
};

function normalizeUrl(rawUrl: string) {
  return rawUrl.replace(/[.,!?;:]+$/g, "");
}

function renderMessageContent(content: string) {
  const safeContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  const matches = Array.from(safeContent.matchAll(URL_PATTERN));

  if (matches.length === 0) {
    return safeContent;
  }

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const url = match[0];
    const startIndex = match.index ?? 0;
    const normalizedUrl = normalizeUrl(url);
    const trailingText = url.slice(normalizedUrl.length);

    if (startIndex > lastIndex) {
      parts.push(safeContent.slice(lastIndex, startIndex));
    }

    parts.push(
      <a
        key={`${normalizedUrl}-${index}`}
        href={normalizedUrl}
        target="_blank"
        rel="noreferrer"
        className="ai-message-link"
      >
        {normalizedUrl}
      </a>,
    );

    if (trailingText) {
      parts.push(trailingText);
    }

    lastIndex = startIndex + url.length;
  });

  if (lastIndex < safeContent.length) {
    parts.push(safeContent.slice(lastIndex));
  }

  return parts;
}

function MessageMeta({
  isThinking,
  thinkingText,
  locale,
}: {
  isThinking: boolean;
  thinkingText: string;
  locale: AILocale;
}) {
  const copy = assistantUiCopy[locale];

  if (!isThinking) {
    return null;
  }

  return (
    <motion.div
      className="ai-presence-strip"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
    >
      <span className="ai-presence-dot" aria-hidden="true" />
      <span className="ai-presence-text">{`${copy.thinkingLabel}: ${thinkingText}`}</span>
    </motion.div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path
        d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3 1.42 1.42Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path
        d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 12.65-5.65Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatWindow({
  isOpen,
  locale,
  messages,
  inputValue,
  isTyping,
  isThinking,
  thinkingText,
  quickPrompts,
  onClose,
  onInputChange,
  onSend,
  onQuickPrompt,
  onClearChat,
}: ChatWindowProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const copy = assistantUiCopy[locale];
  const canUsePortal = typeof document !== "undefined";

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [messages, isTyping, isThinking]);

  useEffect(() => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "0px";
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 132)}px`;
  }, [inputValue]);

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

  if (!isOpen) {
    return null;
  }

  const content = (
    <div className="ai-overlay">
      <div className="ai-overlay-backdrop" aria-hidden="true" onClick={onClose} />

      <section className="ai-chat-window ai-chat-window-minimal" role="dialog" aria-modal="true" aria-label={copy.title}>
        <div className="ai-chat-holo" aria-hidden="true" />

        <header className="ai-chat-header">
          <div className="ai-chat-header-copy">
            <div className="ai-chat-status">
              <span className="ai-chat-status-dot" />
              {copy.status}
            </div>
            <h3 className="ai-chat-title">{copy.title}</h3>
            <p className="ai-chat-subtitle">{copy.subtitle}</p>
          </div>

          <div className="ai-chat-actions">
            <button
              type="button"
              className="ai-chat-close"
              aria-label={copy.clearChat}
              title={copy.clearChat}
              onClick={onClearChat}
            >
              <RefreshIcon />
            </button>
            <button type="button" className="ai-chat-close" aria-label={copy.close} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </header>

        <QuickPromptStrip
          prompts={quickPrompts}
          title={copy.quickPrompts}
          hint={copy.chipsHint}
          onSelect={onQuickPrompt}
        />

        <div className="ai-chat-main ai-chat-main-single">
          <AnimatePresence mode="wait">
            <MessageMeta isThinking={isThinking} thinkingText={thinkingText} locale={locale} />
          </AnimatePresence>

          <div ref={contentRef} className="ai-messages">
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];
              const isGrouped = previousMessage?.role === message.role;

              return (
                <motion.div
                  key={message.id}
                  className={`ai-message ${message.role === "assistant" ? "ai-message-assistant" : "ai-message-user"} ${isGrouped ? "ai-message-grouped" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="ai-message-bubble">
                    {renderMessageContent(message.content)}
                  </div>
                </motion.div>
              );
            })}

            {(isTyping || isThinking) ? (
              <div className="ai-message ai-message-assistant ai-message-grouped">
                <div className="ai-message-bubble ai-typing">
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="sr-only">{copy.thinkingLabel}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <form className="ai-input-row" onSubmit={handleSubmit}>
          <textarea
            ref={textAreaRef}
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="ai-input"
            placeholder={copy.placeholder}
          />
          <button
            type="submit"
            className="ai-send-button"
            disabled={!inputValue.trim() || isTyping || isThinking}
          >
            {copy.send}
          </button>
        </form>
      </section>
    </div>
  );

  if (!canUsePortal) {
    return content;
  }

  return createPortal(content, document.body);
}

export default ChatWindow;
