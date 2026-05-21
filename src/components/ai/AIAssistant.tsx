import { useEffect, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";
import {
  createAssistantGreeting,
  getAIResponse,
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

function AIAssistant({ language }: AIAssistantProps) {
  const locale = resolveLocale(language);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [conversationId, setConversationId] = useState("");
  const [lastAssistantText, setLastAssistantText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const voiceAbortRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechResumeTimerRef = useRef<number | null>(null);

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
        stopSpeaking();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (typeof document === "undefined" || !isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.getVoices();

    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
  }, []);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const stopSpeaking = () => {
    voiceAbortRef.current?.abort();
    voiceAbortRef.current = null;

    if (speechResumeTimerRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(speechResumeTimerRef.current);
      speechResumeTimerRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }

    cleanupAudio();
    setIsSpeaking(false);
  };

  const speakWithBrowserFallback = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) {
      setIsSpeaking(false);
      return;
    }

    const localeToLang: Record<AILocale, string> = {
      ru: "ru-RU",
      kk: "kk-KZ",
      en: "en-US",
    };

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = localeToLang[locale];
    utterance.rate = 0.95;
    utterance.pitch = 0.95;
    utterance.volume = 1;

    const availableVoices = window.speechSynthesis.getVoices();
    const localePrefix = localeToLang[locale].split("-")[0];
    const matchingVoice =
      availableVoices.find((voice) => voice.lang.toLowerCase() === localeToLang[locale].toLowerCase()) ||
      availableVoices.find((voice) => voice.lang.toLowerCase().startsWith(localePrefix)) ||
      availableVoices.find((voice) => voice.default) ||
      null;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        if (speechResumeTimerRef.current !== null) {
          window.clearTimeout(speechResumeTimerRef.current);
          speechResumeTimerRef.current = null;
        }
        setIsSpeaking(false);
      }
    };

    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        if (speechResumeTimerRef.current !== null) {
          window.clearTimeout(speechResumeTimerRef.current);
          speechResumeTimerRef.current = null;
        }
        setIsSpeaking(false);
      }
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();

    speechResumeTimerRef.current = window.setTimeout(() => {
      if (utteranceRef.current === utterance) {
        window.speechSynthesis.resume();
      }
      speechResumeTimerRef.current = null;
    }, 250);
  };

  const speakMessage = async (text: string) => {
    if (!isVoiceEnabled || !text.trim()) {
      setIsSpeaking(false);
      return;
    }

    stopSpeaking();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speakWithBrowserFallback(text);
      return;
    }

    const controller = new AbortController();
    voiceAbortRef.current = controller;
    setIsSpeaking(true);

    try {
      const response = await fetch("/api/assistant-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          locale,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Voice request failed");
      }

      const audioBlob = await response.blob();
      if (!audioBlob.size) {
        throw new Error("Voice response is empty");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;
      audio.volume = 1;
      audio.muted = false;
      audio.preload = "auto";
      audio.playsInline = true;

      audio.onended = () => {
        cleanupAudio();
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        cleanupAudio();
        setIsSpeaking(false);
      };

      await audio.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("AI assistant voice failed:", error);
        speakWithBrowserFallback(text);
        return;
      }

      cleanupAudio();
      setIsSpeaking(false);
    } finally {
      if (voiceAbortRef.current === controller) {
        voiceAbortRef.current = null;
      }
    }
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

    const recentHistory = messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setConversationId(activeConversationId);
    setMessages((currentMessages) => [...currentMessages, userMessage, placeholder]);
    setInputValue("");
    setIsTyping(true);
    stopSpeaking();

    const payload: AssistantApiPayload = {
      message: trimmedPrompt,
      locale,
      conversationId: activeConversationId,
      stream: true,
      history: recentHistory,
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
          const dataLine = eventBlock.split("\n").find((line) => line.startsWith("data: "));

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

      setLastAssistantText(finalText);
      await speakMessage(finalText);
    } catch (error) {
      console.error("AI assistant request failed:", error);

      const fallbackResponse = getAIResponse(trimmedPrompt, locale);
      setLastAssistantText(fallbackResponse);
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: fallbackResponse, isStreaming: false }
            : message,
        ),
      );
      await speakMessage(fallbackResponse);
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
        onClose={() => {
          stopSpeaking();
          setIsOpen(false);
        }}
        onInputChange={setInputValue}
        onSend={submitPrompt}
        onVoiceToggle={() => {
          const nextValue = !isVoiceEnabled;
          setIsVoiceEnabled(nextValue);

          if (!nextValue) {
            stopSpeaking();
          }
        }}
        onReplayVoice={() => {
          if (lastAssistantText.trim()) {
            void speakMessage(lastAssistantText);
          }
        }}
        canReplayVoice={Boolean(lastAssistantText.trim())}
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
