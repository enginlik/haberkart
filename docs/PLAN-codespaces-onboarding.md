# PLAN-codespaces-onboarding

> **Status**: APPROVED for Execution
> **Goal**: Configure the project to run seamlessly in GitHub Codespaces (Cloud IDE).

---

## 🏗️ Context
The project is a Monorepo using **pnpm**, **Docker**, and **TypeScript**. To run this in Codespaces without manual installation headaches, we need to configure the "Dev Container" environment.

---

## 📅 Setup Plan

### Phase 1: Automation (Recommended)
**Goal**: Add configuration files so Codespaces auto-installs everything.

- [ ] **Create `.devcontainer` folder**: Standard folder for Codespaces config.
- [ ] **Create `devcontainer.json`**:
    - Select Node.js 20 image.
    - Enable "Docker-in-Docker" feature (for our docker-compose).
    - Auto-install `pnpm`.
    - Auto-install VS Code Extensions (Prisma, Tailwind, ESLint, Prettier).
    - `postCreateCommand`: Run `pnpm install`.
- [ ] **Push to GitHub**: Send these changes to the remote repo.

### Phase 2: Launching Codespaces (User Action)
**Goal**: User starts the cloud environment.

- [ ] **Open GitHub**: Go to `https://github.com/enginlik/haberkart`.
- [ ] **Create Codespace**: Click **Code** (Green Button) -> **Codespaces** -> **Create codespace on main**.
- [ ] **Wait**: It will take 1-2 minutes to build the container.

### Phase 3: Verify & Run (Inside Codespace)
**Goal**: Start the application.

- [ ] **Check Connections**:
    - `docker ps` (Should see empty list initially).
    - `docker-compose up -d` (Start DB, Redis, MinIO).
- [ ] **Setup Database**:
    - `pnpm turbo run db:push` (Create tables in Postgres).
- [ ] **Start App**:
    - `pnpm dev` (Starts Next.js, API, Worker).
- [ ] **Preview**:
    - VS Code will show a popup "Application running on port 3000". Click **Open in Browser**.

---

## 🧪 Verification
1.  **Terminal**: `pnpm dev` runs without error.
2.  **Browser**: `https://...-3000.app.github.dev` opens the Next.js dashboard.
3.  **Database**: `prisma studio` can connect to the DB.

---

## ❓ Immediate Action
Shall I execute **Phase 1** (Add `.devcontainer` config) and push it now? This will make your Codespaces experience 100% automatic.
