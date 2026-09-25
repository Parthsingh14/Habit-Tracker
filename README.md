# Personal Tracker

A single-user daily habit / sleep / goals tracker. Next.js + TypeScript on the
frontend, FastAPI + MongoDB on the backend, talking to each other over a REST
API. No authentication - this is a personal, single-user tool.

```
Tracker/
├── Frontend/   Next.js (TypeScript) app
├── Backend/    FastAPI (Python) app
└── README.md   you are here
```

---

## 1. Overview

The dashboard has three parts, all visible on one page:

1. **Monthly tracker** - a grid of tasks × days of the month. Click a cell to
   toggle it complete. Add, rename, and delete tasks inline. Navigate between
   months with `‹ Month Year ›`.
2. **Sleep** - log last night's sleep duration and see the last 15 days as a
   line chart.
3. **Monthly notes** - a free-text goals/notes box scoped to the selected
   month, auto-saved as you type.

---

## 2. Tech stack

| Layer      | Choice                                                         |
| ---------- | ---------------------------------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS, Axios       |
| Charts     | Chart.js via `react-chartjs-2`                                 |
| Backend    | FastAPI, Pydantic v2, Motor (async MongoDB driver)              |
| Database   | MongoDB                                                         |
| State      | React hooks + a small service layer (no Redux/TanStack Query - not needed at this scale) |

---

## 3. Architecture

Both apps follow the same top-to-bottom flow so a change in one layer never
leaks into another:

```
Frontend:  Component → hook → service (Axios) → Backend REST API
Backend:   Route → Service → Repository → MongoDB
```

- **Routes** (`api/routes/*.py`) only handle HTTP concerns (status codes, query params).
- **Services** (`services/*.py`) hold business logic and validation that isn't purely field-level.
- **Repositories** (`repositories/*.py`) are the only files that touch a MongoDB collection directly.
- **Schemas** (`schemas/*.py`) define the Pydantic request/response contracts.
- **Models** (`models/collections.py`) document the raw shape of what's actually stored, separately from the API contract.

On the frontend, **hooks** own state + data fetching for one feature area,
**services** are the only files that call Axios, and **components** are kept
presentational wherever possible.

---

## 4. Folder structure

```
Backend/
└── app/
    ├── main.py                  FastAPI app, CORS, lifespan, error handlers
    ├── api/
    │   ├── deps.py               Dependency-injection factories
    │   └── routes/                tasks.py · tracker.py · sleep.py · notes.py
    ├── core/config.py            Env-var driven settings
    ├── database/connection.py    Motor client + index creation
    ├── models/collections.py     TypedDicts for raw Mongo documents
    ├── schemas/                   task.py · tracker.py · sleep.py · notes.py · common.py
    ├── repositories/               task_repository.py · tracker_repository.py · sleep_repository.py · notes_repository.py
    ├── services/                   task_service.py · tracker_service.py · sleep_service.py · notes_service.py
    └── utils/                      date_utils.py · exceptions.py · object_id.py
└── tests/test_date_utils.py

Frontend/
├── app/                          layout.tsx · page.tsx · globals.css
├── components/
│   ├── dashboard/                 Dashboard.tsx · MonthSelector.tsx
│   ├── tracker/                   TrackerTable · TrackerHeader · TrackerRow · TrackerCell · AddTaskForm · TaskActions · DeleteTaskModal
│   ├── sleep/                     SleepTracker · SleepChart · SleepInput
│   ├── notes/                     MonthlyNotes · NotesEditor
│   └── common/                    Button · Modal · Loading · ErrorMessage · EmptyState · Toast
├── services/                      api.ts · taskService.ts · trackerService.ts · sleepService.ts · notesService.ts
├── hooks/                         useTasks · useTracker · useSleep · useMonthlyNotes · useDebounce · useToast
├── types/                         task.ts · tracker.ts · sleep.ts · notes.ts · api.ts
├── utils/                         date.ts · validation.ts
├── constants/api.ts
└── lib/cn.ts
```

---

## 5. Database design

Four collections. Each tracker cell is its own tiny document rather than the
whole month being one document, so toggling a cell is a cheap targeted
upsert instead of rewriting a large document.

```jsonc
// tasks
{ "_id", "name", "isActive", "createdAt", "updatedAt" }

// tracker_entries  - unique index on (taskId, date)
{ "_id", "taskId", "date", "completed", "createdAt", "updatedAt" }

// monthly_notes  - unique index on (year, month)
{ "_id", "month", "year", "content", "createdAt", "updatedAt" }

// sleep_records  - unique index on date
{ "_id", "date", "sleepStart", "sleepEnd", "durationMinutes", "createdAt", "updatedAt" }
```

**Design decisions that differ slightly from the initial sketch:**

- **Tasks are soft-deleted** (`isActive: false`) instead of removed. Deleting
  a task hides it from the grid immediately, but its historical
  `tracker_entries` aren't orphaned or lost.
- **`sleep_records` stores `durationMinutes` (int)** rather than a formatted
  duration string, so range validation (`0 < x ≤ 1440`) and chart math don't
  need to parse a string.
- **The tracker endpoint returns only `entries`**, not the task list - tasks
  come from `GET /api/tasks` independently, since the task list doesn't
  depend on which month is selected. This keeps `useTasks` and `useTracker`
  each owning exactly one thing.

---

## 6. API reference

All responses are JSON. All errors share one shape:

```jsonc
{ "error": true, "message": "...", "statusCode": 404 }
```

### Tasks

| Method | Path              | Body                | Notes                          |
| ------ | ----------------- | -------------------- | ------------------------------- |
| GET    | `/api/tasks`       | -                    | Active tasks only                |
| POST   | `/api/tasks`       | `{ name }`            | 201 Created                      |
| PUT    | `/api/tasks/{id}`  | `{ name }`            |                                   |
| DELETE | `/api/tasks/{id}`  | -                    | Soft delete, 204 No Content       |

### Tracker

| Method | Path                  | Body                       | Notes                                    |
| ------ | ---------------------- | ---------------------------- | ------------------------------------------ |
| GET    | `/api/tracker?month=&year=` | -                     | `{ month, year, daysInMonth, entries }`     |
| POST   | `/api/tracker/toggle`   | `{ taskId, date }`           | Creates or flips the entry, returns it       |

### Sleep

| Method | Path                    | Body                                               | Notes                        |
| ------ | ------------------------ | ----------------------------------------------------- | ------------------------------ |
| GET    | `/api/sleep?days=15`      | -                                                     | Last N days, oldest first       |
| POST   | `/api/sleep`               | `{ date, sleepStart?, sleepEnd?, durationMinutes }`     | Upserts by date, 201 Created    |

### Notes

| Method | Path                          | Body                              | Notes                                  |
| ------ | ------------------------------ | ------------------------------------ | ----------------------------------------- |
| GET    | `/api/notes?month=&year=`       | -                                    | Returns an empty draft if none saved yet    |
| PUT    | `/api/notes`                     | `{ month, year, content }`            | Upserts                                     |

`GET /api/health` is also available for a quick liveness check.

---

## 7. Frontend ↔ backend communication

- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000`) is the only place the
  backend's address is configured.
- `services/api.ts` is the single Axios instance; every other service file
  builds on it and every error is normalized to a plain `Error` with a
  human-readable `.message`, so components never need to know about Axios or
  HTTP status codes directly.
- Tracker cell toggles are **optimistic**: the UI flips immediately, and
  reverts with an error toast if the request fails (handles the "network
  failure while toggling a cell" case from the spec).
- Monthly notes **auto-save** on a ~1.2s debounce after you stop typing
  (chosen over an explicit Save button - see the comment in
  `hooks/useMonthlyNotes.ts` for the reasoning), and switching months
  before a save completes cannot save the wrong month's content.

---

## 8. Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- A running MongoDB instance (local, Docker, or Atlas)

### Backend

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then edit MONGODB_URI if needed
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000` (interactive docs at `/docs`).

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env.local       # then edit NEXT_PUBLIC_API_URL if needed
npm run dev
```

The app is now at `http://localhost:3000`.

### Tests

```bash
cd Backend
pip install pytest pytest-asyncio
pytest
```

---

## 9. Future extension possibilities

The layering makes most of these additive rather than restructuring work:

- **Streaks / stats** - a new `services/stats_service.py` reading from the
  existing `tracker_entries` collection, no schema changes needed.
- **Task reordering** - add an `order` field to `tasks` and a drag handle in `TrackerRow`.
- **Multiple sleep entries per day / naps** - relax the unique index on
  `sleep_records.date` and add a `type` field.
- **Tagging or categorizing tasks** - add a `category` field to `tasks` and
  a filter control in `TrackerTable`.
- **Multi-user support** - would mean adding auth and scoping every
  repository query by a `userId`; the layered structure means this only
  touches the repository layer, not routes or components.
- **Data export** (CSV/JSON of a month) - a new route + service; no changes
  to existing ones.

---

## 10. Notable edge cases already handled

- Leap years and variable month lengths are computed once
  (`get_days_in_month` / `getDaysInMonth`) and reused everywhere - never
  hardcoded.
- Toggling a cell for a task with zero prior entries creates one; toggling
  again removes/flips it via upsert, not a second document.
- Deleting a task removes it from the active list without deleting its
  historical `tracker_entries`.
- Sleep duration is rejected outside `(0, 24h]` on both the frontend
  (before a request is even sent) and the backend (authoritative check).
- Editing notes, then switching months before the debounce fires, does not
  save the old text under the new month.
