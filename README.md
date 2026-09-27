# Employee Management API

A simple Employee Management REST API built with **Node.js + TypeScript** using
**NestJS** and **TypeORM** (SQLite), created for the Raft Solution Software
Engineering Intern technical assessment.

## Tech Stack

- Node.js + TypeScript
- NestJS (framework)
- TypeORM + SQLite (`better-sqlite3` driver — zero external setup required)
- class-validator / class-transformer (request validation)

## How to Install

\`\`\`bash
git clone <your-repo-url>
cd raft-employee-management-api
npm install
cp .env.example .env
\`\`\`

## Database Setup

No external database installation is required. This project uses SQLite via
`better-sqlite3`. TypeORM's `synchronize: true` option automatically creates
the `database.sqlite` file and the `employees` table on first run. The
database file path is configurable via `DATABASE_PATH` in `.env`.

## How to Run the Project

\`\`\`bash
npm run start:dev
\`\`\`

Server starts on `http://localhost:3000` by default (configurable via `PORT`
in `.env`).

## API Endpoints

- `POST /employees` — create an employee (name, email, department,
  joiningDate all required; email must be valid and unique)
- `GET /employees` — list all employees, supports `?department=` filter
- `GET /employees/:id` — get a single employee by id, returns 404 if not
  found

Every response includes a calculated `leaveQuota` field.

## How to Test the APIs

\`\`\`bash
curl.exe -X POST http://localhost:3000/employees -H "Content-Type: application/json" -d "@test-employee.json"
curl.exe http://localhost:3000/employees
curl.exe "http://localhost:3000/employees?department=Engineering"
curl.exe http://localhost:3000/employees/<id>
\`\`\`

## Approach — Leave Quota Logic

Every employee response includes a `leaveQuota` field calculated from their
`joiningDate`:

- Annual leave: 14 days
- Joining on or before the 15th → that month counts as a full remaining
  month
- Joining after the 15th → calculation starts from the next month
- `leaveQuota = round(14 * remainingMonths / 12)`

This is implemented as a small, pure, testable function in
`src/employees/utils/leave-quota.util.ts`, kept separate from the service
layer so it is easy to read, test, and explain.

Verified against the assessment examples:
| Joining Date | Remaining Months | Leave Quota |
|---|---|---|
| March 10 | 10 | round(14×10/12) = **12** |
| March 20 | 9 | round(14×9/12) = **11** |

## Design Decisions

- NestJS was chosen (as preferred in the assessment) for built-in DI and
  first-class `class-validator` pipe support.
- SQLite (`better-sqlite3`) requires zero external services — just
  `npm install` and run.
- Email uniqueness is enforced both at the DB level (`unique` column) and
  explicitly in the service layer to return a clean `409 Conflict`.
- A global `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`)
  strips/rejects unexpected fields so DTOs are the single source of truth.
- `HttpExceptionFilter` normalizes every error response into one consistent
  JSON shape.