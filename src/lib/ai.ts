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

const REGISTRATION_URL = "https://globaledtech-kz.vercel.app/#register";
const CONTACT_EMAIL = "globaledtechkz@gmail.com";
const CONTACT_PHONE = "+7 (700) 033 0229";

const introMessage: Record<AILocale, string> = {
  ru: "Здравствуйте! Я официальный AI-ассистент Global EdTech. Помогу быстро разобраться с программой, регистрацией, партнерством, стендами, спонсорством и форматом участия.",
  kk: "Сәлеметсіз бе! Мен Global EdTech-тің ресми AI-ассистентімін. Бағдарлама, тіркелу, серіктестік, стенд және қатысу форматтары бойынша көмектесе аламын.",
  en: "Hello! I am the official Global EdTech AI assistant. I can help with the program, registration, partnerships, sponsorships, stands, and participation options.",
};

const fallbackMessage: Record<AILocale, string[]> = {
  ru: [
    "Могу помочь по Global EdTech с программой, регистрацией, участием, партнёрством, стендами и контактами. Напишите, что именно вас интересует.",
    "Если хотите, я подскажу по программе, формату участия, выставке, стартап-питчам или регистрации. Что для вас сейчас актуальнее?",
  ],
  kk: [
    "Global EdTech бойынша бағдарлама, тіркелу, қатысу форматы, серіктестік, стенд және байланыс туралы көмектесе аламын. Нақты не қызықтырып тұр?",
    "Қаласаңыз, бағдарлама, көрме, стартап-питчтер немесе тіркелу бойынша қысқа жауап беремін. Қайсысы маңыздырақ?",
  ],
  en: [
    "I can help with the program, registration, participation formats, partnerships, stands, and contacts. What would you like to explore first?",
    "If you want, I can quickly guide you on the agenda, expo, startup pitches, sponsorships, or registration. What matters most right now?",
  ],
};

const keywordGroups: Array<{ category: ResponseCategory; keywords: string[] }> = [
  {
    category: "program",
    keywords: ["программ", "agenda", "schedule", "program", "бағдарлам", "мастер-класс", "panel", "дискусс"],
  },
  {
    category: "speakers",
    keywords: ["спикер", "speaker", "speakers", "сарапшы"],
  },
  {
    category: "registration",
    keywords: ["регист", "register", "sign up", "тіркел", "участв", "participat"],
  },
  {
    category: "startups",
    keywords: ["стартап", "startup", "pitch", "питч"],
  },
  {
    category: "audience",
    keywords: ["кто может", "кто участвует", "для кого", "audience", "who can", "кім қатыса", "аудитория"],
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
    keywords: ["где", "where", "location", "venue", "expo", "мвц", "expo venue", "қайда"],
  },
  {
    category: "dates",
    keywords: ["когда", "дата", "дат", "when", "date", "қашан", "күні"],
  },
  {
    category: "meetings",
    keywords: ["b2b", "b2c", "b2g", "встреч", "meeting", "нетворк", "networking"],
  },
  {
    category: "contacts",
    keywords: ["контакт", "contact", "email", "phone", "почта", "телефон", "байланыс"],
  },
];

const categoryResponses: Record<ResponseCategory, Record<AILocale, string[]>> = {
  program: {
    ru: [
      "Программа будет насыщенной: панельные дискуссии, мастер-классы, выставка EdTech-компаний, B2B/B2C/B2G встречи и стартап-питчи. Если хотите, могу отдельно рассказать, что будет интересно именно студентам, компаниям или партнёрам.",
      "На Global EdTech не одна сцена, а целая экосистема активностей: дискуссии, практические мастер-классы, выставочная зона и деловые встречи. Могу коротко разложить программу по блокам.",
    ],
    kk: [
      "Бағдарлама өте мазмұнды болады: панельдік дискуссиялар, мастер-кластар, EdTech-компаниялар көрмесі, B2B/B2C/B2G кездесулері және стартап-питчтер. Қаласаңыз, оны студенттерге, компанияларға немесе серіктестерге бөлек түсіндіріп беремін.",
      "Global EdTech тек бір сахна емес, тұтас белсенді экожүйе болады: пікірталастар, практикалық мастер-кластар, көрме аймағы және іскерлік кездесулер. Қысқаша блоктарға бөліп айтып бере аламын.",
    ],
    en: [
      "The program will be quite packed: panel discussions, workshops, an EdTech company expo, B2B/B2C/B2G meetings, and startup pitch sessions. If you want, I can break it down for students, companies, or partners.",
      "Global EdTech is not just a stage program. It is a mix of discussions, practical workshops, an exhibition area, and business networking. I can also summarize the agenda by audience type.",
    ],
  },
  speakers: {
    ru: [
      "Ожидаются спикеры и эксперты из образования, технологий, EdTech и инноваций. Подтверждённый список обычно публикуется по мере обновления программы, но уже понятно, что акцент будет на практиках и лидерах рынка.",
      "Спикерский состав формируется вокруг образования будущего, технологий и инноваций. Если хотите, могу подсказать, какие именно темы обычно интересны инвесторам, вузам или EdTech-компаниям.",
    ],
    kk: [
      "Білім, технология, EdTech және инновация салаларынан спикерлер мен сарапшылар күтіледі. Нақты тізім бағдарлама жаңарған сайын жарияланады, бірақ негізгі акцент тәжірибе мен нарық көшбасшыларына жасалады.",
      "Спикерлік құрам білім болашағы, технология және инновация тақырыптарына құрылады. Қаласаңыз, инвесторларға, университеттерге немесе EdTech-компанияларға қай тақырыптар маңызды болатынын айтып беремін.",
    ],
    en: [
      "Speakers and experts are expected from education, technology, EdTech, and innovation. The confirmed lineup is usually published as the program is finalized, but the focus is clearly on practical insight and ecosystem leaders.",
      "The speaker lineup is being shaped around the future of education, technology, and innovation. If helpful, I can also tell you what topics are likely to matter most for investors, universities, or EdTech teams.",
    ],
  },
  registration: {
    ru: [
      `Зарегистрироваться можно через форму на сайте: ${REGISTRATION_URL}. Там вы выбираете формат участия: участник, спикер, партнёр, спонсор или экспонент со стендом.`,
      `Самый быстрый путь — открыть форму регистрации: ${REGISTRATION_URL}. Внутри можно сразу выбрать нужную роль и отправить заявку.`,
    ],
    kk: [
      `Тіркелу үшін сайттағы форманы ашу керек: ${REGISTRATION_URL}. Сол жерде қатысу форматын таңдауға болады: қатысушы, спикер, серіктес, демеуші немесе стендпен экспонент.`,
      `Ең жылдам жолы — тіркелу формасын ашу: ${REGISTRATION_URL}. Ішінде рөліңізді таңдап, өтінім жібере аласыз.`,
    ],
    en: [
      `You can register through the website form here: ${REGISTRATION_URL}. In the form, you can choose the right participation type: participant, speaker, partner, sponsor, or exhibitor with stand.`,
      `The quickest way is to open the registration form: ${REGISTRATION_URL}. From there, you can pick your role and submit the request right away.`,
    ],
  },
  startups: {
    ru: [
      "Да, стартап-питчи предусмотрены. Это хороший формат для команд, которые хотят показать своё решение, получить внимание аудитории и завести полезные контакты в EdTech-среде.",
      "Да, на форуме будут питч-сессии стартапов. Если вы развиваете продукт, это как раз подходящая точка для презентации, обратной связи и нетворкинга.",
    ],
    kk: [
      "Иә, стартап-питчтер болады. Бұл өз шешімін көрсетуге, аудитория назарын аударуға және EdTech ортасында пайдалы байланыстар орнатуға жақсы формат.",
      "Иә, форумда стартаптарға арналған питч-сессиялар қарастырылған. Егер өнім дамытып жүрсеңіз, бұл презентация, кері байланыс және нетворкинг үшін өте қолайлы алаң.",
    ],
    en: [
      "Yes, startup pitch sessions are part of the event. It is a strong format for teams that want visibility, feedback, and useful connections inside the EdTech ecosystem.",
      "Yes, there will be startup pitches. If you are building a product, this is a good space to present it, get reactions, and meet potential partners.",
    ],
  },
  audience: {
    ru: [
      "Аудитория очень широкая: школы, колледжи, университеты, EdTech и IT-компании, инвесторы, госструктуры, родители, студенты, школьники и предприниматели. Форум как раз задуман как точка пересечения этих групп.",
      "Участвовать могут не только образовательные организации, но и бизнес, инвесторы, родители, студенты и школьники. Если скажете, кто вы, я подскажу, зачем вам туда идти и какой формат лучше выбрать.",
    ],
    kk: [
      "Аудитория өте кең: мектептер, колледждер, университеттер, EdTech және IT-компаниялар, инвесторлар, мемлекеттік құрылымдар, ата-аналар, студенттер, оқушылар және кәсіпкерлер. Форум осы топтарды тоғыстыру үшін жасалған.",
      "Қатысу тек білім ұйымдарына ғана емес, бизнеске, инвесторларға, ата-аналарға, студенттерге және оқушыларға да ашық. Егер кім екеніңізді айтсаңыз, сізге қай формат қолайлы екенін нақтылап беремін.",
    ],
    en: [
      "The audience is intentionally broad: schools, colleges, universities, EdTech and IT companies, investors, public institutions, parents, students, school students, and entrepreneurs. The forum is designed as a meeting point for all of them.",
      "It is not limited to education institutions. Businesses, investors, parents, students, and young learners can all benefit. If you tell me who you are, I can suggest the best participation format.",
    ],
  },
  students: {
    ru: [
      "Для студентов это хороший шанс увидеть реальные EdTech-решения, попасть на мастер-классы, послушать экспертов и познакомиться с компаниями и стартапами. Если хотите, могу отдельно подсказать, на какие зоны им стоит обратить внимание в первую очередь.",
      "Студентам форум полезен не только как событие, но и как среда для контактов, идей и карьерных ориентиров. Там будут и практические активности, и выставка, и живая деловая атмосфера.",
    ],
    kk: [
      "Студенттер үшін бұл нақты EdTech-шешімдерді көруге, мастер-кластарға қатысуға, сарапшыларды тыңдауға және компаниялар мен стартаптармен танысуға жақсы мүмкіндік. Қаласаңыз, қай аймақтарға бірінші назар аудару керек екенін де айтамын.",
      "Форум студенттерге жай ғана іс-шара емес, байланыс, идея және болашақ мансап бағытын көруге мүмкіндік береді. Практикалық белсенділіктер де, көрме де, тірі іскерлік орта да болады.",
    ],
    en: [
      "For students, this is a strong chance to explore real EdTech solutions, join workshops, hear from experts, and meet companies and startups. If you want, I can point out which parts of the event will be the most useful for them.",
      "For students, the forum is not only informative but also energizing. It gives exposure to ideas, people, and possible career directions through workshops, talks, and the expo area.",
    ],
  },
  expo: {
    ru: [
      "Да, будет выставка EdTech-компаний. Это одна из ключевых частей форума: можно посмотреть решения вживую, познакомиться с командами и обсудить сотрудничество или внедрение.",
      "Да, выставочная зона предусмотрена. Если вам интересны стенды, демонстрации и прямой разговор с компаниями, это как раз одна из центральных точек события.",
    ],
    kk: [
      "Иә, EdTech-компаниялардың көрмесі болады. Бұл форумның негізгі бөліктерінің бірі: шешімдерді тірідей көріп, командалармен танысып, серіктестік немесе енгізу мүмкіндігін талқылауға болады.",
      "Иә, көрме аймағы қарастырылған. Егер сізге стендтер, демонстрациялар және компаниялармен тікелей сөйлесу қызық болса, бұл іс-шараның басты бөліктерінің бірі болады.",
    ],
    en: [
      "Yes, there will be an EdTech company exhibition. It is one of the core parts of the forum, where visitors can explore solutions live, meet teams, and discuss partnerships or adoption.",
      "Yes, the expo area is part of the experience. If you are interested in booths, live demos, and direct conversations with companies, that will be one of the main zones to visit.",
    ],
  },
  partners: {
    ru: [
      `Да, можно стать партнёром или спонсором. Обычно самый удобный путь — заполнить форму ${REGISTRATION_URL} с нужным форматом участия, а если нужен быстрый контакт, можно сразу написать на ${CONTACT_EMAIL} или позвонить по номеру ${CONTACT_PHONE}.`,
      `Партнёрство и спонсорство доступны. Если хотите обсудить это предметно, можно подать заявку через ${REGISTRATION_URL} или напрямую связаться с командой: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    ],
    kk: [
      `Иә, серіктес немесе демеуші болуға болады. Ең ыңғайлы жолы — ${REGISTRATION_URL} формасын толтыру, ал жедел байланыс керек болса, ${CONTACT_EMAIL} поштасына жазуға немесе ${CONTACT_PHONE} нөміріне хабарласуға болады.`,
      `Серіктестік пен демеушілік ашық. Нақты талқылау үшін ${REGISTRATION_URL} арқылы өтінім беруге немесе командамен тікелей байланысуға болады: ${CONTACT_EMAIL}, ${CONTACT_PHONE}.`,
    ],
    en: [
      `Yes, it is possible to join as a partner or sponsor. The easiest route is to submit the form at ${REGISTRATION_URL}, and if you want direct contact, you can also reach the team at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
      `Partnership and sponsorship options are available. You can apply through ${REGISTRATION_URL} or speak directly with the team at ${CONTACT_EMAIL} and ${CONTACT_PHONE}.`,
    ],
  },
  venue: {
    ru: [
      "Мероприятие пройдёт офлайн в МВЦ EXPO в Астане. Это большой формат с живыми встречами, выставочной зоной и деловой программой на площадке.",
      "Локация — МВЦ EXPO, Астана. То есть форум будет именно в офлайн-формате, с реальным присутствием участников, компаний и партнёров.",
    ],
    kk: [
      "Іс-шара Астанадағы EXPO халықаралық көрме орталығында офлайн өтеді. Бұл тірі кездесулерге, көрме аймағына және іскерлік бағдарламаға арналған ауқымды формат.",
      "Өтетін орны — Астана қаласындағы EXPO көрме орталығы. Яғни форум офлайн форматта, қатысушылар мен компаниялардың тікелей қатысуымен өтеді.",
    ],
    en: [
      "The event will take place offline at the EXPO International Exhibition Center in Astana. It is designed as a live forum with meetings, an exhibition area, and an in-person business program.",
      "The venue is the EXPO center in Astana. So yes, this is an offline event with on-site participation from visitors, companies, and partners.",
    ],
  },
  dates: {
    ru: [
      "Global EdTech пройдёт 7-8 февраля 2027 года.",
      "Даты форума: 7-8 февраля 2027 года.",
    ],
    kk: [
      "Global EdTech 2027 жылғы 7-8 ақпанда өтеді.",
      "Форум күндері: 2027 жылғы 7-8 ақпан.",
    ],
    en: [
      "Global EdTech will take place on February 7-8, 2027.",
      "The forum dates are February 7-8, 2027.",
    ],
  },
  meetings: {
    ru: [
      "Да, в рамках форума запланированы B2B, B2C и B2G встречи. Это важная часть события для компаний, партнёров, инвесторов и образовательных организаций.",
      "Да, деловые встречи предусмотрены. Форум как раз создаёт среду для общения бизнеса, образовательных учреждений, инвесторов и государственных структур.",
    ],
    kk: [
      "Иә, форум аясында B2B, B2C және B2G кездесулері жоспарланған. Бұл компаниялар, серіктестер, инвесторлар және білім ұйымдары үшін өте маңызды бөлік.",
      "Иә, іскерлік кездесулер болады. Форум бизнес, білім ұйымдары, инвесторлар және мемлекеттік құрылымдар арасындағы диалог алаңы ретінде құрылған.",
    ],
    en: [
      "Yes, B2B, B2C, and B2G meetings are part of the forum. That is one of the key reasons the event is valuable for companies, partners, investors, and education institutions.",
      "Yes, business meetings are planned. The forum is built to connect business, education, investors, and public-sector stakeholders in one place.",
    ],
  },
  contacts: {
    ru: [
      `Контакты организаторов: ${CONTACT_EMAIL}, ${CONTACT_PHONE}. Если нужно, могу ещё подсказать, когда лучше писать по поводу партнёрства, стенда или регистрации.`,
      `Связаться с командой можно по email ${CONTACT_EMAIL} или по телефону ${CONTACT_PHONE}. Если скажете цель, я подскажу, какой запрос лучше отправить.`,
    ],
    kk: [
      `Ұйымдастырушылардың байланысы: ${CONTACT_EMAIL}, ${CONTACT_PHONE}. Қаласаңыз, серіктестік, стенд немесе тіркелу бойынша қалай дұрыс жазу керегін де айтып беремін.`,
      `Командамен ${CONTACT_EMAIL} поштасы немесе ${CONTACT_PHONE} телефоны арқылы байланысуға болады. Мақсатыңызды айтсаңыз, қандай өтініш жолдау тиімді екенін ұсынамын.`,
    ],
    en: [
      `You can reach the organizers at ${CONTACT_EMAIL} or ${CONTACT_PHONE}. If you want, I can also suggest the best way to frame a request about partnerships, stands, or registration.`,
      `The team can be contacted at ${CONTACT_EMAIL} and ${CONTACT_PHONE}. If you tell me your goal, I can help you phrase the right request.`,
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
    ru: "Сейчас AI-ассистент временно недоступен. Попробуйте чуть позже или воспользуйтесь разделами сайта.",
    kk: "Қазір AI-ассистент уақытша қолжетімсіз. Сәл кейінірек қайталап көріңіз немесе сайт бөлімдерін пайдаланыңыз.",
    en: "The AI assistant is temporarily unavailable. Please try again shortly or use the website sections.",
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
