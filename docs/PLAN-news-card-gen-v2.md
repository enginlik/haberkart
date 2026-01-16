# PLAN-news-card-gen-v2

> **Status**: APPROVED for Implementation
> **Goal**: Build a high-performance, SaaS-ready Social Media Card Generator with a visual editor and hybrid rendering engine.

---

## 🏗️ System Architecture

### Core Concept: "JSON-Driven Hybrid Rendering"
To ensure the "Preview" in the browser matches the "Output" from the server 100%, we will use a **Common Render Engine** package based on **Satori**.

1.  **Template Schema**: A standardized JSON format defining the layout (text, images, shapes, styles).
2.  **Shared Renderer**: A TypeScript package that takes `(TemplateJSON, Data)` and outputs an SVG/PNG.
    *   **In Browser**: Runs live for instant preview.
    *   **In Worker**: Runs for batch generation/high-res export.

### Tech Stack
*   **Monorepo**: TurboRepo (npm workspaces)
*   **Apps**:
    *   `apps/web`: **Next.js 14** (App Router). Dashboard, Auth, Visual Editor.
    *   **apps/api**: **Fastify**. High-performance REST API.
    *   **apps/worker**: **Node.js** + **BullMQ**. Job processing.
*   **Packages**:
    *   `packages/schema`: Zod definitions (Job, Template, Profile).
    *   `packages/renderer`: Satori + HTML/CSS logic shared between Web & Worker.
    *   `packages/database`: Prisma Client + Migrations.
    *   `packages/config`: ESLint, TypeScript configs.
*   **Infra**: Docker Compose (PostgreSQL, Redis, MinIO).

---

## 📅 Phased Implementation Plan

### Phase 1: Foundation & Infrastructure (Week 1)
**Goal**: Monorepo setup, DB running, Basic API/Worker communication.

- [ ] **Repo Setup**: Initialize TurboRepo with `apps/web`, `apps/api`, `apps/worker`.
- [ ] **Docker**: `docker-compose.yml` for Postgres, Redis (Queue), MinIO (S3).
- [ ] **Database**: Define Prisma schema (`User`, `Workspace`, `Job`, `Template`, `JobOutput`).
- [ ] **Shared Schema**: Create `packages/schema` with Zod types for the "Template JSON".
    ```typescript
    // Example Draft
    type TemplateElement = {
      id: string;
      type: 'text' | 'image' | 'rect';
      x: number; y: number;
      style: CSSProperties;
      content: string; // supports {{handlebars}} or tokens
    }
    ```

### Phase 2: The Core "Render Engine" (Week 2)
**Goal**: A shared package that turns JSON into Image.

- [ ] **Package Setup**: Create `packages/renderer`.
- [ ] **Satori Integration**: Implement function `renderTemplate(json, data) -> svg`.
- [ ] **Font Handling**: Load Google Fonts dynamically given the JSON config.
- [ ] **Tests**: Unit tests ensuring generated SVG structure matches expectations.

### Phase 3: Backend Services (Week 2-3)
**Goal**: Functioning API and Worker that saves files to Storage.

- [ ] **API**:
    - Auth (JWT or Session).
    - `POST /jobs`: Validate JSON, add to BullMQ.
    - `GET /jobs/:id`: Check status.
- [ ] **Worker**:
    - Queue Processor: Pick up job.
    - Execution: Call `packages/renderer`.
    - Optimization: If Satori fails/needs fallback, launch Puppeteer (optional advanced path).
    - Storage: Upload result to MinIO, update DB status.

### Phase 4: Visual Editor & Dashboard (Week 3-4)
**Goal**: The user-facing tool.

- [ ] **Dashboard**: Workspace list, Job history table.
- [ ] **Visual Editor**:
    - Canvas area using `react-moveable`.
    - Properties panel (sidebar) to edit selected element (Text content, Color, Font).
    - State Management: Updates the JSON structure.
- [ ] **Live Preview**:
    - Use `packages/renderer` directly in the React component to show the Satori result layered under the editor interactions.

### Phase 5: Polish & SaaS Features (Week 5)
**Goal**: Production readiness.

- [ ] **Quota System**: Middleware in API to check daily limits.
- [ ] **Templates**: Seed DB with 2-3 high-quality starter templates (Default, Modern, Breaking News).
- [ ] **CI/CD**: Docker build pipelines.

---

## 🧪 Verification Plan

### Automated Tests
*   **Unit**: `packages/renderer` should output valid SVG strings for mock inputs.
*   **Integration**: API `POST /jobs` -> Worker processes -> MinIO has file -> API `GET` returns "COMPLETED".

### Manual Checks
*   **Editor Fidelity**: Design a card in the Web Editor -> Click Generate -> Downloaded image must obtain **pixel-perfect match** with the web view.
*   **Performance**: 100 concurrent requests should not crash the worker (BullMQ concurrency settings check).

---

## ❓ Critical Decisions (Requires Confirmation)

1.  **Auth Provider**: Shall we write our own JWT auth or use Clerk/Auth0? *(Plan assumes custom JWT for now for portability)*.
2.  **Satori Limitations**: Satori supports *most* CSS but not *all* (e.g., complex filters). Is this acceptable? *(Plan assumes YES, prioritizing speed)*.
