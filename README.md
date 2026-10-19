# My Little Surprises ♡

A small, pastel-inspired website made to brighten someone's day, one thoughtful message at a time. Built with **Next.js**, **TypeScript**, and **Supabase**, it brings together encouraging notes, sweet thoughts, and a few playful surprises.

## Features

- **Four surprise categories:** A Little Smile (`smile`), Sweet Thoughts (`sweet`), Words of Encouragement (`motivation`), and Just Because (`random`).
- **Random surprises:** Fetch messages from Supabase by category.
- **Saved surprises:** Keep up to 50 unique favorites in your browser and revisit or remove them later.
- **Share a surprise:** Share an individual message through a link, X, or a generated image for Instagram/Facebook; image download is also available where supported.
- **Submit a surprise:** Visitors can send a message with a name and category for review.
- **Manual moderation:** New submissions stay pending until approved in Supabase; only active, approved messages are publicly readable.
- **Responsive design:** A soft, friendly layout for desktop and mobile.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/) and TypeScript
- [Supabase](https://supabase.com/) (PostgreSQL and API)
- CSS, [Lucide](https://lucide.dev/) icons, and React Icons
- Browser `localStorage` for saved surprises

## Getting started

### Prerequisites

- Node.js and npm
- A Supabase project with the `surprises` table configured

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Use your own project's values. **Never commit `.env.local`, service-role keys, or other secrets.**

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The application uses a Supabase table named `public.surprises`.

| Column | Purpose |
| --- | --- |
| `id` | Unique message identifier (UUID) |
| `category` | `smile`, `sweet`, `motivation`, or `random` |
| `message` | Surprise text |
| `sender_name` | Name or nickname of the sender |
| `is_active` | Whether the message is enabled |
| `is_approved` | Whether it has been approved for public display |
| `created_at` | Creation timestamp |

**Moderation flow:** A visitor submits a message → Supabase stores it with `is_approved = false` → the owner reviews it in the Supabase Table Editor → the owner sets `is_approved = true` to publish it.

Configure Row Level Security (RLS) so public reads return **only** records where `is_active = true` and `is_approved = true`. Public submissions should be insert-only and must not be able to set approval status or edit existing records. The server submission route should validate input before insertion.

## Project structure

```text
app/
  api/
    surprises/
      route.ts          # Retrieve random or specific surprises
      submit/
        route.ts        # Submit a surprise for approval
  globals.css           # Website styling
  layout.tsx
  page.tsx              # Main experience
components/
  SavedSurprises.tsx    # Saved-message popup
  ShareButton.tsx       # Sharing and image generation
  SubmitSurprise.tsx    # Visitor submission form
```

> This is a guide to the features discussed for the project. File locations may differ in your local working copy.

## Privacy and safety notes

- Saved messages live in the **current browser's localStorage** under `daily-surprises`. They are not synchronized across devices.
- Visitor-submitted messages are reviewed before publication. Avoid including private or sensitive information in submissions.
- For a public launch, add rate limiting and bot protection to the submission endpoint.
- Keep Supabase RLS enabled and verify that pending messages cannot be fetched by ID or category.

## Why this exists

Sometimes a tiny message is enough to make an ordinary day feel a little brighter. **My Little Surprises** is a collection of those little moments, made with care. ♡
