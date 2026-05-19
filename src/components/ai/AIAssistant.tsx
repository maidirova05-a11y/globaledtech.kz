import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";
import {
  createAssistantGreeting,
  getAIResponse,
  getSuggestedQuestions,
  type AIMessage,
  type AILocale,
} from "../../lib/ai";

type AIAssistantProps = {
  language: string;
};

const STORAGE_KEY = "globaledtech-ai-assistant";

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
  const timeoutRef = useRef<number | null>(null);
  const speakingRef = useRef<number | null>(null);

  const suggestedQuestions = useMemo(() => getSuggestedQuestions(locale), [locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMessages = sessionStorage.getItem(`${STORAGE_KEY}-${locale}`);

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
    if (typeof window === "undefined" || messages.length === 0) {
      return;
    }

    sessionStorage.setItem(`${STORAGE_KEY}-${locale}`, JSON.stringify(messages));
  }, [messages, locale]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (speakingRef.current) {
        window.clearTimeout(speakingRef.current);
      }
    };
  }, []);

  const submitPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isTyping) {
      return;
    }

    const userMessage = createMessage("user", trimmedPrompt);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsSpeaking(true);

    timeoutRef.current = window.setTimeout(() => {
      const response = getAIResponse(trimmedPrompt, locale);
      const assistantMessage = createMessage("assistant", response);

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setIsTyping(false);

      speakingRef.current = window.setTimeout(() => {
        setIsSpeaking(false);
      }, 800);
    }, 900);
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
        suggestedQuestions={suggestedQuestions}
        onClose={() => setIsOpen(false)}
        onInputChange={setInputValue}
        onSend={submitPrompt}
      />

      <div className="ai-floating-root">
        <FloatingButton isOpen={isOpen} onClick={() => setIsOpen((currentState) => !currentState)} />
      </div>
    </>
  );
}

export default AIAssistant;
