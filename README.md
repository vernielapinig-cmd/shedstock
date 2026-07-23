# ShedStock

A home tool & equipment registry — ported from the original single-file HTML
prototype into a real **Next.js 14 (App Router) + Supabase** app.

The whole household shares one inventory: anyone who signs up can see and
edit every item, exactly like the original prototype (which stored
everything in one shared key-value store). Every add/edit/status-change/
delete is written to an append-only `history` table.

## Stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **Supabase** — Postgres database, Auth, and Row Level Security
- **Tailwind CSS** — styled to match the original design (same colors, fonts, layout)
- **TypeScript**

## Project structure

```
shedstock/
├── supabase/schema.sql        # run this in Supabase to create everything
├── lib/
│   ├── supabase/               # browser / server / middleware clients
│   ├── constants.ts            # categories + status metadata
│   ├── data.ts                 # server-side data fetchers
│   └── utils.ts                # item codes, date formatting
├── types/database.ts           # DB row types
├── actions/
│   ├── auth.ts                 # login / signup / logout server actions
│   └── items.ts                # add / update / delete / status-change + history logging
├── components/                 # Sidebar, TopBar, BottomNav, modals, item card, icons…
├── middleware.ts                # protects /dashboard /inventory /locations /history
└── app/
    ├── (auth)/login, /signup    # auth screens
    └── (app)/dashboard, /inventory, /locations, /history
```

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 2. Run the schema

Open the **SQL Editor** in your Supabase project, paste the contents of
`supabase/schema.sql`, and run it. This creates:

- `profiles` — one row per signed-up user (username, full name), auto-created on signup
- `items` — the shared inventory
- `history` — an append-only audit log
- RLS policies so any authenticated user can read/write the shared data,
  but history can never be edited or deleted once written

### 3. (Recommended) Turn off email confirmation for this household app

In Supabase: **Authentication → Providers → Email**, turn off "Confirm
email". Since this is a private household app rather than a public product,
this lets people start using the app immediately after signing up instead
of waiting on a confirmation email. If you'd rather keep confirmation on,
that's fine too — just know the signup flow will need the user to check
their email before their session becomes active.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
**Project Settings → API** in Supabase.

### 5. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — you'll land on `/login`. Use the **Sign Up**
tab to create the first household account.

### 6. Deploy

Works out of the box on [Vercel](https://vercel.com): import the repo, add
the same two environment variables, deploy.

## Notes on the port

- The original app's custom `localStorage`/in-memory auth (with base64
  "hashed" passwords) was replaced with real **Supabase Auth**
  (email + password), which is what actually keeps passwords secure.
  A `username` and `full_name` are still captured at signup and stored in
  `profiles`, and shown in the sidebar/history exactly like before.
- Item IDs are now proper UUIDs; the human-readable `ITM-XXXXXX` codes shown
  on cards are derived from them the same way as the original.
- All mutations (add/edit/delete/status-change) go through Next.js **Server
  Actions** in `actions/items.ts`, which also write the matching `history`
  row — mirroring the original `logHistory()` calls exactly.
- If you ever want to split this into multiple separate households instead
  of one shared registry, add a `household_id` column to `items`/`history`/
  `profiles` and scope the RLS policies (currently `using (true)`) to
  `household_id = (select household_id from profiles where id = auth.uid())`.
