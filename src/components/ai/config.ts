import type { AILocale } from "../../lib/ai";

export type AssistantQuickPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export type GuideSectionHint = {
  id: string;
  sectionId: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  prompt: string;
};

type AssistantUiCopy = {
  title: string;
  subtitle: string;
  status: string;
  placeholder: string;
  send: string;
  close: string;
  quickPrompts: string;
  thinkingLabel: string;
  chipsHint: string;
  typingPhrases: string[];
  welcomeHint: string;
  fabTitle: string;
  fabSubtitle: string;
  guideLabel: string;
  guideAction: string;
  guideBrowse: string;
  clearChat: string;
};

export const assistantUiCopy: Record<AILocale, AssistantUiCopy> = {
  ru: {
    title: "AI-ассистент",
    subtitle: "Живой гид по Global EdTech",
    status: "Online",
    placeholder: "Спросите про программу, регистрацию, партнерство, стенды или B2B встречи...",
    send: "Отправить",
    close: "Закрыть чат",
    quickPrompts: "Быстрые запросы",
    thinkingLabel: "Ассистент думает",
    chipsHint: "Можно нажать на тему и сразу получить короткий ответ",
    typingPhrases: [
      "Секунду, собираю главное...",
      "Подбираю самый полезный ответ...",
      "Смотрю, что для вас сейчас важнее всего...",
      "Сейчас отвечу коротко и по делу...",
    ],
    welcomeHint:
      "Могу быстро помочь с регистрацией, программой, спикерами, выставкой, B2B-встречами, партнерством и стендами.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Спросить о форуме",
    guideLabel: "AI Guide",
    guideAction: "Открыть чат",
    guideBrowse: "К разделу",
    clearChat: "Новый диалог",
  },
  kk: {
    title: "AI-ассистент",
    subtitle: "Global EdTech бойынша тірі гид",
    status: "Online",
    placeholder: "Бағдарлама, тіркелу, серіктестік, стендтер немесе B2B кездесулер туралы сұраңыз...",
    send: "Жіберу",
    close: "Чатты жабу",
    quickPrompts: "Жылдам сұраулар",
    thinkingLabel: "Ассистент ойланып жатыр",
    chipsHint: "Тақырыпты басып, бірден қысқа жауап алуға болады",
    typingPhrases: [
      "Бір сәт, негізгісін жинап жатырмын...",
      "Сізге ең пайдалы жауапты дайындап жатырмын...",
      "Қазір не маңызды екенін қарап жатырмын...",
      "Қысқа әрі түсінікті жауап беремін...",
    ],
    welcomeHint:
      "Тіркелу, бағдарлама, спикерлер, көрме, B2B кездесулер, серіктестік және стендтер бойынша көмектесе аламын.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Форум туралы сұрау",
    guideLabel: "AI Guide",
    guideAction: "Чатты ашу",
    guideBrowse: "Бөлімге өту",
    clearChat: "Жаңа диалог",
  },
  en: {
    title: "AI Assistant",
    subtitle: "Your Global EdTech event guide",
    status: "Online",
    placeholder: "Ask about the program, registration, speakers, expo, stands, or B2B meetings...",
    send: "Send",
    close: "Close chat",
    quickPrompts: "Quick prompts",
    thinkingLabel: "Assistant is thinking",
    chipsHint: "Tap a topic to get a quick answer",
    typingPhrases: [
      "Give me a second, pulling together the useful part...",
      "Thinking through the clearest answer...",
      "Checking what matters most for your case...",
      "Putting together a concise reply...",
    ],
    welcomeHint:
      "I can help with registration, program details, speakers, expo, B2B meetings, partnerships, and stand bookings.",
    fabTitle: "AI Assistant",
    fabSubtitle: "Ask about the forum",
    guideLabel: "AI Guide",
    guideAction: "Open chat",
    guideBrowse: "View section",
    clearChat: "New chat",
  },
};

export const assistantQuickPrompts: Record<AILocale, AssistantQuickPrompt[]> = {
  ru: [
    { id: "registration", label: "Регистрация", prompt: "Как зарегистрироваться на Global EdTech?" },
    { id: "program", label: "Программа", prompt: "Расскажи о программе мероприятия" },
    { id: "speakers", label: "Спикеры", prompt: "Какие спикеры ожидаются?" },
    { id: "students", label: "Для студентов", prompt: "Что будет для студентов на Global EdTech?" },
    { id: "stands", label: "Купить стенд", prompt: "Как купить стенд на выставке?" },
    { id: "partners", label: "Стать партнером", prompt: "Как стать партнером Global EdTech?" },
    { id: "meetings", label: "B2B встречи", prompt: "Будут ли B2B, B2C и B2G встречи?" },
    { id: "faq", label: "FAQ", prompt: "Дай короткий FAQ по Global EdTech" },
    { id: "contacts", label: "Контакты", prompt: "Какие контакты у организаторов?" },
  ],
  kk: [
    { id: "registration", label: "Тіркелу", prompt: "Global EdTech-ке қалай тіркелуге болады?" },
    { id: "program", label: "Бағдарлама", prompt: "Іс-шара бағдарламасы туралы айтып бер" },
    { id: "speakers", label: "Спикерлер", prompt: "Қандай спикерлер күтіледі?" },
    { id: "students", label: "Студенттерге", prompt: "Global EdTech-те студенттер үшін не болады?" },
    { id: "stands", label: "Стенд алу", prompt: "Көрмеден стендті қалай алуға болады?" },
    { id: "partners", label: "Серіктес болу", prompt: "Global EdTech серіктесі қалай болуға болады?" },
    { id: "meetings", label: "B2B кездесулер", prompt: "B2B, B2C және B2G кездесулері бола ма?" },
    { id: "faq", label: "FAQ", prompt: "Global EdTech бойынша қысқа FAQ бер" },
    { id: "contacts", label: "Байланыс", prompt: "Ұйымдастырушылардың байланыс деректерін бер" },
  ],
  en: [
    { id: "registration", label: "Registration", prompt: "How do I register for Global EdTech?" },
    { id: "program", label: "Program", prompt: "Tell me about the event program" },
    { id: "speakers", label: "Speakers", prompt: "What speakers are expected?" },
    { id: "students", label: "For students", prompt: "What will Global EdTech offer for students?" },
    { id: "stands", label: "Buy a stand", prompt: "How can I book an exhibition stand?" },
    { id: "partners", label: "Become a partner", prompt: "How can we become a Global EdTech partner?" },
    { id: "meetings", label: "B2B meetings", prompt: "Will there be B2B, B2C, and B2G meetings?" },
    { id: "faq", label: "FAQ", prompt: "Give me a short FAQ about Global EdTech" },
    { id: "contacts", label: "Contacts", prompt: "What are the organizer contacts?" },
  ],
};

export const guideSectionHints: Record<AILocale, GuideSectionHint[]> = {
  ru: [
    {
      id: "program",
      sectionId: "program",
      eyebrow: "Секция программы",
      title: "Здесь собрана деловая программа форума",
      description: "Если хотите, я быстро расскажу, что будет по дискуссиям, мастер-классам и B2B-встречам.",
      ctaLabel: "Спросить про программу",
      prompt: "Расскажи кратко о программе Global EdTech",
    },
    {
      id: "register",
      sectionId: "register",
      eyebrow: "Регистрация",
      title: "Можно сразу подобрать формат участия",
      description: "Подскажу, чем отличаются участник, партнер, спонсор и экспонент со стендом.",
      ctaLabel: "Помочь с регистрацией",
      prompt: "Помоги выбрать формат участия и регистрацию",
    },
    {
      id: "benefits",
      sectionId: "benefits",
      eyebrow: "Партнерство",
      title: "Это хорошее место для разговоров о стендах и партнерстве",
      description: "Могу коротко объяснить, что дает участие компаниям, партнерам и инвесторам.",
      ctaLabel: "Узнать про партнерство",
      prompt: "Какие возможности есть для партнеров, спонсоров и стендов?",
    },
    {
      id: "contacts",
      sectionId: "contacts",
      eyebrow: "FAQ и контакты",
      title: "Если остались вопросы, я помогу сориентироваться",
      description: "Можно быстро уточнить контакты организаторов, место проведения и базовый FAQ.",
      ctaLabel: "Открыть FAQ",
      prompt: "Дай короткий FAQ и контакты по Global EdTech",
    },
  ],
  kk: [
    {
      id: "program",
      sectionId: "program",
      eyebrow: "Бағдарлама бөлімі",
      title: "Мұнда форумның негізгі бағдарламасы жиналған",
      description: "Қаласаңыз, панельдер, мастер-кластар және B2B кездесулер туралы қысқаша айтып беремін.",
      ctaLabel: "Бағдарламаны сұрау",
      prompt: "Global EdTech бағдарламасын қысқаша түсіндір",
    },
    {
      id: "register",
      sectionId: "register",
      eyebrow: "Тіркелу",
      title: "Қатысу форматын бірден таңдауға болады",
      description: "Қатысушы, серіктес, демеуші немесе стендпен экспонент айырмасын түсіндіріп беремін.",
      ctaLabel: "Тіркелуге көмектесу",
      prompt: "Қатысу форматын таңдауға және тіркелуге көмектес",
    },
    {
      id: "benefits",
      sectionId: "benefits",
      eyebrow: "Серіктестік",
      title: "Бұл жер серіктестік пен стендтерді талқылауға ыңғайлы",
      description: "Компаниялар, серіктестер және инвесторлар үшін қандай мүмкіндік бар екенін қысқаша айтамын.",
      ctaLabel: "Серіктестік туралы",
      prompt: "Серіктестерге, демеушілерге және стендтерге қандай мүмкіндік бар?",
    },
    {
      id: "contacts",
      sectionId: "contacts",
      eyebrow: "FAQ және байланыс",
      title: "Сұрақ қалса, тез бағдар бере аламын",
      description: "Ұйымдастырушылар байланысы, өткізу орны және қысқа FAQ бойынша көмектесемін.",
      ctaLabel: "FAQ ашу",
      prompt: "Global EdTech бойынша қысқа FAQ және байланыс бер",
    },
  ],
  en: [
    {
      id: "program",
      sectionId: "program",
      eyebrow: "Program section",
      title: "This is where the forum agenda comes together",
      description: "I can quickly break down the talks, workshops, expo flow, and B2B meeting format.",
      ctaLabel: "Ask about the program",
      prompt: "Give me a short overview of the Global EdTech program",
    },
    {
      id: "register",
      sectionId: "register",
      eyebrow: "Registration",
      title: "You can choose the right participation format here",
      description: "I can help compare participant, partner, sponsor, and exhibitor options before you register.",
      ctaLabel: "Help me register",
      prompt: "Help me choose the best participation format and registration path",
    },
    {
      id: "benefits",
      sectionId: "benefits",
      eyebrow: "Partnership",
      title: "A good place to explore stands and partnership value",
      description: "I can summarize what companies, investors, and sponsors can get from joining the forum.",
      ctaLabel: "Explore partnership",
      prompt: "What opportunities are there for partners, sponsors, and stand bookings?",
    },
    {
      id: "contacts",
      sectionId: "contacts",
      eyebrow: "FAQ and contacts",
      title: "If you still have questions, I can point you fast",
      description: "Ask me for the organizer contacts, venue details, or a quick event FAQ.",
      ctaLabel: "Open FAQ",
      prompt: "Give me a short FAQ and the organizer contacts for Global EdTech",
    },
  ],
};
