export type AILocale = "ru" | "kk" | "en";

export type AIMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: number;
  isStreaming?: boolean;
};

export type SuggestedQuestion = {
  id: string;
  label: string;
  prompt: string;
};

export type AssistantApiPayload = {
  message: string;
  locale: AILocale;
  conversationId?: string;
  stream?: boolean;
  history: Array<Pick<AIMessage, "role" | "content">>;
};

type ResponseRule = {
  topic: string;
  patterns: string[];
  response: Record<AILocale, string>;
};

const introMessage: Record<AILocale, string> = {
  ru: "Здравствуйте! Я AI-помощник форума Global EdTech. Помогу быстро найти информацию о выставке, регистрации, программе, партнерах и контактах.",
  kk: "Сәлеметсіз бе! Мен Global EdTech форумының AI-көмекшісімін. Көрме, тіркелу, бағдарлама, серіктестер және байланыс туралы ақпаратты жылдам табуға көмектесемін.",
  en: "Hello! I am the AI assistant for Global EdTech. I can help you with information about the forum, registration, program, partners, and contacts.",
};

const fallbackMessage: Record<AILocale, string> = {
  ru: "Я могу помочь с информацией о Global EdTech, регистрации, программе, локации, спикерах, партнерах и контактах. Выберите быстрый вопрос или напишите подробнее.",
  kk: "Мен Global EdTech, тіркелу, бағдарлама, локация, спикерлер, серіктестер және байланыс туралы ақпаратпен көмектесе аламын. Дайын сұрақтардың бірін таңдаңыз немесе нақтырақ жазыңыз.",
  en: "I can help with information about Global EdTech, registration, program, location, speakers, partners, and contacts. Choose a suggested question or write your request in more detail.",
};

const responseRules: ResponseRule[] = [
  {
    topic: "about",
    patterns: ["global edtech", "о форуме", "форум", "about forum", "about global edtech", "не туралы", "форум туралы"],
    response: {
      ru: "Global EdTech — это международный выставочный образовательный форум в Астане, который объединяет EdTech-компании, школы, университеты, экспертов, стартапы и технологических партнеров.",
      kk: "Global EdTech — Астанада өтетін халықаралық көрме-білім беру форумы. Ол EdTech-компанияларды, мектептерді, университеттерді, сарапшыларды, стартаптарды және технологиялық серіктестерді біріктіреді.",
      en: "Global EdTech is an international exhibition and educational forum in Astana that brings together EdTech companies, schools, universities, experts, startups, and technology partners.",
    },
  },
  {
    topic: "registration",
    patterns: ["регистрац", "register", "sign up", "тіркел", "участв", "join"],
    response: {
      ru: "Для участия в Global EdTech откройте раздел «Регистрация» на сайте и заполните форму. После отправки заявки команда форума свяжется с вами при необходимости.",
      kk: "Global EdTech-ке қатысу үшін сайттағы «Тіркелу» бөліміне өтіп, форманы толтырыңыз. Өтінім жіберілгеннен кейін қажет болса, форум командасы сізбен байланысады.",
      en: "To join Global EdTech, open the Registration section on the website and complete the form. After submission, the forum team will contact you if needed.",
    },
  },
  {
    topic: "speakers",
    patterns: ["спикер", "speaker", "speakers", "сарапшы", "эксперт"],
    response: {
      ru: "На форуме ожидаются спикеры и эксперты из сфер образования, технологий, инноваций и EdTech. Актуальный список спикеров публикуется по мере подтверждения программы.",
      kk: "Форумда білім, технология, инновация және EdTech салаларынан спикерлер мен сарапшылар қатысады. Нақты тізім бағдарлама бекітілген сайын жаңартылып отырады.",
      en: "The forum features speakers and experts from education, technology, innovation, and EdTech. The confirmed speaker list is published as the program is finalized.",
    },
  },
  {
    topic: "program",
    patterns: ["программ", "agenda", "schedule", "бағдарлама", "расписание"],
    response: {
      ru: "Программа Global EdTech включает экспертные выступления, панельные дискуссии, выставочную часть, технологические зоны, партнерские встречи и networking-сессии.",
      kk: "Global EdTech бағдарламасына сарапшылар баяндамалары, панельдік сессиялар, көрме аймағы, технологиялық аймақтар, серіктестік кездесулер және networking форматтары кіреді.",
      en: "The Global EdTech program includes expert talks, panel discussions, an exhibition area, technology zones, partnership meetings, and networking sessions.",
    },
  },
  {
    topic: "location",
    patterns: ["где", "локац", "location", "where", "астана", "қайда", "мекенжай"],
    response: {
      ru: "Форум Global EdTech пройдет в Астане, Казахстан. Даты мероприятия: 7–8 февраля 2027 года.",
      kk: "Global EdTech форумы Астана қаласында, Қазақстанда өтеді. Іс-шара күндері: 2027 жылғы 7–8 ақпан.",
      en: "Global EdTech will take place in Astana, Kazakhstan. Event dates: February 7–8, 2027.",
    },
  },
  {
    topic: "contacts",
    patterns: ["контакт", "contact", "email", "почта", "телефон", "байланыс", "phone"],
    response: {
      ru: "Контакты форума Global EdTech: globaledtechkz@gmail.com, +7 (700) 033 0229.",
      kk: "Global EdTech форумының байланыстары: globaledtechkz@gmail.com, +7 (700) 033 0229.",
      en: "Global EdTech contact details: globaledtechkz@gmail.com, +7 (700) 033 0229.",
    },
  },
  {
    topic: "partners",
    patterns: ["партнер", "partner", "partners", "серіктес"],
    response: {
      ru: "Форум развивается вместе с образовательными организациями, EdTech-компаниями, технологическими командами и стратегическими партнерами экосистемы Global EdTech.",
      kk: "Форум Global EdTech экожүйесінің білім беру ұйымдарымен, EdTech-компаниялармен, технологиялық командалармен және стратегиялық серіктестерімен бірге дамиды.",
      en: "The forum is developed together with educational organizations, EdTech companies, technology teams, and strategic ecosystem partners.",
    },
  },
  {
    topic: "faq",
    patterns: ["faq", "часто", "вопрос", "question", "сұрақ"],
    response: {
      ru: "Чаще всего участники спрашивают о регистрации, программе, спикерах, партнерах и логистике форума. Я могу подсказать по каждому из этих направлений.",
      kk: "Қатысушылар көбіне тіркелу, бағдарлама, спикерлер, серіктестер және форум логистикасы туралы сұрайды. Осы бағыттардың әрқайсысы бойынша көмектесе аламын.",
      en: "The most common questions are about registration, program, speakers, partners, and forum logistics. I can help with each of these topics.",
    },
  },
];

const suggestedQuestions: Record<AILocale, SuggestedQuestion[]> = {
  ru: [
    { id: "about", label: "О форуме", prompt: "Что такое Global EdTech?" },
    { id: "registration", label: "Как зарегистрироваться?", prompt: "Как зарегистрироваться?" },
    { id: "location", label: "Где пройдет мероприятие?", prompt: "Где пройдет мероприятие?" },
    { id: "speakers", label: "Кто спикеры?", prompt: "Кто спикеры?" },
    { id: "program", label: "Программа форума", prompt: "Какая программа форума?" },
    { id: "partners", label: "Партнеры", prompt: "Кто партнеры форума?" },
  ],
  kk: [
    { id: "about", label: "Форум туралы", prompt: "Global EdTech деген не?" },
    { id: "registration", label: "Қалай тіркелемін?", prompt: "Қалай тіркелемін?" },
    { id: "location", label: "Іс-шара қайда өтеді?", prompt: "Іс-шара қайда өтеді?" },
    { id: "speakers", label: "Спикерлер кім?", prompt: "Спикерлер кім?" },
    { id: "program", label: "Форум бағдарламасы", prompt: "Форум бағдарламасы қандай?" },
    { id: "partners", label: "Серіктестер", prompt: "Форумның серіктестері кім?" },
  ],
  en: [
    { id: "about", label: "About the forum", prompt: "What is Global EdTech?" },
    { id: "registration", label: "How to register?", prompt: "How do I register?" },
    { id: "location", label: "Where is the event?", prompt: "Where will the event take place?" },
    { id: "speakers", label: "Who are the speakers?", prompt: "Who are the speakers?" },
    { id: "program", label: "Forum program", prompt: "What is the forum program?" },
    { id: "partners", label: "Partners", prompt: "Who are the forum partners?" },
  ],
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const createAssistantGreeting = (locale: AILocale): AIMessage => ({
  id: `assistant-greeting-${locale}`,
  role: "assistant",
  content: introMessage[locale],
  createdAt: Date.now(),
});

export const getSuggestedQuestions = (locale: AILocale) => suggestedQuestions[locale];

export const getAssistantUnavailableMessage = (locale: AILocale) =>
  ({
    ru: "Сейчас AI-ассистент временно недоступен. Попробуйте снова через несколько секунд или воспользуйтесь разделами сайта.",
    kk: "Қазір AI-көмекші уақытша қолжетімсіз. Бірнеше секундтан кейін қайта көріңіз немесе сайт бөлімдерін пайдаланыңыз.",
    en: "The AI assistant is temporarily unavailable. Please try again in a few seconds or use the website sections.",
  })[locale];

export const getAIResponse = (input: string, locale: AILocale): string => {
  const normalizedInput = normalizeText(input);

  const match = responseRules.find((rule) =>
    rule.patterns.some((pattern) => normalizedInput.includes(normalizeText(pattern))),
  );

  if (match) {
    return match.response[locale];
  }

  return fallbackMessage[locale];
};
