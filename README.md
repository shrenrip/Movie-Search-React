# Movie Search App

A React web app that searches The Movie Database (TMDB) by title. It shows the best match as a featured card with its poster, details, and top-billed cast, followed by a grid of alternative matches.

## Features

- Search by title using the search button or the Enter key
- Featured card for the best match: poster, title, release date, score, description, and the top five cast members
- Grid of alternative results (three per row) showing poster, title, release date, and score
- Placeholder box for titles that have no poster on TMDB
- Error message when a request fails
- Dark theme based on the VS Code color palette

## Tech Stack

- React (function components and hooks)
- Vite (dev server and build tool)
- TMDB API v3 (search and credits endpoints)
- Plain CSS in a single `index.css` file

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A free TMDB account and API key (see [API Key Setup](#api-key-setup))

### Install and run

```bash
git clone <your-repository-url>
cd <project-folder>
npm install
```

Set up your API key (next section), then start the dev server:

```bash
npm run dev
```

Open the local address printed in the terminal (usually `http://localhost:5173`).

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build in `dist/` |
| `npm run preview` | Serves the production build locally for testing |

## API Key Setup

The app needs a TMDB API key to fetch data. The key is read from an environment variable, so it is never written into the source code or committed to Git.

### 1. Get a TMDB API key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Open your account **Settings** and go to the **API** section.
3. Request an API key. TMDB will ask for a short description of your use. A personal or learning project is fine.
4. Copy the value labeled **API Key**.

TMDB shows two credentials: the **API Key** (a short hexadecimal string) and the **API Read Access Token** (a long token). This project uses the short **API Key**, which is sent as an `api_key` query parameter. The Read Access Token will not work with the current code.

### 2. Create your `.env` file

In the project root (the same folder as `package.json`), create a file named `.env`:

```
VITE_TMDB_API_KEY=paste_your_key_here
```

Rules to follow:

- The name must start with `VITE_`. Vite only exposes variables with that prefix to the app, and anything else will be `undefined`.
- No quotes and no spaces around the `=`.
- Restart the dev server after creating or editing `.env`. Vite reads it only at startup.

### 3. Confirm `.env` is ignored by Git

Check that your `.gitignore` contains this line:

```
.env
```

Then commit a template so other people know which variable to set. Create `.env.example` with a placeholder value:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 4. How the app reads the key

In `App.jsx`:

```jsx
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

### Important notes on security

- **The key is not truly secret in a frontend app.** Vite bundles the value into the JavaScript sent to the browser, and anyone can see it in the browser's network tab. The `.env` file keeps it out of your repository, nothing more.
- If you ever committed a real key to Git (for example in an old `config.js`), treat it as leaked. Delete it from your TMDB account settings, generate a new one, and put the new one in `.env`.
- For a production app that must protect its key, send requests through a small backend or serverless function that holds the key, and have the frontend call that instead.

### Deploying

Hosting platforms do not receive your local `.env` file. Add `VITE_TMDB_API_KEY` in the platform's environment variable settings (for example Vercel or Netlify project settings), then redeploy. The value is baked in at build time, so changing it later requires a new build.

## Project Structure

```
.
├── index.html
├── .env                  # your real key (ignored by Git)
├── .env.example          # template for other users
├── .gitignore
├── package.json
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # container: state and API calls
    ├── index.css         # all styling
    └── components/
        ├── SearchBar.jsx
        ├── MovieCard.jsx
        └── MovieGrid.jsx
```

## Architecture

The app follows the container/presentational pattern. `App` owns all state and data fetching. The components in `components/` only receive props and render markup.

```
App (state, fetching)
├── SearchBar     (input and button)
├── MovieCard     (main result, variant="main")
└── MovieGrid     (alternatives)
    └── MovieCard (one per result, variant="alternative")
```

### `App.jsx`

State:

| State | Type | Purpose |
|---|---|---|
| `movies` | array | Search results from TMDB. Index 0 is the main result |
| `userInput` | string | Current text in the search box |
| `cast` | array of strings | Names of the top five cast members of the main result |
| `error` | string | Error message to display, empty when there is none |

Functions:

- `getMovie()` runs when the user searches. It ignores empty input, clears the previous cast, calls the TMDB search endpoint, stores the results, and then calls `getActors` for the first result. It reads the query from the `userInput` state and takes no arguments.
- `getActors(movieId)` calls the credits endpoint for one movie and stores the first five cast names. It has its own `try/catch`, so a failed cast request does not hide the movie.

Endpoints used:

| Purpose | Endpoint |
|---|---|
| Search | `GET /3/search/movie?api_key=...&query=...` |
| Cast | `GET /3/movie/{movie_id}/credits?api_key=...` |

The search query is passed through `encodeURIComponent` so titles containing characters such as `&` work correctly.

### `SearchBar.jsx`

Pill-shaped input and button.

| Prop | Type | Description |
|---|---|---|
| `value` | string | Current input text (controlled input) |
| `onChange` | function | Called with the new text on every keystroke |
| `onSearch` | function | Called on button click or when Enter is pressed |

### `MovieCard.jsx`

Renders one movie. The `variant` prop switches between the large featured layout and the compact grid layout.

| Prop | Type | Default | Description |
|---|---|---|---|
| `movie` | object | required | A TMDB result (`title`, `release_date`, `vote_average`, `overview`, `poster_path`) |
| `cast` | array | `[]` | Cast names, shown only on the main variant |
| `variant` | `'main'` or `'alternative'` | `'alternative'` | Controls layout and which fields appear |

If `poster_path` is `null`, a placeholder box with the class `noPoster` is rendered in place of the image.

### `MovieGrid.jsx`

Maps an array of movies into `MovieCard` components using `movie.id` as the React `key`.

| Prop | Type | Description |
|---|---|---|
| `movies` | array | Alternative results (everything after the first result) |

## Styling

All styles live in `src/index.css`.

- Background `#1e1e1e`, panels `#252526`, text `#d4d4d4`, muted text `#999`
- `.searchBox`: semi-transparent black pill (`rgba(0, 0, 0, 0.4)`)
- `.mainMovieCard`: flex row with the poster on the left and `.mainMovieInfo` on the right
- `.alternativeMovieCards`: CSS grid with three equal columns
- `.noPoster`: placeholder sized to match the poster in each card type

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Nothing loads, console shows a 401 response | The API key is missing, wrong, or you used the Read Access Token instead of the API Key |
| Key shows as `undefined` | The variable name does not start with `VITE_`, or the dev server was not restarted after editing `.env` |
| Works locally but not after deploying | The environment variable was not added in the hosting dashboard, or the site was not rebuilt afterward |
| Blank page after a search | The search returned no results (no "no results" message exists yet) |

## Known Limitations and Ideas

- Cast is fetched for the main result only, to avoid one extra request per result
- Rapid repeated searches can occasionally show the previous movie's cast, because responses may arrive out of order
- No loading indicator and no "no results found" message yet
- The layout is not yet adjusted for small screens
- Possible next steps: pagination with TMDB's `page` parameter, clicking an alternative to make it the main result, a `useMovieSearch` custom hook, and fetching cast with `useEffect`

## Credits

Movie data and images are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.