Let me draft two README.md files: one for the Front-end and one for the Back-end, including setup, env vars, scripts, and example API calls.## Front-end README (README.md) ✅

LeadTracker — Front-end (React + Vite + Tailwind) 🚀
Short description

LeadTracker is a lightweight React front-end for finding local business leads, logging outreach and call notes, and managing a small sales pipeline. It uses SerpApi-backed backend APIs for business search and JWT for auth.
Demo & repo

Deployed demo: https://jumahans.github.io/Lead-tracker-front-end
Tech stack

React (Vite), Tailwind CSS, Axios, react-router-dom, GH Pages (deployment)
Features

Search businesses by niche + location 🔍
Save leads and view them in a dashboard 📇
Log call status and notes per lead 📞📝
Authentication with JWT (login + profile) 🔑
Quick start (local)

Environment

The project reads its API base URL from code in api.js. To use a custom backend in local dev, set an environment variable and update api.js (or replace the hard-coded URL):
(If you change the environment approach, ensure your axios instance uses that variable: import.meta.env.VITE_API_BASE_URL.)

NPM scripts

npm run dev — start dev server
npm run build — build production assets
npm run preview — preview production build
npm run lint — run ESLint
npm run deploy — build & deploy to GitHub Pages (configured with gh-pages)
API used

Auth: POST /api/token/ → returns access & refresh tokens
Create user: POST /create-user/
Create freelancer: POST /freelancer-details/ (authenticated)
Search businesses: POST /get-business-details/ with { business, location } (authenticated)
List leads: GET /list-leads/ (authenticated)
Toggle / update call status: POST /update-call-status/<lead_id>/ or GET /call-status/<lead_id>/ (authenticated)
Delete lead: DELETE /delete-lead/<lead_id>/ (authenticated)
Development notes & tips

Tailwind is configured. Edit styles in src/index.css/tailwind.config.js.
The front-end stores JWT tokens in localStorage; the axios interceptor attaches Authorization: Bearer <token>.
If API endpoints change, update api.js.
Contributing

Fork → create branch → open PR with small, focused changes. Please run npm run lint before creating PRs.
License

MIT (or choose your license)