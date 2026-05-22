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

type ResponseCategory =
  | "program"
  | "speakers"
  | "registration"
  | "startups"
  | "audience"
  | "students"
  | "expo"
  | "partners"
  | "venue"
  | "dates"
  | "meetings"
  | "contacts"
  | "fallback";

const CONTACT_EMAIL = "globaledtechkz@gmail.com";
const CONTACT_PHONE = "+7 (700) 033 0229";

const introMessage: Record<AILocale, string> = {
  ru: "Здравствуйте. Я AI-ассистент Global EdTech. Могу коротко помочь по программе, участию и контактам.",
  kk: "Сәлеметсіз бе. Мен Global EdTech AI-ассистентімін. Бағдарлама, қатысу және байланыс бойынша қысқа жауап бере аламын.",
  en: "Hello. I am the Global EdTech AI assistant. I can help briefly with the program, participation, and contacts.",
};

const fallbackMessage: Record<AILocale, string[]> = {
  ru: [
    "Уточните, что именно вас интересует: программа, участие, стенд, партнерство или контакты.",
    "Могу коротко ответить по программе, участию, стенду, партнерству или контактам.",
  ],
  kk: [
    "Нақты не қызықтыратынын жазыңыз: бағдарлама, қатысу, стенд, серіктестік немесе байланыс.",
    "Бағдарлама, қатысу, стенд, серіктестік немесе байланыс бойынша қысқа жауап бере аламын.",
  ],
  en: [
    "Please уточните the topic: program, participation, stand, partnership, or contacts.",
    "I can answer briefly about the program, participation, stands, partnerships, or contacts.",
  ],
};

const keywordGroups: Array<{ category: ResponseCategory; keywords: string[] }> = [
  {
    category: "program",
    keywords: ["программ", "agenda", "schedule", "program", "бағдарлам", "panel", "дискусс"],
  },
  {
    category: "speakers",
    keywords: ["спикер", "speaker", "speakers", "сарапшы"],
  },
  {
    category: "registration",
    keywords: ["регистр", "register", "sign up", "тіркел", "участв", "participat"],
  },
  {
    category: "startups",
    keywords: ["стартап", "startup", "pitch", "питч"],
  },
  {
    category: "audience",
    keywords: ["кто может", "для кого", "audience", "who can", "аудитория", "кім қатыса"],
  },
  {
    category: "students",
    keywords: ["студент", "student", "school", "школьник", "оқушы"],
  },
  {
    category: "expo",
    keywords: ["выставк", "expo", "exhibition", "стенд", "booth", "көрме", "exhibitor"],
  },
  {
    category: "partners",
    keywords: ["партнер", "partner", "sponsor", "спонс", "демеуш", "серіктес"],
  },
  {
    category: "venue",
    keywords: ["где", "where", "location", "venue", "мвц", "expo venue", "қайда"],
  },
  {
    category: "dates",
    keywords: ["когда", "дата", "дат", "when", "date", "қашан", "күні"],
  },
  {
    category: "meetings",
    keywords: ["b2b", "b2c", "b2g", "встреч", "meeting", "networking"],
  },
  {
    category: "contacts",
    keywords: ["контакт", "contact", "email", "phone", "почта", "телефон", "байланыс"],
  },
];

const categoryResponses: Record<ResponseCategory, Record<AILocale, string[]>> = {
  program: {
    ru: [
      "Сейчас заявлены деловая программа, выставочная зона и B2B/B2C/B2G-встречи. Детали программы еще обновляются.",
      "На данный момент подтверждены деловая программа, выставочная часть и деловые встречи. Подробное расписание еще готовится.",
    ],
    kk: [
      "Қазір іскерлік бағдарлама, көрме аймағы және B2B/B2C/B2G кездесулері жарияланған. Толық бағдарлама әлі жаңарып жатыр.",
      "Әзірге іскерлік бағдарлама, көрме бөлігі және іскерлік кездесулер расталған. Толық кесте кейінірек жарияланады.",
    ],
    en: [
      "At the moment, the confirmed format includes a business program, an expo area, and B2B/B2C/B2G meetings. Detailed scheduling is still being updated.",
      "The confirmed format currently includes the business program, the expo area, and business meetings. The detailed agenda is still in progress.",
    ],
  },
  speakers: {
    ru: [
      "Подтвержденный список спикеров пока не объявлен.",
      "Список спикеров еще формируется и пока не опубликован.",
    ],
    kk: [
      "Расталған спикерлер тізімі әзірге жарияланған жоқ.",
      "Спикерлер тізімі әлі қалыптасып жатыр.",
    ],
    en: [
      "The confirmed speaker lineup has not been announced yet.",
      "The speaker list is still being finalized and has not been published yet.",
    ],
  },
  registration: {
    ru: [
      "Для участия можно выбрать формат: участник, партнер, спонсор или экспонент со стендом.",
      "Участие доступно в нескольких форматах: участник, партнер, спонсор или экспонент со стендом.",
    ],
    kk: [
      "Қатысу үшін бірнеше формат бар: қатысушы, серіктес, демеуші немесе стенді бар экспонент.",
      "Қатысу форматын таңдауға болады: қатысушы, серіктес, демеуші немесе стенді бар экспонент.",
    ],
    en: [
      "There are several participation formats: participant, partner, sponsor, or exhibitor with a stand.",
      "You can join in different formats: participant, partner, sponsor, or exhibitor with a stand.",
    ],
  },
  startups: {
    ru: [
      "Стартап-питчи заявлены в формате мероприятия. Детали еще обновляются.",
      "Питч-сессии предусмотрены, но подробности пока не опубликованы.",
    ],
    kk: [
      "Стартап-питчтер форматта бар. Толық мәлімет кейінірек жарияланады.",
      "Питч-сессиялар қарастырылған, бірақ егжей-тегжейі әлі жоқ.",
    ],
    en: [
      "Startup pitch sessions are included in the event format. Details are still being updated.",
      "Pitch sessions are planned, but detailed information has not been published yet.",
    ],
  },
  audience: {
    ru: [
      "Форум ориентирован на образовательные организации, EdTech и IT-компании, студентов, родителей и предпринимателей.",
      "Среди целевой аудитории - образовательные организации, компании, студенты, родители и предприниматели.",
    ],
    kk: [
      "Форум білім беру ұйымдарына, EdTech және IT-компанияларға, студенттерге, ата-аналарға және кәсіпкерлерге арналған.",
      "Негізгі аудитория - білім беру ұйымдары, компаниялар, студенттер, ата-аналар және кәсіпкерлер.",
    ],
    en: [
      "The forum is aimed at education organizations, EdTech and IT companies, students, parents, and entrepreneurs.",
      "The target audience includes education organizations, companies, students, parents, and entrepreneurs.",
    ],
  },
  students: {
    ru: [
      "Для студентов участие возможно. Подробная отдельная программа для студентов пока не объявлена.",
      "Студенты могут участвовать в форуме. Дополнительные детали для этой аудитории еще не опубликованы.",
    ],
    kk: [
      "Студенттер қатыса алады. Студенттерге арналған жеке толық бағдарлама әзірге жарияланған жоқ.",
      "Студенттердің қатысуы мүмкін. Қосымша мәлімет кейінірек жарияланады.",
    ],
    en: [
      "Students can participate. A separate detailed student program has not been announced yet.",
      "Student participation is possible. More details for this audience are still pending.",
    ],
  },
  expo: {
    ru: [
      "Стенд можно обсудить с командой форума по контактам организаторов.",
      "Участие со стендом доступно в формате экспонента. Для деталей лучше связаться с организаторами.",
    ],
    kk: [
      "Стенд бойынша қатысуды ұйымдастырушылармен байланысып талқылауға болады.",
      "Стендпен қатысу экспонент форматы арқылы мүмкін. Толық мәлімет үшін ұйымдастырушыларға жазыңыз.",
    ],
    en: [
      "Stand participation can be discussed directly with the organizing team.",
      "Joining with a stand is available through the exhibitor format. For details, contact the organizers.",
    ],
  },
  partners: {
    ru: [
      `Партнерство можно обсудить напрямую с организаторами: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `По вопросам партнерства и спонсорства лучше написать или позвонить организаторам: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    ],
    kk: [
      `Серіктестік бойынша ұйымдастырушылармен тікелей байланысуға болады: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `Серіктестік және демеушілік мәселелері бойынша ұйымдастырушыларға жазыңыз немесе қоңырау шалыңыз: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    ],
    en: [
      `Partnership questions can be discussed directly with the organizers: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `For partnership or sponsorship, please contact the organizers directly: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    ],
  },
  venue: {
    ru: [
      "Форум пройдет офлайн в МВЦ EXPO, Астана.",
      "Локация форума - МВЦ EXPO, Астана.",
    ],
    kk: [
      "Форум офлайн түрде EXPO, Астанада өтеді.",
      "Өтетін орны - EXPO, Астана.",
    ],
    en: [
      "The forum will take place offline at EXPO in Astana.",
      "The venue is EXPO, Astana.",
    ],
  },
  dates: {
    ru: [
      "Даты форума: 7-8 февраля 2027 года.",
      "Global EdTech пройдет 7-8 февраля 2027 года.",
    ],
    kk: [
      "Форум күндері: 2027 жылғы 7-8 ақпан.",
      "Global EdTech 2027 жылғы 7-8 ақпанда өтеді.",
    ],
    en: [
      "The forum dates are February 7-8, 2027.",
      "Global EdTech will take place on February 7-8, 2027.",
    ],
  },
  meetings: {
    ru: [
      "B2B, B2C и B2G-встречи заявлены в формате форума.",
      "Деловые встречи предусмотрены. Подробный порядок еще уточняется.",
    ],
    kk: [
      "B2B, B2C және B2G кездесулері форум форматында бар.",
      "Іскерлік кездесулер қарастырылған. Толық тәртібі кейінірек нақтыланады.",
    ],
    en: [
      "B2B, B2C, and B2G meetings are included in the forum format.",
      "Business meetings are planned. The detailed process is still being clarified.",
    ],
  },
  contacts: {
    ru: [
      `Контакты организаторов: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `Связаться с организаторами можно по email ${CONTACT_EMAIL} или по телефону ${CONTACT_PHONE}.`,
    ],
    kk: [
      `Ұйымдастырушылардың байланысы: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `Ұйымдастырушылармен ${CONTACT_EMAIL} немесе ${CONTACT_PHONE} арқылы байланысуға болады.`,
    ],
    en: [
      `Organizer contacts: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
      `You can contact the organizers via ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    ],
  },
  fallback: fallbackMessage,
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function detectCategory(input: string): ResponseCategory {
  const normalizedInput = normalizeText(input);

  const matched = keywordGroups.find(({ keywords }) =>
    keywords.some((keyword) => normalizedInput.includes(normalizeText(keyword))),
  );

  return matched?.category || "fallback";
}

function chooseVariant(locale: AILocale, category: ResponseCategory, seedSource: string) {
  const variants = categoryResponses[category][locale];
  const seed = Array.from(seedSource).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return variants[seed % variants.length];
}

export const createAssistantGreeting = (locale: AILocale): AIMessage => ({
  id: `assistant-greeting-${locale}`,
  role: "assistant",
  content: introMessage[locale],
  createdAt: Date.now(),
});

export const getAssistantUnavailableMessage = (locale: AILocale) =>
  ({
    ru: "Сейчас AI-ассистент временно недоступен. Попробуйте позже.",
    kk: "Қазір AI-ассистент уақытша қолжетімсіз. Кейінірек қайталап көріңіз.",
    en: "The AI assistant is temporarily unavailable. Please try again later.",
  })[locale];

export const getAIResponse = (
  input: string,
  locale: AILocale,
  history: Array<Pick<AIMessage, "role" | "content">> = [],
): string => {
  const category = detectCategory(input);
  const lastUserMessage =
    [...history].reverse().find((message) => message.role === "user" && message.content)?.content || "";

  return chooseVariant(locale, category, `${input}::${lastUserMessage}`);
};
