
"use client";

import { useState, type FormEvent } from "react";
import { Heart, Send, CheckCircle2 } from "lucide-react";

type Category = "smile" | "sweet" | "motivation" | "random";

export default function SubmitSurprise() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category>("sweet");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/surprises/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_name: name.trim(),
                    category,
                    message: message.trim(),
                }),
            });


            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.error || "Unable to submit your message."
                );
            }

            setSuccess(true);
            setName("");
            setMessage("");
            setCategory("sweet");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }

    }

    return (
        <section className="submit-surprise" id="submit-surprise">
            <div className="submit-surprise-heading">
                <Heart size={28} />
                <h2>Share a little happiness ♡</h2>
                <p>
                    Have something sweet to say? Leave a little
                    surprise for someone to discover.
                </p>
            </div>

            {success ? (
                <div className="submit-success" role="status">
                    <CheckCircle2 size={38} />
                    <h3>Your surprise is on its way! ♡</h3>
                    <p>
                        Thank you for sharing a little happiness.
                        Your message will appear once approved.
                    </p>
                    <button
                        type="button"
                        className="pill-button secondary"
                        onClick={() => setSuccess(false)}
                    >
                        Write another surprise
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="submit-form">
                    <div className="submit-field">
                        <label htmlFor="sender-name">Your name</label>
                        <input
                            id="sender-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name or a cute nickname..."
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="submit-field">
                        <label htmlFor="surprise-category">Category</label>
                        <select
                            id="surprise-category"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value as Category)
                            }
                        >
                            <option value="smile">A little smile</option>
                            <option value="sweet">Sweet thoughts</option>
                            <option value="motivation">Words of encouragement</option>
                            <option value="random">Just because ♡</option>
                        </select>
                    </div>

                    <div className="submit-field">
                        <label htmlFor="surprise-message">
                            Your little message
                        </label>
                        <textarea
                            id="surprise-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write something that'll make someone smile..."
                            maxLength={500}
                            rows={5}
                            required
                        />
                        <span className="submit-counter">
                            {message.length}/500
                        </span>
                    </div>

                    {error && (
                        <p className="submit-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="pill-button primary submit-button"
                        disabled={loading}
                    >
                        <Send size={16} />
                        {loading ? "Sending your love..." : "Send your surprise ♡"}
                    </button>

                    <p className="submit-note">
                        Every message is reviewed before appearing on the website.
                    </p>
                </form>
            )}
        </section>
    );
}
