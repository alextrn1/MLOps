# UI audit: общая система интерфейса

Дата аудита: 1 августа 2026. Эталон: `https://ml-ops-control-hub--iskinlidia.replit.app`. Сравнение выполнено при viewport `1536 × 900` CSS px, который соответствует пропорциям приложенных снимков `1920 × 1041` при системном масштабировании Windows 125%.

## Объём этапа

На этом этапе выровнены только оболочка и повторно используемые примитивы. Module Federation, маршруты, API, mock-данные, бизнес-логика и содержимое страниц не менялись. Специфичные стили отдельных экранов зафиксированы ниже как отдельный следующий слой визуального выравнивания.

## Методика

- фактические значения оригинала получены через `getComputedStyle` и `getBoundingClientRect` в браузере;
- локальная версия измерена тем же скриптом при том же viewport;
- восемь эталонных и девять локальных скриншотов использованы для проверки композиции, масштаба и состояний;
- значения с дробью `0.8px` в браузере являются результатом device scale; дизайн-токен границы остаётся `1px`.
- сравнительные снимки после изменений сохранены в `artifacts/ui-audit` при одинаковом размере `1280 × 720`.

## Фактические значения оригинала и изменения

| Элемент | Оригинал | Локально до аудита | Требуемое / внедрённое |
| --- | --- | --- | --- |
| Базовый шрифт | Plus Jakarta Sans, `16px / 24px`, 400 | Plus Jakarta Sans, `16px`, `line-height: normal` | явные `16px / 24px`, 400 |
| Canvas | `#f8fafc` | `#f8fafc` | без изменения |
| Основной текст | `#0f1729` | `#0f1729` | без изменения |
| Вторичный текст | `#64748b` | `#64748b` | без изменения |
| Sidebar | `256px`, `#0f1729`, граница `#141f38` | совпадал по размеру и цвету | вынесено в `--ui-sidebar-width` и общий `Sidebar` |
| Header | `56px`, padding `0 24px`, белый фон | совпадал | вынесено в общий `Header` |
| Активный SidebarItem | `36px`, padding `8px 12px`, gap `12px`, radius `6px`, `14px / 20px`, 500, `#16213c` | геометрия совпадала, line-height был `normal` | общий `SidebarItem`, явный `20px` |
| UserProfile: имя | `14px / 14px`, 500 | `14px`, 600, line-height `1.2` | `14px / 14px`, 500 |
| Заголовок страницы | `24px / 32px`, 700, letter-spacing `-0.6px` | совпадал на Projects/Models/Experiments; в новых remote встречался `30px / 37.5px` | общий `PageHeader`: `24px / 32px`, 700, `-0.025em` |
| Подзаголовок | `14px / 20px`, 400, `#64748b`, margin-top `4px` | совпадал на ранних remote; на новых — `16px` | общий `PageHeader`: `14px / 20px` |
| PrimaryButton | `36px`, padding `8px 16px`, radius `6px`, `14px / 20px`, 500, `#493cdd` | `36px`, `14px`, 600; page-specific варианты `46px`, `16px`, 600 | общий вес исправлен на 500; размеры закреплены токенами |
| SecondaryButton | `36px`, border `#e1e7ef`, radius `6px`, белый фон | близко к эталону | общий вариант с едиными hover/focus/disabled |
| Search | `448 × 36px`, padding `4px 12px 4px 36px`, radius `6px`, `14px / 20px`, shadow-sm | совпадал на Projects; page-specific варианты до `561 × 46px`, `17px` | общий `Search` закрепляет эталонные размеры |
| Input | border `#e1e7ef`, radius `6px`, `14px / 20px`; control среднего размера `40px` | `40px`, визуально близко | общий `Input`, сохранён размер формы `40px` |
| Toolbar/panel | padding `16px`, gap `16px`, radius `8px`, border `#e1e7ef`, высота `69.6px` | совпадал на ранних remote; page-specific `87px`, radius `11px`, padding `19px` | токены panel/radius/spacing готовы для следующей миграции |
| Card | radius `12px`, border `#e1e7ef`, белый фон, shadow-sm | совпадал | формализовано в `Card` и токенах |
| Table | `14px / 20px`, header `40px`, th padding `0 16px`, 500; td padding `16px`, строка около `72.8px` | Projects: почти совпадал (`td 73px`, но padding `12px 16px`); Datasets: `16px`, header `49px`, строка `91px`, padding `20px` | общий `Table` закрепляет эталон; специфичные таблицы пока не переписаны |
| StatusBadge | `12px / 16px`, 600, padding `2px 10px`, min-height около `22px`, pill | `12px / 12px`, 700 | исправлены line-height и weight; цвета сохранены семантически |
| Border | `#e1e7ef`, 1px | несколько близких локальных цветов | единый `--ui-color-border` |
| Shadow | `0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)` | совпадал у Card/Button/Search | закреплён как `--ui-shadow-control` и `--ui-shadow-card` |

## Основные общие отличия

1. В локальной реализации правильные значения были распределены между `apps/shell/src/styles.css` и CSS отдельных remote. Теперь исходная точка одна — `packages/ui/src/tokens.css`.
2. У части элементов отсутствовал явный `line-height`; это давало небольшое вертикальное смещение текста и иконок относительно оригинала.
3. Общая кнопка и статусный бейдж были заметно плотнее оригинала по насыщенности: 600 вместо 500 у кнопки и 700 вместо 600 у бейджа.
4. Появились несовместимые локальные масштабы в позднее реализованных Datasets, Deployments и Monitoring. Причина не в shell: их page-specific CSS задаёт заголовки 30px, текст 16–17px, кнопки 46px и увеличенные отступы.
5. Общие состояния hover/focus/disabled раньше частично дублировались. Теперь они определены один раз для кнопок, полей, навигации и icon button.

## Общие элементы

Общими считаются и находятся в `packages/ui`:

- `AppShell`, `Sidebar`, `Header`;
- `Search`, `SidebarItem`, `UserProfile`;
- `PageHeader`;
- `PrimaryButton`, `SecondaryButton`, базовый `Button`;
- `Input`, `Select`, а также совместимые `TextField` и `SelectField`;
- `Card`, `Table`, `StatusBadge`;
- `AppIcon`, `Notice`, loading/empty/error states.

Shell уже использует общие `AppShell`, `Sidebar`, `Header`, `Search`, `SidebarItem` и `UserProfile`. Примитивы страниц добавлены без принудительного переписывания содержимого remote на этом этапе.

## Специфичные элементы страниц

Следующие элементы не должны исправляться глобальным каскадом, потому что их структура и размеры зависят от конкретного экрана:

- Dashboard: KPI-карточки, списки инцидентов и последних развёртываний;
- Projects: колонки владельца, карточки summary и связанные сущности;
- Models: фильтры реестра, история версий, stage badges;
- Experiments: колонки метрик, параметры, логи и панели деталей;
- Datasets: version chip, schema/profile/lineage и текущая локальная таблица;
- Deployments: карточка deployment, окружение, traffic и график метрик;
- Monitoring: переключатель фильтров, severity icons, incident metrics и actions.

## Известные page-specific расхождения после этапа

- Datasets остаётся крупнее оригинала: локальные `30px`/`46px`/`91px` против эталонных `24px`/`36px`/`72.8px`.
- Deployments и Monitoring используют ту же увеличенную локальную шкалу и требуют отдельной миграции разметки на `PageHeader`, `Search`, `Table` и стандартные spacing tokens.
- Dashboard, Projects, Models и Experiments визуально ближе к эталону; их точечное выравнивание содержимого намеренно отложено.

## Токены

Система включает:

- палитру primary/info/danger/success/warning и нейтральные canvas/surface/text/muted/border/sidebar;
- типографику `12/16`, `14/20`, `16/24`, `18/24`, `24/32` и веса 400/500/600/700;
- spacing scale `0, 4, 8, 12, 16, 20, 24, 32, 40, 48`;
- layout: sidebar `256px`, compact sidebar `72px`, header `56px`, content padding `24px`;
- controls `36/40/44px`, icons `16/18/20/24px`;
- radii `6/8/12/999px`, border `1px`, shadow-sm;
- z-index header/sidebar/dropdown/modal: `20/30/50/100`.

Старые semantic CSS variables сохранены как aliases, чтобы не ломать уже реализованные remote.
