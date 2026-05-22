# GlobalEdTech Migration Checklist

## Что уже сохранено в репозитории

- `vercel.json`
- `.env.example`
- `ADMIN_SETUP.md`
- весь исходный код фронтенда и API

## Что НЕ хранится в репозитории и нужно сохранить вручную

- реальные значения `Environment Variables` из текущего Vercel-проекта
- привязка домена
- настройки Storage / KV
- настройки проекта в Vercel UI, если они менялись вручную

## Обязательные env-переменные

Сверь и перенеси значения для:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `APP_ALLOWED_ORIGINS`
- `AI_REQUEST_TIMEOUT_MS`
- `AI_MAX_MESSAGE_LENGTH`
- `AI_MAX_HISTORY_ITEMS`
- `AI_RATE_LIMIT_WINDOW_MS`
- `AI_RATE_LIMIT_MAX`
- `AI_VOICE_RATE_LIMIT_MAX`
- `AI_REGISTRATION_RATE_LIMIT_MAX`
- `AI_BLOCK_SUSPICIOUS_INPUT`
- `AI_ENABLE_SANITIZATION`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `VOICE_PROVIDER`
- `OPENAI_TTS_MODEL`
- `OPENAI_TTS_VOICE`
- `OPENAI_TTS_VOICE_LABEL`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `ELEVENLABS_VOICE_LABEL`
- `ELEVENLABS_MODEL_ID`
- `ELEVENLABS_STABILITY`
- `ELEVENLABS_SIMILARITY_BOOST`
- `ELEVENLABS_STYLE`

Источник шаблона: `.env.example`

## Что использует проект

- `api/registrations.js`: зависит от `KV_REST_API_URL` и `KV_REST_API_TOKEN`
- `api/admin/auth.js`: зависит от `ADMIN_PASSWORD`
- админ-сессия также требует `ADMIN_SESSION_SECRET`
- `vercel.json`: содержит rewrite для `/admin`

## Безопасный порядок переноса

1. Убедиться, что репозиторий на GitHub актуален.
2. В старом Vercel-проекте открыть `Settings -> Environment Variables` и сохранить все реальные значения.
3. В новом Vercel-аккаунте импортировать этот GitHub-репозиторий.
4. Добавить все env-переменные до первого production deploy.
5. Подключить KV/Storage или заново привязать существующее хранилище, если это требуется в новом аккаунте.
6. Запустить deploy.
7. Проверить:
   - главную страницу
   - отправку регистрации
   - `/admin`
   - вход в админку
8. Только после проверки переключать основной домен.

## Важно

- `.env` в репозитории отсутствует и в git не хранится
- реальные секреты из старого Vercel я не вижу и не могу вытащить без твоего входа в аккаунт
- перенос GitHub/Vercel-подключения через UI я тоже не могу сделать сам без доступа к твоим аккаунтам
