import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";
import {
  createAssistantGreeting,
  getAIResponse,
  getSuggestedQuestions,
  type AIMessage,
  type AssistantApiPayload,
  type AILocale,
} from "../../lib/ai";

type AIAssistantProps = {
  language: string;
};

const STORAGE_KEY = "globaledtech-ai-assistant";
const CONVERSATION_KEY = "globaledtech-ai-conversation";
const VOICE_ENABLED_KEY = "globaledtech-ai-voice-enabled";

const VOICE_PREFERENCES: Record<AILocale, string[]> = {
  ru: [
    "dmitry",
    "pavel",
    "george",
    "microsoft pavel",
    "microsoft dmitry",
    "yuri",
    "alex",
  ],
  kk: [
    "kazakh",
    "kk-kz",
    "dmitry",
    "pavel",
    "george",
    "alex",
  ],
  en: [
    "daniel",
    "george",
    "david",
    "mark",
    "aaron",
    "alex",
    "guy",
  ],
};

const VOICE_SETTINGS: Record<AILocale, { rate: number; pitch: number }> = {
  ru: { rate: 0.9, pitch: 0.86 },
  kk: { rate: 0.9, pitch: 0.88 },
  en: { rate: 0.92, pitch: 0.84 },
};

function resolveLocale(language: string): AILocale {
  if (language === "kk" || language === "en") {
    return language;
  }

  return "ru";
}

function createMessage(role: "assistant" | "user", content: string): AIMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

function createConversationId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function scoreVoice(voice: SpeechSynthesisVoice, locale: AILocale, targetLang: string) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  const preferences = VOICE_PREFERENCES[locale];
  let score = 0;

  if (lang === targetLang.toLowerCase()) {
    score += 100;
  } else if (lang.startsWith(locale)) {
    score += 70;
  }

  if (voice.localService) {
    score += 12;
  }

  const preferredIndex = preferences.findIndex((token) => name.includes(token));
  if (preferredIndex >= 0) {
    score += 50 - preferredIndex;
  }

  if (name.includes("natural")) {
    score += 18;
  }

  if (name.includes("neural")) {
    score += 18;
  }

  if (name.includes("desktop")) {
    score += 6;
  }

  if (name.includes("female") || name.includes("zira") || name.includes("hazel") || name.includes("aria")) {
    score -= 10;
  }

  return score;
}

function pickBestVoice(voices: SpeechSynthesisVoice[], locale: AILocale, targetLang: string) {
  const sorted = [...voices].sort(
    (left, right) => scoreVoice(right, locale, targetLang) - scoreVoice(left, locale, targetLang),
  );

  return sorted[0];
}

function AIAssistant({ language }: AIAssistantProps) {
  const locale = resolveLocale(language);
  const suggestedQuestions = useMemo(() => getSuggestedQuestions(locale), [locale]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [conversationId, setConversationId] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMessages = sessionStorage.getItem(`${STORAGE_KEY}-${locale}`);
    const savedConversationId = sessionStorage.getItem(`${CONVERSATION_KEY}-${locale}`) || "";
    const savedVoicePreference = sessionStorage.getItem(VOICE_ENABLED_KEY);

    setConversationId(savedConversationId);
    setIsVoiceEnabled(savedVoicePreference !== "false");

    if (!savedMessages) {
      setMessages([createAssistantGreeting(locale)]);
      return;
    }

    try {
      const parsed = JSON.parse(savedMessages) as AIMessage[];
      setMessages(parsed.length > 0 ? parsed : [createAssistantGreeting(locale)]);
    } catch {
      sessionStorage.removeItem(`${STORAGE_KEY}-${locale}`);
      setMessages([createAssistantGreeting(locale)]);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined" || messages.length === 0) {
      return;
    }

    sessionStorage.setItem(`${STORAGE_KEY}-${locale}`, JSON.stringify(messages));
  }, [messages, locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (conversationId) {
      sessionStorage.setItem(`${CONVERSATION_KEY}-${locale}`, conversationId);
    } else {
      sessionStorage.removeItem(`${CONVERSATION_KEY}-${locale}`);
    }
  }, [conversationId, locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem(VOICE_ENABLED_KEY, String(isVoiceEnabled));
  }, [isVoiceEnabled]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  const speakMessage = (text: string) => {
    if (
      !isVoiceEnabled ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !text.trim()
    ) {
      setIsSpeaking(false);
      return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    const localeToLang: Record<AILocale, string> = {
      ru: "ru-RU",
      kk: "kk-KZ",
      en: "en-US",
    };

    utterance.lang = localeToLang[locale];
    utterance.rate = VOICE_SETTINGS[locale].rate;
    utterance.pitch = VOICE_SETTINGS[locale].pitch;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = pickBestVoice(voices, locale, utterance.lang);

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setIsSpeaking(false);
      }
    };

    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setIsSpeaking(false);
      }
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const submitPrompt = async (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isTyping) {
      return;
    }

    const activeConversationId = conversationId || createConversationId();
    const userMessage = createMessage("user", trimmedPrompt);
    const assistantMessageId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const placeholder: AIMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
    };

    setConversationId(activeConversationId);
    setMessages((currentMessages) => [...currentMessages, userMessage, placeholder]);
    setInputValue("");
    setIsTyping(true);

    const payload: AssistantApiPayload = {
      message: trimmedPrompt,
      locale,
      conversationId: activeConversationId,
      stream: true,
      history: messages.slice(-8).map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Assistant request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalText = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const eventBlock of events) {
          const dataLine = eventBlock
            .split("\n")
            .find((line) => line.startsWith("data: "));

          if (!dataLine) {
            continue;
          }

          const eventData = JSON.parse(dataLine.slice(6)) as
            | { type: "meta"; conversationId?: string }
            | { type: "delta"; delta?: string }
            | { type: "done"; message?: string; conversationId?: string }
            | { type: "error"; error?: string };

          if (eventData.type === "meta" && typeof eventData.conversationId === "string") {
            setConversationId(eventData.conversationId);
            continue;
          }

          if (eventData.type === "delta" && typeof eventData.delta === "string") {
            finalText += eventData.delta;
            setIsTyping(false);
            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: finalText, isStreaming: true }
                  : message,
              ),
            );
            continue;
          }

          if (eventData.type === "done") {
            const resolvedMessage =
              typeof eventData.message === "string" && eventData.message.trim()
                ? eventData.message
                : finalText;

            finalText = resolvedMessage;

            if (typeof eventData.conversationId === "string") {
              setConversationId(eventData.conversationId);
            }

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: resolvedMessage, isStreaming: false }
                  : message,
              ),
            );
          }

          if (eventData.type === "error") {
            throw new Error(eventData.error || "Assistant stream failed");
          }
        }
      }

      if (!finalText.trim()) {
        throw new Error("Assistant returned an empty response");
      }

      speakMessage(finalText);
    } catch (error) {
      console.error("AI assistant request failed:", error);

      const fallbackResponse = getAIResponse(trimmedPrompt, locale);
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: fallbackResponse, isStreaming: false }
            : message,
        ),
      );
      speakMessage(fallbackResponse);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        locale={locale}
        messages={messages}
        inputValue={inputValue}
        isTyping={isTyping}
        isSpeaking={isSpeaking}
        isVoiceEnabled={isVoiceEnabled}
        suggestedQuestions={suggestedQuestions}
        onClose={() => setIsOpen(false)}
        onInputChange={setInputValue}
        onSend={submitPrompt}
        onVoiceToggle={() => {
          const nextValue = !isVoiceEnabled;
          setIsVoiceEnabled(nextValue);

          if (!nextValue) {
            stopSpeaking();
          }
        }}
      />

      {!isOpen ? (
        <div className="ai-floating-root">
          <FloatingButton onClick={() => setIsOpen(true)} />
        </div>
      ) : null}
    </>
  );
}

export default AIAssistant;
