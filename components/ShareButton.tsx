
"use client";

import { useEffect, useRef, useState } from "react";
import {
    Share2,
    Check,
    X,
    Link2,
    Download,
} from "lucide-react";
import {
    FaFacebookF,
    FaXTwitter,
} from "react-icons/fa6";

interface ShareButtonProps {
    surpriseId: string;
    message: string;
}

type Platform = "instagram" | "facebook";

export default function ShareButton({
    surpriseId,
    message,
}: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [busy, setBusy] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [copied, setCopied] = useState(false);

    const shareUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/?surprise=${encodeURIComponent(surpriseId)}`
            : "";
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function wrapText(
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number
    ): string[] {
        const lines: string[] = [];

        for (const paragraph of text.split("\n")) {
            if (!paragraph.trim()) {
                lines.push("");
                continue;
            }

            let line = "";

            for (const word of paragraph.split(/\s+/)) {
                const test = line ? `${line} ${word}` : word;

                if (ctx.measureText(test).width > maxWidth && line) {
                    lines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            }

            if (line) lines.push(line);
        }

        return lines;
    }

    const formattedMessage =
        `"${message}"\n` +
        `~ From My Little Surprises (${shareUrl})`;

    function shareTwitter() {
        const url =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(formattedMessage);

        window.open(url, "_blank", "noopener,noreferrer");
        setOpen(false);
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(formattedMessage);

            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            alert("Unable to copy the message.");
        }
    }


    async function generateImage(
        platform: Platform
    ): Promise<File> {
        const width = 1080;
        const height = platform === "instagram" ? 1920 : 1350;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is unavailable");

        // Soft pastel background
        const gradient = ctx.createLinearGradient(
            0, 0, width, height
        );
        gradient.addColorStop(0, "#fff2f7");
        gradient.addColorStop(0.5, "#fffaf4");
        gradient.addColorStop(1, "#fce5ee");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Decorative circles
        ctx.fillStyle = "rgba(245, 170, 194, 0.16)";
        ctx.beginPath();
        ctx.arc(80, 100, 280, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width - 50, height - 100, 340, 0, Math.PI * 2);
        ctx.fill();

        // Inner card
        const margin = 75;
        const cardTop = platform === "instagram" ? 300 : 170;
        const cardHeight = height - cardTop * 2;

        ctx.fillStyle = "rgba(255,255,255,0.82)";
        ctx.beginPath();
        ctx.roundRect(
            margin,
            cardTop,
            width - margin * 2,
            cardHeight,
            55
        );
        ctx.fill();

        ctx.strokeStyle = "#f4d5e1";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Header decoration
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e58bab";
        ctx.font = "70px Georgia, serif";
        ctx.fillText("♡", width / 2, cardTop + 115);

        // Message typography: shrink to fit
        const maxTextWidth = width - 240;
        const maxTextHeight = cardHeight - 430;

        let fontSize = 66;
        let lines: string[] = [];

        while (fontSize >= 26) {
            ctx.font = `${fontSize}px Georgia, serif`;
            lines = wrapText(
                ctx,
                `"${message}"`,
                maxTextWidth
            );

            if (lines.length * fontSize * 1.45 <= maxTextHeight) {
                break;
            }

            fontSize -= 2;
        }

        ctx.fillStyle = "#97516d";
        ctx.font = `${fontSize}px Georgia, serif`;

        const lineHeight = fontSize * 1.45;
        const totalHeight = lines.length * lineHeight;
        const centerY = cardTop + cardHeight / 2;

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                width / 2,
                centerY - totalHeight / 2 +
                index * lineHeight + lineHeight / 2
            );
        });

        // Signature
        ctx.fillStyle = "#bc7893";
        ctx.font = "34px Georgia, serif";
        ctx.fillText(
            "~ From My Little Surprises ♡",
            width / 2,
            cardTop + cardHeight - 145
        );

        // Footer
        ctx.font = "27px sans-serif";
        ctx.fillStyle = "#c38ba1";
        ctx.fillText(
            "A little happiness, just for you.",
            width / 2,
            height - 75
        );

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) resolve(result);
                    else reject(new Error("Image generation failed"));
                },
                "image/png"
            );
        });

        return new File(
            [blob],
            `little-surprise-${surpriseId || "message"}.png`,
            { type: "image/png" }
        );
    }

    function downloadImage(file: File) {
        const url = URL.createObjectURL(file);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = file.name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function downloadSurprise() {
        if (busy || !message.trim()) return;

        setBusy(true);

        try {
            const file = await generateImage("instagram");
            downloadImage(file);
            setStatus("Image downloaded! ♡");
        } catch (error) {
            console.error(error);
            setStatus("Couldn't generate the image.");
        } finally {
            setBusy(false);
        }
    }


    async function shareImage(platform: Platform) {
        if (busy || !message.trim()) return;

        setBusy(true);
        setStatus("Creating your surprise image...");

        try {
            const file = await generateImage(platform);

            const shareData: ShareData = {
                files: [file],
            };

            // Native sharing on supported devices
            if (
                navigator.share &&
                navigator.canShare?.(shareData)
            ) {
                try {
                    await navigator.share(shareData);
                    setStatus("Image ready to share! ♡");
                } catch (error) {
                    if (
                        error instanceof DOMException &&
                        error.name === "AbortError"
                    ) {
                        setStatus("");
                    } else {
                        downloadImage(file);
                        setStatus("Image downloaded! ♡");
                    }
                }
            } else {
                // Desktop / unsupported browser fallback
                downloadImage(file);
                setStatus("Image downloaded! Upload it to your social app ♡");
            }
        } catch (error) {
            console.error(error);
            setStatus("Couldn't generate the image.");
        } finally {
            setBusy(false);
        }
    }



    return (
        <div className="share-container" ref={containerRef}>
            <button
                type="button"
                className="pill-button secondary"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Share this surprise"
                disabled={!message || busy}
            >
                <Share2 size={16} />
                Share
            </button>

            {open && (
                <div className="share-popup">
                    <div className="share-popup-header">
                        <span>Send a little happiness ♡</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close share menu"
                        >
                            <X size={15} />
                        </button>
                    </div>


                    <div className="share-options">
                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={() => shareImage("facebook")}
                            disabled={busy}
                            title="Share image to Facebook"
                            aria-label="Share image to Facebook"
                        >
                            <FaFacebookF />
                        </button>

                        {/* Twitter / X */}
                        <button
                            type="button"
                            onClick={shareTwitter}
                            title="Share on X"
                            aria-label="Share on X"
                        >
                            <FaXTwitter />
                        </button>

                        {/* Download Image */}
                        <button
                            type="button"
                            onClick={downloadSurprise}
                            disabled={busy}
                            title="Download surprise image"
                            aria-label="Download surprise image"
                        >
                            <Download />
                        </button>

                        {/* Copy Message & Link */}
                        <button
                            type="button"
                            onClick={copyLink}
                            title="Copy message and link"
                            aria-label="Copy message and link"
                        >
                            {copied ? <Check /> : <Link2 />}
                        </button>
                    </div>

                    {copied && (
                        <p className="share-feedback">
                            Message copied! ♡
                        </p>
                    )}

                    {status && (
                        <p className="share-feedback" role="status">
                            {status}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
