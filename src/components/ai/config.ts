import type { AILocale } from "../../lib/ai";

export type AssistantQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export const assistantUiCopy: Record<
  AILocale,
  {
    title: string;
    subtitle: string;
    status: string;
    placeholder: string;
    send: string;
    close: string;
    quickPrompts: string;
    thinkingLabel: string;
    speakingLabel: string;
    voiceOn: string;
    voiceOff: string;
    replay: string;
    stopVoice: string;
    clearChat: string;
    chipsHint: string;
    voiceProvider: string;
    typingPhrases: string[];
    welcomeHint: string;
    fabTitle: string;
    fabSubtitle: string;
  }
> = {
  ru: {
    title: "AI-ассистент",
    subtitle: "Живой помощник Global EdTech",
    status: "Online",
    placeholder: "Спросите про программу, регистрацию, партнерство или аудиторию...",
    send: "Отправить",
    close: "Закрыть чат",
    quickPrompts: "Быстрые запросы",
    thinkingLabel: "Ассистент думает",
    speakingLabel: "Ассистент озвучивает ответ",
    voiceOn: "Выключить озвучку",
    voiceOff: "Включить озвучку",
    replay: "Повторить озвучку",
    stopVoice: "Остановить озвучку",
    clearChat: "Новый диалог",
    chipsHint: "Можно нажать на тему и сразу получить ответ",
    voiceProvider: "Голос",
    typingPhrases: [
      "Сейчас быстро соберу главное...",
      "Думаю, как ответить короче и полезнее...",
      "Смотрю, что вам будет важнее всего...",
      "Подбираю самый подходящий ответ...",
    ],
    welcomeHint: "Могу быстро подсказать по программе, регистрации, стендам, спонсорству и участию для студентов, компаний и партнеров.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Спросить о форуме",
  },
  kk: {
    title: "AI-ассистент",
    subtitle: "Global EdTech тірі көмекшісі",
    status: "Online",
    placeholder: "Бағдарлама, тіркелу, серіктестік немесе аудитория туралы сұраңыз...",
    send: "Жіберу",
    close: "Чатты жабу",
    quickPrompts: "Жылдам сұраулар",
    thinkingLabel: "Ассистент ойланып жатыр",
    speakingLabel: "Ассистент жауапты дыбыстап жатыр",
    voiceOn: "Дыбыстауды өшіру",
    voiceOff: "Дыбыстауды қосу",
    replay: "Қайта дыбыстау",
    stopVoice: "Дыбысты тоқтату",
    clearChat: "Жаңа диалог",
    chipsHint: "Тақырыпты басып, бірден жауап алуға болады",
    voiceProvider: "Дауыс",
    typingPhrases: [
      "Негізгі ақпаратты тез жинап жатырмын...",
      "Жауапты қысқа әрі пайдалы етіп дайындап жатырмын...",
      "Сізге ең маңыздысын іріктеп жатырмын...",
      "Ең қолайлы жауапты құрастырып жатырмын...",
    ],
    welcomeHint: "Бағдарлама, тіркелу, стенд, демеушілік және студенттерге не компанияларға қатысу форматтары бойынша көмектесе аламын.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Форум туралы сұрау",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Your Global EdTech guide",
    status: "Online",
    placeholder: "Ask about the program, registration, partnerships, or student opportunities...",
    send: "Send",
    close: "Close chat",
    quickPrompts: "Quick prompts",
    thinkingLabel: "Assistant is thinking",
    speakingLabel: "Assistant is speaking",
    voiceOn: "Turn voice off",
    voiceOff: "Turn voice on",
    replay: "Replay voice",
    stopVoice: "Stop voice",
    clearChat: "New chat",
    chipsHint: "Tap a topic to get a fast answer",
    voiceProvider: "Voice",
    typingPhrases: [
      "Let me pull together the useful part first...",
      "Thinking through the clearest answer...",
      "Checking what matters most for your case...",
      "Putting together a concise answer...",
    ],
    welcomeHint: "I can help with the program, registration, sponsorships, stands, and the best participation format for students, companies, and partners.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Ask about the forum",
  },
};

export const assistantQuickPrompts: Record<AILocale, AssistantQuickPrompt[]> = {
  ru: [
    { id: "registration", label: "Регистрация", prompt: "Как зарегистрироваться на Global EdTech?" },
    { id: "program", label: "Программа мероприятия", prompt: "Расскажи о программе мероприятия" },
    { id: "partners", label: "Для партнеров", prompt: "Как стать партнером Global EdTech?" },
    { id: "students", label: "Для студентов", prompt: "Что будет на Global EdTech для студентов?" },
    { id: "stands", label: "Купить стенд", prompt: "Как купить стенд на выставке?" },
    { id: "sponsor", label: "Стать спонсором", prompt: "Как стать спонсором мероприятия?" },
    { id: "speakers", label: "Спикеры", prompt: "Какие спикеры ожидаются?" },
    { id: "venue", label: "Место проведения", prompt: "Где пройдет мероприятие?" },
    { id: "meetings", label: "B2B встречи", prompt: "Будут ли B2B, B2C и B2G встречи?" },
    { id: "expo", label: "EdTech выставка", prompt: "Будет ли выставка EdTech-компаний?" },
    { id: "startups", label: "Стартап-питчи", prompt: "Будут ли стартап-питчи?" },
    { id: "faq", label: "FAQ", prompt: "Дай короткий FAQ по Global EdTech" },
    { id: "contacts", label: "Контакты", prompt: "Какие контакты у организаторов?" },
  ],
  kk: [
    { id: "registration", label: "Тіркелу", prompt: "Global EdTech-ке қалай тіркелуге болады?" },
    { id: "program", label: "Бағдарлама", prompt: "Іс-шара бағдарламасы туралы айтып бер" },
    { id: "partners", label: "Серіктестерге", prompt: "Global EdTech-тің серіктесі қалай болуға болады?" },
    { id: "students", label: "Студенттерге", prompt: "Global EdTech-те студенттер үшін не болады?" },
    { id: "stands", label: "Стенд алу", prompt: "Көрмеден стендті қалай алуға болады?" },
    { id: "sponsor", label: "Демеуші болу", prompt: "Іс-шараның демеушісі қалай болуға болады?" },
    { id: "speakers", label: "Спикерлер", prompt: "Қандай спикерлер күтіледі?" },
    { id: "venue", label: "Өтетін орны", prompt: "Іс-шара қай жерде өтеді?" },
    { id: "meetings", label: "B2B кездесулер", prompt: "B2B, B2C және B2G кездесулері бола ма?" },
    { id: "expo", label: "EdTech көрмесі", prompt: "EdTech-компаниялардың көрмесі бола ма?" },
    { id: "startups", label: "Стартап-питчтер", prompt: "Стартап-питчтер болады ма?" },
    { id: "faq", label: "FAQ", prompt: "Global EdTech бойынша қысқа FAQ бер" },
    { id: "contacts", label: "Байланыс", prompt: "Ұйымдастырушылардың байланыс деректерін бер" },
  ],
  en: [
    { id: "registration", label: "Registration", prompt: "How do I register for Global EdTech?" },
    { id: "program", label: "Event program", prompt: "Tell me about the event program" },
    { id: "partners", label: "For partners", prompt: "How can we become a Global EdTech partner?" },
    { id: "students", label: "For students", prompt: "What will Global EdTech offer for students?" },
    { id: "stands", label: "Buy a stand", prompt: "How can I book an exhibition stand?" },
    { id: "sponsor", label: "Become a sponsor", prompt: "How can I become an event sponsor?" },
    { id: "speakers", label: "Speakers", prompt: "What speakers are expected?" },
    { id: "venue", label: "Venue", prompt: "Where will the event take place?" },
    { id: "meetings", label: "B2B meetings", prompt: "Will there be B2B, B2C, and B2G meetings?" },
    { id: "expo", label: "EdTech expo", prompt: "Will there be an EdTech company exhibition?" },
    { id: "startups", label: "Startup pitches", prompt: "Will there be startup pitch sessions?" },
    { id: "faq", label: "FAQ", prompt: "Give me a short FAQ about Global EdTech" },
    { id: "contacts", label: "Contacts", prompt: "What are the organizer contacts?" },
  ],
};
