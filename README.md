# My Little Surprises ♡

*A little bit of magic. A lot of you.*

A small, pastel-inspired website made to brighten someone's day, one thoughtful message at a time.

Built with **Next.js**, **TypeScript**, and **Supabase**, My Little Surprises is a cozy corner of the internet filled with encouraging notes, sweet thoughts, and little reminders that someone out there cares.

Whether you need a smile, a little motivation, or simply something sweet to read, there's always a surprise waiting for you.

**Live website:** [surprises.ajmission.dev](https://surprises.ajmission.dev)

---

## Features

### Four Surprise Categories

Discover messages based on how you're feeling:

- **A Little Smile (`smile`)** — Cheerful messages to brighten your day.
- **Sweet Thoughts (`sweet`)** — Heartfelt words and gentle reminders that you're appreciated.
- **Words of Encouragement (`motivation`)** — Motivation and reassurance for difficult days.
- **Just Because (`random`)** — Unexpected little surprises for no particular reason.

### Random Surprises

Fetch a random message from Supabase based on your selected category. Every click offers another opportunity to discover something thoughtful.

### Saved Surprises

- Save your favorite messages directly in your browser.
- Store up to **50 unique surprises**.
- Revisit previously saved messages through a dedicated popup.
- Remove messages from your collection whenever you like.
- Saved surprises persist across page refreshes using `localStorage`.

### Share a Surprise

Spread a little happiness by sharing individual messages.

- Generate shareable links to specific surprises.
- Share through supported social platforms, including X.
- Generate images suitable for sharing on Instagram and Facebook.
- Download surprise images where supported.
- Copy links to share through messaging applications.

### Submit a Surprise

Visitors can contribute their own thoughtful messages.

- Enter a name or nickname.
- Select a surprise category.
- Write a message of up to **500 characters**.
- Submit the message for review.
- Receive feedback about successful or unsuccessful submissions.

### Submission Rate Limiting

To help prevent spam and excessive submissions, the website uses **Upstash Redis** and `@upstash/ratelimit`.

- Limit of **3 submission attempts per IP address per hour**.
- Sliding-window rate limiting.
- HTTP `429 Too Many Requests` responses when the limit is exceeded.
- Friendly error messages for visitors.
- Shared rate-limit storage suitable for Vercel's serverless environment.

### Manual Message Moderation

All visitor-submitted surprises require approval before appearing publicly.

- New submissions remain pending by default.
- The website owner reviews submissions through Supabase.
- Only approved and active messages are publicly accessible.
- Visitors cannot approve or modify existing messages through the public interface.

### Custom Branding and Social Previews

- Custom heart-themed website favicon.
- Open Graph metadata for rich link previews.
- Custom social sharing image (`og-image.png`).
- Twitter/X summary card metadata.
- Branded website title and description.

### Responsive Design

A soft, pastel-inspired interface designed for both desktop and mobile devices.

- Responsive navigation and header.
- Interactive envelope illustration.
- Decorative hearts, clouds, and sparkles.
- Mobile-friendly buttons and forms.
- Responsive saved-surprises modal.
- Subtle animations and visual details.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | Full-stack React framework using the App Router |
| [React](https://react.dev/) | User interface components |
| TypeScript | Type-safe application development |
| [Supabase](https://supabase.com/) | PostgreSQL database and API |
| [Upstash Redis](https://upstash.com/) | Shared rate-limit storage |
| `@upstash/ratelimit` | Submission rate limiting |
| CSS | Responsive styling and animations |
| [Lucide](https://lucide.dev/) | Interface icons |
| React Icons | Additional icons |
| Browser localStorage | Client-side saved surprises |
| [Vercel](https://vercel.com/) | Hosting and deployment |

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed.
- A Supabase project.
- A configured `public.surprises` table.
- An Upstash Redis database for rate limiting.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the placeholders with your repository details.

### 2. Install Dependencies

```bash
npm install
```

The project uses the following packages for rate limiting:

```bash
npm install @upstash/ratelimit @upstash/redis
```

If they are already included in `package.json`, the initial installation is sufficient.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your-upstash-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
```

Get your Supabase credentials from your Supabase project settings.

Get your Redis credentials from the [Upstash Console](https://console.upstash.com/).

**Security:** Never commit `.env.local`, private API tokens, service-role keys, or other secrets to version control.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## Database Structure

The application uses a Supabase PostgreSQL table named `public.surprises`.

| Column | Purpose |
|---|---|
| `id` | Unique identifier (UUID) |
| `category` | `smile`, `sweet`, `motivation`, or `random` |
| `message` | Surprise message content |
| `sender_name` | Name or nickname of the sender |
| `is_active` | Whether the message is enabled |
| `is_approved` | Whether the message has been approved |
| `created_at` | Timestamp of message creation |

### Message Moderation Workflow

1. A visitor writes and submits a surprise.
2. The API validates the submission and checks the rate limit.
3. Supabase stores the message with `is_approved = false`.
4. The website owner reviews the submission in the Supabase Table Editor.
5. The owner sets `is_approved = true` to publish the message.
6. Approved and active surprises become available to visitors.

The database should enforce secure defaults and Row Level Security policies so that public submissions cannot bypass moderation.

---

## API Endpoints

### `GET /api/surprises`

Retrieves surprise messages from Supabase.

Supports random messages by category and individual messages by ID.

Example:

```http
GET /api/surprises?category=sweet
```

Example for a specific surprise:

```http
GET /api/surprises?id=SURPRISE_UUID
```

Only approved and active messages should be publicly accessible.

### `POST /api/surprises/submit`

Submits a new surprise for approval.

Example request:

```json
{
  "sender_name": "Anonymous",
  "category": "sweet",
  "message": "A little reminder that you make ordinary days feel special."
}
```

Validation rules:

- Sender name: 1–50 characters.
- Message: 1–500 characters.
- Category: must be one of the four supported values.
- Approval status cannot be supplied by visitors.
- Submission requests are subject to rate limiting.

Possible responses:

| Status | Meaning |
|---|---|
| `201` | Submitted successfully for approval |
| `400` | Invalid submission |
| `429` | Submission rate limit exceeded |
| `500` | Submission failed |
| `503` | Required service unavailable |

---

## Project Structure

```text
app/
├── api/
│   └── surprises/
│       ├── route.ts
│       └── submit/
│           └── route.ts
├── icon.svg
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── SavedSurprises.tsx
├── ShareButton.tsx
└── SubmitSurprise.tsx

lib/
└── rate-limit.ts

public/
└── og-image.png
```

**Note:** This structure highlights the main files discussed for the project. Your local working copy may contain additional files and components.

---

## Deployment

The project is designed to be deployed on **Vercel**.

### Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the Supabase and Upstash environment variables.
4. Deploy the application.
5. Configure your custom domain.

### Custom Domain

The website uses:

**[surprises.ajmission.dev](https://surprises.ajmission.dev)**

Configure the subdomain in Vercel's domain settings and add the required DNS records through your domain provider.

### Social Sharing Metadata

The root layout defines Open Graph and Twitter/X metadata.

The social preview image is located at:

```text
public/og-image.png
```

Recommended image dimensions:

**1200 × 630 pixels**

This image is used by supported platforms when generating rich link previews.

---

## Privacy and Security

The website includes several measures to protect submissions and visitor data.

**Saved messages:** Favorites are stored locally in the current browser under the `daily-surprises` localStorage key. They are not synchronized across devices.

**Moderation:** Visitor-submitted messages require manual approval before publication.

**Rate limiting:** Anonymous submissions are limited to three attempts per IP address per hour using Upstash Redis.

**Input validation:** The submission API validates sender names, categories, and message lengths.

**Database security:** Supabase Row Level Security should restrict public access to approved, active messages and prevent visitors from changing moderation fields.

**Environment variables:** Private tokens and credentials must remain server-side.

**Privacy considerations:** Visitors should avoid including sensitive or personally identifying information in messages intended for public display.

IP-based rate limiting is a spam-prevention measure, not a complete bot-protection solution. Additional protection, such as CAPTCHA or Cloudflare Turnstile, can be introduced if needed.

---

## Future Improvements

Some possible additions as the project grows:

- An admin dashboard for reviewing submitted surprises.
- CAPTCHA or Cloudflare Turnstile for additional spam protection.
- Personalized Open Graph images for individual surprise links.
- More surprise categories and interactive experiences.
- Additional animations and seasonal themes.
- Optional cloud synchronization for saved surprises.

---

## Why This Exists

Not every meaningful gesture needs to be grand.

Sometimes, a few thoughtful words can make an ordinary day feel a little brighter. A simple reminder that someone is appreciated, a little encouragement when things get difficult, or a sweet message that arrives at just the right moment.

**My Little Surprises** was created around that idea.

A small space filled with thoughtful words, gentle reminders, and little moments of happiness.

Made with a little code, a lot of care, and someone special in mind. ♡

---

**My Little Surprises ♡**

*One little surprise at a time.*