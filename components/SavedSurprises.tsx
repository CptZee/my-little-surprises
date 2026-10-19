
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Heart, Trash2, X, Bookmark } from "lucide-react";

interface SavedSurprise {
    message: string;
    category: string;
    date: string;
}

interface SavedSurprisesProps {
    onSelect?: (surprise: SavedSurprise) => void;
}

const STORAGE_KEY = "daily-surprises";

export default function SavedSurprises({
    onSelect,
}: SavedSurprisesProps) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<SavedSurprise[]>([]);

    function loadMessages() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            setMessages(Array.isArray(stored) ? stored : []);
        } catch {
            setMessages([]);
        }
    }

    useEffect(() => {
        if (open) loadMessages();
    }, [open]);

    function removeMessage(message: string) {
        const updated = messages.filter(
            (item) => item.message !== message
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updated)
        );

        setMessages(updated);
    }

    return (
        <>
            <button
                type="button"
                className="pill-button secondary"
                onClick={() => setOpen(true)}
            >
                <Bookmark size={16} />
                Saved Surprises
            </button>

            {open && createPortal(
                <div className="saved-overlay" onClick={() => setOpen(false)}>
                    <div
                        className="saved-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Saved surprises"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="saved-header">
                            <div>
                                <h2>Saved with love ♡</h2>
                                <p>Your little collection of happiness</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close saved surprises"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {messages.length === 0 ? (
                            <div className="saved-empty">
                                <Heart size={32} />
                                <p>No saved surprises yet.</p>
                                <span>
                                    Save a message and it'll appear here!
                                </span>
                            </div>
                        ) : (
                            <div className="saved-list">
                                {messages.map((item, index) => (
                                    <div className="saved-card" key={`${item.message}-${index}`}>
                                        <div className="saved-card-meta">
                                            <span>{item.category}</span>
                                            <span>{item.date}</span>
                                        </div>

                                        <p className="saved-card-message">
                                            "{item.message}"
                                        </p>

                                        <div className="saved-card-actions">
                                            <button
                                                type="button"
                                                className="saved-delete"
                                                onClick={() => removeMessage(item.message)}
                                                aria-label="Remove saved surprise"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="saved-footer">
                            {messages.length} little surprise
                            {messages.length !== 1 ? "s" : ""} saved ♡
                        </p>
                    </div>
                </div>
                , document.body)}
        </>
    );
}
