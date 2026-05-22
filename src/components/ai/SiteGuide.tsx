import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assistantUiCopy, guideSectionHints, type GuideSectionHint } from "./config";
import type { AILocale } from "../../lib/ai";

type SiteGuideProps = {
  locale: AILocale;
  isChatOpen: boolean;
  onOpenChat: () => void;
  onPrompt: (prompt: string) => void;
};

const DEFAULT_SECTION_ID = "program";
const GUIDE_VISIBILITY_KEY = "globaledtech-ai-guide-visible";

function getVisibleSection(sectionIds: string[]) {
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => Boolean(section));

  if (sections.length === 0) {
    return DEFAULT_SECTION_ID;
  }

  let bestSectionId = sections[0].id;
  let bestScore = Number.NEGATIVE_INFINITY;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.48;
    const sectionCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);
    const visibilityBoost = rect.top < window.innerHeight && rect.bottom > 0 ? 180 : 0;
    const score = visibilityBoost - distance;

    if (score > bestScore) {
      bestScore = score;
      bestSectionId = section.id;
    }
  });

  return bestSectionId;
}

function SiteGuide({ locale, isChatOpen, onOpenChat, onPrompt }: SiteGuideProps) {
  const copy = assistantUiCopy[locale];
  const hints = guideSectionHints[locale];
  const [activeSectionId, setActiveSectionId] = useState(DEFAULT_SECTION_ID);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedVisibility = window.localStorage.getItem(GUIDE_VISIBILITY_KEY);
    if (savedVisibility === "hidden") {
      setIsVisible(false);
    }

    const knownSectionIds = hints.map((hint) => hint.sectionId);

    const updateActiveSection = () => {
      setActiveSectionId(getVisibleSection(knownSectionIds));
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [hints]);

  const activeHint = useMemo<GuideSectionHint>(() => {
    return hints.find((hint) => hint.sectionId === activeSectionId) || hints[0];
  }, [activeSectionId, hints]);

  const handleBrowse = () => {
    const section = document.getElementById(activeHint.sectionId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hideGuide = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUIDE_VISIBILITY_KEY, "hidden");
    }
  };

  const showGuide = () => {
    setIsVisible(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUIDE_VISIBILITY_KEY, "visible");
    }
  };

  return (
    <div className={`site-guide-root ${isChatOpen ? "site-guide-root-shifted" : ""}`}>
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key={activeHint.id}
            className="site-guide-bubble"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="site-guide-topline">
              <p className="site-guide-eyebrow">{activeHint.eyebrow}</p>
              <div className="site-guide-top-actions">
                <button
                  type="button"
                  className="site-guide-chat-trigger"
                  onClick={onOpenChat}
                  aria-label={copy.guideAction}
                >
                  <span className="site-guide-chat-trigger-dot" />
                  {copy.guideLabel}
                </button>
                <button
                  type="button"
                  className="site-guide-dismiss"
                  onClick={hideGuide}
                  aria-label="Hide AI guide"
                >
                  ×
                </button>
              </div>
            </div>

            <h3 className="site-guide-title">{activeHint.title}</h3>
            <p className="site-guide-description">{activeHint.description}</p>

            <div className="site-guide-actions">
              <button
                type="button"
                className="site-guide-action-primary"
                onClick={() => {
                  onPrompt(activeHint.prompt);
                }}
              >
                {activeHint.ctaLabel}
              </button>
              <button
                type="button"
                className="site-guide-action-secondary"
                onClick={handleBrowse}
              >
                {copy.guideBrowse}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="site-guide-restore"
            type="button"
            className="site-guide-restore"
            onClick={showGuide}
            aria-label="Show AI guide"
            initial={{ opacity: 0, x: -12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="site-guide-restore-dot" />
            <span className="site-guide-restore-label">AI</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SiteGuide;
