## MVP Plan: AI Web Dev Platform (Lovable/v0/Bolt-like)

### Decision: Tool Invocation Strategy
•⁠  ⁠Use LangGraph + LangChain Tools for the agent loop (deterministic graph, retries, timeouts).
•⁠  ⁠Keep our orchestrator thin; tools call a SandboxManager that abstracts Docker now and Firecracker later.
•⁠  ⁠Rationale: structured state machine, built-in control for steps/retries; still minimal surface area.

### High-Level Architecture
•⁠  ⁠Frontend (Vite + React + TS): chat panel, file tree, code viewer, preview iframe, logs.
•⁠  ⁠Backend (FastAPI): agent sessions, LangGraph runner, memory APIs, sandbox lifecycle, streaming.
•⁠  ⁠Agent: LangGraph nodes (planner, file_ops, deps_install, dev_runner, verifier, memory_update) using LangChain tools.
•⁠  ⁠Sandbox: Docker per session (switchable to Firecracker via SandboxManager interface).
•⁠  ⁠Storage: Postgres (sessions, messages, project snapshot JSON), Mem0 (conversation), optional pgvector later.

### Core Entities
•⁠  ⁠Session: { sessionId, createdAt, status, previewUrl, containerId, workspacePath }
•⁠  ⁠Message: { sessionId, role, content, toolCalls, timestamp }
•⁠  ⁠ProjectSnapshot: { sessionId, manifest, packageManager, framework, devCommand, port }
•⁠  ⁠Workspace: host directory bind-mounted into sandbox at /workspace

### Tool Surface (minimal, deterministic)
•⁠  ⁠fs_list(dir)
•⁠  ⁠fs_read(path)
•⁠  ⁠fs_write(path, content)
•⁠  ⁠install(pkgManager, args[])
•⁠  ⁠exec(cmd, cwd?, timeoutSec<=120)
•⁠  ⁠dev_start(cmd, port)
•⁠  ⁠dev_stop()
•⁠  ⁠http_fetch(url)

Notes
•⁠  ⁠Guardrails: path allowlist (workspace root), output truncation, timeouts, CPU/mem quotas, egress policy default deny.
•⁠  ⁠Logs: stream stdout/stderr; keep last N KB per step.

### Orchestrator Responsibilities
•⁠  ⁠Maintain conversation state and tool registry per session.
•⁠  ⁠Translate model tool-calls into sandbox actions; handle retries and backoff.
•⁠  ⁠Manage long-running dev process (dev_start) and log streaming.
•⁠  ⁠Health checks for preview (http_fetch) and container.
•⁠  ⁠Checkpointing (optional): git init, commit before risky edits.

### Backend API (no auth for MVP)
•⁠  ⁠POST /api/sessions
  - Body: { template?: "vite-react" | "nextjs" | "empty" }
  - Resp: { sessionId, previewUrl }

•⁠  ⁠POST /api/sessions/:id/messages (SSE stream)
  - Body: { text: string }
  - Stream events: token, tool_call, tool_result, status

•⁠  ⁠GET /api/sessions/:id/state
  - Resp: { status, previewUrl, container:{ id, port }, snapshot }

•⁠  ⁠POST /api/sessions/:id/dev/stop
  - Resp: { ok: true }

•⁠  ⁠WS /api/sessions/:id/logs
  - Messages: { ts, stream: "stdout"|"stderr", line }

•⁠  ⁠GET /api/sessions/:id/fs/list?path=
  - Resp: { entries:[{ name, path, type:"file"|"dir", size }] }

•⁠  ⁠GET /api/sessions/:id/fs/read?path=
  - Resp: { path, content }

•⁠  ⁠POST /api/sessions/:id/fs/write
  - Body: { path, content }
  - Resp: { ok:true }

•⁠  ⁠GET /api/sessions/:id/preview/proxy/*
  - Reverse proxy to container port for iframe preview

### Container Runtime (MVP Docker, Firecracker-ready)
•⁠  ⁠Base image: node:20-bookworm (add python:3.11 in multi-stage if needed).
•⁠  ⁠Non-root user; mount host workspace at /workspace (ro for install? rw for edits).
•⁠  ⁠Expose dev port (e.g., 5173/3000) mapped to preview proxy.
•⁠  ⁠Limits: CPU 1, RAM 1–2GB, disk quota; network egress restricted by policy.
•⁠  ⁠Firecracker path: replace Docker driver with MicroVM driver; keep same SandboxManager API.

### Model & Agent Config
•⁠  ⁠Provider: OpenAI/Anthropic with tool-calling.
•⁠  ⁠Agent: LangGraph with nodes and deterministic edges; retries with backoff.
•⁠  ⁠System prompt: agent rules (tools, iteration loop, safety, performance).
•⁠  ⁠Temperature: 0.2–0.4 for determinism.

### Frontend Features (MVP)
•⁠  ⁠Chat with streaming tokens and tool events.
•⁠  ⁠File explorer (list/read) with code viewer (Monaco).
•⁠  ⁠Optional diff viewer (git) and minimal editor toggle.
•⁠  ⁠Live preview iframe via backend proxy.
•⁠  ⁠Logs pane (stdout/stderr, tool summaries).

### Security & Safety
•⁠  ⁠No outbound network except package registries if permitted.
•⁠  ⁠No sudo, no destructive commands, path allowlist rooted at workspace.
•⁠  ⁠Secret redaction in logs; output truncation per step.
•⁠  ⁠Timeouts and retries for tools; kill switches for runaway processes.

### Memory (required from day one)
•⁠  ⁠Conversational: Mem0 stores chat turns and rolling summary.
•⁠  ⁠Project snapshot: Postgres JSON (manifest, framework, devCommand, port, packageManager).
•⁠  ⁠Retrieval later: pgvector/FAISS for code and logs if workspace grows.
•⁠  ⁠Decision/error logs: persisted and retrievable for the agent.

### LangGraph Nodes (sketch)
•⁠  ⁠planner -> chooses next action (edit, install, run, verify)
•⁠  ⁠file_ops -> fs_list/fs_read/fs_write
•⁠  ⁠deps_install -> install
•⁠  ⁠dev_runner -> dev_start/dev_stop
•⁠  ⁠verifier -> http_fetch + error capture
•⁠  ⁠memory_update -> update Mem0 + snapshot
•⁠  ⁠Edges: planner → {file_ops|deps_install|dev_runner} → verifier → planner; failures → retries/backoff.

### Development Roadmap
1) FastAPI skeleton with sessions and /fs/* endpoints.
2) SandboxManager (Docker driver) + preview reverse proxy + logs.
3) Implement tools (fs_*, exec, install, dev_start/stop, http_fetch).
4) LangGraph scaffold (planner, file_ops, dev_runner, verifier, memory_update) using tools.
5) Frontend chat + file explorer + preview + logs.
6) Memory: wire Mem0 + snapshot; add decision/error logs.
7) Hardening: timeouts, truncation, quotas, allowlists, retries.
8) Optional: Swap Docker driver -> Firecracker microVM driver.

### Why not LangChain (initially)
•⁠  ⁠Adds abstraction and dependencies we don't yet need.
•⁠  ⁠Our orchestrator is simpler: one agent, one tool-registry, straightforward retries.
•⁠  ⁠We can add LC later for complex multi-tool workflows, retrieval, or better tracing.

### Future Extensions
•⁠  ⁠Multi-model routing (cost/latency/quality).
•⁠  ⁠Templates (Next.js, Vite, Express/FastAPI starters).
•⁠  ⁠Evaluation harness for regression testing of generations.
•⁠  ⁠Team collaboration: shareable sessions and read-only previews.