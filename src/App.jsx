import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const navItems = [
  { label: "О событии", href: "#about" },
  { label: "Внутренние мероприятия", href: "#events" },
  { label: "Аудитория", href: "#audience" },
  { label: "Цели", href: "#benefits" },
  { label: "Программа", href: "#program" },
  { label: "Регистрация", href: "#register" },
  { label: "Контакты", href: "#contacts" },
];

const aboutCards = [
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
];

const ecosystemEvents = [
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
    image: "/assets/itecx-logo-main.png",
  },
];

const audienceItems = [
  "EdTech-компании и стартапы",
  "Школы, университеты и учебные центры",
  "Школьники, студенты, учителя и преподаватели",
  "Руководители образовательных организаций",
  "Государственные структуры и отраслевые институты",
  "Инвесторы, партнеры и технологические компании",
];

const benefitCards = [
  {
    title: "Показать современные инновации",
    description:
      "Продемонстрировать передовые EdTech-решения, которые уже сегодня трансформируют образование и готовят учащихся к вызовам завтрашнего дня.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.18a15.9 15.9 0 0 0-1.2-5A8.02 8.02 0 0 1 18.93 11ZM12 4.07c.84 1.01 1.85 3.17 2.23 6.93H9.77C10.15 7.24 11.16 5.08 12 4.07ZM9.45 6a15.9 15.9 0 0 0-1.2 5H5.07A8.02 8.02 0 0 1 9.45 6ZM5.07 13h3.18a15.9 15.9 0 0 0 1.2 5A8.02 8.02 0 0 1 5.07 13ZM12 19.93c-.84-1.01-1.85-3.17-2.23-6.93h4.46c-.38 3.76-1.39 5.92-2.23 6.93ZM14.55 18a15.9 15.9 0 0 0 1.2-5h3.18A8.02 8.02 0 0 1 14.55 18Z" />
      </svg>
    ),
  },
  {
    title: "Объединить ключевых игроков",
    description:
      "Форум служит мостом между EdTech-компаниями, школами, университетами, государственными структурами и инвестиционными фондами.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 2 8l10 5 8.18-4.09V17H22V8L12 3Zm-7.6 8.74V16L12 21l7.6-5v-4.26L12 15.5l-7.6-3.76Z" />
      </svg>
    ),
  },
  {
    title: "Дать практические инструменты",
    description:
      "Участники получают не только вдохновение, но и конкретные, применимые на практике инструменты и стратегии для модернизации образовательных учреждений.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.59 13.41a2 2 0 0 0 2.82 0l3.18-3.18a4 4 0 1 0-5.66-5.66l-1.77 1.76 1.41 1.42 1.77-1.77a2 2 0 1 1 2.83 2.83l-3.18 3.18a2 2 0 0 1-2.83 0l-.7-.71-1.42 1.42.71.71ZM9.41 10.59a2 2 0 0 0-2.82 0l-3.18 3.18a4 4 0 1 0 5.66 5.66l1.77-1.76-1.41-1.42-1.77 1.77a2 2 0 1 1-2.83-2.83l3.18-3.18a2 2 0 0 1 2.83 0l.7.71 1.42-1.42-.71-.71Zm6.36-1.95-1.41-1.41-6.36 6.36 1.41 1.41 6.36-6.36Z" />
      </svg>
    ),
  },
  {
    title: "Запустить открытую дискуссию",
    description:
      "Мы инициируем диалог о школах будущего, обсуждаем глобальные тренды и ключевые аспекты развития EdTech-среды.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 6 14h5l-1 8 8-12h-5l1-8Z" />
      </svg>
    ),
  },
  {
    title: "Сформировать ежегодное ключевое событие",
    description:
      "Наша цель — сделать Global EdTech одним из самых значимых и ожидаемых событий в сфере образовательных технологий в Казахстане.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z" />
      </svg>
    ),
  },
];

const programItems = [
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
];

const contactItems = [
  { label: "Город", value: "Астана, Казахстан" },
  { label: "Даты", value: "7–8 февраля 2027" },
  { label: "Email", value: "hello@globaledtech.org" },
  { label: "Телефон", value: "+7 (700) 000-00-00" },
];

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{text}</p>
    </motion.div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      participationType: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Registration submitted:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#0B0F2A] text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-12%] top-[12%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-80 w-80 rounded-full bg-yellow-400/15 blur-3xl" />
        <div className="grid-overlay absolute inset-0 opacity-30" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B0F2A]/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero" className="flex min-w-0 items-center">
            <img
              src="/assets/globaledtech-logo.png"
              alt="Global EdTech"
              className="header-logo header-logo-main"
            />
          </a>

          <div className="hidden items-center gap-6 xl:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 xl:flex">
            <img
              src="/assets/azgroup-logo.png"
              alt="AZ Group"
              className="header-logo header-logo-partner"
            />
            <a href="#register" className="button-primary">
              Регистрация
            </a>
          </div>

          <button
            type="button"
            className="button-secondary px-4 py-3 xl:hidden"
            aria-expanded={isMenuOpen}
            aria-label="Открыть меню навигации"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            Меню
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-white/10 px-4 py-4 sm:px-6 xl:hidden">
            <div className="mx-auto grid max-w-7xl gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="menu-info-card">
                  <p className="menu-info-label">Даты</p>
                  <p className="menu-info-value">7–8 февраля 2027</p>
                </div>
                <div className="menu-info-card">
                  <p className="menu-info-label">Город</p>
                  <p className="menu-info-value">Астана</p>
                </div>
                <div className="menu-info-card">
                  <p className="menu-info-label">Формат</p>
                  <p className="menu-info-value">Форум + Expo</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="#register"
                  className="button-primary justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Зарегистрироваться
                </a>
                <a
                  href="#events"
                  className="button-secondary justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Внутренние мероприятия
                </a>
              </div>

              <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="menu-footer">
                <img
                  src="/assets/azgroup-logo.png"
                  alt="AZ Group"
                  className="header-logo header-logo-partner"
                />
                <a
                  href="#contacts"
                  className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Контакты и информация
                </a>
              </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-[88px] sm:pt-[100px]">
        <section
          id="hero"
          className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div className="glass-panel inline-flex items-center gap-3 px-4 py-2 text-sm text-slate-200">
                <span className="pulse-dot" />
                Международная платформа в сфере образования и технологий
              </div>
              <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="tech-title">Global EdTech</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
                Экосистема образования будущего
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Global EdTech — это масштабное событие, объединяющее лидеров,
                новаторов, образовательные организации, EdTech-компании и всех, кто
                заинтересован в трансформации образовательного ландшафта.
              </p>

              <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
                <div className="stat-card p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Город</p>
                  <p className="mt-2 text-lg font-semibold text-white">Астана</p>
                </div>
                <div className="stat-card p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Даты</p>
                  <p className="mt-2 text-lg font-semibold text-white">7–8 февраля 2027</p>
                </div>
                <div className="stat-card p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Ожидается
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">10 000+ гостей</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#register" className="button-primary justify-center">
                  Зарегистрироваться
                </a>
                <a href="#events" className="button-secondary justify-center">
                  Смотреть мероприятия
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            >
              <div className="glass-panel relative overflow-hidden p-8 sm:p-10">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
                <div className="hero-orb hero-orb-cyan" />
                <div className="hero-orb hero-orb-pink" />
                <div className="hero-orb hero-orb-yellow" />
                <div className="relative z-10">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                    Forum Overview
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      ["3", "внутренних мероприятия"],
                      ["150+", "спикеров и экспертов"],
                      ["2", "дня деловой программы"],
                      ["1", "единая EdTech-экосистема"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-[16px] border border-white/10 bg-white/5 p-5"
                      >
                        <p className="text-3xl font-semibold text-white">{value}</p>
                        <p className="mt-2 text-sm text-slate-300">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="О событии"
              title="Не просто форум-выставка, а живая платформа для будущего образования"
              text="Global EdTech является ключевой площадкой для бизнес-конференций, презентаций новейших технологий, активного нетворкинга, обмена идеями и развития бизнеса в стремительно меняющемся мире образовательных технологий."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aboutCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="glass-panel card-hover p-6"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="mb-5 h-2 w-16 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400" />
                  <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Внутренние мероприятия"
              title="Три сильных направления в рамках Global EdTech"
              text="На площадке Global EdTech пройдут отдельные тематические мероприятия, которые расширяют программу форума и делают ее интересной для школьников, студентов, преподавателей, специалистов и технологических команд."
            />

            <div className="grid gap-6 xl:grid-cols-3">
              {ecosystemEvents.map((event, index) => (
                <motion.article
                  key={event.title}
                  className="glass-panel card-hover overflow-hidden p-6"
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
                    />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{event.subtitle}</p>
                </motion.article>
              ))}
            </div>


          </div>
        </section>

        <section id="audience" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
                Целевая аудитория
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Для тех, кто развивает образование, технологии и новые форматы обучения
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Событие объединяет профессиональное сообщество, образовательные команды,
                молодых исследователей и технологических партнеров, которым важны
                практические инструменты, развитие экосистемы и сильные связи внутри рынка.
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-6 sm:p-8"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <ul className="grid gap-4 sm:grid-cols-2">
                {audienceItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 rounded-[16px] border border-white/10 bg-white/5 p-4"
                  >
                    <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(0,194,255,0.8)]" />
                    <span className="text-sm leading-7 text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="benefits" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Наши цели"
              title="Что делает Global EdTech важным событием для экосистемы"
              text="Форум строится вокруг практической пользы, открытого диалога и долгосрочного развития образовательной среды."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {benefitCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="glass-panel card-hover p-6"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 shadow-[0_0_30px_rgba(0,194,255,0.18)]">
                    <span className="icon">{card.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="program" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Форматы"
              title="Программа, где идеи переходят в действие"
              text="В основе Global EdTech — деловой формат, экспертные выступления, выставочная часть, интерактивные зоны и реальные точки для партнерства."
            />
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-yellow-400 sm:block" />
              <div className="space-y-6">
                {programItems.map((item, index) => (
                  <motion.div
                    key={item.time}
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

        <section id="register" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-300">
                Регистрация
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Станьте частью Global EdTech в Астане
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Присоединяйтесь к событию 7–8 февраля 2027 года и станьте частью
                экосистемы, где образование, технологии и сильные идеи встречаются на
                одной площадке.
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-6 sm:p-8"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label className="field-label" htmlFor="name">
                    Имя
                  </label>
                  <input
                    id="name"
                    className="field-input"
                    placeholder="Ваше имя"
                    {...register("name", { required: "Укажите имя" })}
                  />
                  {errors.name && <p className="field-error">{errors.name.message}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="field-input"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Укажите email",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Введите корректный email",
                        },
                      })}
                    />
                    {errors.email && <p className="field-error">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="phone">
                      Телефон
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="field-input"
                      placeholder="+7 (___) ___-__-__"
                      {...register("phone", {
                        required: "Укажите телефон",
                        minLength: {
                          value: 8,
                          message: "Введите корректный номер телефона",
                        },
                      })}
                    />
                    {errors.phone && <p className="field-error">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="company">
                      Компания
                    </label>
                    <input
                      id="company"
                      className="field-input"
                      placeholder="Название организации"
                      {...register("company", { required: "Укажите компанию" })}
                    />
                    {errors.company && <p className="field-error">{errors.company.message}</p>}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="participationType">
                      Формат участия
                    </label>
                    <select
                      id="participationType"
                      className="field-input"
                      defaultValue=""
                      {...register("participationType", {
                        required: "Выберите формат участия",
                      })}
                    >
                      <option value="" disabled>
                        Выберите вариант
                      </option>
                      <option value="delegate">Участник</option>
                      <option value="speaker">Спикер</option>
                      <option value="partner">Партнер</option>
                    </select>
                    {errors.participationType && (
                      <p className="field-error">{errors.participationType.message}</p>
                    )}
                  </div>
                </div>

                <button type="submit" className="button-primary mt-2 justify-center">
                  Отправить заявку
                </button>

                {(isSubmitSuccessful || isSubmitted) && (
                  <p className="rounded-[16px] border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    Спасибо за регистрацию. Наша команда свяжется с вами в ближайшее время.
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </section>

        <section id="contacts" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Контакты"
              title="Давайте вместе строить следующую главу в развитии образования"
              text="Свяжитесь с нами по вопросам участия, партнерства и сотрудничества в рамках Global EdTech."
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="glass-panel p-6 text-center"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                  <p className="mt-4 text-xl font-semibold text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2027 Global EdTech. Экосистема образования будущего.</p>
          <div className="flex gap-5">
            <a href="#hero" className="transition hover:text-cyan-300">
              Наверх
            </a>
            <a href="#register" className="transition hover:text-cyan-300">
              Регистрация
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
