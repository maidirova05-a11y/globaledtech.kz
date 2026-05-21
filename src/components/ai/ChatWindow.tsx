import { FormEvent, KeyboardEvent, Suspense, lazy, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { assistantUiCopy, type AssistantQuickPrompt } from "./config";
import type { AIMessage, AILocale } from "../../lib/ai";

const AIAvatar = lazy(() => import("./AIAvatar"));
const URL_PATTERN = /https?:\/\/[^\s]+/g;
const REGISTRATION_URL_PATTERN = /https?:\/\/[^\s]*#register\b/i;

type ChatWindowProps = {
  isOpen: boolean;
  locale: AILocale;
  messages: AIMessage[];
  inputValue: string;
  isTyping: boolean;
  isThinking: boolean;
  thinkingText: string;
  isSpeaking: boolean;
  isVoiceEnabled: boolean;
  voiceProviderLabel: string;
  voiceLabel: string;
  quickPrompts: AssistantQuickPrompt[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onQuickPrompt: (value: string) => void;
  onVoiceToggle: () => void;
  onReplayVoice: () => void;
  onStopVoice: () => void;
  onClearChat: () => void;
  canReplayVoice: boolean;
};

function normalizeUrl(rawUrl: string) {
  return rawUrl.replace(/[.,!?;:]+$/g, "");
}

function renderMessageContent(content: string) {
  const matches = Array.from(content.matchAll(URL_PATTERN));

  if (matches.length === 0) {
    return content;
  }

  const parts: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const url = match[0];
    const startIndex = match.index ?? 0;
    const normalizedUrl = normalizeUrl(url);
    const trailingText = url.slice(normalizedUrl.length);

    if (startIndex > lastIndex) {
      parts.push(content.slice(lastIndex, startIndex));
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

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

function SpeakerIcon({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path
        d="M5 9v6h4l5 4V5l-5 4H5Zm11.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12Zm0-8.5v2.08a7 7 0 0 1 0 12.84v2.08a9 9 0 0 0 0-17Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path
        d="M16.5 12a4.5 4.5 0 0 0-1.2-3.04l1.42-1.42A6.46 6.46 0 0 1 18.5 12c0 1.65-.62 3.16-1.64 4.3l-1.42-1.42c.67-.8 1.06-1.83 1.06-2.88ZM19 3.59 17.59 2.18 2.18 17.59 3.6 19l4.4-4H9l5 4V9.59L19 3.59Zm-5-1.77-3.82 3.81H5v6h1.36L14 4.99V1.82Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path
        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6a6 6 0 1 1-10.39-4.04L6.2 7.55A8 8 0 1 0 12 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ai-action-icon">
      <path d="M6 6h12v12H6z" fill="currentColor" />
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

function MessageMeta({
  isThinking,
  isSpeaking,
  thinkingText,
  locale,
}: {
  isThinking: boolean;
  isSpeaking: boolean;
  thinkingText: string;
  locale: AILocale;
}) {
  const copy = assistantUiCopy[locale];

  if (!isThinking && !isSpeaking) {
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
      <span className="ai-presence-text">
        {isThinking ? `${copy.thinkingLabel}: ${thinkingText}` : copy.speakingLabel}
      </span>
    </motion.div>
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
  isSpeaking,
  isVoiceEnabled,
  voiceProviderLabel,
  voiceLabel,
  quickPrompts,
  onClose,
  onInputChange,
  onSend,
  onQuickPrompt,
  onVoiceToggle,
  onReplayVoice,
  onStopVoice,
  onClearChat,
  canReplayVoice,
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
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 144)}px`;
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

  const handleRegistrationClick = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const content = (
    <div className="ai-overlay">
      <div className="ai-overlay-backdrop" aria-hidden="true" onClick={onClose} />

      <section className="ai-chat-window" role="dialog" aria-modal="true" aria-label={copy.title}>
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
              aria-label={isVoiceEnabled ? copy.voiceOn : copy.voiceOff}
              title={isVoiceEnabled ? copy.voiceOn : copy.voiceOff}
              onClick={onVoiceToggle}
            >
              <SpeakerIcon enabled={isVoiceEnabled} />
            </button>
            <button
              type="button"
              className="ai-chat-close"
              aria-label={copy.replay}
              title={copy.replay}
              onClick={onReplayVoice}
              disabled={!canReplayVoice}
            >
              <ReplayIcon />
            </button>
            <button
              type="button"
              className="ai-chat-close"
              aria-label={copy.stopVoice}
              title={copy.stopVoice}
              onClick={onStopVoice}
              disabled={!isSpeaking}
            >
              <StopIcon />
            </button>
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

        <div className="ai-voice-toolbar">
          <div className="ai-voice-toolbar-copy">
            <p className="ai-voice-toolbar-title">{copy.voiceProvider}</p>
            <p className="ai-voice-toolbar-state">
              {voiceProviderLabel} · {voiceLabel}
            </p>
          </div>
          <div className="ai-voice-toolbar-buttons">
            <button
              type="button"
              className={`ai-voice-pill ${isVoiceEnabled ? "ai-voice-pill-active" : ""}`}
              onClick={onVoiceToggle}
            >
              {isVoiceEnabled ? copy.voiceOn : copy.voiceOff}
            </button>
            <button
              type="button"
              className="ai-voice-pill"
              disabled={!isSpeaking}
              onClick={onStopVoice}
            >
              {copy.stopVoice}
            </button>
          </div>
        </div>

        <div className="ai-avatar-wrap">
          <Suspense fallback={<div className="ai-avatar-shell ai-avatar-shell-placeholder" />}>
            <AIAvatar mode={isThinking ? "thinking" : isSpeaking || isTyping ? "talking" : "idle"} />
          </Suspense>
        </div>

        <div className="ai-quick-prompts">
          <div className="ai-quick-prompts-head">
            <p className="ai-quick-prompts-title">{copy.quickPrompts}</p>
            <p className="ai-quick-prompts-hint">{copy.chipsHint}</p>
          </div>
          <div className="ai-quick-prompts-list">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                className="ai-quick-prompt-chip"
                onClick={() => onQuickPrompt(prompt.prompt)}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-chat-main ai-chat-main-single">
          <AnimatePresence mode="wait">
            <MessageMeta
              isThinking={isThinking}
              isSpeaking={isSpeaking}
              thinkingText={thinkingText}
              locale={locale}
            />
          </AnimatePresence>

          <div ref={contentRef} className="ai-messages">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`ai-message ${message.role === "assistant" ? "ai-message-assistant" : "ai-message-user"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="ai-message-bubble">
                  {renderMessageContent(message.content)}
                  {message.role === "assistant" && REGISTRATION_URL_PATTERN.test(message.content) ? (
                    <div className="ai-message-actions">
                      <a href="#register" className="ai-message-cta" onClick={handleRegistrationClick}>
                        {quickPrompts[0]?.label || "Registration"}
                      </a>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}

            {(isTyping || isThinking) ? (
              <div className="ai-message ai-message-assistant">
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
