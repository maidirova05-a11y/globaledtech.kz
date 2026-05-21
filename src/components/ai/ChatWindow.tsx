import { FormEvent, KeyboardEvent, Suspense, lazy, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  isSpeaking: boolean;
  isVoiceEnabled: boolean;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onVoiceToggle: () => void;
  onReplayVoice: () => void;
  canReplayVoice: boolean;
};

const labels = {
  ru: {
    title: "AI-ассистент",
    subtitle: "Помощник по Global EdTech",
    status: "Online",
    placeholder: "Задайте вопрос о мероприятии...",
    send: "Отправить",
    close: "Закрыть чат",
    typing: "AI-ассистент печатает",
    voiceOn: "Выключить озвучку",
    voiceOff: "Включить озвучку",
    replay: "Повторить озвучку",
  },
  kk: {
    title: "AI-ассистент",
    subtitle: "Global EdTech көмекшісі",
    status: "Online",
    placeholder: "Іс-шара туралы сұрақ жазыңыз...",
    send: "Жіберу",
    close: "Чатты жабу",
    typing: "AI-ассистент жауап жазып жатыр",
    voiceOn: "Дыбыстауды өшіру",
    voiceOff: "Дыбыстауды қосу",
    replay: "Дыбыстауды қайталау",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Global EdTech helper",
    status: "Online",
    placeholder: "Ask about the event...",
    send: "Send",
    close: "Close chat",
    typing: "AI assistant is typing",
    voiceOn: "Turn voice off",
    voiceOff: "Turn voice on",
    replay: "Replay voice",
    registerCta: "Registration",
  },
} as const;

labels.ru.registerCta = "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f";
labels.kk.registerCta = "\u0422\u0456\u0440\u043a\u0435\u043b\u0443";

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

function ChatWindow({
  isOpen,
  locale,
  messages,
  inputValue,
  isTyping,
  isSpeaking,
  isVoiceEnabled,
  onClose,
  onInputChange,
  onSend,
  onVoiceToggle,
  onReplayVoice,
  canReplayVoice,
}: ChatWindowProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const copy = labels[locale];
  const canUsePortal = typeof document !== "undefined";

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
            <button type="button" className="ai-chat-close" aria-label={copy.close} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="ai-avatar-wrap">
          <Suspense fallback={<div className="ai-avatar-shell ai-avatar-shell-placeholder" />}>
            <AIAvatar isSpeaking={isSpeaking || isTyping} />
          </Suspense>
        </div>

        <div className="ai-chat-main ai-chat-main-single">
          <div ref={contentRef} className="ai-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ${message.role === "assistant" ? "ai-message-assistant" : "ai-message-user"}`}
              >
                <div className="ai-message-bubble">
                  {renderMessageContent(message.content)}
                  {message.role === "assistant" && REGISTRATION_URL_PATTERN.test(message.content) ? (
                    <div className="ai-message-actions">
                      <a
                        href="#register"
                        className="ai-message-cta"
                        onClick={handleRegistrationClick}
                      >
                        {copy.registerCta}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="ai-message ai-message-assistant">
                <div className="ai-message-bubble ai-typing">
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="ai-typing-dot" />
                  <span className="sr-only">{copy.typing}</span>
                </div>
              </div>
            ) : null}
          </div>
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
          <button type="submit" className="ai-send-button" disabled={!inputValue.trim() || isTyping}>
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
