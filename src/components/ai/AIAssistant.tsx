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

export type VoiceVariant = "assistant" | "deep" | "warm";

const STORAGE_KEY = "globaledtech-ai-assistant";
const CONVERSATION_KEY = "globaledtech-ai-conversation";
const VOICE_ENABLED_KEY = "globaledtech-ai-voice-enabled";
const VOICE_VARIANT_KEY = "globaledtech-ai-voice-variant";
const DEFAULT_VOICE_VARIANT: VoiceVariant = "assistant";

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
  const suggestedQuestions = useMemo(() => getSuggestedQuestions(locale), [locale]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [voiceVariant, setVoiceVariant] = useState<VoiceVariant>(DEFAULT_VOICE_VARIANT);
  const [conversationId, setConversationId] = useState("");
  const [lastAssistantText, setLastAssistantText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const voiceAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMessages = sessionStorage.getItem(`${STORAGE_KEY}-${locale}`);
    const savedConversationId = sessionStorage.getItem(`${CONVERSATION_KEY}-${locale}`) || "";
    const savedVoicePreference = sessionStorage.getItem(VOICE_ENABLED_KEY);
    const savedVoiceVariant = sessionStorage.getItem(VOICE_VARIANT_KEY);

    setConversationId(savedConversationId);
    setIsVoiceEnabled(savedVoicePreference !== "false");
    setVoiceVariant(
      savedVoiceVariant === "assistant" || savedVoiceVariant === "deep" || savedVoiceVariant === "warm"
        ? savedVoiceVariant
        : DEFAULT_VOICE_VARIANT,
    );

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
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem(VOICE_VARIANT_KEY, voiceVariant);
  }, [voiceVariant]);

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
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
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
    cleanupAudio();
    setIsSpeaking(false);
  };

  const speakMessage = async (text: string) => {
    if (!isVoiceEnabled || !text.trim()) {
      setIsSpeaking(false);
      return;
    }

    stopSpeaking();

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
          variant: voiceVariant,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Voice request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;

      audio.onended = () => {
        cleanupAudio();
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        cleanupAudio();
        setIsSpeaking(false);
      };

      audio.preload = "auto";
      await audio.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("AI assistant voice failed:", error);
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
        voiceVariant={voiceVariant}
        suggestedQuestions={suggestedQuestions}
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
        onVoiceVariantChange={(nextVariant) => {
          stopSpeaking();
          setVoiceVariant(nextVariant);
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
