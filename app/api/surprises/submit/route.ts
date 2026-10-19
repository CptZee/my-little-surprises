
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const categories = [
    "smile",
    "sweet",
    "motivation",
    "random",
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const sender_name =
            typeof body.sender_name === "string"
                ? body.sender_name.trim()
                : "";

        const message =
            typeof body.message === "string"
                ? body.message.trim()
                : "";

        const category = body.category;

        if (
            sender_name.length < 1 ||
            sender_name.length > 50 ||
            message.length < 1 ||
            message.length > 500 ||
            !categories.includes(category)
        ) {
            return NextResponse.json(
                { error: "Please check your submission." },
                { status: 400 }
            );
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key =
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        if (!url || !key) {
            return NextResponse.json(
                { error: "Service unavailable." },
                { status: 503 }
            );
        }

        const supabase = createClient(url, key);

        // Never accept approval status from the visitor.
        const { error } = await supabase
            .from("surprises")
            .insert({
                sender_name,
                category,
                message,
            });

        if (error) {
            console.error("Submission failed:", error.message);

            return NextResponse.json(
                { error: "Unable to submit your surprise." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Submitted for approval!" },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}
