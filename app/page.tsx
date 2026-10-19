"use client";

import ShareButton from "@/components/ShareButton";
import { useState, useEffect } from "react";
import SavedSurprises from "@/components/SavedSurprises";
import SubmitSurprise from "@/components/SubmitSurprise";

type Category = "smile" | "sweet" | "motivation" | "random";

const surprises: Record<Category, { label: string; emoji: string; color: string }> = {
  smile: { label: "Make me smile", emoji: "☻", color: "rose" },
  sweet: { label: "Tell me something sweet", emoji: "♡", color: "lavender" },
  motivation: { label: "Give me motivation", emoji: "⌁", color: "mint" },
  random: { label: "Surprise me!", emoji: "✧", color: "butter" }
};

const categories: Category[] = ["smile", "sweet", "motivation", "random"];

export default function Home() {
  const [surpriseId, setSurpriseId] = useState("");
  const [selected, setSelected] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("surprise");

    if (!sharedId) return;

    async function loadSharedSurprise() {
      try {
        const response = await fetch(
          `/api/surprises?id=${encodeURIComponent(sharedId!)}`
        );

        if (!response.ok) {
          throw new Error("Surprise not found");
        }

        const data = await response.json();

        // Update the existing surprise states
        setSurpriseId(data.id);
        setMessage(data.message);

        // Set category if your page uses this state
        setSelected(data.category);

        // If your page has a reveal/visibility state,
        // set it here too, e.g. setIsRevealed(true).
      } catch (error) {
        console.error("Failed to load shared surprise:", error);
      }
    }

    loadSharedSurprise();
  }, []);


  async function reveal(category: Category) {
    setSelected(category);
    setLoading(true);
    setError("");
    setMessage("");
    setSaved(false);
    try {
      const response = await fetch(`/api/surprises?category=${category}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load a surprise right now.");
      const data: { id: string, message?: string } = await response.json();
      if (!data.message) throw new Error("No surprises in this category yet.");
      setSurpriseId(data.id);
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function saveMessage() {
    if (!message) return;
    const existing = JSON.parse(localStorage.getItem("daily-surprises") || "[]") as { message: string; category: string; date: string }[];
    if (!existing.some((item) => item.message === message)) {
      existing.unshift({ message, category: selected || "random", date: new Date().toLocaleDateString() });
      localStorage.setItem("daily-surprises", JSON.stringify(existing.slice(0, 50)));
    }
    setSaved(true);
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true">✦</div>
      <div className="ambient ambient-two" aria-hidden="true">♡</div>

      <header className="topbar">
        <a className="brand" href="/" aria-label="Daily Surprise home">
          <span className="brand-mark">♡</span>
          <span>My Little <em>Surprises</em></span>
        </a>

        <div className="topbar-actions">
          <SavedSurprises
            onSelect={(surprise) => {
              setMessage(surprise.message);
              setSelected(surprise.category as Category);
              setSaved(true);
            }}
          />

          <a
            className="saved-link note-link"
            href="#how-it-works"
            aria-label="A little note for you"
            title="A little note for you"
          >
            <span className="note-link-text">
              A little note for you
            </span>
            <span className="note-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </header>


      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR DAILY DOSE OF HAPPY</div>
          <h1>A little bit of <span>magic.</span><br />A lot of <span>you.</span></h1>
          <p className="hero-description">
            A tiny corner of the internet made to remind you how lovely you are.
            Pick a button, take a breath, and let a little good find you.
          </p>
          <div className="hero-note"><span className="note-heart">♡</span> made with a little code and a lot of care</div>
        </div>
        <div className="hero-art" aria-label="Cute illustrated envelope with a heart">
          <div className="orbit orbit-one">✦</div>
          <div className="orbit orbit-two">♡</div>
          <div className="sunburst">✧</div>
          <div className="cloud cloud-left" />
          <div className="cloud cloud-right" />
          <div className="envelope">
            <div className="letter">
              <span className="letter-spark">✦</span>
              <span className="letter-heart">♡</span>
              <span className="letter-caption">for you, always</span>
            </div>
            <div className="envelope-flap" />
            <div className="seal">♡</div>
          </div>
          <div className="art-caption">psst... you're AJ's favorite</div>
        </div>
      </section>

      <section className="surprise-section" id="surprise">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A SMALL MOMENT, JUST FOR YOU</div>
            <h2>What do you need today?</h2>
          </div>
          <span className="tiny-doodle">✳</span>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const item = surprises[category];
            return (
              <button
                className={`category-card ${item.color} ${selected === category ? "active" : ""}`}
                key={category}
                onClick={() => reveal(category)}
                disabled={loading}
                type="button"
              >
                <span className="category-icon">{item.emoji}</span>
                <span className="category-label">{item.label}</span>
                <span className="category-arrow">↗</span>
              </button>
            );
          })}
        </div>

        <div className={`message-card ${message ? "has-message" : ""}`} aria-live="polite">
          <div className="message-decoration decoration-left">✿</div>
          <div className="message-decoration decoration-right">✦</div>
          {loading ? (
            <p role="status">Finding a little surprise for you…</p>
          ) : error ? (
            <div role="alert"><p>{error}</p><button className="pill-button secondary" onClick={() => reveal(selected || "random")} type="button">Try again ↻</button></div>
          ) : message ? (
            <>
              <div className="message-kicker">A LITTLE REMINDER</div>
              <div className="message-heart">♡</div>
              <p className="surprise-message">{message}</p>
              <div className="message-actions">
                <button className="pill-button primary" onClick={saveMessage} type="button">
                  {saved ? "✓ Saved with love" : "♡ Save this"}
                </button>
                <ShareButton
                  surpriseId={surpriseId}
                  message={message}
                />
                <button className="another-button" onClick={() => reveal(selected || "random")} type="button">another one ↻</button>
              </div>
            </>
          ) : (
            <>
              <div className="message-heart idle-heart">♡</div>
              <h3>Your little surprise is waiting</h3>
              <p>Choose the feeling you need, and let’s find a little something for your heart.</p>
            </>
          )}
        </div>
      </section>

      <section className="bottom-note" id="how-it-works">
        <div className="bottom-star">✧</div>
        <p>Different buttons, different surprises,</p>
        <p className="bottom-script">but always you. <span>♡</span></p>
        <div className="bottom-underline" />
      </section>

      <section id="new-surprise">
        <SubmitSurprise />
      </section>

      <footer className="footer">
        <span>© 2026 My Little Surprises</span>
        <span>made with <b>♡</b> and a little bit of code from AJ to You</span>
      </footer>
    </main>
  );
}
