# Build, Break, Paint!

Full Next.js starter project containing the start screen, username/password and Google authentication routes, 3D block sandbox, save/load/autosave APIs, and realtime multiplayer room presence/chat.

## 1. Requirements
- Node.js 20.9 or newer
- A Supabase project
- Google OAuth credentials if you want Google sign-in

## 2. Install
Open a terminal in this folder and run:

```bash
npm install
```

## 3. Configure Supabase
1. Create a project at https://supabase.com.
2. Copy `.env.example` to `.env.local`.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Project Settings > API.
4. In Supabase SQL Editor, run all of `supabase/schema.sql`.
5. In Authentication > Providers, enable Google and configure its Client ID and Client Secret if Google login is needed.
6. In Authentication > URL Configuration, set the Site URL to your app URL and add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - Your production domain followed by `/auth/callback`
7. For username/password accounts in this starter, turn off email confirmation in Supabase Authentication settings.; users should sign in with the username, not an email address.

Do not expose a Supabase service-role key in browser code. This project uses the public anon/publishable key and Row Level Security.

## 4. Run
```bash
npm run dev
```
Open http://localhost:3000.

For a production build:
```bash
npm run build
npm run start
```

## 5. Current feature scope
- Start screen and login/register modal.
- Google OAuth redirect route (requires provider setup).
- 3D scene with basic Build, Break and Paint tools.
- Orbit camera controls.
- Manual save, load, delete and periodic 30-second autosave.
- Best-effort save when the page becomes hidden.
- Supabase Realtime room presence and broadcast chat.

## 6. Important limitations
- Multiplayer currently shares online presence and chat only. Player movement and block/world editing are not synchronized between clients yet.
- Browser shutdown, a crash, or power loss can prevent the visibility-change save from running. The 30-second autosave reduces, but cannot eliminate, potential data loss.
- Autosave currently creates a new save record each time it runs. A retention/cleanup policy should be added before production.
- The simple profanity filter is client-side only and is not a security or moderation system.
- This is a runnable starter project, not a production-hardened public game. Add server-side rate limits, moderation, validation, and abuse protection before opening it to everyone.
*This is a supabase to login or sign in project and this is a file to make a web, you can copy but make it different!*
***official web: "https://buildbreakpaint.netlify.app"***
  As since, official web can't sign in with google and sign up with google!


## 7. Improvements in this package
- Autosave updates the same cloud autosave record rather than generating a new record every interval.
- A local device backup is available if cloud saving is unavailable or the player is signed out. It stays in this browser/device.
- Worlds can be exported to and imported from JSON, with validation and a 10,000-block safety limit.
- The camera FOV slider now affects the actual 3D camera.
- `npm run lint` and `npm run typecheck` both run the TypeScript checker (compatible with Next.js 15).

## 8. Build and deploy
Run `npm ci`, then `npm run lint`, then `npm run build`.
For Cloudflare, configure the two public Supabase environment variables in your deployment settings and use `npm run deploy`.
