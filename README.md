<div align="center">

# LocaSphere

**Discover what's happening around you, and share what you discover.**

A location-based community app for discovering places, activities, events and local tips shared by the people around you.

![Expo](https://img.shields.io/badge/Expo_SDK-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-4F46E5)
![Status](https://img.shields.io/badge/status-UI%20prototype-7C3AED)

</div>

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Screens](#screens)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Backend integration](#backend-integration)
- [Search & future AI features](#search--future-ai-features)
- [Demo data & test sign-in](#demo-data--test-sign-in)
- [Building & releasing](#building--releasing)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Overview

LocaSphere combines local discovery with a community feed. It serves two kinds of users, and one account can be both:

| Role | What they do |
| --- | --- |
| **Explorer** | Discovers nearby places and events, searches, browses categories, views content on a map, reads reviews, likes, saves, follows creators and reports inappropriate content. |
| **Creator** | Publishes posts with photos, location, category and tags; manages (edits/deletes) their posts; tracks engagement; maintains a creator profile. |

This repository contains the **mobile frontend**: a working React Native (Expo) UI that runs on realistic mock data. The data layer is built so the mocks can be swapped for a **Django REST Framework + PostgreSQL** backend without changing any screens.

---

## Features

- **Onboarding & auth:** animated splash, 3-step onboarding, mobile number login, 6-digit OTP with resend timer, and "Continue with Google".
- **Personalised home:** greeting, city selector, category shortcuts, *Near you*, *Trending nearby*, *Recommended for you* and community posts.
- **Explore:** live search, category chips, filters (sort, distance, rating, type, open now) and a **Map / List** toggle.
- **Dedicated search:** recent searches, popular queries, category browsing, debounced results, and natural-language prompts that are ready for AI search.
- **Place / post details:** photo carousel, rating, distance, hours, price, creator card with follow, photos, reviews, like, save, share, directions and report.
- **Creator tools:** a 4-step publishing flow (Photos → Details → Category & location → Preview) with drafts and quality hints.
- **Saved collection:** filters for All / Places / Posts / Events, with instant optimistic removal.
- **Profiles:** personal profile with creator insights and Posts / Reviews / Saved tabs, plus public creator profiles with grid/list layouts.
- **Light & dark mode:** follows the system setting by default, with a manual System / Light / Dark switch in Settings. Every screen, map, chip and illustration has a dark variant.
- **Production UX:** skeleton loaders, empty states, error states with retry, pull-to-refresh, toasts, haptics, accessibility labels and 44 pt+ touch targets.

---

## Screens

| Area | Route | Screen |
| --- | --- | --- |
| Splash | *(overlay)* | `screens/Splash/SplashScreen.tsx` |
| Onboarding | `/onboarding` | `screens/Onboarding/OnboardingScreen.tsx` |
| Login | `/login` | `screens/Auth/LoginScreen.tsx` |
| OTP verification | `/verify` | `screens/Auth/VerifyOtpScreen.tsx` |
| Home *(tab)* | `/` | `screens/Home/HomeScreen.tsx` |
| Explore *(tab)* | `/explore` | `screens/Explore/ExploreScreen.tsx` |
| Create *(tab)* | `/create` | `screens/CreatePost/CreatePostScreen.tsx` |
| Saved *(tab)* | `/saved` | `screens/Saved/SavedScreen.tsx` |
| Profile *(tab)* | `/profile` | `screens/Profile/ProfileScreen.tsx` |
| Search | `/search` | `screens/Search/SearchScreen.tsx` |
| Place / post details | `/place/[id]` | `screens/PostDetails/PostDetailsScreen.tsx` |
| Creator profile | `/creator/[id]` | `screens/CreatorProfile/CreatorProfileScreen.tsx` |
| Settings | `/settings` | `screens/Settings/SettingsScreen.tsx` |
| Edit profile *(modal)* | `/edit-profile` | `screens/Profile/EditProfileScreen.tsx` |

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), React Native 0.86, React 19.2 |
| Language | TypeScript (strict) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, built on React Navigation) |
| Styling | `StyleSheet` via a theme-aware `makeStyles()` helper + design tokens (`src/theme`), light & dark schemes |
| Animation | React Native Reanimated 4 |
| Images | `expo-image` (caching, transitions), `expo-image-picker` |
| Device APIs | `expo-haptics`, `Share`, `Linking` (directions) |
| Compiler | React Compiler enabled (`experiments.reactCompiler`) |
| Quality | ESLint (`eslint-config-expo`), `tsc --noEmit`, `expo-doctor` |

---

## Getting started

### Prerequisites

- **Node.js** 20 LTS or newer, plus npm
- **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), **or** an Android emulator / iOS simulator
- Optional: [EAS CLI](https://docs.expo.dev/eas/) for cloud builds (`npx eas-cli@latest`)

### Installation

```bash
git clone https://github.com/hemanth-user13/LocaSphere-FE.git
cd LocaSphere-FE
npm install
```

### Run the app

```bash
npx expo start
```

Then:

- scan the QR code with **Expo Go** (Android) or the Camera app (iOS)
- press **`a`** for an Android emulator, **`i`** for the iOS simulator or **`w`** for the web

> **Tip:** After changing `babel.config.js`, `metro.config.js` or `.env`, restart with a cleared cache: `npx expo start -c`.

---

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |
| `npm run lint` | Lint with ESLint (`expo lint`) |
| `npx tsc --noEmit` | Type-check the project |
| `npx expo-doctor` | Diagnose dependency and config issues |
| `npx expo install <pkg>` | Add a package at the SDK-compatible version (**always use this instead of `npm install <pkg>`**) |

> ⚠️ `npm run reset-project` is left over from the Expo starter template. Don't run it on this project.

---

## Configuration

Configuration lives in environment variables (see [`.env.example`](.env.example)). Copy it to get started:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | *(unset)* | Base URL of the Django REST API, e.g. `https://api.locasphere.app/api/v1`. **When unset, the app uses in-memory mock data.** |
| `EXPO_PUBLIC_USE_MOCKS` | `false` | Force mock data even when an API URL is set. |
| `EXPO_PUBLIC_FEATURE_SEMANTIC_SEARCH` | `false` | Route natural-language queries to `/search/semantic/` (requires a backend that supports it). |

All runtime config is read in [`src/services/config.ts`](src/services/config.ts).

App identity (name, scheme, splash colour, permission strings) is set in [`app.json`](app.json).

---

## Project structure

```
.
├── app.json                 # Expo app config (name, splash, plugins, permissions)
├── .env.example             # Environment variable template
├── assets/                  # App icons & splash images
└── src/
    ├── app/                 # Expo Router routes (thin files → screens)
    │   ├── _layout.tsx      # Root stack + providers + splash overlay
    │   ├── (auth)/          # login, verify (redirects away when signed in)
    │   ├── (tabs)/          # Home, Explore, Create, Saved, Profile
    │   ├── place/[id].tsx   # Place / post details
    │   ├── creator/[id].tsx # Public creator profile
    │   └── onboarding.tsx, search.tsx, settings.tsx, edit-profile.tsx
    ├── screens/             # Screen implementations, one folder per feature
    ├── components/          # Reusable UI (Button, PlaceCard, SearchBar, …)
    │   └── navigation/      # Custom tab bar buttons
    ├── context/             # AuthContext (session), LibraryContext (saves/likes/follows)
    ├── services/            # Data layer: API client, services, mocks, search strategies
    │   ├── api/             # fetch client (JWT, snake↔camel case) + DRF endpoints
    │   └── search/          # Keyword / semantic search strategies
    ├── hooks/               # useResource, useDebouncedValue, useCountdown
    ├── theme/               # Design tokens: colors, spacing, radius, typography, shadows
    ├── types/               # Domain models & search contracts
    ├── data/                # Categories + mock fixtures (used only by mock services)
    └── utils/               # Formatting, haptics, share/directions, a11y helpers
```

**Conventions**

- Files in `src/app/` are routes only. They re-export a screen from `src/screens/`, so navigation and UI stay decoupled.
- Screens never import from `src/data/`. They get data through `@/services`.
- Import with the `@/` alias, which maps to `src/` (e.g. `import { Button } from "@/components"`).

---

## Architecture

```
 Screen ──► useResource(fetcher) ──► service interface ──┬─► mock implementation (src/data)
   │                                                      └─► HTTP implementation (apiClient → DRF)
   └──► Context (Auth, Library) ── optimistic updates ──► libraryService
```

- **Navigation:** the root stack holds the tabs plus pushed screens. `(tabs)/_layout.tsx` redirects signed-out users to onboarding or login, and `(auth)/_layout.tsx` redirects signed-in users back into the app.
- **Data fetching:** `useResource` provides loading, error, refresh and silent-reload states, and is shaped like TanStack Query so it can be swapped later.
- **State:**
  - `AuthContext` holds the session and onboarding flag.
  - `LibraryContext` holds saved, liked and followed IDs plus recent searches. Updates are optimistic and roll back if the API call fails.
- **Services:** each domain (`auth`, `content`, `users`, `library`, `location`, `search`) exposes one interface with a mock and an HTTP implementation, chosen by `config.useMocks`.

---

## Design system

All visual decisions come from tokens in [`src/theme`](src/theme), so a rebrand only touches one folder. Each token has a light and a dark value:

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| Primary | `#4F46E5` | `#6366F1` | Brand, primary actions, active states |
| Accent | `#7C3AED` | `#A78BFA` | Highlights, creator badge, verified marks |
| Background | `#F8FAFC` | `#0B1120` | App background |
| Surface | `#FFFFFF` | `#131B2E` | Cards, sheets, tab bar |
| Surface muted | `#F1F5F9` | `#1B2538` | Inputs, segmented controls |
| Text / Secondary | `#0F172A` / `#64748B` | `#F1F5F9` / `#94A3B8` | Typography |
| Border | `#E2E8F0` | `#253049` | Subtle card borders |
| Success / Warning / Error | `#10B981` / `#F59E0B` / `#EF4444` | `#34D399` / `#FBBF24` / `#F87171` | Status |

The dark scheme uses layered navy surfaces rather than pure black, softened text, and slightly brighter brand colours so contrast stays readable.

**Using the theme in components**

```tsx
import { makeStyles, useTheme } from "@/theme";

function Card() {
  const { colors, isDark } = useTheme(); // for inline colours / icons
  const styles = useStyles();            // cached per colour scheme
  return <View style={styles.card} />;
}

const useStyles = makeStyles((colors) => ({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
}));
```

Never hard-code hex values in components; add a token to both `lightColors` and `darkColors` in `src/theme/colors.ts` instead.

- **Spacing:** 8 pt system (`xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48`), with 16 px screen padding.
- **Radius:** 8–28 px; cards use 16 px.
- **Typography:** `display`, `h1`–`h3`, `body`, `callout`, `caption`, `label` and `overline`, rendered through the `AppText` component.
- **Shadows:** intentionally minimal. Borders do most of the separation work.

---

## Backend integration

The app expects a **Django REST Framework** API. Endpoints are defined in [`src/services/api/endpoints.ts`](src/services/api/endpoints.ts):

| Domain | Endpoints |
| --- | --- |
| Auth | `POST /auth/otp/request/`, `POST /auth/otp/verify/`, `POST /auth/google/`, `POST /auth/token/refresh/`, `POST /auth/logout/` |
| Feed | `GET /feed/home/` |
| Content | `GET/POST /content/`, `GET/DELETE /content/{id}/`, `GET /content/{id}/reviews/`, `POST/DELETE /content/{id}/like/`, `POST/DELETE /content/{id}/save/`, `POST /content/{id}/report/` |
| Users | `GET/PATCH /users/me/`, `GET /users/{id}/`, `GET /users/{id}/content/`, `GET /users/{id}/reviews/`, `POST/DELETE /users/{id}/follow/` |
| Library | `GET /me/saved/`, `GET /me/library/` |
| Search | `POST /search/`, `POST /search/semantic/`, `GET /search/suggestions/` |
| Uploads | `POST /uploads/presign/` |

The API client ([`src/services/api/client.ts`](src/services/api/client.ts)):

- sends `Authorization: Bearer <token>` (JWT)
- converts **snake_case ↔ camelCase** automatically
- applies a 15 s request timeout
- surfaces DRF `detail` messages as `ApiError`
- expects lists in DRF's `PageNumberPagination` envelope (`count / next / previous / results`)

**To connect a backend:** set `EXPO_PUBLIC_API_URL`, restart with `npx expo start -c`, and implement the endpoints above. No screen changes are needed.

---

## Search & future AI features

Search goes through a strategy layer ([`src/services/search`](src/services/search)):

- `SearchRequest` carries `query`, `filters` and `mode`: `"keyword"`, `"semantic"` or `"auto"`.
- **Keyword strategy:** works today. It is a client-side mock now and Postgres full-text search on the backend later.
- **Semantic strategy:** a placeholder for query → embedding → vector search (e.g. pgvector), returning hits with a relevance `score` and an optional `reason`.
- **`auto` mode:** sends natural-language queries (4+ words) to semantic search once it's enabled.

This leaves room for semantic search, embeddings, vector search, personalised recommendations, AI review summaries and natural-language discovery, for example *"Find me a quiet cafe where I can work for a few hours."*

---

## Demo data & test sign-in

With no API configured, the app runs entirely on mock data. The data covers 16 places, posts and events across Hyderabad neighbourhoods, plus 6 creators and reviews; business names are fictional.

| Action | How |
| --- | --- |
| Log in | Any valid 10-digit Indian mobile number (starting with 6–9) |
| OTP | **Any 6 digits** work; **`000000`** shows the error state |
| Google sign-in | Signs in immediately as the demo creator |
| Photos | Pick from your gallery, or tap *"Use sample photos"* in Create |

> Session, saves and likes live in memory and reset when the app reloads.

---

## Building & releasing

This project uses Continuous Native Generation, so `ios/` and `android/` are generated and should never be edited by hand. Configure native behaviour in `app.json` and config plugins instead.

```bash
# Development build (needed once you add native modules not in Expo Go)
npx eas-cli@latest build --profile development --platform android

# Store builds
npx eas-cli@latest build --platform all
npx eas-cli@latest submit --platform all

# Over-the-air JS updates
npx eas-cli@latest update
```

See the [EAS documentation](https://docs.expo.dev/eas/) for profiles and credentials.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Buttons invisible or styles missing after pulling changes | Restart with a cleared cache: `npx expo start -c` |
| `Incompatible package versions` warnings | `npx expo install --fix` |
| Unsure whether the project is healthy | `npx expo-doctor` |
| Images not loading | Mock images load from Unsplash, so check the device's internet connection |
| Typed route errors in the editor | Run `npx expo start` once to regenerate `.expo/types` |

---

## Roadmap

- [ ] Connect the Django REST API (auth, feed, content, search)
- [ ] Persist the session with `expo-secure-store` and preferences (incl. theme choice) with AsyncStorage
- [ ] Real maps (`react-native-maps` / Mapbox) behind `DiscoveryMap`
- [ ] Device location via `expo-location`
- [ ] Review composer and post editing
- [ ] Photo uploads via presigned URLs
- [ ] Push notifications for nearby events
- [ ] Semantic search, recommendations and AI review summaries
- [ ] Unit and E2E tests

---

## Contributing

1. Create a feature branch from `main`.
2. Follow the existing structure: routes in `src/app`, UI in `src/screens` and `src/components`, data access only through `src/services`.
3. Use theme tokens instead of hard-coded colours or spacing.
4. Before opening a pull request, make sure these pass:

   ```bash
   npm run lint
   npx tsc --noEmit
   ```

---

<div align="center">

**LocaSphere** · Private project · © LocaSphere. All rights reserved.

</div>
