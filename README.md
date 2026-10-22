# OmedanTech Starthub

**Innovate. Build. Scale.**

A responsive technology-starthub website and training application management platform for **OmedanTech**. The platform showcases the firm's technology services and management team, presents trainee interests, and allows applicants to create an account before applying for available training programs.

> **Project status:** Update this status to reflect the actual implementation. Features that depend on external services—such as email verification, file storage, and production hosting—must be configured and tested before being described as operational.

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [OmedanTech Services](#omedantech-services)
- [Management Team](#management-team)
- [Trainee Showcase](#trainee-showcase)
- [Application Workflow](#application-workflow)
- [Recommended Technology Stack](#recommended-technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Admin, Staff, and Trainee Login Details](#admin-staff-and-trainee-login-details)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Suggested Project Structure](#suggested-project-structure)
- [Security and Privacy](#security-and-privacy)
- [Testing](#testing)
- [Deployment](#deployment)
- [Customization](#customization)
- [Known Limitations and Production Checklist](#known-limitations-and-production-checklist)
- [Contributing](#contributing)
- [License](#license)

## Overview

OmedanTech is a technology-focused firm offering digital product strategy, software and app development, AI prompting, AI development, cloud and infrastructure services, cybersecurity, IT staff augmentation, and technology training.

This project brings the firm's public-facing website and training application process into one platform. Visitors can explore services and published training programs. To apply for a program, a visitor must create an account and authenticate first. Applicants can then submit and track applications through a private dashboard, while authorized administrators manage programs and review submissions.

## Objectives

- Present OmedanTech's services and brand professionally.
- Provide a responsive, accessible experience on desktop, tablet, and mobile.
- Publish and manage training programs.
- Require account registration and authentication before application submission.
- Store applications and status history in a database.
- Provide applicants with a private dashboard.
- Give authorized administrators tools to manage programs, applicants, website content, team profiles, and trainee showcase entries.
- Apply appropriate security and privacy controls.

## Key Features

### Public website

- Red-and-blue visual identity.
- Responsive navigation and hero section.
- About, mission, vision, and values sections.
- Seven technology service cards.
- Management team section.
- Trainee showcase with program interests.
- Searchable and filterable training catalog.
- Training program detail pages.
- Contact form and FAQs.
- Privacy Policy and Terms pages.
- Footer marquee: **“Innovation and Creativity in Tech”**
- Footer credit: **“Developed by OmedanTech Team 2026.”**

### Account and authentication

- Role-based account registration and login for administrators, staff, and trainees.
- Required private JPEG, PNG, or WebP passport photograph for new trainee registrations.
- Unique email validation.
- Password hashing.
- Server-side authorization for administrator and assigned-program staff actions.
- Protected trainee, staff, and administrator portals.

### Training applications

- Program-specific application forms.
- Applicant profile and learning interests.
- Optional trainee-showcase opt-in during application, with a separate optional showcase photo and administrator approval before public display.
- Optional supporting-document upload, if enabled.
- Application review before submission.
- Unique application reference numbers.
- Submission confirmation.
- Application status tracking.
- Prevention of duplicate applications where configured.
- Enforcement of program opening and closing dates.

### Applicant dashboard

- Profile management.
- Available training programs.
- Submitted applications and reference numbers.
- Application statuses and history.
- Training sessions for accepted programs, with assignment instructions, written submissions, scores, trainer feedback, and progress tracking.
- Notifications and account settings.

### Administrator dashboard

- Staff account provisioning and program assignments.
- Training program creation, editing, publishing, closing, and archiving.
- Applicant and application management.
- Application review, applicant-detail editing, and status updates.
- Team profile and trainee showcase management.
- Service and website content management.
- System-wide attendance and class-performance oversight.
- Program assignments, trainee submissions, scoring, and training-progress monitoring across all programs.
- Trainee account contact-detail editing, restricted passport-photo viewing, one-time password resets, and permanent deletion of linked trainee records.
- Contact message management, audit logs, and authorized application exports in Excel (.xlsx), PDF, or CSV format.

### Staff portal

- Access only to programs assigned by an administrator.
- Manage accepted trainees enrolled in assigned programs.
- Record attendance, tasks handled, assignments, class contributions, feedback, and optional scores.
- Publish program assignments, review trainee responses, and score submissions to update each trainee's training progress.

Training progress is the percentage of points earned across published assignments for an accepted program. Trainees can update an ungraded submission; after it is scored, the submission is locked. Assignment responses are submitted as text in the trainee dashboard.

## OmedanTech Services

The website presents the following seven services:

1. **Product Discovery & Strategy** — Market-fit analysis, customer experience (CX) research, product discovery, and project roadmaps.
2. **Software & App Development** — Custom software, Minimum Viable Products (MVPs), websites, web applications, mobile apps, and APIs.
3. **AI Prompting** — Prompt engineering, instruction and context design, structured outputs, and effective use of Large Language Models (LLMs).
4. **AI Development** — AI-enabled applications, machine learning, data preparation, predictive modeling, model integration, evaluation, and deployment.
5. **Cloud & Infrastructure** — Cloud architecture, server infrastructure, application deployment, monitoring, scalability, backup, and technical debt management.
6. **Cybersecurity & Compliance** — Authorized vulnerability assessments, secure development, data protection, security reviews, and compliance readiness.
7. **IT Staff Augmentation** — Developers, UI/UX designers, product managers, QA testers, and other technical professionals.

Service descriptions and offerings should remain editable by authorized administrators where content management is supported.

## Management Team

The team section is designed for the following profiles:

| Name | Position | Professional title |
|---|---|---|
| Comrade Idara Udofia | Managing Director | Software Engineer |
| Comrade Imoh Ben | Full-Stack Developer | Senior Engineer |
| Miss Comfort Iwah | Front Desk Officer | Customer Care |
| Miss Theresa | UI/UX Designer | Designer |
| Temple Matthew | Junior Developer | Junior Developer |

Use official photographs supplied and approved by the individuals. Until photographs are available, use clearly replaceable placeholders. Do not represent stock photos as actual team members.

## Trainee Showcase

The trainee showcase can feature approved profiles and areas of interest such as:

- AI Prompting
- AI Development and Machine Learning
- Full-Stack Web Development
- Frontend Development
- Backend Development
- Mobile App Development
- UI/UX Design
- Cloud Computing and DevOps
- Cybersecurity
- Product Discovery and Strategy

Only publish trainee names, photographs, testimonials, or achievements with appropriate permission. If real profiles are not yet available, use clearly labelled sample data or generic illustrations.

## Application Workflow

The expected application journey is:

1. A visitor browses available training programs.
2. The visitor selects a program and clicks **Apply Now**.
3. If not authenticated, the visitor is redirected to registration or login.
4. The selected program is preserved through a validated redirect flow.
5. The user creates an account and verifies their email if verification is enabled.
6. The authenticated applicant completes the program's application form.
7. The server validates eligibility, required fields, program availability, and duplicate-application rules.
8. The application is saved to the database and assigned a unique reference number.
9. The applicant receives an on-screen confirmation and, when configured, an email.
10. The applicant tracks the application in their dashboard.
11. An authorized administrator or reviewer evaluates the application and updates its status.

Typical application statuses:

- Draft
- Submitted
- Under Review
- Shortlisted
- Accepted
- Rejected
- Withdrawn

Status changes should be authorized and recorded in an application history.

## Recommended Technology Stack

Use the stack actually implemented by the project. The following is the recommended architecture.

| Layer | Recommended technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Forms | React Hook Form and Zod |
| Icons | Lucide |
| Backend | Node.js, Express.js, TypeScript |
| API | REST API |
| Database | PostgreSQL |
| ORM | Prisma |
| Testing | Vitest or Jest, API integration tests, Playwright |
| Email | Configured transactional email provider |
| File storage | Private S3-compatible object storage, if needed |
| Deployment | A suitable frontend host, backend host, and managed PostgreSQL provider |

Package versions and commands may differ depending on the generated repository.

## System Architecture

```text
Browser / Mobile Device
          |
          v
React + TypeScript Frontend
          |
          v
Backend REST API (Node.js + Express)
          |
          +------ Authentication and authorization
          |
          +------ Training and application workflows
          |
          +------ Admin and content management
          |
          v
PostgreSQL Database
          |
          +------ Optional transactional email provider
          |
          +------ Optional private document storage
```

The backend must be the authority for authentication, permissions, application validation, and data access. Frontend route guards improve user experience but do not replace server-side authorization.

## Getting Started

### Prerequisites

Install the tools required by the actual repository:

- Node.js LTS and npm (or the package manager used by the project).
- PostgreSQL.
- Git.
- A code editor such as Visual Studio Code.

If the repository uses a monorepo, separate frontend and backend applications, or Docker, follow its actual scripts and setup instructions.

### 1. Clone the repository

Replace the placeholder URL with the actual repository URL.

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

For a single-package project:

```bash
npm install
```

For a project with separate `client` and `server` folders, install dependencies in each folder or use the workspace instructions defined in the root `package.json`.

### 3. Configure environment variables

Create local environment files from the project's example files, if provided. For example:

```bash
cp .env.example .env
```

On Windows Command Prompt, copy the file with:

```bat
copy .env.example .env
```

Set the database connection and any required authentication, email, or storage settings. Never commit real secrets to source control.

### 4. Create the database

Create a PostgreSQL database for local development, for example:

```sql
CREATE DATABASE omedantech_starthub;
```

Configure the application's database URL to match your local PostgreSQL username, password, host, port, and database name.

### 5. Run database migrations

If the project uses Prisma, the commands may look like:

```bash
npx prisma generate
npx prisma migrate dev
```

If seed data is configured, run the repository's documented seed command. Use only clearly labelled demonstration records for development.

### 6. Start the development server

Use the scripts defined in `package.json`. A common single-app command is:

```bash
npm run dev
```

If the frontend and backend run separately, start each using its own documented development command. Confirm the actual local URLs in the terminal output.

### 7. Verify the application

Check that:

- The landing page renders at the local URL.
- All seven service sections appear.
- Team and trainee cards use the correct content or placeholders.
- Registration and login work.
- An unauthenticated user cannot submit an application.
- The selected training program is preserved after login or registration.
- A submitted application is persisted and appears in the applicant dashboard.
- An accepted trainee can view program assignments, submit work, and see scores and updated progress.
- Assigned staff and administrators can publish assignments, review submissions, and score trainees; unauthorized users cannot access program submissions.
- An applicant cannot view another applicant's records.
- Administrative actions require the correct permissions.

## Admin, Staff, and Trainee Login Details

All account types sign in at **`/login`**. Successful login routes each account to its appropriate portal:

| Account | Login email | Password | Portal |
|---|---|---|---|
| Administrator | `BOOTSTRAP_ADMIN_EMAIL` configured in `.env` | `BOOTSTRAP_ADMIN_PASSWORD` configured in `.env` | `/admin` |
| Staff | Email entered by an administrator when creating the staff account | Private initial password set by the administrator (at least 12 characters) | `/staff` |
| Trainee | Email used to register at `/register` | Password chosen during registration | `/dashboard` |

There are **no shared or hard-coded demo administrator or staff credentials**. To configure the first administrator, copy `.env.example` to `.env` and set a valid `BOOTSTRAP_ADMIN_EMAIL`, a unique `BOOTSTRAP_ADMIN_PASSWORD` of at least 12 characters, and a unique `JWT_SECRET`. Keep `.env` private and never commit real credentials. When the database has no administrator, the server uses these bootstrap values to create an administrator account.

After signing in, an administrator can use **Staff & Access** in the Admin Console to create staff logins. Select a position—Managing Director, Full-Stack Developer, UI/UX Designer, Front Desk, Junior Developer, or Project Manager—and assign the programs the staff member is responsible for. Share the staff email and initial password privately. Staff sign in at `/login` and can manage only their assigned programs.

Trainees create their own account at `/register` (also linked from the login page), then sign in at `/login` with their registered email and password. Application submission and the trainee dashboard require a trainee account.

New trainee registrations must include a JPEG, PNG, or WebP passport photograph up to 5 MB and explicit consent for its administrative use. The image is stored under the private `data/private/passports/` directory, excluded from version control, and served only through an authenticated administrator endpoint. Back up and protect this directory alongside the database; do not place passport images in public assets.

Administrators can manage registered accounts from **Trainee Accounts**. They can edit contact details, view passport photographs, issue a temporary password that is displayed once, or permanently delete a trainee account and its linked applications, attendance, performance, and training submissions. Passwords remain one-way hashed and are never viewable. Permanent deletion also removes the passport photograph and personal references from audit details.

The example values in `.env.example` are placeholders, not usable credentials. Existing installations that used former demo administrator credentials should configure a real bootstrap administrator in `.env`; do not reuse or publish demo passwords.

## Environment Configuration

The current server reads its administrator bootstrap credentials and signing secret from the root `.env` file. Copy `.env.example` to `.env` and replace its placeholder values. The authentication-related settings are:

```dotenv
JWT_SECRET="replace-with-a-unique-random-secret"
BOOTSTRAP_ADMIN_EMAIL="admin@example.com"
BOOTSTRAP_ADMIN_PASSWORD="replace-with-a-unique-password-of-at-least-12-characters"
```

The generic example below is for optional integrations; variables not present in `.env.example` are not required by this application's current local JSON database.

```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/omedantech_starthub"

# Configure according to the authentication implementation.
SESSION_SECRET="replace-with-a-long-random-secret"

# Configure only if email verification and notifications are implemented.
EMAIL_FROM="noreply@example.com"
EMAIL_PROVIDER_API_KEY=""

# Configure only if private document uploads are enabled.
STORAGE_ENDPOINT=""
STORAGE_BUCKET=""
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
```

For a Vite frontend, only variables intentionally exposed to the browser should use the `VITE_` prefix. **Never place database credentials, session secrets, private storage keys, or privileged API keys in frontend environment variables.**

Use a separate, secure production configuration. Do not use the example values as real secrets.

## Database Setup

The recommended database entities include:

- `users`
- `user_profiles`
- `roles`
- `user_roles`
- `services`
- `team_members`
- `trainee_showcase`
- `training_programs`
- `training_modules`
- `applications`
- `application_answers`
- `application_documents`
- `application_status_history`
- `notifications`
- `email_verification_tokens`
- `password_reset_tokens`
- `contact_messages`
- `faqs`
- `site_settings`
- `audit_logs`

Use foreign keys, appropriate indexes, unique constraints, and timestamps. Keep uploaded documents in private object storage or another secured storage layer rather than exposing sensitive files through public URLs.

## Available Scripts

Run the commands supported by the project's `package.json`. Common examples include:

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run lint
```

These are examples, not a guarantee that every script exists. Check `package.json` for the actual scripts. Backend migrations, seeding, and server startup may have separate commands.

## Suggested Project Structure

A possible structure for a full-stack implementation is:

```text
omedantech-starthub/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── features/
│       │   ├── auth/
│       │   ├── training/
│       │   ├── applications/
│       │   ├── team/
│       │   └── admin/
│       ├── hooks/
│       ├── lib/
│       ├── routes/
│       └── main.tsx
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── app.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Adapt this structure to the generated repository rather than moving files unnecessarily.

## Security and Privacy

Before production deployment:

- Hash passwords using Argon2id or a suitable established password-hashing algorithm.
- Enforce authentication and authorization on the server.
- Validate inputs on both client and server.
- Use parameterized database access through the ORM.
- Configure secure cookies and CSRF protection where applicable.
- Add rate limiting to authentication and public form endpoints.
- Protect against XSS and use secure HTTP headers.
- Expire and securely handle email-verification and password-reset tokens.
- Restrict file types and sizes; validate uploads server-side and scan files where possible.
- Store applicant documents privately and authorize every download.
- Prevent applicants from accessing other users' records.
- Restrict admin actions by role and keep audit history for sensitive operations.
- Collect only necessary personal data and publish a clear privacy notice.
- Define retention, deletion, backup, and recovery procedures.
- Keep secrets out of source control and logs.
- Use HTTPS in production.

Cybersecurity services advertised on the website should be performed only with appropriate authorization and scope.

## Testing

Recommended test coverage includes:

### Authentication
- Registration and duplicate-email handling.
- Login and logout.
- Email verification, if enabled.
- Password reset.
- Session expiry and access control.

### Training applications
- Required-field validation.
- Mandatory authentication before submission.
- Correct return to the selected program after authentication.
- Closed-program restrictions.
- Duplicate-application prevention.
- Successful database persistence.
- Reference number generation.
- Application status history.

### Authorization and privacy
- Applicants can only access their own applications.
- Reviewers can only access permitted records.
- Admin endpoints reject unauthorized users.
- Private documents cannot be accessed through public URLs.

### UI and accessibility
- Responsive navigation.
- Keyboard navigation and visible focus.
- Form labels and validation messages.
- Loading, empty, success, and error states.
- Reduced-motion support.

## Deployment

The deployment platform will depend on the implementation and hosting choices.

1. Build and test the frontend.
2. Deploy the backend API to a suitable Node.js host.
3. Provision a managed PostgreSQL database.
4. Configure production environment variables and secrets.
5. Apply database migrations using the deployment procedure.
6. Configure email and private file storage if required.
7. Configure frontend API URLs, CORS, cookies, and allowed origins.
8. Enable HTTPS and appropriate security headers.
9. Configure database backups, monitoring, and error reporting.
10. Test registration, login, application submission, status tracking, and admin permissions in the deployed environment.

Do not publish the system as production-ready until all required integrations have been configured and tested.

## Customization

Before launch, replace or verify:

- Official OmedanTech logo and approved brand assets.
- Company mission, vision, and contact details.
- Management team photographs and biographies.
- Trainee showcase content and publication permissions.
- Training titles, descriptions, curricula, dates, fees, and eligibility rules.
- Privacy Policy and Terms of Use.
- Email provider and sender domain.
- Hosting, database, and file-storage configuration.
- Footer credit: **Developed by OmedanTech Team 2026.**

The footer marquee must display:

**Innovation and Creativity in Tech**

## Known Limitations and Production Checklist

This README describes the intended system. It does not, by itself, confirm that every feature has been implemented or deployed.

Before launch, verify that:

- [ ] The actual repository matches the documented stack.
- [ ] Registration and authentication are connected to the backend.
- [ ] Email verification and password reset work, if enabled.
- [ ] PostgreSQL migrations run successfully.
- [ ] Training programs are managed through persistent data.
- [ ] Applications are saved and can be reviewed.
- [ ] Backend authorization protects every private endpoint.
- [ ] File uploads are private and validated, if enabled.
- [ ] Team and trainee images are approved and accurate.
- [ ] Privacy Policy and Terms have been reviewed.
- [ ] Automated tests pass.
- [ ] Production secrets are configured securely.
- [ ] Backups and recovery procedures are in place.
- [ ] The deployed application has been tested end to end.

## Contributing

For project changes:

1. Create a feature branch.
2. Keep changes focused and maintainable.
3. Add or update tests for changed behavior.
4. Run the available lint, test, and build commands.
5. Document any new environment variables or setup steps.
6. Submit a pull request for review.


---

**OmedanTech Tech Starthub**  
**Innovate. Build. Scale.**  
*Innovation and Creativity in Tech*  
*Developed by OmedanTech Team 2026.*
