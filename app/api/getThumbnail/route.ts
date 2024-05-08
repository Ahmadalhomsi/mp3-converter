import { NextResponse } from "next/server";
import ytdl2 from "youtubedl-core";
import ytdlp from "ytdlp-nodejs";

export async function POST(request: Request, response: Response) {
    try {
        const data = await request.json();
        const url = data.url;

        if (!ytdl2.validateURL(url)) {
            return NextResponse.json({ error: "Invalid YouTube link. Please enter a valid YouTube video URL." }, { status: 400 });
        }

        // Regular expression to match YouTube video URLs
        const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+$/;

        // Validate the YouTube URL
        if (!youtubeUrlRegex.test(url)) {
            return NextResponse.json({ error: "Invalid YouTube link. Please enter a valid YouTube video URL." }, { status: 400 });
        }


        console.log("Thumbnail Link:");
        const thumbUrl = ytdlp.thumbnail(url, {
            quality: "max",
            type: "jpg"
        });
        console.log(thumbUrl);

        return NextResponse.json(thumbUrl);

    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: "Internal server error " + err }, { status: 500 });
    }
}
