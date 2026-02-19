# Web Waffle (React)

This is a refactor of the original static **web-waffle** site into a modern React app (Vite + React Router).

## What changed

- **React app** with routes for: Writing, About, Portfolio, Contact
- WordPress export content is loaded from: `src/content/wpContent.json`
- Legacy images are served from: `public/img`
- Legacy CSS was migrated to: `src/styles/global.css`

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
