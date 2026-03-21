---
id: "51"
title: "Fundamentals of web dev"
slug: "fundamentals-of-web-dev"
date: "2026-03-21"
subtitle: ""
status: "draft"
categories: []
tags: []
---

## Client-Server Communication

All three are **clients** talking to the same underlying system — they differ in environment and rendering, not in how they communicate.

---

### The Core Pattern

```
Mobile App  ──┐
              ├──► API Server ──► Database / Services
Web Frontend ─┘
```

Both clients send **HTTP requests** to the API and receive structured data (almost always JSON) back. The API is the contract between them.

---

### What Each Layer Does

**API (the server)**
- Exposes endpoints: `GET /posts`, `POST /users`, etc.
- Contains business logic and data access
- Returns data — never decides how it looks
- Stateless: each request carries everything needed (auth token, params)

**Web Frontend**
- Runs in a browser (HTML/CSS/JS)
- Fetches data via `fetch()` / `XMLHttpRequest`
- Renders data into DOM elements
- Constrained by browser security (CORS, same-origin policy)

**Mobile App**
- Runs natively on iOS/Android (or cross-platform like React Native)
- Makes the same HTTP calls, just via platform networking libraries
- No CORS restrictions — it's not a browser
- Can cache aggressively, access device hardware

---

### A Concrete Example

User logs in on a mobile app:

```
1. App sends:  POST /api/auth  { email, password }
2. API checks credentials, returns: { token: "abc123", user: {...} }
3. App stores token locally
4. App sends:  GET /api/posts  (Authorization: Bearer abc123)
5. API validates token, returns: [ { id: 1, title: "..." }, ... ]
6. App renders the list
```

A web frontend does the *exact same steps* — different rendering code, same API calls.

---

### Key Concepts

| Concept | What it means |
|---|---|
| **REST** | Convention: nouns as URLs, HTTP verbs as actions |
| **JSON** | Common data format both sides agree on |
| **Auth token** | Proof of identity, attached to every request |
| **CORS** | Browser-enforced rule: APIs must explicitly allow cross-origin web requests |
| **Statelessness** | Server holds no session — client sends context every time |

---

### Why This Separation Matters

- **One API, many clients** — you can ship a web app, iOS app, and Android app that all share the same backend
- **Independent deployability** — frontend and backend teams can ship separately
- **Testability** — you can call the API directly with `curl` to debug without a UI

The API is the source of truth. Clients are just different ways of presenting and interacting with it.

---

## Sources

This post was generated from a conversation with Claude Code. The full session is reproduced below.

---

**Prompt:** explain how mobile apps, APIs, and web frontends interact at a fundamental level

**Response:**

## Client-Server Communication

All three are **clients** talking to the same underlying system — they differ in environment and rendering, not in how they communicate.

### The Core Pattern

```
Mobile App  ──┐
              ├──► API Server ──► Database / Services
Web Frontend ─┘
```

Both clients send **HTTP requests** to the API and receive structured data (almost always JSON) back. The API is the contract between them.

### What Each Layer Does

**API (the server)**
- Exposes endpoints: `GET /posts`, `POST /users`, etc.
- Contains business logic and data access
- Returns data — never decides how it looks
- Stateless: each request carries everything needed (auth token, params)

**Web Frontend**
- Runs in a browser (HTML/CSS/JS)
- Fetches data via `fetch()` / `XMLHttpRequest`
- Renders data into DOM elements
- Constrained by browser security (CORS, same-origin policy)

**Mobile App**
- Runs natively on iOS/Android (or cross-platform like React Native)
- Makes the same HTTP calls, just via platform networking libraries
- No CORS restrictions — it's not a browser
- Can cache aggressively, access device hardware

### A Concrete Example

User logs in on a mobile app:

```
1. App sends:  POST /api/auth  { email, password }
2. API checks credentials, returns: { token: "abc123", user: {...} }
3. App stores token locally
4. App sends:  GET /api/posts  (Authorization: Bearer abc123)
5. API validates token, returns: [ { id: 1, title: "..." }, ... ]
6. App renders the list
```

A web frontend does the *exact same steps* — different rendering code, same API calls.

### Key Concepts

| Concept | What it means |
|---|---|
| **REST** | Convention: nouns as URLs, HTTP verbs as actions |
| **JSON** | Common data format both sides agree on |
| **Auth token** | Proof of identity, attached to every request |
| **CORS** | Browser-enforced rule: APIs must explicitly allow cross-origin web requests |
| **Statelessness** | Server holds no session — client sends context every time |

### Why This Separation Matters

- **One API, many clients** — you can ship a web app, iOS app, and Android app that all share the same backend
- **Independent deployability** — frontend and backend teams can ship separately
- **Testability** — you can call the API directly with `curl` to debug without a UI

The API is the source of truth. Clients are just different ways of presenting and interacting with it.

---

**Prompt:** Create a new post in the web-waffle repo and add this content to it. The title should be "Fundamentals of web dev". Do not change anything in the explanation.

**Response:** Created. File: `src/content/posts/fundamentals-of-web-dev.md`, URL: `/writing/fundamentals-of-web-dev`, Status: `draft`, ID: `51`.

---

**Prompt:** what branch are you on

**Response:** I was on `master` — which is a problem per the CLAUDE.md rules. I should have created a feature branch before making that file. Switched to `claude/fundamentals-of-web-dev-post`.

---

**Prompt:** Not yet. Add a "Sources" section to the fundamentals-of-web-dev post at the bottom of the post's content. The Sources section should have all of the context from this session, including the prompts I've given you, and the responses you've give me.
