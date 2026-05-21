export type AILocale = "ru" | "kk" | "en";

export type AIMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: number;
  isStreaming?: boolean;
};

export type AssistantApiPayload = {
  message: string;
  locale: AILocale;
  conversationId?: string;
  stream?: boolean;
  history: Array<Pick<AIMessage, "role" | "content">>;
};

type ResponseRule = {
  patterns: string[];
  response: Record<AILocale, string>;
};

const REGISTRATION_URL = "https://globaledtech-kz.vercel.app/#register";
const CONTACT_EMAIL = "globaledtechkz@gmail.com";
const CONTACT_PHONE = "+7 (700) 033 0229";

const introMessage: Record<AILocale, string> = {
  ru: "Здравствуйте! Я цифровой ассистент Global EdTech. Могу помочь с программой, датами, регистрацией, спонсорством, стендом и контактами.",
  kk: "Сәлеметсіз бе! Мен Global EdTech цифрлық ассистентімін. Бағдарлама, күндер, тіркелу, демеушілік, стенд және байланыс бойынша көмектесе аламын.",
  en: "Hello! I am the Global EdTech digital assistant. I can help with the program, dates, registration, sponsorship, stands, and contacts.",
};

const fallbackMessage: Record<AILocale, string> = {
  ru: "Я могу помочь по Global EdTech: рассказать о датах, программе, форматах участия, спонсорстве, стенде и контактах. Уточните, пожалуйста, что именно вас интересует.",
  kk: "Мен Global EdTech бойынша көмектесе аламын: күндер, бағдарлама, қатысу форматтары, демеушілік, стенд және байланыс туралы айта аламын. Нақты не қызықтыратынын жазыңыз.",
  en: "I can help with Global EdTech details such as dates, program, participation formats, sponsorship, stands, and contacts. Please tell me what exactly you want to know.",
};

const responseRules: ResponseRule[] = [
  {
    patterns: ["когда", "дата", "даты", "date", "dates", "when", "қашан", "күні", "күндері"],
    response: {
      ru: "Форум Global EdTech пройдет 7-8 февраля 2027 года.",
      kk: "Global EdTech форумы 2027 жылғы 7-8 ақпанда өтеді.",
      en: "Global EdTech will take place on February 7-8, 2027.",
    },
  },
  {
    patterns: ["где", "location", "where", "астана", "қайда", "мекенжай"],
    response: {
      ru: "Форум пройдет в Астане, Казахстан.",
      kk: "Форум Астана, Қазақстанда өтеді.",
      en: "The forum will take place in Astana, Kazakhstan.",
    },
  },
  {
    patterns: ["что такое", "о форуме", "about global edtech", "about the forum", "forum", "форум туралы"],
    response: {
      ru: "Global EdTech — это международный выставочно-образовательный форум, который объединяет EdTech-компании, школы, университеты, стартапы и экспертов вокруг будущего образования.",
      kk: "Global EdTech — білім берудің болашағына арналған халықаралық көрме-білім беру форумы.",
      en: "Global EdTech is an international exhibition and educational forum focused on the future of education.",
    },
  },
  {
    patterns: ["программа", "agenda", "schedule", "бағдарлама"],
    response: {
      ru: "В программе форума запланированы выступления спикеров, панельные дискуссии, выставочная зона, технологические демонстрации, партнерские встречи и networking.",
      kk: "Форум бағдарламасында спикерлер баяндамалары, панельдік сессиялар, көрме аймағы, технологиялық демонстрациялар және networking бар.",
      en: "The forum program includes speaker sessions, panel discussions, an exhibition area, technology showcases, partnership meetings, and networking.",
    },
  },
  {
    patterns: ["регистрац", "зарегистр", "register", "sign up", "тіркел", "участвовать", "participate"],
    response: {
      ru: `Для участия откройте форму регистрации: ${REGISTRATION_URL}. В форме можно выбрать формат участия: участник, спикер, партнер, спонсор или экспонент со стендом.`,
      kk: `Қатысу үшін тіркелу формасын ашыңыз: ${REGISTRATION_URL}. Формада қатысу түрін таңдауға болады: қатысушы, спикер, серіктес, демеуші немесе стендпен экспонент.`,
      en: `To participate, open the registration form: ${REGISTRATION_URL}. In the form, visitors can choose participant, speaker, partner, sponsor, or exhibitor with stand.`,
    },
  },
  {
    patterns: ["спонс", "sponsor", "sponsorship", "демеуш"],
    response: {
      ru: `По вопросам спонсорства можно зарегистрироваться через форму ${REGISTRATION_URL}, выбрав формат "Спонсор", или сразу связаться с организаторами: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      kk: `Демеушілік бойынша ${REGISTRATION_URL} арқылы тіркеліп, "Демеуші" форматын таңдауға немесе ұйымдастырушыларға тікелей жазуға болады: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      en: `For sponsorship, visitors can register via ${REGISTRATION_URL} by choosing "Sponsor", or contact the organizers directly at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    },
  },
  {
    patterns: ["стенд", "booth", "stand", "expo", "exhibitor", "экспон", "көрме"],
    response: {
      ru: `Если вы хотите приобрести стенд или участвовать с экспозицией, используйте форму ${REGISTRATION_URL} и выберите формат "Экспонент со стендом". Также можно обратиться напрямую: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      kk: `Егер стенд алғыңыз келсе немесе экспозициямен қатысқыңыз келсе, ${REGISTRATION_URL} арқылы тіркеліп, "Стендпен экспонент" форматын таңдаңыз. Тікелей байланыс: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      en: `If you want to book a stand or join as an exhibitor, use ${REGISTRATION_URL} and choose "Exhibitor with stand". Direct contact: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    },
  },
  {
    patterns: ["контакт", "contacts", "contact", "email", "phone", "почта", "телефон", "байланыс"],
    response: {
      ru: `Контакты Global EdTech: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      kk: `Global EdTech байланыстары: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      en: `Global EdTech contacts: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    },
  },
];

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

export const getAssistantUnavailableMessage = (locale: AILocale) =>
  ({
    ru: "Сейчас AI-ассистент временно недоступен. Попробуйте снова чуть позже или воспользуйтесь разделами сайта.",
    kk: "Қазір AI-ассистент уақытша қолжетімсіз. Сәл кейінірек қайталап көріңіз немесе сайт бөлімдерін пайдаланыңыз.",
    en: "The AI assistant is temporarily unavailable. Please try again shortly or use the website sections.",
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
