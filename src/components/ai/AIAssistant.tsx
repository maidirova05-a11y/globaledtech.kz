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

function createMessage(role: "assistant" | "user", content: string): AIMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

function resolveLocale(language: string): AILocale {
  if (language === "kk" || language === "en") {
    return language;
  }

  return "ru";
}

function AIAssistant({ language }: AIAssistantProps) {
  const locale = resolveLocale(language);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const suggestedQuestions = useMemo(() => getSuggestedQuestions(locale), [locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMessages = sessionStorage.getItem(`${STORAGE_KEY}-${locale}`);
    const savedConversationId = sessionStorage.getItem(`${CONVERSATION_KEY}-${locale}`) || "";
    setConversationId(savedConversationId);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as AIMessage[];
        setMessages(parsed.length ? parsed : [createAssistantGreeting(locale)]);
        return;
      } catch {
        sessionStorage.removeItem(`${STORAGE_KEY}-${locale}`);
      }
    }

    setMessages([createAssistantGreeting(locale)]);
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedVoicePreference = sessionStorage.getItem(VOICE_ENABLED_KEY);

    if (savedVoicePreference === "false") {
      setIsVoiceEnabled(false);
    }
  }, []);

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

    if (!conversationId) {
      sessionStorage.removeItem(`${CONVERSATION_KEY}-${locale}`);
      return;
    }

    sessionStorage.setItem(`${CONVERSATION_KEY}-${locale}`, conversationId);
  }, [conversationId, locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    sessionStorage.setItem(VOICE_ENABLED_KEY, String(isVoiceEnabled));
  }, [isVoiceEnabled]);

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

  const speakAssistantMessage = (text: string) => {
    if (
      !isVoiceEnabled ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !text.trim()
    ) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    const languageByLocale: Record<AILocale, string> = {
      ru: "ru-RU",
      kk: "kk-KZ",
      en: "en-US",
    };

    utterance.lang = languageByLocale[locale];
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice =
      voices.find((voice) => voice.lang.toLowerCase() === utterance.lang.toLowerCase()) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith(locale));

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

    stopSpeaking();
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const submitPrompt = async (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isTyping) {
      return;
    }

    const activeConversationId =
      conversationId ||
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `conversation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    const userMessage = createMessage("user", trimmedPrompt);
    const assistantMessageId = `assistant-stream-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const assistantPlaceholder: AIMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
    };

    setConversationId(activeConversationId);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsSpeaking(true);

    const historyForApi = messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const payload: AssistantApiPayload = {
      message: trimmedPrompt,
      locale,
      conversationId: activeConversationId,
      stream: true,
      history: historyForApi,
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
      let streamedText = "";
      let hasAttachedAssistantMessage = false;
      let hasReceivedDelta = false;

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
            if (!hasAttachedAssistantMessage) {
              hasAttachedAssistantMessage = true;
              setMessages((currentMessages) => [...currentMessages, assistantPlaceholder]);
            }

            if (!hasReceivedDelta) {
              hasReceivedDelta = true;
              setIsTyping(false);
            }

            streamedText += eventData.delta;

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      content: streamedText,
                      isStreaming: true,
                    }
                  : message,
              ),
            );
            continue;
          }

          if (eventData.type === "done") {
            const finalMessage =
              typeof eventData.message === "string" && eventData.message.trim()
                ? eventData.message
                : streamedText;

            if (typeof eventData.conversationId === "string") {
              setConversationId(eventData.conversationId);
            }

            if (!hasAttachedAssistantMessage) {
              hasAttachedAssistantMessage = true;
              setMessages((currentMessages) => [...currentMessages, assistantPlaceholder]);
            }

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      content: finalMessage,
                      isStreaming: false,
                    }
                  : message,
              ),
            );
            streamedText = finalMessage;
            speakAssistantMessage(finalMessage);
            continue;
          }

          if (eventData.type === "error") {
            throw new Error(eventData.error || "Assistant stream failed");
          }
        }
      }

      if (!streamedText.trim()) {
        throw new Error("Assistant returned an empty response");
      }
    } catch (error) {
      console.error("AI assistant request failed:", error);

      const fallbackResponse = getAIResponse(trimmedPrompt, locale);
      speakAssistantMessage(fallbackResponse);
      setMessages((currentMessages) => {
        const hasPlaceholder = currentMessages.some((message) => message.id === assistantMessageId);

        if (hasPlaceholder) {
          return currentMessages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: fallbackResponse,
                  isStreaming: false,
                }
              : message,
          );
        }

        return [
          ...currentMessages,
          {
            id: assistantMessageId,
            role: "assistant",
            content: fallbackResponse,
            createdAt: Date.now(),
          },
        ];
      });
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
          <FloatingButton
            isOpen={isOpen}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
      ) : null}
    </>
  );
}

export default AIAssistant;
