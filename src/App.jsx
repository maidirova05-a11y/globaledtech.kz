import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import RegistrationForm from "./components/RegistrationForm";

const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const AIAssistant = lazy(() => import("./components/ai/AIAssistant"));

const languages = [
  { code: "ru", label: "RU" },
  { code: "kk", label: "KZ" },
  { code: "en", label: "EN" },
];

const translations = {
  ru: {
    nav: [
      { label: "О событии", href: "#about" },
      { label: "Внутренние мероприятия", href: "#events" },
      { label: "Аудитория", href: "#audience" },
      { label: "Цели", href: "#benefits" },
      { label: "Программа", href: "#program" },
      { label: "Регистрация", href: "#register" },
      { label: "Контакты", href: "#contacts" },
    ],
    ui: {
      register: "Регистрация",
      registerNow: "Зарегистрироваться",
      menu: "Меню",
      openMenu: "Открыть меню навигации",
      internalEvents: "Внутренние мероприятия",
      contactsInfo: "Контакты и информация",
      admin: "Админка",
      top: "Наверх",
      forumOverview: "Обзор форума",
    },
    hero: {
      badge: "Международная платформа в сфере образования и технологий",
      subtitle: "Экосистема образования будущего",
      description:
        "Global EdTech — это масштабное событие, объединяющее лидеров, новаторов, образовательные организации, EdTech-компании и всех, кто заинтересован в трансформации образовательного ландшафта.",
      cityLabel: "Город",
      cityValue: "Астана",
      datesLabel: "Даты",
      datesValue: "20 - 21 февраля 2027 года",
      stats: [
        ["3", "внутренних мероприятия"],
        ["150+", "спикеров и экспертов"],
        ["2", "дня деловой программы"],
        ["1", "единая EdTech-экосистема"],
      ],
    },
    about: {
      eyebrow: "О событии",
      title: "Не просто форум-выставка, а живая платформа для будущего образования",
      text:
        "Global EdTech является ключевой площадкой для бизнес-конференций, презентаций новейших технологий, активного нетворкинга, обмена идеями и развития бизнеса в стремительно меняющемся мире образовательных технологий.",
      cards: [
        {
          title: "Форум-выставка нового поколения",
          description:
            "Global EdTech объединяет лидеров и новаторов сферы образования и создает масштабную платформу для тех, кто меняет подходы к обучению.",
        },
        {
          title: "Площадка для диалога и роста",
          description:
            "Это не просто событие, а динамичная среда для организаций образования, EdTech-компаний, учебных центров и всех, кто заинтересован в трансформации образовательного ландшафта.",
        },
        {
          title: "Технологии, идеи, нетворкинг",
          description:
            "Мероприятие становится ключевой точкой для бизнес-конференций, презентаций новейших технологий, обмена идеями и развития деловых связей.",
        },
        {
          title: "Инвестиция в будущее образования",
          description:
            "Global EdTech — это катализатор инноваций и платформа для всех, кто стремится к совершенству в сфере образовательных технологий.",
        },
      ],
    },
    events: {
      eyebrow: "Внутренние мероприятия",
      title: "Три главных направления в рамках Global EdTech",
      text:
        "На площадке Global EdTech пройдут отдельные тематические мероприятия, которые расширяют программу форума и делают ее интересной для школьников, студентов, преподавателей, специалистов и технологических команд.",
      cards: [
        {
          title: "AstanaTechCup",
          subtitle: "Республиканский чемпионат по робототехнике, дронам и киберспорту",
          image: "/assets/astanatechcup-logo.png",
        },
        {
          title: "BilimTalks",
          subtitle: "Семинары для специалистов в сфере образования на актуальные темы",
          image: "/assets/bilimtalks-logo.png",
        },
        {
          title: "ITECx",
          subtitle:
            "Международный научный конгресс для школьников, студентов, учителей и преподавателей ВУЗов",
          image: "/assets/itecx-logo-transparent.png",
        },
      ],
    },
    audience: {
      eyebrow: "Целевая аудитория",
      title: "Для тех, кто развивает образование, технологии и новые форматы обучения",
      text:
        "Событие объединяет профессиональное сообщество, образовательные команды, молодых исследователей и технологических партнеров, которым важны практические инструменты, развитие экосистемы и сильные связи внутри рынка.",
      items: [
        "EdTech-компании и стартапы",
        "Школы, университеты и учебные центры",
        "Школьники, студенты, учителя и преподаватели",
        "Руководители образовательных организаций",
        "Государственные структуры и отраслевые институты",
        "Инвесторы, партнеры и технологические компании",
      ],
    },
    benefits: {
      eyebrow: "Наши цели",
      title: "Что делает Global EdTech важным событием для экосистемы",
      text: "Форум строится вокруг практической пользы, открытого диалога и долгосрочного развития образовательной среды.",
      cards: [
        {
          title: "Показать современные инновации",
          description:
            "Продемонстрировать передовые EdTech-решения, которые уже сегодня трансформируют образование и готовят учащихся к вызовам завтрашнего дня.",
        },
        {
          title: "Объединить ключевых игроков",
          description:
            "Форум служит мостом между EdTech-компаниями, школами, университетами, государственными структурами и инвестиционными фондами.",
        },
        {
          title: "Дать практические инструменты",
          description:
            "Участники получают не только вдохновение, но и конкретные, применимые на практике инструменты и стратегии для модернизации образовательных учреждений.",
        },
        {
          title: "Запустить открытую дискуссию",
          description:
            "Мы инициируем диалог о школах будущего, обсуждаем глобальные тренды и ключевые аспекты развития EdTech-среды.",
        },
        {
          title: "Сформировать ежегодное ключевое событие",
          description:
            "Наша цель — сделать Global EdTech одним из самых значимых и ожидаемых событий в сфере образовательных технологий в Казахстане.",
        },
        {
          title: "Поддержать развитие сообщества",
          description:
            "Мы создаем среду для долгосрочного сотрудничества, обмена опытом и совместных проектов, которые ускоряют развитие современного образования.",
        },
      ],
    },
    program: {
      eyebrow: "Форматы",
      title: "Программа, где идеи переходят в действие",
      text:
        "В основе Global EdTech — деловой формат, экспертные выступления, выставочная часть, интерактивные зоны и реальные точки для партнерства.",
      items: [
        {
          time: "09:00",
          title: "Выступления спикеров и панельные дискуссии",
          detail:
            "Ведущие эксперты, визионеры и практики делятся опытом, прогнозами и лучшими практиками в сфере образовательных технологий.",
        },
        {
          time: "10:30",
          title: "Ярмарка образовательных организаций",
          detail:
            "Участники представляют свои проекты, программы и достижения, налаживают контакты и находят новых партнеров.",
        },
        {
          time: "12:00",
          title: "Зоны технологий и стартапов",
          detail:
            "Молодые и уже состоявшиеся EdTech-компании демонстрируют интерактивные решения, последние разработки и прототипы.",
        },
        {
          time: "14:00",
          title: "Экспозиции и интерактивные зоны",
          detail:
            "Посетители смогут протестировать новые технологии и получить практический опыт взаимодействия с образовательными продуктами и сервисами.",
        },
        {
          time: "15:30",
          title: "Подписание меморандумов",
          detail:
            "Форум способствует заключению новых партнерских соглашений и меморандумов о сотрудничестве для запуска реальных совместных инициатив.",
        },
        {
          time: "17:00",
          title: "Нетворкинг и обмен идеями",
          detail:
            "Живой обмен мнениями, новые знакомства и развитие бизнеса в быстро меняющемся мире образовательных технологий.",
        },
      ],
    },
    register: {
      eyebrow: "Регистрация",
      title: "Станьте частью Global EdTech в Астане",
      text:
        "Присоединяйтесь к событию 20–21 февраля 2027 года и выберите удобный формат участия: участник, спикер, партнер, спонсор или экспонент со стендом.",
    },
    contacts: {
      eyebrow: "Контакты",
      title: "Давайте вместе строить следующую главу в развитии образования",
      text1:
        "Свяжитесь с нами по вопросам участия, партнерства, спонсорства и приобретения стенда в рамках",
      text2: "Global EdTech.",
      items: [
        { label: "Город", value: "Астана, Казахстан" },
        { label: "Даты", value: "20 - 21 февраля 2027 года" },
        { label: "Email", value: "globaledtechkz@gmail.com" },
        { label: "Телефон", value: "+7 (700) 033 0229" },
      ],
    },
    footer: {
      copyright: "© 2027 Global EdTech. Экосистема образования будущего.",
    },
    form: {
      aria: { form: "Форма регистрации на мероприятие" },
      fields: {
        name: { label: "Имя", placeholder: "Ваше имя" },
        surname: { label: "Фамилия", placeholder: "Ваша фамилия" },
        email: { label: "Email", placeholder: "you@example.com" },
        phone: { label: "Телефон", placeholder: "+1 202 555 0188" },
        company: { label: "Компания", placeholder: "Название организации" },
        participationType: { label: "Формат участия", placeholder: "Выберите вариант" },
      },
      participationTypes: {
        delegate: "Участник",
        speaker: "Спикер",
        partner: "Партнер",
        sponsor: "Спонсор",
        exhibitor: "Экспонент со стендом",
      },
      buttons: {
        submit: "Отправить заявку",
        submitting: "Отправка...",
      },
      messages: {
        submitSuccess:
          "Спасибо за регистрацию. Наша команда свяжется с вами в ближайшее время.",
        submitError: "Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.",
        companyOptional: "необязательно",
        companyHint:
          "Поле необязательно, но мы рекомендуем его заполнить — так другим участникам форума будет проще вас найти. Нажмите «Зарегистрироваться» ещё раз, чтобы продолжить без него.",
      },
      countryPicker: {
        countryAria: "Выбор страны телефона",
        searchPlaceholder: "Поиск страны, кода или +",
        searchAria: "Поиск страны",
        listAria: "Список стран",
        empty: "Ничего не найдено",
      },
      validation: {
        nameMin: "Имя должно содержать минимум 2 символа",
        namePattern: "Имя может содержать только буквы и дефис",
        surnameMin: "Фамилия должна содержать минимум 2 символа",
        surnamePattern: "Фамилия может содержать только буквы и дефис",
        emailInvalid: "Введите корректный email",
        phoneInvalid: "Введите корректный международный номер",
        companyMin: "Компания должна содержать минимум 2 символа",
        companyPattern: "Компания может содержать только буквы, цифры, пробелы, &, -, .",
        participationRequired: "Выберите формат участия",
      },
    },
  },
  kk: {
    nav: [
      { label: "Іс-шара туралы", href: "#about" },
      { label: "Ішкі іс-шаралар", href: "#events" },
      { label: "Аудитория", href: "#audience" },
      { label: "Мақсаттар", href: "#benefits" },
      { label: "Бағдарлама", href: "#program" },
      { label: "Тіркелу", href: "#register" },
      { label: "Байланыс", href: "#contacts" },
    ],
    ui: {
      register: "Тіркелу",
      registerNow: "Тіркелу",
      menu: "Мәзір",
      openMenu: "Навигация мәзірін ашу",
      internalEvents: "Ішкі іс-шаралар",
      contactsInfo: "Байланыс және ақпарат",
      admin: "Әкімші панелі",
      top: "Жоғарыға",
      forumOverview: "Форумға шолу",
    },
    hero: {
      badge: "Білім және технология саласындағы халықаралық платформа",
      subtitle: "Болашақ білім экожүйесі",
      description:
        "Global EdTech — көшбасшыларды, жаңашылдарды, білім беру ұйымдарын, EdTech-компанияларды және білім беру кеңістігін трансформациялауға қызығушылық танытатын барша қауымды біріктіретін ауқымды іс-шара.",
      cityLabel: "Қала",
      cityValue: "Астана",
      datesLabel: "Күндер",
      datesValue: "2027 жылғы 20 - 21 ақпан",
      stats: [
        ["3", "ішкі іс-шара"],
        ["150+", "спикер мен сарапшы"],
        ["2", "іскерлік бағдарлама күні"],
        ["1", "біртұтас EdTech экожүйесі"],
      ],
    },
    about: {
      eyebrow: "Іс-шара туралы",
      title: "Тек форум-көрме емес, болашақ білімге арналған жанды платформа",
      text:
        "Global EdTech — бизнес-конференциялар, жаңа технологиялардың таныстырылымдары, белсенді нетворкинг, идея алмасу және білім беру технологияларының жылдам өзгеретін әлемінде бизнесті дамытуға арналған негізгі алаң.",
      cards: [
        {
          title: "Жаңа буын форум-көрмесі",
          description:
            "Global EdTech білім саласының көшбасшылары мен жаңашылдарын біріктіріп, оқыту тәсілдерін өзгертетіндерге ауқымды алаң ұсынады.",
        },
        {
          title: "Диалог пен өсу алаңы",
          description:
            "Бұл жай ғана іс-шара емес, білім беру ұйымдары, EdTech-компаниялар, оқу орталықтары және білім беру кеңістігін трансформациялауға мүдделі баршаға арналған серпінді орта.",
        },
        {
          title: "Технологиялар, идеялар, нетворкинг",
          description:
            "Іс-шара бизнес-конференциялар, жаңа технологиялардың таныстырылымдары, идея алмасу және іскерлік байланыстарды дамыту үшін маңызды нүктеге айналады.",
        },
        {
          title: "Білім болашағына инвестиция",
          description:
            "Global EdTech — инновациялардың катализаторы және білім беру технологиялары саласында жетістікке ұмтылатын баршаға арналған платформа.",
        },
      ],
    },
    events: {
      eyebrow: "Ішкі іс-шаралар",
      title: "Global EdTech аясындағы үш негізгі бағыт",
      text:
        "Global EdTech алаңында форум бағдарламасын кеңейтетін және оны оқушылар, студенттер, оқытушылар, мамандар мен технологиялық командалар үшін тартымды ететін жеке тақырыптық іс-шаралар өтеді.",
      cards: [
        {
          title: "AstanaTechCup",
          subtitle: "Робототехника, дрондар және киберспорт бойынша республикалық чемпионат",
          image: "/assets/astanatechcup-logo.png",
        },
        {
          title: "BilimTalks",
          subtitle: "Білім беру саласы мамандарына арналған өзекті тақырыптағы семинарлар",
          image: "/assets/bilimtalks-logo.png",
        },
        {
          title: "ITECx",
          subtitle:
            "Оқушылар, студенттер, мұғалімдер мен ЖОО оқытушыларына арналған халықаралық ғылыми конгресс",
          image: "/assets/itecx-logo-transparent.png",
        },
      ],
    },
    audience: {
      eyebrow: "Мақсатты аудитория",
      title: "Білімді, технологияны және жаңа оқу форматтарын дамытатындар үшін",
      text:
        "Іс-шара практикалық құралдарға, экожүйені дамытуға және нарық ішіндегі берік байланыстарға мүдделі кәсіби қауымдастықты, білім беру командаларын, жас зерттеушілерді және технологиялық серіктестерді біріктіреді.",
      items: [
        "EdTech-компаниялар мен стартаптар",
        "Мектептер, университеттер және оқу орталықтары",
        "Оқушылар, студенттер, мұғалімдер және оқытушылар",
        "Білім беру ұйымдарының басшылары",
        "Мемлекеттік құрылымдар мен салалық институттар",
        "Инвесторлар, серіктестер және технологиялық компаниялар",
      ],
    },
    benefits: {
      eyebrow: "Біздің мақсаттарымыз",
      title: "Global EdTech-ті экожүйе үшін маңызды ететін не",
      text: "Форум практикалық пайдаға, ашық диалогқа және білім беру ортасының ұзақ мерзімді дамуына негізделген.",
      cards: [
        {
          title: "Заманауи инновацияларды көрсету",
          description:
            "Бүгіннің өзінде білімді өзгертетін және оқушыларды ертеңгі сын-қатерлерге дайындайтын озық EdTech шешімдерін көрсету.",
        },
        {
          title: "Негізгі ойыншыларды біріктіру",
          description:
            "Форум EdTech-компаниялар, мектептер, университеттер, мемлекеттік құрылымдар мен инвестициялық қорлар арасындағы көпір қызметін атқарады.",
        },
        {
          title: "Практикалық құралдар беру",
          description:
            "Қатысушылар шабыт қана емес, білім беру ұйымдарын жаңғыртуға арналған нақты әрі қолданбалы құралдар мен стратегияларды алады.",
        },
        {
          title: "Ашық пікірталас бастау",
          description:
            "Біз болашақ мектептері туралы диалогты бастап, жаһандық трендтер мен EdTech ортасының дамуының негізгі аспектілерін талқылаймыз.",
        },
        {
          title: "Жыл сайынғы маңызды оқиғаны қалыптастыру",
          description:
            "Біздің мақсатымыз — Global EdTech-ті Қазақстандағы білім беру технологиялары саласындағы ең маңызды әрі күтілетін іс-шаралардың біріне айналдыру.",
        },
        {
          title: "Қауымдастық дамуын қолдау",
          description:
            "Біз ұзақ мерзімді ынтымақтастыққа, тәжірибе алмасуға және заманауи білімнің дамуын жеделдететін бірлескен жобаларға арналған орта құрамыз.",
        },
      ],
    },
    program: {
      eyebrow: "Форматтар",
      title: "Идеялар әрекетке айналатын бағдарлама",
      text:
        "Global EdTech негізінде іскерлік формат, сарапшылардың баяндамалары, көрме бөлімі, интерактивті аймақтар және серіктестікке арналған нақты нүктелер жатыр.",
      items: [
        {
          time: "09:00",
          title: "Спикерлердің баяндамалары және панельдік пікірталастар",
          detail:
            "Жетекші сарапшылар, визионерлер және практиктер білім беру технологиялары саласындағы тәжірибе, болжамдар және үздік практикалармен бөліседі.",
        },
        {
          time: "10:30",
          title: "Білім беру ұйымдарының жәрмеңкесі",
          detail:
            "Қатысушылар өз жобаларын, бағдарламаларын және жетістіктерін таныстырып, байланыс орнатып, жаңа серіктестер табады.",
        },
        {
          time: "12:00",
          title: "Технологиялар мен стартаптар аймақтары",
          detail:
            "Жас және қалыптасқан EdTech-компаниялар интерактивті шешімдерді, соңғы әзірлемелер мен прототиптерді көрсетеді.",
        },
        {
          time: "14:00",
          title: "Экспозициялар мен интерактивті аймақтар",
          detail:
            "Қонақтар жаңа технологияларды сынап көріп, білім беру өнімдері мен сервистерімен өзара әрекеттесудің тәжірибесін алады.",
        },
        {
          time: "15:30",
          title: "Меморандумдарға қол қою",
          detail:
            "Форум жаңа серіктестік келісімдер мен нақты бірлескен бастамаларды іске қосуға арналған ынтымақтастық меморандумдарын жасауға ықпал етеді.",
        },
        {
          time: "17:00",
          title: "Нетворкинг және идея алмасу",
          detail:
            "Пікірлермен жанды алмасу, жаңа таныстықтар және білім беру технологияларының жылдам өзгеретін әлемінде бизнесті дамыту.",
        },
      ],
    },
    register: {
      eyebrow: "Тіркелу",
      title: "Астанадағы Global EdTech-тің бір бөлігі болыңыз",
      text:
        "2027 жылғы 20–21 ақпанда өтетін іс-шараға қосылып, өзіңізге лайық қатысу форматын таңдаңыз: қатысушы, спикер, серіктес, демеуші немесе стендпен экспонент.",
    },
    contacts: {
      eyebrow: "Байланыс",
      title: "Білім дамуының келесі тарауын бірге құрайық",
      text1:
        "Қатысу, серіктестік, демеушілік және стенд сатып алу мәселелері бойынша бізбен байланысыңыз",
      text2: "Global EdTech аясында.",
      items: [
        { label: "Қала", value: "Астана, Қазақстан" },
        { label: "Күндер", value: "2027 жылғы 20 - 21 ақпан" },
        { label: "Email", value: "globaledtechkz@gmail.com" },
        { label: "Телефон", value: "+7 (700) 033 0229" },
      ],
    },
    footer: {
      copyright: "© 2027 Global EdTech. Болашақ білім экожүйесі.",
    },
    form: {
      aria: { form: "Іс-шараға тіркелу формасы" },
      fields: {
        name: { label: "Аты", placeholder: "Атыңыз" },
        surname: { label: "Тегі", placeholder: "Тегіңіз" },
        email: { label: "Email", placeholder: "you@example.com" },
        phone: { label: "Телефон", placeholder: "+1 202 555 0188" },
        company: { label: "Компания", placeholder: "Ұйым атауы" },
        participationType: { label: "Қатысу форматы", placeholder: "Нұсқаны таңдаңыз" },
      },
      participationTypes: {
        delegate: "Қатысушы",
        speaker: "Спикер",
        partner: "Серіктес",
        sponsor: "Демеуші",
        exhibitor: "Стендпен экспонент",
      },
      buttons: {
        submit: "Өтінімді жіберу",
        submitting: "Жіберілуде...",
      },
      messages: {
        submitSuccess:
          "Тіркелгеніңізге рақмет. Біздің команда жақын арада сізбен байланысады.",
        submitError: "Өтінімді жіберу мүмкін болмады. Қайтадан көріңіз.",
        companyOptional: "міндетті емес",
        companyHint:
          "Бұл өріс міндетті емес, бірақ толтыруды ұсынамыз — ұйым атауы қатысушыларға сізді оңай табуға көмектеседі. Жалғастыру үшін «Тіркелу» түймесін қайта басыңыз.",
      },
      countryPicker: {
        countryAria: "Телефон елін таңдау",
        searchPlaceholder: "Елді, кодты немесе + іздеу",
        searchAria: "Елді іздеу",
        listAria: "Елдер тізімі",
        empty: "Ештеңе табылмады",
      },
      validation: {
        nameMin: "Аты кемінде 2 таңбадан тұруы керек",
        namePattern: "Аты тек әріптер мен дефистен тұруы мүмкін",
        surnameMin: "Тегі кемінде 2 таңбадан тұруы керек",
        surnamePattern: "Тегі тек әріптер мен дефистен тұруы мүмкін",
        emailInvalid: "Дұрыс email енгізіңіз",
        phoneInvalid: "Дұрыс халықаралық нөмір енгізіңіз",
        companyMin: "Компания атауы кемінде 2 таңбадан тұруы керек",
        companyPattern: "Компания атауында тек әріптер, сандар, бос орын, &, -, . болуы мүмкін",
        participationRequired: "Қатысу форматын таңдаңыз",
      },
    },
  },
  en: {
    nav: [
      { label: "About", href: "#about" },
      { label: "Internal Events", href: "#events" },
      { label: "Audience", href: "#audience" },
      { label: "Goals", href: "#benefits" },
      { label: "Program", href: "#program" },
      { label: "Registration", href: "#register" },
      { label: "Contacts", href: "#contacts" },
    ],
    ui: {
      register: "Registration",
      registerNow: "Register Now",
      menu: "Menu",
      openMenu: "Open navigation menu",
      internalEvents: "Internal Events",
      contactsInfo: "Contacts and information",
      admin: "Admin Panel",
      top: "Top",
      forumOverview: "Forum Overview",
    },
    hero: {
      badge: "International platform in education and technology",
      subtitle: "The ecosystem of future education",
      description:
        "Global EdTech is a large-scale event that brings together leaders, innovators, educational institutions, EdTech companies, and everyone interested in transforming the educational landscape.",
      cityLabel: "City",
      cityValue: "Astana",
      datesLabel: "Dates",
      datesValue: "February 20 - 21, 2027",
      stats: [
        ["3", "internal events"],
        ["150+", "speakers and experts"],
        ["2", "days of business program"],
        ["1", "unified EdTech ecosystem"],
      ],
    },
    about: {
      eyebrow: "About the Event",
      title: "More than a forum-exhibition, it is a living platform for the future of education",
      text:
        "Global EdTech is a key venue for business conferences, presentations of the latest technologies, active networking, exchange of ideas, and business growth in the rapidly changing world of educational technology.",
      cards: [
        {
          title: "A next-generation forum and expo",
          description:
            "Global EdTech unites leaders and innovators in education and creates a large-scale platform for those reshaping learning approaches.",
        },
        {
          title: "A space for dialogue and growth",
          description:
            "This is more than just an event. It is a dynamic environment for educational institutions, EdTech companies, training centers, and everyone invested in transforming education.",
        },
        {
          title: "Technology, ideas, networking",
          description:
            "The event becomes a key point for business conferences, presentations of new technologies, exchange of ideas, and development of business relationships.",
        },
        {
          title: "An investment in the future of education",
          description:
            "Global EdTech is a catalyst for innovation and a platform for everyone striving for excellence in educational technology.",
        },
      ],
    },
    events: {
      eyebrow: "Internal Events",
      title: "Three key directions within Global EdTech",
      text:
        "Global EdTech will host dedicated thematic events that expand the forum agenda and make it relevant for school students, university students, educators, specialists, and technology teams.",
      cards: [
        {
          title: "AstanaTechCup",
          subtitle: "National championship in robotics, drones, and esports",
          image: "/assets/astanatechcup-logo.png",
        },
        {
          title: "BilimTalks",
          subtitle: "Seminars for education professionals on current topics",
          image: "/assets/bilimtalks-logo.png",
        },
        {
          title: "ITECx",
          subtitle:
            "International scientific congress for school students, university students, teachers, and professors",
          image: "/assets/itecx-logo-transparent.png",
        },
      ],
    },
    audience: {
      eyebrow: "Target Audience",
      title: "For those advancing education, technology, and new learning formats",
      text:
        "The event brings together professional communities, education teams, young researchers, and technology partners who value practical tools, ecosystem growth, and strong market connections.",
      items: [
        "EdTech companies and startups",
        "Schools, universities, and training centers",
        "School students, university students, teachers, and lecturers",
        "Leaders of educational institutions",
        "Government bodies and industry institutes",
        "Investors, partners, and technology companies",
      ],
    },
    benefits: {
      eyebrow: "Our Goals",
      title: "What makes Global EdTech an important event for the ecosystem",
      text:
        "The forum is built around practical value, open dialogue, and long-term development of the educational environment.",
      cards: [
        {
          title: "Showcase modern innovation",
          description:
            "Demonstrate advanced EdTech solutions that are already transforming education and preparing learners for tomorrow’s challenges.",
        },
        {
          title: "Unite key players",
          description:
            "The forum serves as a bridge between EdTech companies, schools, universities, government institutions, and investment funds.",
        },
        {
          title: "Provide practical tools",
          description:
            "Participants gain not only inspiration, but also concrete and practical tools and strategies for modernizing educational institutions.",
        },
        {
          title: "Launch open discussion",
          description:
            "We initiate dialogue about schools of the future, discuss global trends, and explore key aspects of EdTech development.",
        },
        {
          title: "Build an annual flagship event",
          description:
            "Our goal is to make Global EdTech one of the most significant and anticipated events in educational technology in Kazakhstan.",
        },
        {
          title: "Support community growth",
          description:
            "We create an environment for long-term collaboration, exchange of experience, and joint projects that accelerate modern education.",
        },
      ],
    },
    program: {
      eyebrow: "Formats",
      title: "A program where ideas turn into action",
      text:
        "Global EdTech is built on a business-focused format, expert talks, an exhibition area, interactive zones, and real opportunities for partnership.",
      items: [
        {
          time: "09:00",
          title: "Speaker sessions and panel discussions",
          detail:
            "Leading experts, visionaries, and practitioners share experience, forecasts, and best practices in educational technology.",
        },
        {
          time: "10:30",
          title: "Education fair",
          detail:
            "Participants present projects, programs, and achievements, build connections, and discover new partners.",
        },
        {
          time: "12:00",
          title: "Technology and startup zones",
          detail:
            "Young and established EdTech companies demonstrate interactive solutions, the latest developments, and prototypes.",
        },
        {
          time: "14:00",
          title: "Exhibitions and interactive zones",
          detail:
            "Visitors will be able to test new technologies and gain hands-on experience with educational products and services.",
        },
        {
          time: "15:30",
          title: "Memorandum signing",
          detail:
            "The forum helps launch new partnership agreements and memorandums of cooperation for real joint initiatives.",
        },
        {
          time: "17:00",
          title: "Networking and idea exchange",
          detail:
            "Live exchange of views, new connections, and business development in the fast-changing world of educational technology.",
        },
      ],
    },
    register: {
      eyebrow: "Registration",
      title: "Become part of Global EdTech in Astana",
      text:
        "Join the event on February 20–21, 2027 and choose the format that fits you best: participant, speaker, partner, sponsor, or exhibitor with stand.",
    },
    contacts: {
      eyebrow: "Contacts",
      title: "Let’s build the next chapter in education together",
      text1:
        "Contact us regarding participation, partnerships, sponsorships, and stand bookings within",
      text2: "Global EdTech.",
      items: [
        { label: "City", value: "Astana, Kazakhstan" },
        { label: "Dates", value: "February 20 - 21, 2027" },
        { label: "Email", value: "globaledtechkz@gmail.com" },
        { label: "Phone", value: "+7 (700) 033 0229" },
      ],
    },
    footer: {
      copyright: "© 2027 Global EdTech. The ecosystem of future education.",
    },
    form: {
      aria: { form: "Event registration form" },
      fields: {
        name: { label: "First Name", placeholder: "Your first name" },
        surname: { label: "Last Name", placeholder: "Your last name" },
        email: { label: "Email", placeholder: "you@example.com" },
        phone: { label: "Phone", placeholder: "+1 202 555 0188" },
        company: { label: "Company", placeholder: "Organization name" },
        participationType: { label: "Participation Format", placeholder: "Choose an option" },
      },
      participationTypes: {
        delegate: "Participant",
        speaker: "Speaker",
        partner: "Partner",
        sponsor: "Sponsor",
        exhibitor: "Exhibitor with stand",
      },
      buttons: {
        submit: "Submit Registration",
        submitting: "Submitting...",
      },
      messages: {
        submitSuccess:
          "Thank you for registering. Our team will contact you shortly.",
        submitError: "We could not submit your registration. Please try again.",
        companyOptional: "optional",
        companyHint:
          "This field is optional, but we recommend filling it in — your organization helps other attendees find you at the forum. Click Register again to continue without it.",
      },
      countryPicker: {
        countryAria: "Select phone country",
        searchPlaceholder: "Search country, code, or +",
        searchAria: "Search country",
        listAria: "Country list",
        empty: "No results found",
      },
      validation: {
        nameMin: "First name must contain at least 2 characters",
        namePattern: "First name may contain only letters and a hyphen",
        surnameMin: "Last name must contain at least 2 characters",
        surnamePattern: "Last name may contain only letters and a hyphen",
        emailInvalid: "Enter a valid email",
        phoneInvalid: "Enter a valid international phone number",
        companyMin: "Company must contain at least 2 characters",
        companyPattern: "Company may contain only letters, numbers, spaces, &, -, .",
        participationRequired: "Select a participation format",
      },
    },
  },
};

const galleryContent = {
  ru: {
    eyebrow: "Фотогалерея",
    title: "Посмотрите, как живут проекты AZ Group и Global EdTech",
    text:
      "От практических семинаров и олимпиад до форумов, фестивалей и международных встреч — эти кадры показывают атмосферу, людей и масштаб экосистемы, которую мы развиваем.",
    highlights: [
      "Форумы, фестивали и выступления",
      "Школьные проекты и олимпиады",
      "Партнерства, награды и сильное комьюнити",
    ],
    altBase: "Фотография мероприятия Global EdTech",
    open: "Открыть фотографию",
    close: "Закрыть",
  },
  kk: {
    eyebrow: "Фотогалерея",
    title: "AZ Group пен Global EdTech жобаларының шынайы атмосферасын көріңіз",
    text:
      "Практикалық семинарлардан олимпиадаларға, форумдар, фестивальдер мен халықаралық кездесулерге дейін бұл кадрлар біздің экожүйенің ауқымын, адамдарын және энергиясын көрсетеді.",
    highlights: [
      "Форумдар, фестивальдер және баяндамалар",
      "Мектеп жобалары мен олимпиадалар",
      "Серіктестік, марапаттар және мықты қауымдастық",
    ],
    altBase: "Global EdTech іс-шарасынан фото",
    open: "Фотосуретті ашу",
    close: "Жабу",
  },
  en: {
    eyebrow: "Gallery",
    title: "See the real energy behind AZ Group and Global EdTech projects",
    text:
      "From practical seminars and olympiads to forums, festivals, and international gatherings, these moments show the people, atmosphere, and momentum behind the ecosystem we are building.",
    highlights: [
      "Forums, festivals, and keynote moments",
      "School projects and olympiad experiences",
      "Partnerships, awards, and community impact",
    ],
    altBase: "Global EdTech event photo",
    open: "Open photo",
    close: "Close",
  },
};

const galleryPhotos = [
  {
    src: "/assets/gallery/optimized/00008886-1600.jpg",
    thumb: "/assets/gallery/optimized/00008886-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00008214-1600.jpg",
    thumb: "/assets/gallery/optimized/00008214-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00008585-1600.jpg",
    thumb: "/assets/gallery/optimized/00008585-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00007659-1600.jpg",
    thumb: "/assets/gallery/optimized/00007659-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00002466-1600.jpg",
    thumb: "/assets/gallery/optimized/00002466-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00002366-1600.jpg",
    thumb: "/assets/gallery/optimized/00002366-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/2V3A6160-1600.jpg",
    thumb: "/assets/gallery/optimized/2V3A6160-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/2V3A6128-1600.jpg",
    thumb: "/assets/gallery/optimized/2V3A6128-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00002625-1600.jpg",
    thumb: "/assets/gallery/optimized/00002625-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00002419-1600.jpg",
    thumb: "/assets/gallery/optimized/00002419-800.jpg",
  },
];

const galleryAutoplayDelay = 4500;
const heroAutoplayDelay = 5200;

const getWrappedIndex = (index, total) => {
  if (!total) {
    return 0;
  }

  return (index + total) % total;
};

const heroPhotos = [
  {
    src: "/assets/hero/ALM09565-1600.jpg",
    thumb: "/assets/hero/ALM09565-800.jpg",
  },
  {
    src: "/assets/hero/ALM09818-1600.jpg",
    thumb: "/assets/hero/ALM09818-800.jpg",
  },
  {
    src: "/assets/hero/ALM09057-1600.jpg",
    thumb: "/assets/hero/ALM09057-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00008886-1600.jpg",
    thumb: "/assets/gallery/optimized/00008886-800.jpg",
  },
  {
    src: "/assets/gallery/optimized/00008214-1600.jpg",
    thumb: "/assets/gallery/optimized/00008214-800.jpg",
  },
];

const benefitIcons = [
  <svg key="icon-1" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.18a15.9 15.9 0 0 0-1.2-5A8.02 8.02 0 0 1 18.93 11ZM12 4.07c.84 1.01 1.85 3.17 2.23 6.93H9.77C10.15 7.24 11.16 5.08 12 4.07ZM9.45 6a15.9 15.9 0 0 0-1.2 5H5.07A8.02 8.02 0 0 1 9.45 6ZM5.07 13h3.18a15.9 15.9 0 0 0 1.2 5A8.02 8.02 0 0 1 5.07 13ZM12 19.93c-.84-1.01-1.85-3.17-2.23-6.93h4.46c-.38 3.76-1.39 5.92-2.23 6.93ZM14.55 18a15.9 15.9 0 0 0 1.2-5h3.18A8.02 8.02 0 0 1 14.55 18Z" />
  </svg>,
  <svg key="icon-2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 2 8l10 5 8.18-4.09V17H22V8L12 3Zm-7.6 8.74V16L12 21l7.6-5v-4.26L12 15.5l-7.6-3.76Z" />
  </svg>,
  <svg key="icon-3" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14.59 13.41a2 2 0 0 0 2.82 0l3.18-3.18a4 4 0 1 0-5.66-5.66l-1.77 1.76 1.41 1.42 1.77-1.77a2 2 0 1 1 2.83 2.83l-3.18 3.18a2 2 0 0 1-2.83 0l-.7-.71-1.42 1.42.71.71ZM9.41 10.59a2 2 0 0 0-2.82 0l-3.18 3.18a4 4 0 1 0 5.66 5.66l1.77-1.76-1.41-1.42-1.77 1.77a2 2 0 1 1-2.83-2.83l3.18-3.18a2 2 0 0 1 2.83 0l.7.71 1.42-1.42-.71-.71Zm6.36-1.95-1.41-1.41-6.36 6.36 1.41 1.41 6.36-6.36Z" />
  </svg>,
  <svg key="icon-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2 6 14h5l-1 8 8-12h-5l1-8Z" />
  </svg>,
  <svg key="icon-5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z" />
  </svg>,
  <svg key="icon-6" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 11c1.66 0 2.99-1.57 2.99-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 2.99-1.57 2.99-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
  </svg>,
];

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};



function LanguageSwitcher({ language, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => onChange(item.code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.2em] transition ${
            language === item.code
              ? "bg-cyan-400/20 text-cyan-200"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.38em] text-cyan-400">
        <span className="inline-block h-px w-6 bg-cyan-400/60" aria-hidden="true" />
        {eyebrow}
        <span className="inline-block h-px w-6 bg-cyan-400/60" aria-hidden="true" />
      </p>
      <h2 className="section-heading-h2">{title}</h2>
      <p className="mt-5 text-base leading-7 text-slate-400 sm:text-[1.05rem] sm:leading-8">{text}</p>
    </motion.div>
  );
}

function GallerySlider({ gallery, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = galleryPhotos.length;

  useEffect(() => {
    if (isPaused || totalSlides < 2) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => getWrappedIndex(currentIndex + 1, totalSlides));
    }, galleryAutoplayDelay);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isPaused, totalSlides]);

  return (
    <motion.div
      className="gallery-slider"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="gallery-slider-stage">
        <div
          className="gallery-slider-track"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {galleryPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className="gallery-slide"
              onClick={() => onOpen(index)}
              aria-label={`${gallery.open}: ${index + 1}`}
            >
              <img
                src={photo.src}
                srcSet={`${photo.thumb} 800w, ${photo.src} 1600w`}
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 56vw, 760px"
                alt={`${gallery.altBase} ${index + 1}`}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="gallery-slide-image"
              />
              <div className="gallery-slide-overlay" />
            </button>
          ))}
        </div>

        <div className="gallery-slider-panel">
          <div>
            <p className="gallery-slider-kicker">{gallery.eyebrow}</p>
            <p className="gallery-slider-status">
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </p>
          </div>

          <div className="gallery-slider-actions">
            <button
              type="button"
              className="gallery-slider-arrow"
              aria-label="Previous slide"
              onClick={() =>
                setActiveIndex((currentIndex) => getWrappedIndex(currentIndex - 1, totalSlides))
              }
            >
              &#8592;
            </button>
            <button
              type="button"
              className="gallery-slider-arrow"
              aria-label="Next slide"
              onClick={() =>
                setActiveIndex((currentIndex) => getWrappedIndex(currentIndex + 1, totalSlides))
              }
            >
              &#8594;
            </button>
          </div>
        </div>

        <div className="gallery-slider-progress" aria-hidden="true">
          <span
            className="gallery-slider-progress-bar"
            style={{ width: `${((activeIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      <div className="gallery-thumbs" role="tablist" aria-label="Gallery thumbnails">
        {galleryPhotos.map((photo, index) => (
          <button
            key={photo.thumb}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`${gallery.open}: ${index + 1}`}
            className={`gallery-thumb ${activeIndex === index ? "gallery-thumb-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={photo.thumb}
              alt={`${gallery.altBase} ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="gallery-thumb-image"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function CounterNumber({ value }) {
  const parsed = String(value).match(/^(\d+)(.*)$/);
  if (!parsed) return <>{value}</>;
  const num = parseInt(parsed[1], 10);
  const suffix = parsed[2] || '';

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 65, damping: 22, restDelta: 0.5 });
  const display = useTransform(spring, (v) => String(Math.round(v)));

  useEffect(() => {
    if (isInView) spring.set(num);
  }, [isInView, num, spring]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

function HeroBgSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(
      () => setActiveIndex((i) => getWrappedIndex(i + 1, heroPhotos.length)),
      heroAutoplayDelay,
    );
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="hero-bg-slideshow" aria-hidden="true">
      {heroPhotos.map((photo, index) => (
        <img
          key={photo.src}
          src={photo.src}
          srcSet={`${photo.thumb} 800w, ${photo.src} 1600w`}
          sizes="100vw"
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "low"}
          decoding="async"
          className={`hero-bg-image ${activeIndex === index ? "hero-bg-image-active" : ""}`}
        />
      ))}
      <div className="hero-bg-overlay" />
      <div className="hero-bg-dots">
        {heroPhotos.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-bg-dot ${activeIndex === index ? "hero-bg-dot-active" : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(null);
  const [shouldLoadAssistant, setShouldLoadAssistant] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "ru";
    }

    return localStorage.getItem("site-language") || "ru";
  });
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    typeof window !== "undefined" &&
    (window.location.pathname === "/admin" || window.location.hash.startsWith("#admin")),
  );

  useEffect(() => {
    localStorage.setItem("site-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const syncRouteState = () => {
      setIsAdminRoute(
        window.location.pathname === "/admin" || window.location.hash.startsWith("#admin"),
      );
    };

    syncRouteState();
    window.addEventListener("hashchange", syncRouteState);
    window.addEventListener("popstate", syncRouteState);

    return () => {
      window.removeEventListener("hashchange", syncRouteState);
      window.removeEventListener("popstate", syncRouteState);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handleEsc = (e) => { if (e.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (selectedGalleryIndex === null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedGalleryIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setSelectedGalleryIndex((currentIndex) =>
          getWrappedIndex((currentIndex ?? 0) - 1, galleryPhotos.length),
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedGalleryIndex((currentIndex) =>
          getWrappedIndex((currentIndex ?? 0) + 1, galleryPhotos.length),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedGalleryIndex]);

  useEffect(() => {
    if (typeof window === "undefined" || isAdminRoute || shouldLoadAssistant) {
      return undefined;
    }

    let idleId = null;
    let timeoutId = null;

    const loadAssistant = () => {
      setShouldLoadAssistant(true);
    };

    const scheduleLoad = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadAssistant, { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(loadAssistant, 2200);
      }
    };

    const handleInteraction = () => {
      loadAssistant();
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    window.addEventListener("pointerdown", handleInteraction, { once: true, passive: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener("load", scheduleLoad);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, [isAdminRoute, shouldLoadAssistant]);

  const t = useMemo(() => translations[language] || translations.ru, [language]);
  const gallery = useMemo(() => galleryContent[language] || galleryContent.ru, [language]);
  const selectedGalleryPhoto =
    selectedGalleryIndex === null ? null : galleryPhotos[selectedGalleryIndex] ?? null;

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0B0F2A]" />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F2A] text-slate-100">
      <a href="#main-content" className="skip-link">Перейти к содержанию</a>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-12%] top-[12%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-80 w-80 rounded-full bg-yellow-400/15 blur-3xl" />
        <div className="grid-overlay absolute inset-0 opacity-30" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#0B0F2A]/90 backdrop-blur-xl transition-shadow duration-300">
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8"
        >
          <a href="#hero" className="flex min-w-0 items-center" aria-label="Global EdTech — на главную">
            <img
              src="/assets/globaledtech-logo.png"
              alt="Global EdTech"
              className="header-logo header-logo-main"
              decoding="async"
            />
          </a>

          <div className="hidden flex-1 items-center justify-center gap-6 xl:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 xl:flex">
            <LanguageSwitcher language={language} onChange={setLanguage} />
            <a
              href="https://az-group.kz/"
              target="_blank"
              rel="noreferrer"
              aria-label="AZ Group official website"
            >
              <img
                src="/assets/azgroup-logo.png"
                alt="AZ Group"
                className="header-logo header-logo-partner"
                loading="lazy"
                decoding="async"
              />
            </a>
            <a href="#register" className="button-primary text-sm">
              {t.ui.register}
            </a>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <LanguageSwitcher language={language} onChange={setLanguage} />
            <button
              type="button"
              className="button-secondary px-4 py-2.5 text-sm"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={t.ui.openMenu}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {t.ui.menu}
            </button>
          </div>
        </nav>

      </header>

      {/* Mobile navigation overlay — full-screen, professional */}
      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="mobile-nav-overlay xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.ui.menu}
        >
          <div className="mobile-nav-inner">
            <div className="mobile-nav-header">
              <a href="#hero" onClick={() => setIsMenuOpen(false)} aria-label="Global EdTech — на главную">
                <img
                  src="/assets/globaledtech-logo.png"
                  alt="Global EdTech"
                  className="header-logo"
                  style={{ height: '3rem' }}
                  decoding="async"
                />
              </a>
              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Закрыть меню"
                onClick={() => setIsMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mobile-nav-ctas">
              <a
                href="#register"
                className="button-primary justify-center text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.ui.registerNow}
              </a>
              <a
                href="#events"
                className="button-secondary justify-center text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.ui.internalEvents}
              </a>
            </div>

            <nav className="mobile-nav-links" aria-label="Mobile navigation">
              {t.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <span className="mobile-nav-link-arrow" aria-hidden="true">›</span>
                </a>
              ))}
            </nav>

            <div className="mobile-nav-footer">
              <a
                href="https://az-group.kz/"
                target="_blank"
                rel="noreferrer"
                aria-label="AZ Group official website"
              >
                <img
                  src="/assets/azgroup-logo.png"
                  alt="AZ Group"
                  className="header-logo header-logo-partner"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <a
                href="#contacts"
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.ui.contactsInfo}
              </a>
            </div>
          </div>
        </div>
      )}

      <main id="main-content">
        {/* ── HERO: full-viewport, photo background, text overlay ── */}
        <section id="hero" className="relative overflow-hidden">
          {/* Background photo slideshow */}
          <HeroBgSlideshow />

          {/* Content layer */}
          <div className="hero-fullbg relative z-10 w-full">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-[118px] sm:px-6 sm:pb-16 sm:pt-[136px] lg:px-8 lg:pb-20 lg:pt-[140px]">

              <motion.div
                className="hero-text-col"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                {/* Badge */}
                <div className="hero-badge">
                  <span className="pulse-dot" aria-hidden="true" />
                  {t.hero.badge}
                </div>

                {/* Main headline — very large */}
                <h1 className="mt-7 text-[3rem] font-extrabold leading-[0.92] tracking-tight sm:text-[5rem] lg:text-[6.5rem] xl:text-[8rem]">
                  <span className="tech-title">Global<br />EdTech</span>
                </h1>

                <p className="mt-6 max-w-lg text-xl font-medium leading-snug text-white/90 sm:text-2xl">
                  {t.hero.subtitle}
                </p>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 sm:text-[1.05rem]">
                  {t.hero.description}
                </p>

                {/* City + Dates */}
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="inline-flex items-center gap-2 text-sm text-white/65">
                    <svg className="h-4 w-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="font-semibold text-white">{t.hero.cityValue}</span>
                    <span className="text-white/25">·</span>
                    {t.hero.cityLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-white/65">
                    <svg className="h-4 w-4 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <span className="font-semibold text-white">{t.hero.datesValue}</span>
                    <span className="text-white/25">·</span>
                    {t.hero.datesLabel}
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href="#register" className="button-primary px-7 py-4 text-sm font-semibold">
                    {t.ui.registerNow}
                  </a>
                  <a href="#about" className="hero-secondary-cta">
                    {t.about.eyebrow}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* Stats strip — full width */}
              <motion.div
                className="mt-12 hero-stats-strip lg:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                {t.hero.stats.map(([value, label]) => (
                  <div key={label} className="hero-stats-strip-item">
                    <p className="hero-stats-strip-value">
                      <CounterNumber value={value} />
                    </p>
                    <p className="hero-stats-strip-label">{label}</p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            aria-hidden="true"
          >
            <div className="scroll-cue">
              <div className="scroll-cue-arrow">
                <div className="scroll-cue-line" />
                <div className="scroll-cue-chevron" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Event formats ticker — communicates scope immediately */}
        <div className="event-ticker-strip" aria-hidden="true">
          <div className="event-ticker-track">
            {[...t.program.items, ...t.program.items, ...t.program.items, ...t.program.items].map((item, i) => (
              <span
                key={i}
                className="event-ticker-item"
              >
                <span className={`event-ticker-item-dot ${
                  i % 3 === 0 ? 'event-ticker-item-dot-cyan' :
                  i % 3 === 1 ? 'event-ticker-item-dot-pink' :
                  'event-ticker-item-dot-yellow'
                }`} />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <section id="about" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={t.about.eyebrow}
              title={t.about.title}
              text={t.about.text}
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {t.about.cards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="glass-panel card-hover p-6 sm:p-7"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="about-card-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold leading-snug text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">{card.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={t.events.eyebrow}
              title={t.events.title}
              text={t.events.text}
            />

            <div className="grid gap-5 xl:grid-cols-3">
              {t.events.cards.map((event, index) => (
                <motion.article
                  key={event.title}
                  className="glass-panel card-hover overflow-hidden p-6 sm:p-7"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="event-logo-wrap">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{event.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{event.subtitle}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={gallery.eyebrow}
              title={gallery.title}
              text={gallery.text}
            />

            {/* Highlight chips */}
            <motion.div
              className="gallery-highlights-row mb-8"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {gallery.highlights.map((item) => (
                <span key={item} className="gallery-highlight-chip">
                  <span className="gallery-highlight-chip-dot" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Full-width slider */}
            <GallerySlider gallery={gallery} onOpen={setSelectedGalleryIndex} />
          </div>
        </section>

        <section id="audience" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.38em] text-fuchsia-400">
                <span className="inline-block h-px w-6 bg-fuchsia-400/60" aria-hidden="true" />
                {t.audience.eyebrow}
              </p>
              <h2 className="section-heading-h2">{t.audience.title}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-[1.05rem]">
                {t.audience.text}
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-6 sm:p-8"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <ul className="grid gap-3 sm:grid-cols-2">
                {t.audience.items.map((item) => (
                  <li key={item} className="audience-item">
                    <span className="audience-item-dot" aria-hidden="true" />
                    <span className="audience-item-text">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="benefits" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={t.benefits.eyebrow}
              title={t.benefits.title}
              text={t.benefits.text}
            />
            <div className="benefits-grid">
              {t.benefits.cards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className={`benefit-card benefit-card-${index + 1} glass-panel`}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <div className="benefit-card-glow" aria-hidden="true" />
                  <div className="benefit-card-content">
                    <div className="benefit-icon-shell">
                      <span className="icon">{benefitIcons[index]}</span>
                    </div>
                    <div className="benefit-copy">
                      <h3 className="benefit-title">{card.title}</h3>
                      <p className="benefit-description">{card.description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="program" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={t.program.eyebrow}
              title={t.program.title}
              text={t.program.text}
            />
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-yellow-400 sm:block" />
              <div className="space-y-6">
                {t.program.items.map((item, index) => (
                  <motion.div
                    key={`${item.time}-${item.title}`}
                    className="glass-panel relative grid gap-5 p-6 sm:grid-cols-[110px_1fr] sm:pl-14"
                    variants={reveal}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="absolute left-[13px] top-8 hidden h-4 w-4 rounded-full border-4 border-[#0B0F2A] bg-cyan-400 shadow-[0_0_22px_rgba(0,194,255,0.85)] sm:block" />
                    <div className="text-lg font-semibold text-cyan-300">{item.time}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="register" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.38em] text-yellow-400">
                <span className="inline-block h-px w-6 bg-yellow-400/60" aria-hidden="true" />
                {t.register.eyebrow}
              </p>
              <h2 className="section-heading-h2">{t.register.title}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-[1.05rem]">
                {t.register.text}
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-6 sm:p-8"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <RegistrationForm language={language} translations={t.form} />
            </motion.div>
          </div>
        </section>

        <section id="contacts" className="section-deferred px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={t.contacts.eyebrow}
              title={t.contacts.title}
              text={`${t.contacts.text1} ${t.contacts.text2}`}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {t.contacts.items.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="glass-panel card-hover p-6 text-center"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-4 text-lg font-semibold leading-snug text-white sm:text-xl">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-enhanced" role="contentinfo">
        <div className="footer-grid px-4 sm:px-6 lg:px-8">
          {/* Brand column */}
          <div>
            <img
              src="/assets/globaledtech-logo.png"
              alt="Global EdTech"
              className="header-logo mb-4"
              style={{ height: '3.2rem' }}
              loading="lazy"
              decoding="async"
            />
            <p className="footer-brand-sub">
              {t.footer.copyright.replace('© 2027 Global EdTech. ', '')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="footer-col-title">{t.about.eyebrow}</p>
            <div className="footer-col-links">
              {t.nav.slice(0, 4).map((item) => (
                <a key={item.href} href={item.href} className="footer-col-link">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <p className="footer-col-title">{t.contacts.eyebrow}</p>
            <div className="footer-col-links">
              {t.contacts.items.map((item) => (
                <span key={item.label} className="footer-col-link">
                  <span className="text-slate-600">{item.label}:</span>{' '}
                  <span className="text-slate-500">{item.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom px-4 sm:px-6 lg:px-8">
          <p className="footer-copyright">{t.footer.copyright}</p>
          <div className="flex gap-5">
            <a href="#hero" className="footer-col-link text-xs uppercase tracking-[0.2em]">
              {t.ui.top}
            </a>
            <a href="#register" className="footer-col-link text-xs uppercase tracking-[0.2em]">
              {t.ui.register}
            </a>
          </div>
        </div>
      </footer>

      {shouldLoadAssistant ? (
        <Suspense fallback={null}>
          <AIAssistant language={language} />
        </Suspense>
      ) : null}

      {selectedGalleryPhoto ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020617]/88 px-4 py-6 backdrop-blur-md">
          <button
            type="button"
            aria-label={gallery.close}
            className="absolute inset-0"
            onClick={() => setSelectedGalleryIndex(null)}
          />
          <div className="relative z-10 w-full max-w-6xl">
            <button
              type="button"
              onClick={() => setSelectedGalleryIndex(null)}
              className="absolute right-2 top-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0B0F2A]/80 text-2xl text-white transition hover:border-cyan-300/45 hover:text-cyan-200"
            >
              ×
            </button>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() =>
                setSelectedGalleryIndex((currentIndex) =>
                  getWrappedIndex((currentIndex ?? 0) - 1, galleryPhotos.length),
                )
              }
              className="absolute left-2 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0B0F2A]/80 text-2xl text-white transition hover:border-cyan-300/45 hover:text-cyan-200"
            >
              &#8592;
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() =>
                setSelectedGalleryIndex((currentIndex) =>
                  getWrappedIndex((currentIndex ?? 0) + 1, galleryPhotos.length),
                )
              }
              className="absolute right-2 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0B0F2A]/80 text-2xl text-white transition hover:border-cyan-300/45 hover:text-cyan-200"
            >
              &#8594;
            </button>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#081022] shadow-[0_30px_120px_rgba(2,8,23,0.65)]">
              <img
                src={selectedGalleryPhoto.src}
                srcSet={`${selectedGalleryPhoto.thumb} 800w, ${selectedGalleryPhoto.src} 1600w`}
                sizes="92vw"
                alt={`${gallery.altBase} ${(selectedGalleryIndex ?? 0) + 1}`}
                decoding="async"
                className="max-h-[82vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
