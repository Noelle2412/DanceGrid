# DanceGrid

DanceGrid is a web app for designing **formation choreographies**. In formation dancing, the formations on the floor are called *pictures*. With DanceGrid you set up a dance floor and your dancers, place them on the floor for every picture, and export the whole choreography as a PDF.

- **Frontend (live):** https://dancegridfrontend.vercel.app/
- **Backend (live):** https://dancegrid-backend.onrender.com/
- **Source:** https://github.com/Noelle2412/DanceGrid

> The backend runs on a free Render instance. After a period of inactivity the first request can take up to about a minute while the server wakes up.

## Features

- **Accounts:** sign up, log in and log out with email and password.
- **Editor for everyone:** anyone can start a new choreography and design it. Saving requires an account.
- **Floor:** a configurable grid (width x length in meters) with the origin (0 / 0) in the center.
- **Dancers:** solo dancers or couples (leader and follower). Each dancer has a name, a number and a design (shape and color).
- **Pictures:** a choreography is an ordered list of pictures. Each picture has a title, an optional comment, and a position for every dancer.
  - Drag dancers on the canvas (positions snap to 0.25 m and stay inside the floor).
  - Or type exact coordinates into the coordinate table next to the canvas.
  - New pictures start from a copy of the previous one.
- **Sharing:** the owner can share a saved choreography with other registered users by email. Everyone with access can edit it.
- **PDF export:** a title page with the dancer legend, then one page per picture with the floor, the coordinates of every dancer and the comment. Available to everyone with access to the choreography.
- **Light and dark theme** for the site.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript and JavaScript, Tailwind CSS 4, shadcn/ui and Base UI |
| Canvas | Konva with react-konva |
| State | Zustand (separate stores for settings, couples and pictures, coordinated by `stores/choreoSession.ts`) |
| PDF | @react-pdf/renderer (loaded lazily on export) |
| HTTP | axios with credentials, react-cookie |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Auth | Passport (local strategy for login, JWT strategy for requests), bcrypt, JWT in an httpOnly cookie (14 days) |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure

```
dancegrid_backend/
  app.js                 Express setup, CORS, routers
  config/                auth helpers (register, login, logout), Passport strategies
  controllers/           users and choreos controllers
  routers/               /users and /choreos routes
  middlewares/           requireAuth, errorHandler
  models/                Mongoose schemas (User, Choreo, Dancer, Picture, DancerPosition)
  utils/                 permission helpers (owner / shared access), ResponseError
dancegrid_frontend/
  app/                   pages (home, login, register, /choreos, /choreos/[id], /user/[id], help)
  api/                   axios wrappers for the backend
  components/
    canvas/              editor, grid, draggable dancers, coordinate table, pictures overview
    pdf/                 PDF document and export button
    choreolisting/       "My choreographies" and "Shared with me"
    forms/, layout/, ui/
  stores/                Zustand stores and cross-store session logic
```

## Data model

- **User:** `email` (unique), `password` (hashed), `provider`.
- **Choreo:** `name`, `owner`, `gridSize` `[x, y]`, `mode` (`solo` or `couple`), `couples`, `pictures`, `sharedWith` (user ids).
- **Couple:** `number` (unique per choreography, whole number, at least 1), `leader` and `follower`, each with `name`, `color` and `shape`.
- **Picture:** `id`, `title`, `comment`, `order`, and `coordinates`, one entry per dancer with `coupleNumber`, `role` (`leader` or `follower`), `x` and `y`. Pictures are ordered by `order`.

## API overview

All `/choreos` routes require a logged-in user (JWT cookie).

| Method | Route | Description | Who |
| --- | --- | --- | --- |
| POST | `/users/register` | Create an account | anyone |
| POST | `/users/login` | Log in, sets the auth cookie | anyone |
| POST | `/users/:id/logout` | Log out, clears the cookie | logged in |
| GET | `/users/:id/choreos` | Choreographies owned by the user | that user |
| GET | `/users/:id/shared_choreos` | Choreographies shared with the user | that user |
| POST | `/choreos` | Create a choreography | logged in |
| GET | `/choreos/:id` | Get a choreography | owner, shared users |
| PATCH | `/choreos/:id` | Update name, grid size, mode | owner, shared users |
| PATCH | `/choreos/:id/update_couples` | Replace the dancers | owner, shared users |
| PATCH | `/choreos/:id/update_pictures` | Replace the pictures | owner, shared users |
| PATCH | `/choreos/:id/add_shared_user` | Share by email | owner |
| PATCH | `/choreos/:id/remove_shared_user` | Stop sharing with an email | owner |
| GET | `/choreos/:id/shared_users` | List emails shared with | owner |
| PATCH | `/choreos/:id/remove_access` | Remove your own access | shared users |
| DELETE | `/choreos/:id` | Delete a choreography | owner |

## Running locally

You need Node.js and a MongoDB database (local, or a free MongoDB Atlas cluster).

### Backend

```bash
cd dancegrid_backend
npm install
cp .env.example .env   # then fill in the values below
npm run dev            # or: npm start
```

Environment variables (`dancegrid_backend/.env`):

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on, for example `3000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_TOKEN_SECRET` | Long random string used to sign login tokens |
| `NODE_ENV` | `production` or `development`. In production the auth cookie is sent with `secure` |
| `ORIGIN` | URL of the frontend, used for CORS, for example `http://localhost:8080` |

The code also contains a half-finished Google sign-in (Passport Google strategy). It is not connected to any route and the button is disabled in the UI. If the Google strategy is still imported, the server also expects `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `SERVER_URL`. Set them to any placeholder value for local runs.

### Frontend

```bash
cd dancegrid_frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
npm run dev            # http://localhost:8080
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend |

For production use `npm run build` followed by `npm start`. Both apps also include a `Dockerfile`.

## How to use

1. Open **New Choreography**. Give it a name, set the floor size and choose couple or solo mode.
2. Add dancers with **+ Add Dancers**. Set names, shapes and colors.
3. Click **+ Add Picture**, then drag the dancers or type their coordinates.
4. Add more pictures. Each new picture starts as a copy of the last one.
5. Log in and use **Save Settings** (name, floor, dancers) and **Save Pictures**. Use **Share** with another user's email to collaborate.
6. Click **Export PDF** for the printable version.

## Known limitations

- **Cross-site cookies.** Frontend and backend are on different domains (vercel.app and onrender.com). Browsers that block third-party cookies (Safari, Brave, Firefox with strict tracking protection) may not keep the login. A same-origin proxy through Next.js rewrites would fix this.
- **Concurrent editing.** Saving replaces the whole list of couples or pictures. If two people edit the same choreography at once, the last save wins. There is no live sync or merge.
- **Unsaved changes.** There is no warning when leaving the editor with unsaved changes.
- **Google sign-in** is not finished and is disabled.
- **Cold starts.** The free Render instance sleeps when idle.

### Planned features

- Delete choreographies from the overview
- Edit picture titles and comments in the editor
- Better tools for moving dancers (for example selecting all of them at once)
- Reordering pictures in the overview
- Collapsible dancer settings on small screens
- Dark mode for the stage
- Validation that coordinates lie inside the grid on the backend (Zod)

## Author

Built by Aischa as the final project of a web development bootcamp.
