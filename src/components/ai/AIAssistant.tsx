import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";
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
    <>
      <ChatWindow
        isOpen={controller.isOpen}
        locale={locale}
        messages={controller.messages}
        inputValue={controller.inputValue}
        isTyping={controller.isTyping}
        isThinking={controller.isThinking}
        thinkingText={controller.thinkingText}
        isSpeaking={controller.isSpeaking}
        isVoiceEnabled={controller.isVoiceEnabled}
        voiceProviderLabel={controller.voiceMeta.providerLabel}
        voiceLabel={controller.voiceMeta.voiceLabel}
        quickPrompts={assistantQuickPrompts[locale]}
        onClose={() => {
          controller.stopSpeaking();
          controller.setIsOpen(false);
        }}
        onInputChange={controller.setInputValue}
        onSend={controller.submitPrompt}
        onQuickPrompt={(prompt) => {
          void controller.submitPrompt(prompt);
        }}
        onVoiceToggle={() => {
          const nextValue = !controller.isVoiceEnabled;
          controller.setIsVoiceEnabled(nextValue);

          if (!nextValue) {
            controller.stopSpeaking();
          }
        }}
        onReplayVoice={() => {
          if (controller.lastAssistantText.trim()) {
            void controller.speakMessage(controller.lastAssistantText);
          }
        }}
        onStopVoice={controller.stopSpeaking}
        onClearChat={controller.resetConversation}
        canReplayVoice={Boolean(controller.lastAssistantText.trim())}
      />

      {!controller.isOpen ? (
        <div className="ai-floating-root">
          <FloatingButton
            title={copy.fabTitle}
            subtitle={copy.fabSubtitle}
            onClick={() => controller.setIsOpen(true)}
          />
        </div>
      ) : null}
    </>
  );
}

export default AIAssistant;
