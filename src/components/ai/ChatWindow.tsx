import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AIAvatar from "./AIAvatar";
import type { AIMessage, SuggestedQuestion, AILocale } from "../../lib/ai";
import type { VoiceVariant } from "./AIAssistant";

type ChatWindowProps = {
  isOpen: boolean;
  locale: AILocale;
  messages: AIMessage[];
  inputValue: string;
  isTyping: boolean;
  isSpeaking: boolean;
  isVoiceEnabled: boolean;
  voiceVariant: VoiceVariant;
  suggestedQuestions: SuggestedQuestion[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onVoiceToggle: () => void;
  onVoiceVariantChange: (value: VoiceVariant) => void;
  onReplayVoice: () => void;
  canReplayVoice: boolean;
};

const labels = {
  ru: {
    title: "AI-ассистент",
    subtitle: "Цифровой помощник форума",
    status: "Online",
    placeholder: "Задайте вопрос о форуме...",
    send: "Отправить",
    close: "Закрыть чат",
    typing: "AI Assistant печатает",
    quickActions: "Быстрые вопросы",
    voiceOn: "Выключить голос",
    voiceOff: "Включить голос",
    replay: "Повторить озвучку",
    voiceStateOn: "AI-озвучка включена",
    voiceStateOff: "AI-озвучка выключена",
    voiceDisclosure: "Голос синтезирован ИИ",
    voiceStyle: "Стиль голоса",
    voiceAssistant: "Ассистент",
    voiceDeep: "Глубокий",
    voiceWarm: "Живой",
  },
  kk: {
    title: "AI-ассистент",
    subtitle: "Форумның цифрлық көмекшісі",
    status: "Online",
    placeholder: "Форум туралы сұрақ жазыңыз...",
    send: "Жіберу",
    close: "Чатты жабу",
    typing: "AI Assistant жауап дайындап жатыр",
    quickActions: "Жылдам сұрақтар",
    voiceOn: "Дауысты өшіру",
    voiceOff: "Дауысты қосу",
    replay: "Дауысты қайталау",
    voiceStateOn: "AI-дауыс қосулы",
    voiceStateOff: "AI-дауыс өшірулі",
    voiceDisclosure: "Дауыс ИИ арқылы синтезделеді",
    voiceStyle: "Дауыс стилі",
    voiceAssistant: "Ассистент",
    voiceDeep: "Терең",
    voiceWarm: "Жанды",
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
    voiceOn: "Mute voice",
    voiceOff: "Enable voice",
    replay: "Replay voice",
    voiceStateOn: "AI voice on",
    voiceStateOff: "AI voice off",
    voiceDisclosure: "Voice is AI-generated",
    voiceStyle: "Voice style",
    voiceAssistant: "Assistant",
    voiceDeep: "Deep",
    voiceWarm: "Warm",
  },
} as const;

function ChatWindow({
  isOpen,
  locale,
  messages,
  inputValue,
  isTyping,
  isSpeaking,
  isVoiceEnabled,
  voiceVariant,
  suggestedQuestions,
  onClose,
  onInputChange,
  onSend,
  onVoiceToggle,
  onVoiceVariantChange,
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

  if (!isOpen) {
    return null;
  }

  const voiceButtons: Array<{ id: VoiceVariant; label: string }> = [
    { id: "assistant", label: copy.voiceAssistant },
    { id: "deep", label: copy.voiceDeep },
    { id: "warm", label: copy.voiceWarm },
  ];

  const content = (
    <div className="ai-overlay">
      <div className="ai-overlay-backdrop" aria-hidden="true" />

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
              className="ai-chat-close ai-chat-action-label"
              aria-label={isVoiceEnabled ? copy.voiceOn : copy.voiceOff}
              title={isVoiceEnabled ? copy.voiceOn : copy.voiceOff}
              onClick={onVoiceToggle}
            >
              TTS
            </button>
            <button
              type="button"
              className="ai-chat-close ai-chat-action-label"
              aria-label={copy.replay}
              title={copy.replay}
              onClick={onReplayVoice}
              disabled={!canReplayVoice}
            >
              Play
            </button>
            <button type="button" className="ai-chat-close" aria-label={copy.close} onClick={onClose}>
              X
            </button>
          </div>
        </header>

        <div className="ai-voice-toolbar">
          <div className="ai-voice-toolbar-copy">
            <p className="ai-voice-toolbar-title">{copy.voiceStyle}</p>
            <p className="ai-voice-toolbar-state">
              {isVoiceEnabled ? copy.voiceStateOn : copy.voiceStateOff}
            </p>
          </div>
          <div className="ai-voice-toolbar-buttons">
            {voiceButtons.map((voiceButton) => (
              <button
                key={voiceButton.id}
                type="button"
                className={`ai-voice-pill ${voiceVariant === voiceButton.id ? "ai-voice-pill-active" : ""}`}
                onClick={() => onVoiceVariantChange(voiceButton.id)}
              >
                {voiceButton.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-avatar-wrap">
          <AIAvatar isSpeaking={isSpeaking || isTyping} />
        </div>

        <div ref={contentRef} className="ai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.role === "assistant" ? "ai-message-assistant" : "ai-message-user"}`}
            >
              <div className="ai-message-bubble">{message.content}</div>
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

        <div className="ai-quick-row">
          <div className="ai-quick-row-head">
            <p className="ai-quick-title">{copy.quickActions}</p>
            <p className="ai-voice-disclosure">{copy.voiceDisclosure}</p>
          </div>
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
