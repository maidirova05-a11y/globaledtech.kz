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
  ru: `Здравствуйте! Я цифровой ассистент Global EdTech. Помогу с информацией о форуме, регистрацией, спонсорством, стендом и контактами. Регистрация: ${REGISTRATION_URL}`,
  kk: `Сәлеметсіз бе! Мен Global EdTech цифрлық ассистентімін. Форум, тіркелу, демеушілік, стенд және байланыс туралы көмектесемін. Тіркелу: ${REGISTRATION_URL}`,
  en: `Hello! I am the Global EdTech digital assistant. I can help with event details, registration, sponsorship, stands, and contacts. Registration: ${REGISTRATION_URL}`,
};

const fallbackMessage: Record<AILocale, string> = {
  ru: `Я могу помочь с форумом Global EdTech, регистрацией, ролями участия, спонсорством, стендом и контактами. Регистрация: ${REGISTRATION_URL}. Контакты: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
  kk: `Мен Global EdTech форумы, тіркелу, қатысу форматтары, демеушілік, стенд және байланыс бойынша көмектесе аламын. Тіркелу: ${REGISTRATION_URL}. Байланыс: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
  en: `I can help with Global EdTech, registration, participation roles, sponsorship, stands, and contacts. Registration: ${REGISTRATION_URL}. Contacts: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
};

const responseRules: ResponseRule[] = [
  {
    patterns: ["global edtech", "о форуме", "about the event", "about global edtech", "форум туралы"],
    response: {
      ru: "Global EdTech — международный выставочно-образовательный форум в Астане, который объединяет EdTech-компании, школы, университеты, стартапы и экспертов вокруг будущего образования.",
      kk: "Global EdTech — Астанада өтетін халықаралық көрме-білім беру форумы. Ол EdTech-компанияларды, мектептерді, университеттерді, стартаптарды және сарапшыларды біріктіреді.",
      en: "Global EdTech is an international exhibition and educational forum in Astana that brings together EdTech companies, schools, universities, startups, and experts.",
    },
  },
  {
    patterns: ["регистрац", "register", "sign up", "тіркел", "join", "participate"],
    response: {
      ru: `Для участия откройте форму регистрации: ${REGISTRATION_URL}. В форме можно выбрать формат участия: участник, спикер, партнер, спонсор или экспонент со стендом.`,
      kk: `Қатысу үшін тіркелу формасын ашыңыз: ${REGISTRATION_URL}. Формада қатысу түрін таңдауға болады: қатысушы, спикер, серіктес, демеуші немесе стендпен экспонент.`,
      en: `To participate, open the registration form: ${REGISTRATION_URL}. In the form, visitors can choose participant, speaker, partner, sponsor, or exhibitor with stand.`,
    },
  },
  {
    patterns: ["спонс", "sponsor", "sponsorship", "демеуш", "партнерство"],
    response: {
      ru: `По вопросам спонсорства можно зарегистрироваться как спонсор через форму ${REGISTRATION_URL} или сразу связаться с организаторами: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      kk: `Демеушілік бойынша ${REGISTRATION_URL} сілтемесі арқылы 'Демеуші' ретінде тіркелуге немесе ұйымдастырушыларға тікелей жазуға болады: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      en: `For sponsorship, visitors can register as a sponsor via ${REGISTRATION_URL} or contact the organizers directly at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    },
  },
  {
    patterns: ["стенд", "stand", "booth", "expo", "exhibitor", "экспон", "көрме орны"],
    response: {
      ru: `Если вы хотите приобрести стенд или участвовать с экспозицией, используйте форму ${REGISTRATION_URL} и выберите формат 'Экспонент со стендом'. Также можно обратиться напрямую: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      kk: `Егер стенд алғыңыз келсе немесе экспозициямен қатысқыңыз келсе, ${REGISTRATION_URL} арқылы тіркеліп, 'Стендпен экспонент' форматын таңдаңыз. Тікелей байланыс: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      en: `If you want to book a stand or join as an exhibitor, use ${REGISTRATION_URL} and choose 'Exhibitor with stand'. Direct contact: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    },
  },
  {
    patterns: ["speaker", "speakers", "спикер", "спикеры", "сарапшы"],
    response: {
      ru: "На форуме ожидаются спикеры и эксперты из сфер образования, технологий, инноваций и EdTech. Подтвержденный список публикуется по мере обновления программы.",
      kk: "Форумда білім, технология, инновация және EdTech салаларынан спикерлер мен сарапшылар болады. Нақты тізім бағдарлама жаңарған сайын жарияланады.",
      en: "The forum features speakers and experts from education, technology, innovation, and EdTech. The confirmed list is published as the program is updated.",
    },
  },
  {
    patterns: ["программ", "agenda", "schedule", "бағдарлама"],
    response: {
      ru: "Программа включает выступления спикеров, панельные дискуссии, выставочную зону, технологические демонстрации, партнерские встречи и networking.",
      kk: "Бағдарламада спикерлер баяндамалары, панельдік сессиялар, көрме аймағы, технологиялық демонстрациялар, серіктестік кездесулер және networking бар.",
      en: "The program includes speaker sessions, panel discussions, an exhibition area, technology showcases, partnership meetings, and networking.",
    },
  },
  {
    patterns: ["где", "where", "location", "астана", "қайда"],
    response: {
      ru: "Форум пройдет в Астане, Казахстан, 7-8 февраля 2027 года.",
      kk: "Форум Астана, Қазақстанда 2027 жылғы 7-8 ақпанда өтеді.",
      en: "The forum will take place in Astana, Kazakhstan, on February 7-8, 2027.",
    },
  },
  {
    patterns: ["контакт", "contact", "email", "phone", "почта", "телефон", "байланыс"],
    response: {
      ru: `Контакты Global EdTech: ${CONTACT_EMAIL}, ${CONTACT_PHONE}. Регистрация: ${REGISTRATION_URL}.`,
      kk: `Global EdTech байланыстары: ${CONTACT_EMAIL}, ${CONTACT_PHONE}. Тіркелу: ${REGISTRATION_URL}.`,
      en: `Global EdTech contacts: ${CONTACT_EMAIL}, ${CONTACT_PHONE}. Registration: ${REGISTRATION_URL}.`,
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
