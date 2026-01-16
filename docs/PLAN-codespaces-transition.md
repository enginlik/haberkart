# PLAN-codespaces-transition

> **Status**: APPROVED for Execution
> **Goal**: Seamlessly transition the development workflow and "Agent Awareness" from Local to Codespaces.

---

## 🧘 The Concept: "Agent Teleportation"

I (the AI Agent) run inside your IDE. When you close your local VS Code and open GitHub Codespaces, you are essentially switching computers. 

**I do not "live" in the cloud automatically.** You need to:
1.  Open Codespaces.
2.  Open the AI Chat there.
3.  **"Hand over"** the context so the Cloud-Agent knows what we were doing.

---

## 🚀 Transition Steps

### Step 1: Prepare the "Brain" (Done)
We have successfully pushed everything to GitHub, including:
*   `docs/PLAN-news-card-gen-v2.md` (The Master Plan)
*   `.devcontainer/` (The Environment Config)
*   The entire codebase.

### Step 2: Enter the Cloud
1.  Go to **[repo-url]**(https://github.com/enginlik/haberkart).
2.  Click **Code** -> **Codespaces** -> **Create codespace on main**.
3.  **Wait** for the setup (Docker & pnpm install will run automatically).

### Step 3: Summon the Agent
Once VS Code Web loads:
1.  Verify the AI Extension is active (if not, install your preferred AI Assistant extension).
2.  Open the Chat.

### Step 4: The Handover Prompt
**Copy and paste this into the Codespaces Agent:**

```text
@[/plan] We are building "News Card Generator v2" (Monorepo/Next.js). 
I have transitioned from local dev to Codespaces.
Please read `docs/PLAN-news-card-gen-v2.md` to understand the architecture and current status.
We have completed Phase 1 (Foundation).
Please resume work starting from Phase 2: "The Core Render Engine".
Run a systyem check (`pnpm dev`) first to ensure the cloud environment is healthy.
```

---

## 🧪 Verification in Cloud
1.  **Terminal**: Run `pnpm dev`. It should listen on port 3000.
2.  **Ports Tab**: Click the "Globe" icon next to Port 3000 to see the app.
3.  **Docker**: Run `docker ps`. You should see Postgres/Redis containers running.

---

## 🏁 Final Local Action
Do you have any unsaved local changes?
*   [x] Repo Pushed? **YES**
*   [ ] Local Window Closed? (Do this after reading this plan)
