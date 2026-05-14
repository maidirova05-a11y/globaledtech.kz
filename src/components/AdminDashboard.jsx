import { useEffect, useMemo, useState } from "react";

const participationTypeLabels = {
  delegate: "Участник",
  speaker: "Спикер",
  partner: "Партнер",
};

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "").replace(/"/g, '""');
  return `"${stringValue}"`;
}

function buildExportRows(registrations) {
  return registrations.map((item) => ({
    createdAt: formatDate(item.createdAt),
    name: item.name || "",
    surname: item.surname || "",
    email: item.email || "",
    phone: item.phone || "",
    company: item.company || "",
    participationType:
      participationTypeLabels[item.participationType] || item.participationType || "",
  }));
}

export default function AdminDashboard() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("adminPassword") || "");
  const [inputValue, setInputValue] = useState(
    () => sessionStorage.getItem("adminPassword") || "",
  );
  const [registrations, setRegistrations] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const totalCount = registrations.length;
  const speakerCount = useMemo(
    () => registrations.filter((item) => item.participationType === "speaker").length,
    [registrations],
  );
  const partnerCount = useMemo(
    () => registrations.filter((item) => item.participationType === "partner").length,
    [registrations],
  );

  const loadRegistrations = async (adminPassword) => {
    setStatus("loading");
    setError("");

    const response = await fetch("/api/admin/registrations", {
      headers: {
        "x-admin-password": adminPassword,
      },
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setError(result?.error || "Не удалось загрузить список регистраций.");
      return;
    }

    setRegistrations(Array.isArray(result?.registrations) ? result.registrations : []);
    setStatus("success");
  };

  useEffect(() => {
    if (!password) {
      return;
    }

    void loadRegistrations(password);
  }, [password]);

  const handleLogin = async (event) => {
    event.preventDefault();

    const trimmedPassword = inputValue.trim();
    if (!trimmedPassword) {
      setError("Введите пароль администратора.");
      setStatus("error");
      return;
    }

    sessionStorage.setItem("adminPassword", trimmedPassword);
    setPassword(trimmedPassword);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminPassword");
    setPassword("");
    setInputValue("");
    setRegistrations([]);
    setStatus("idle");
    setError("");
  };

  const handleExport = () => {
    if (registrations.length === 0) {
      setStatus("error");
      setError("Нет данных для выгрузки.");
      return;
    }

    const rows = buildExportRows(registrations);
    const header = [
      "Дата и время",
      "Имя",
      "Фамилия",
      "Email",
      "Телефон",
      "Компания",
      "Формат участия",
    ];

    const csvLines = [
      header.map(escapeCsvValue).join(";"),
      ...rows.map((row) =>
        [
          row.createdAt,
          row.name,
          row.surname,
          row.email,
          row.phone,
          row.company,
          row.participationType,
        ]
          .map(escapeCsvValue)
          .join(";"),
      ),
    ];

    const csvContent = `\uFEFF${csvLines.join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = downloadUrl;
    link.download = `global-edtech-registrations-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen bg-[#081124] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(8,15,42,0.45)] backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Admin Panel
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Регистрации Global EdTech
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Здесь можно смотреть все заявки, которые отправили пользователи через форму
              регистрации на сайте.
            </p>
          </div>

          {password ? (
            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
              >
                На сайт
              </a>
              <button
                type="button"
                onClick={() => void loadRegistrations(password)}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Обновить
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/20"
              >
                Выгрузить в Excel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-rose-400/60 hover:text-white"
              >
                Выйти
              </button>
            </div>
          ) : null}
        </div>

        {!password ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_rgba(8,15,42,0.45)] backdrop-blur-xl sm:p-8">
            <form className="grid gap-5" onSubmit={handleLogin}>
              <div>
                <label
                  className="mb-3 block text-sm font-medium text-slate-200"
                  htmlFor="adminPassword"
                >
                  Пароль администратора
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="w-full rounded-[18px] border border-white/10 bg-[#212847] px-4 py-4 text-white outline-none transition focus:border-cyan-400/70"
                  placeholder="Введите пароль"
                />
              </div>

              <button
                type="submit"
                className="rounded-[18px] bg-gradient-to-r from-cyan-500 via-sky-400 to-fuchsia-500 px-5 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(56,189,248,0.25)]"
              >
                Войти в админку
              </button>

              {status === "error" && error ? (
                <p className="rounded-[18px] border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Всего заявок</p>
                <p className="mt-3 text-3xl font-semibold text-white">{totalCount}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Спикеры</p>
                <p className="mt-3 text-3xl font-semibold text-white">{speakerCount}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Партнеры</p>
                <p className="mt-3 text-3xl font-semibold text-white">{partnerCount}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(8,15,42,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h2 className="text-lg font-semibold text-white">Список регистраций</h2>
                {status === "loading" ? (
                  <span className="text-sm text-cyan-200">Загрузка...</span>
                ) : null}
              </div>

              {status === "error" && error ? (
                <div className="px-5 py-4">
                  <p className="rounded-[18px] border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </p>
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm text-slate-400">
                      <th className="px-5 py-4 font-medium">Дата</th>
                      <th className="px-5 py-4 font-medium">Имя</th>
                      <th className="px-5 py-4 font-medium">Email</th>
                      <th className="px-5 py-4 font-medium">Телефон</th>
                      <th className="px-5 py-4 font-medium">Компания</th>
                      <th className="px-5 py-4 font-medium">Формат</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length > 0 ? (
                      registrations.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 text-sm text-slate-200">
                          <td className="px-5 py-4 align-top">{formatDate(item.createdAt)}</td>
                          <td className="px-5 py-4 align-top">
                            <div className="font-medium text-white">
                              {[item.name, item.surname].filter(Boolean).join(" ")}
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top">{item.email || "—"}</td>
                          <td className="px-5 py-4 align-top">{item.phone || "—"}</td>
                          <td className="px-5 py-4 align-top">{item.company || "—"}</td>
                          <td className="px-5 py-4 align-top">
                            {participationTypeLabels[item.participationType] ||
                              item.participationType ||
                              "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-5 py-8 text-sm text-slate-400" colSpan={6}>
                          {status === "loading"
                            ? "Загружаем регистрации..."
                            : "Пока нет сохраненных регистраций."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
