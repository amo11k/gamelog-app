# GameLog — Full Project Context

## Overview

Social video game tracking web application. Two subprojects:

- **`frontend/`** — React + Vite + Tailwind CSS v4 + TanStack Query (port 3000)
- **`backend/`** — Spring Boot 3.4.1 + Java 21 + PostgreSQL + JWT (port 8000)

---

## Folder Structure

```
gamelog-app/
├── context.md                  # this file
├── frontend/                   # React SPA
│   ├── vite.config.ts          # proxy /api → localhost:8000
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── api/                # Axios service layer
│       │   ├── client.ts       # baseURL=/api, Bearer token interceptor, 401 redirect
│       │   ├── auth.ts         # login/register/logout/me
│       │   ├── games.ts        # search/getTrending/getUserGames/addGame/updateGame/removeGame
│       │   └── users.ts        # getProfile/getGames/updateProfile/getRecentReviews
│       ├── types/index.ts      # all shared TypeScript types
│       ├── context/
│       │   └── AuthContext.tsx  # user state, login/register/logout, loading
│       ├── hooks/
│       │   ├── useAuth.ts      # useContext wrapper
│       │   ├── useGames.ts     # TanStack Query hooks (queries + mutations with toast)
│       │   └── useUsers.ts     # TanStack Query hooks for public profiles
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx       # sticky top nav, mobile hamburger
│       │   │   └── Sidebar.tsx      # desktop left nav (lg:+)
│       │   ├── ui/
│       │   │   ├── GameCard.tsx     # cover + title + rating + hours + status badge
│       │   │   ├── UserCard.tsx     # avatar + username + stats row
│       │   │   ├── RatingBadge.tsx  # color-coded star (emerald/yellow/orange/red)
│       │   │   ├── ReviewBox.tsx    # review with avatar/rating/timestamp
│       │   │   ├── StatusBadge.tsx  # Playing/Completed/Dropped/Wishlist pills
│       │   │   ├── SearchBar.tsx    # debounced input (400ms) with clear
│       │   │   ├── LoadingSkeleton.tsx  # GameCard/UserCard/Profile/SearchResult skeletons
│       │   │   └── EmptyState.tsx   # icon + title + description + optional CTA
│       │   └── ProtectedRoute.tsx   # auth gate → redirect /login
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx     # form validation, password toggle, redirect
│       │   │   └── RegisterPage.tsx  # username/email/password validation
│       │   ├── HomePage.tsx          # hero + trending grid + features + CTA
│       │   ├── ProfilePage.tsx       # avatar + stats + game collection + recent reviews
│       │   ├── SearchPage.tsx        # live search + add-to-collection dropdown
│       │   └── LibraryPage.tsx       # tabs (All/Playing/Completed/Dropped/Wishlist) + edit modal
│       ├── utils/date.ts             # formatDistanceToNow, formatHours
│       ├── App.tsx                   # BrowserRouter + QueryClientProvider + AuthProvider + routes
│       ├── main.tsx                  # entry point
│       └── index.css                 # Tailwind v4 import + custom theme (surface/accent colors)
│
└── backend/                    # Spring Boot REST API
    ├── pom.xml                 # Spring Boot 3.4.1, JJWT 0.12.6, MapStruct 1.6.3
    ├── Dockerfile
    ├── docker-compose.yml      # PostgreSQL 16 + app
    └── src/main/java/com/amo11k/backend/
        ├── BackendApplication.java
        ├── config/
        │   ├── SecurityConfig.java     # permit: /api/auth/**, /api/games/search, /api/users/*
        │   ├── CorsConfig.java         # localhost:3000
        │   ├── WebConfig.java          # RestTemplate bean
        │   └── DataSeeder.java         # seeds 3 users, 5 games, 9 entries
        ├── security/
        │   ├── JwtTokenProvider.java       # HMAC-SHA256 generate/validate
        │   ├── JwtAuthenticationFilter.java # Bearer token extraction + context set
        │   └── CustomUserDetailsService.java # load by email or id
        ├── entity/
        │   ├── User.java               # users table
        │   ├── Game.java               # games table
        │   ├── UserGame.java           # user_games table (unique user_id + game_id)
        │   └── enums/GameStatus.java   # PLAYING, COMPLETED, DROPPED, WISHLIST
        ├── repository/
        │   ├── UserRepository.java     # findByUsername, findByEmail, existsBy*
        │   ├── GameRepository.java     # searchByTitle (LIKE %q%), findByExternalId
        │   └── UserGameRepository.java # findByUserId, findByUserIdAndStatus, existsBy*
        ├── dto/
        │   ├── request/  # RegisterRequest, LoginRequest, UpdateProfileRequest, UserGameRequest, UpdateUserGameRequest
        │   └── response/ # AuthResponse, UserProfileResponse, GameResponse, UserGameResponse, PagedResponse, ErrorResponse
        ├── mapper/
        │   ├── UserMapper.java         # toProfileResponse, toProfileResponseWithStats
        │   ├── GameMapper.java         # toResponse
        │   └── UserGameMapper.java     # toResponse (uses GameMapper)
        ├── service/
        │   ├── AuthService.java        # BCrypt register, AuthenticationManager login
        │   ├── UserService.java        # profile with computed stats, update profile
        │   ├── GameService.java        # local DB search → RAWG fallback, getOrCreateGame
        │   ├── UserGameService.java    # CRUD with ownership checks
        │   └── RawgService.java        # RAWG API search → GameResponse list
        ├── controller/
        │   ├── AuthController.java     # POST /api/auth/register, /login, GET /me, POST /logout
        │   ├── UserController.java     # GET /api/users/{username}, PUT /api/users/me
        │   ├── GameController.java     # GET /api/games/search?q=, POST /api/games
        │   └── UserGameController.java # GET/POST/PUT/DELETE /api/user-games
        └── exception/
            ├── GlobalExceptionHandler.java  # 400/401/404/500 with structured ErrorResponse
            ├── ResourceNotFoundException.java
            ├── BadRequestException.java
            └── UnauthorizedException.java
```

---

## API Contract

### Authentication (public)

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/api/auth/register` | `{ username, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/me` | — | `UserProfileResponse` |
| POST | `/api/auth/logout` | — | `204` |

### Users (public read, protected write)

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/api/users/{username}` | — | `UserProfileResponse` (with stats) |
| PUT | `/api/users/me` | `{ bio?, avatarUrl? }` | `UserProfileResponse` |

### Games (/api/users/* is PUBLIC; the rest protected)

| Method | Path | Params | Response |
|--------|------|--------|----------|
| GET | `/api/games/search` | `?q=&page=0&size=20` | `PagedResponse<GameResponse>` |
| POST | `/api/games` | body: `GameResponse` | `GameResponse` |

### User Games (protected)

| Method | Path | Params/Body | Response |
|--------|------|-------------|----------|
| GET | `/api/user-games/me` | `?status=` | `List<UserGameResponse>` |
| POST | `/api/user-games` | `{ gameId|externalGameId, status, rating?, hoursPlayed?, review? }` | `UserGameResponse` |
| PUT | `/api/user-games/{id}` | `{ status?, rating?, hoursPlayed?, review? }` | `UserGameResponse` |
| DELETE | `/api/user-games/{id}` | — | `204` |

### Response DTOs

```
UserProfileResponse { id, username, email, avatarUrl, bio, createdAt, gamesCount, completedGames, totalHours, averageRating }
GameResponse         { id, externalId, title, coverUrl, releaseDate, genres, platforms }
UserGameResponse     { id, game: GameResponse, status, rating, hoursPlayed, review, completedAt, createdAt }
PagedResponse<T>     { data: T[], page, size, totalElements, totalPages, last }
AuthResponse         { token, user: UserProfileResponse }
ErrorResponse        { status, message, timestamp, errors?: { field: msg } }
```

---

## TanStack Query Keys

### Frontend query keys and where they're used:

| Query Key | Used In | Stale Time |
|-----------|---------|------------|
| `['games', 'trending']` | HomePage | 5 min |
| `['games', 'search', query, page]` | SearchPage | 2 min |
| `['user', 'games', status]` | LibraryPage | 30 sec |
| `['users', username, 'profile']` | ProfilePage | 2 min |
| `['users', username, 'games', status]` | ProfilePage | 30 sec |

### Mutations invalidate:
- `useAddGame()` → invalidates `['user', 'games']`
- `useUpdateGame()` → invalidates `['user', 'games']`
- `useRemoveGame()` → invalidates `['user', 'games']`
- `useUpdateProfile()` → invalidates `['users']`

---

## Frontend Routes

| Path | Component | Auth Required | Layout |
|------|-----------|---------------|--------|
| `/` | HomePage | No | AppLayout (Navbar + Sidebar) |
| `/search` | SearchPage | No | AppLayout |
| `/library` | LibraryPage | Yes (ProtectedRoute) | AppLayout |
| `/profile/:username` | ProfilePage | No | AppLayout |
| `/login` | LoginPage | No | None (standalone) |
| `/register` | RegisterPage | No | None (standalone) |

---

## Backend Configuration

### application.yaml defaults
```
DB_URL:      jdbc:postgresql://localhost:5432/gamelog
DB_USERNAME: gamelog
DB_PASSWORD: gamelog
JWT_SECRET:  4a6f686e446f6553656372657456657279566572795365637265744b6579466f7247616d654c6f67417070
JWT_EXPIRATION_MS: 86400000 (24h)
RAWG_API_KEY: (set via env var)
SERVER_PORT: 8000
JPA DDL:     create-drop
```

### Seed Data
- **Users:** `alice` / `bob` / `charlie` (all password: `password123`)
- **Games:** Cyberpunk 2077, Elden Ring, Hollow Knight, Baldur's Gate 3, Stardew Valley
- **Entries:** 9 user-game associations covering all 4 statuses

### Security: Public vs Protected
- **PUBLIC:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/games/search`, `GET /api/users/*`
- **PROTECTED:** everything else (JWT Bearer token required)

---

## How to Run

```bash
# Backend (from backend/):
docker compose up --build
# Or manually: start PostgreSQL, then:
./mvnw spring-boot:run

# Frontend (from frontend/):
npm run dev
# → opens on port 3000, proxies /api to port 8000
```

---

## Frontend Tailwind Theme

Custom `@theme` in `index.css` defines:
- `surface-{50..960}` — dark palette (`surface-950: #0f1117` is main bg)
- `accent-{50..900}` — purple-ish (`accent-500: #6c63ff`)
- semantic colors: `success`, `warning`, `error`, `info`
- fonts: `Inter` (sans), `JetBrains Mono` (mono)

---

## Known Inconsistencies
1. **Frontend API paths differ from backend routes:**
   - Frontend calls `POST /api/games/{id}/add` for adding games; backend expects `POST /api/user-games`
   - Frontend calls `PUT /api/user/games/{id}` for updating; backend expects `PUT /api/user-games/{id}`
   - Frontend calls `DELETE /api/user/games/{id}` for removing; backend expects `DELETE /api/user-games/{id}`
   - Frontend calls `GET /api/user/games` for user games; backend expects `GET /api/user-games/me`
   - Frontend calls `PUT /api/user/profile` for updating profile; backend expects `PUT /api/users/me`
   - Frontend calls `GET /api/games/trending` — backend has no such endpoint
   - Frontend calls `GET /api/users/{username}/games` — backend has no such endpoint
   - Frontend calls `GET /api/reviews` — backend has no such endpoint

2. **Rating scale mismatch:**
   - Backend stores rating as `0-100` integer
   - Frontend displays rating as `0-10` float (divided by 10)

3. **Frontend expects `camelCase` in API responses; backend also uses `camelCase`** ✅

4. **AuthContext stores `user` in localStorage — no auto-refresh of token**
