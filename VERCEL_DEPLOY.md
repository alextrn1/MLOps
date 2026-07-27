# Демонстрационный деплой на Vercel

## Схема деплоя

Один GitHub-репозиторий подключается к восьми независимым Vercel Projects. Каждый проект использует свой `apps/<name>` как Root Directory и собирает собственный `dist`.

| Vercel Project | Root Directory | Build Command | Output Directory | Production federation entry |
| --- | --- | --- | --- | --- |
| `mlops-shell` | `apps/shell` | `pnpm build` | `dist` | не используется как remote |
| `mlops-dashboard` | `apps/dashboard` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-projects` | `apps/projects` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-models` | `apps/models` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-experiments` | `apps/experiments` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-datasets` | `apps/datasets` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-deployments` | `apps/deployments` | `pnpm build` | `dist` | `/remoteEntry.js` |
| `mlops-monitoring` | `apps/monitoring` | `pnpm build` | `dist` | `/remoteEntry.js` |

Во всех проектах:

- Framework Preset: `Vite`;
- Package Manager: `pnpm` (версия берётся из корневого `packageManager`);
- Install Command: `pnpm install --frozen-lockfile` или значение Vercel по умолчанию;
- Build Command: `pnpm build`;
- Output Directory: `dist`;
- опция **Include source files outside of the Root Directory in the Build Step** должна быть включена, поскольку приложения импортируют workspace-пакеты из `packages/*` и используют корневой lockfile.

Файл `vercel.json` внутри каждого Root Directory уже фиксирует Vite, build command, `dist`, SPA fallback и междоменные заголовки.

## Загрузка репозитория в GitHub

Если репозиторий ещё не создан:

```bash
git init
git add .
git commit -m "Prepare microfrontends for Vercel demo"
git branch -M main
git remote add origin https://github.com/<organization>/<repository>.git
git push -u origin main
```

Перед `git add` не добавляйте `.env` с реальными URL или токенами. В Git должны попадать только примеры переменных окружения.

## Создание семи remote-проектов

В Vercel выберите **Add New → Project**, импортируйте один и тот же GitHub-репозиторий семь раз и создайте проекты `dashboard`, `projects`, `models`, `experiments`, `datasets`, `deployments`, `monitoring`.

Для каждого проекта задайте Root Directory и настройки из таблицы выше. Сначала выполните production deployment всех семи remote. После завершения зафиксируйте их стабильные production domains, например:

```text
https://mlops-dashboard.example.vercel.app
https://mlops-projects.example.vercel.app
```

Проверяйте entry по полному адресу `<production-domain>/remoteEntry.js`. URL конкретного preview deployment не рекомендуется использовать в production shell: после следующего push он изменится.

## Создание shell-проекта

Импортируйте тот же GitHub-репозиторий восьмой раз:

- Root Directory: `apps/shell`;
- Framework Preset: `Vite`;
- Build Command: `pnpm build`;
- Output Directory: `dist`;
- Include source files outside Root Directory: включено.

В **Settings → Environment Variables** shell-проекта добавьте:

| Variable | Value |
| --- | --- |
| `VITE_DASHBOARD_REMOTE_URL` | `https://<dashboard-domain>/remoteEntry.js` |
| `VITE_PROJECTS_REMOTE_URL` | `https://<projects-domain>/remoteEntry.js` |
| `VITE_MODELS_REMOTE_URL` | `https://<models-domain>/remoteEntry.js` |
| `VITE_EXPERIMENTS_REMOTE_URL` | `https://<experiments-domain>/remoteEntry.js` |
| `VITE_DATASETS_REMOTE_URL` | `https://<datasets-domain>/remoteEntry.js` |
| `VITE_DEPLOYMENTS_REMOTE_URL` | `https://<deployments-domain>/remoteEntry.js` |
| `VITE_MONITORING_REMOTE_URL` | `https://<monitoring-domain>/remoteEntry.js` |

Создайте переменные минимум для окружения **Production**. Для согласованного preview-стенда добавьте их также в **Preview**, указывая стабильные remote domains выбранного стенда. Vercel build shell намеренно завершится ошибкой, если хотя бы одна из этих переменных отсутствует.

Для демонстрационных приложений с API-слоем можно дополнительно задать `VITE_API_MODE=mock`. При будущем подключении backend задайте `VITE_API_MODE=real` и `VITE_API_BASE_URL=https://<api-domain>` в соответствующих Vercel Projects.

## Порядок деплоя

1. Разверните `dashboard`, `projects`, `models`, `experiments`, `datasets`, `deployments`, `monitoring`.
2. Проверьте `https://<remote-domain>/remoteEntry.js` каждого remote.
3. Добавьте семь URL в environment variables shell.
4. Разверните shell.
5. Проверьте верхнеуровневые маршруты и deep links через shell.

После изменения production domain remote обновите соответствующую переменную shell и выполните **Redeploy**: Vite подставляет federation URL во время сборки.

## Обновления после git push

После `git push origin main` каждый связанный Vercel Project создаёт новый deployment из того же коммита. Для изменений federation-контракта безопасный порядок такой:

1. дождаться успешных deployment затронутых remote;
2. проверить их `remoteEntry.js`;
3. выполнить redeploy shell, если менялись домены или build-time variables;
4. проверить маршруты через production shell.

Для обычных обратно совместимых изменений UI shell не требуется пересобирать: он продолжает запрашивать стабильный `/remoteEntry.js` remote-проекта.

## Проверка после деплоя

Проверка federation entries:

```bash
curl -I https://<dashboard-domain>/remoteEntry.js
curl -I https://<projects-domain>/remoteEntry.js
curl -I https://<models-domain>/remoteEntry.js
curl -I https://<experiments-domain>/remoteEntry.js
curl -I https://<datasets-domain>/remoteEntry.js
curl -I https://<deployments-domain>/remoteEntry.js
curl -I https://<monitoring-domain>/remoteEntry.js
```

Ожидается `200`, JavaScript Content-Type и заголовки:

```text
Access-Control-Allow-Origin: *
Cross-Origin-Resource-Policy: cross-origin
Cache-Control: public, max-age=0, must-revalidate
```

Проверьте standalone и deep links с обновлением страницы:

- dashboard: `/`;
- projects: `/projects`, `/projects/p1`, `/projects/p1/edit`;
- models: `/models`, `/models/m1`, `/models/m1/versions/mv1`;
- experiments: `/experiments`, `/experiments/e1`, `/experiments/new`;
- datasets: `/datasets`;
- deployments: `/deployments`;
- monitoring: `/monitoring`.

Затем откройте те же маршруты на домене shell. В DevTools → Network убедитесь, что shell получает `remoteEntry.js` и последующие `/assets/*` с доменов соответствующих remote без CORS-ошибок.

SPA rewrite не применяется к `/remoteEntry.js`, `/remoteEntry.ssr.js`, `/assets/*` и `/@mf-types/*`; остальные неизвестные пути возвращают `index.html`, после чего маршрут обрабатывает React Router.

## Локальная разработка

`pnpm dev` по-прежнему использует:

- shell — `http://127.0.0.1:5173`;
- dashboard — `http://127.0.0.1:5174`;
- projects — `http://127.0.0.1:5175`;
- models — `http://127.0.0.1:5176`;
- experiments — `http://127.0.0.1:5177`;
- datasets — `http://127.0.0.1:5178`;
- deployments — `http://127.0.0.1:5179`;
- monitoring — `http://127.0.0.1:5180`.

Локальные URL остаются fallback-значениями shell и не используются Vercel build при наличии обязательных `VITE_*_REMOTE_URL`.
