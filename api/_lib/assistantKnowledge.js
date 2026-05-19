export const supportedLocales = ["ru", "kk", "en"];

export function resolveLocale(locale) {
  return supportedLocales.includes(locale) ? locale : "ru";
}

const forumKnowledge = {
  ru: {
    forumName: "Global EdTech",
    eventType: "международный выставочный образовательный форум",
    city: "Астана",
    country: "Казахстан",
    dates: "7–8 февраля 2027 года",
    about:
      "Global EdTech объединяет EdTech-компании, школы, университеты, экспертов, стартапы и технологических партнеров вокруг будущего образования.",
    registration:
      "Для участия нужно открыть раздел «Регистрация» на сайте и заполнить форму. После отправки заявки команда форума сможет связаться с участником при необходимости.",
    program:
      "Программа включает выступления спикеров, панельные дискуссии, выставочную часть, технологические зоны, партнерские встречи, интерактивные экспозиции и networking.",
    programHighlights: [
      "09:00 — выступления спикеров и панельные дискуссии",
      "10:30 — ярмарка образовательных организаций",
      "12:00 — зоны технологий и стартапов",
      "14:00 — интерактивные экспозиции",
      "15:30 — подписание меморандумов",
      "17:00 — networking и обмен идеями",
    ],
    speakers:
      "На форуме ожидаются спикеры и эксперты из сфер образования, технологий, инноваций и EdTech. Подтвержденный список публикуется по мере обновления программы.",
    partners:
      "Форум развивается вместе с образовательными организациями, EdTech-компаниями, технологическими командами и стратегическими партнерами экосистемы.",
    partnerHighlights: ["AZ Group", "AstanaTechCup", "BilimTalks", "ITECx"],
    contacts: {
      email: "globaledtechkz@gmail.com",
      phone: "+7 (700) 033 0229",
    },
    audience:
      "Аудитория форума: школы, университеты, образовательные центры, EdTech-компании, государственные структуры, инвесторы, ученики, студенты, преподаватели и технологические команды.",
    heroStats: ["3 внутренних мероприятия", "150+ спикеров и экспертов", "2 дня программы", "1 единая EdTech-экосистема"],
  },
  kk: {
    forumName: "Global EdTech",
    eventType: "халықаралық көрме-білім беру форумы",
    city: "Астана",
    country: "Қазақстан",
    dates: "2027 жылғы 7–8 ақпан",
    about:
      "Global EdTech EdTech-компанияларды, мектептерді, университеттерді, сарапшыларды, стартаптарды және технологиялық серіктестерді білімнің болашағы төңірегінде біріктіреді.",
    registration:
      "Қатысу үшін сайттағы «Тіркелу» бөліміне өтіп, форманы толтыру қажет. Өтінім жіберілгеннен кейін қажет болса, форум командасы қатысушымен байланысады.",
    program:
      "Бағдарламаға спикерлер баяндамалары, панельдік сессиялар, көрме бөлігі, технологиялық аймақтар, серіктестік кездесулер, интерактивті экспозициялар және networking кіреді.",
    programHighlights: [
      "09:00 — спикерлер баяндамалары және панельдік сессиялар",
      "10:30 — білім беру ұйымдарының жәрмеңкесі",
      "12:00 — технологиялар мен стартаптар аймағы",
      "14:00 — интерактивті экспозициялар",
      "15:30 — меморандумдарға қол қою",
      "17:00 — networking және идея алмасу",
    ],
    speakers:
      "Форумда білім, технология, инновация және EdTech салаларынан спикерлер мен сарапшылар қатысады. Нақты тізім бағдарлама жаңарған сайын жарияланады.",
    partners:
      "Форум білім беру ұйымдарымен, EdTech-компаниялармен, технологиялық командалармен және экожүйенің стратегиялық серіктестерімен бірге дамиды.",
    partnerHighlights: ["AZ Group", "AstanaTechCup", "BilimTalks", "ITECx"],
    contacts: {
      email: "globaledtechkz@gmail.com",
      phone: "+7 (700) 033 0229",
    },
    audience:
      "Форум аудиториясы: мектептер, университеттер, білім беру орталықтары, EdTech-компаниялар, мемлекеттік құрылымдар, инвесторлар, оқушылар, студенттер, мұғалімдер және технологиялық командалар.",
    heroStats: ["3 ішкі іс-шара", "150+ спикер мен сарапшы", "2 күндік бағдарлама", "1 бірыңғай EdTech-экожүйе"],
  },
  en: {
    forumName: "Global EdTech",
    eventType: "international exhibition and educational forum",
    city: "Astana",
    country: "Kazakhstan",
    dates: "February 7–8, 2027",
    about:
      "Global EdTech brings together EdTech companies, schools, universities, experts, startups, and technology partners around the future of education.",
    registration:
      "To participate, visitors should open the Registration section on the website and submit the form. After submission, the forum team may contact the participant if needed.",
    program:
      "The program includes speaker sessions, panel discussions, an exhibition area, technology zones, partnership meetings, interactive showcases, and networking.",
    programHighlights: [
      "09:00 — speaker sessions and panel discussions",
      "10:30 — education organization fair",
      "12:00 — technology and startup zones",
      "14:00 — interactive showcases",
      "15:30 — memorandum signing",
      "17:00 — networking and idea exchange",
    ],
    speakers:
      "The forum features speakers and experts from education, technology, innovation, and EdTech. The confirmed list is published as the program is updated.",
    partners:
      "The forum is developed together with educational organizations, EdTech companies, technology teams, and strategic ecosystem partners.",
    partnerHighlights: ["AZ Group", "AstanaTechCup", "BilimTalks", "ITECx"],
    contacts: {
      email: "globaledtechkz@gmail.com",
      phone: "+7 (700) 033 0229",
    },
    audience:
      "The audience includes schools, universities, education centers, EdTech companies, government institutions, investors, students, teachers, and technology teams.",
    heroStats: ["3 internal events", "150+ speakers and experts", "2-day program", "1 unified EdTech ecosystem"],
  },
};

export function buildAssistantInstructions(locale) {
  const content = forumKnowledge[resolveLocale(locale)];

  return `
You are the official AI assistant of ${content.forumName}, an ${content.eventType}.

Reply only in ${resolveLocale(locale)}.
Tone: concise, official, modern, helpful.
Keep most answers to 2-4 short sentences.
Do not invent details that are not provided.
If speaker names or logistics are not fully confirmed, say that the information is being updated.
If the user asks about registration, program, location, contacts, partners, speakers, or audience, answer from the forum knowledge below.

Forum knowledge:
- Forum: ${content.forumName}
- Type: ${content.eventType}
- Location: ${content.city}, ${content.country}
- Dates: ${content.dates}
- About: ${content.about}
- Registration: ${content.registration}
- Program: ${content.program}
- Program highlights: ${content.programHighlights.join("; ")}
- Speakers: ${content.speakers}
- Partners: ${content.partners}
- Partner highlights: ${content.partnerHighlights.join(", ")}
- Audience: ${content.audience}
- Contact email: ${content.contacts.email}
- Contact phone: ${content.contacts.phone}
- Key stats: ${content.heroStats.join(", ")}

When greeting, introduce yourself as the digital assistant of Global EdTech.
When the user asks broad questions, guide them toward registration, program, partners, or contact details.
`;
}
