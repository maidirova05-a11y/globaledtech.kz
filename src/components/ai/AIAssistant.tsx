import AssistantErrorBoundary from "./AssistantErrorBoundary";
import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";
import SiteGuide from "./SiteGuide";
import { assistantQuickPrompts, assistantUiCopy } from "./config";
import { useAssistantController } from "./useAssistantController";
import type { AILocale } from "../../lib/ai";

type AIAssistantProps = {
  language: string;
};

function resolveLocale(language: string): AILocale {
  if (language === "kk" || language === "en") {
    return language;
  }

  return "ru";
}

function AIAssistant({ language }: AIAssistantProps) {
  const locale = resolveLocale(language);
  const controller = useAssistantController(locale);
  const copy = assistantUiCopy[locale];

  return (
    <AssistantErrorBoundary>
      <>
        <SiteGuide
          locale={locale}
          isChatOpen={controller.isOpen}
          onOpenChat={() => controller.setIsOpen(true)}
          onPrompt={(prompt) => {
            void controller.openChatWithPrompt(prompt);
          }}
        />

        <ChatWindow
          isOpen={controller.isOpen}
          locale={locale}
          messages={controller.messages}
          inputValue={controller.inputValue}
          isTyping={controller.isTyping}
          isThinking={controller.isThinking}
          thinkingText={controller.thinkingText}
          quickPrompts={assistantQuickPrompts[locale]}
          onClose={() => {
            controller.setIsOpen(false);
          }}
          onInputChange={controller.setInputValue}
          onSend={controller.submitPrompt}
          onQuickPrompt={(prompt) => {
            void controller.submitPrompt(prompt);
          }}
          onClearChat={controller.resetConversation}
        />

        {!controller.isOpen ? (
          <div className="ai-floating-root">
            <FloatingButton
              title={copy.fabTitle}
              onClick={() => controller.setIsOpen(true)}
            />
          </div>
        ) : null}
      </>
    </AssistantErrorBoundary>
  );
}

export default AIAssistant;
