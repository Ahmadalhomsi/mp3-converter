import { NextResponse } from "next/server";
const ytdl = require("ytdl-core");
const fs = require("fs");





export async function POST(request : Request, response : Response) {
    try {
        const data = await request.json();
        const url = data.url;
        const type = data.type;

        // Regular expression to match YouTube video URLs
        const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+$/;

        // Validate the YouTube URL
        if (!youtubeUrlRegex.test(url)) {
            return NextResponse.json({ error: "Invalid YouTube link. Please enter a valid YouTube video URL." }, { status: 400 });
        }






        const fileName = `video.${type === 'mp3' ? 'mp3' : 'mp4'}`;

        if (type === "mp3") {
            const videoStream = ytdl(url, {
                format: type,
                filter: type === 'mp3' ? 'audioonly' : 'videoonly',
            });
            // Set headers for file download
            const headers = {
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-type": `audio/mp3`,
            };

            // Return the response with headers and streaming data
            return new Response(videoStream, { headers });
        }
        else if (type === "mp4") {
            const videoStream = ytdl(url);
            // Set headers for file download
            const headers = {
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-type": `video/mp4`,
            };

            // Return the response with headers and streaming data
            return new Response(videoStream, { headers });
        }



    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: "Internal server error " + err }, { status: 500 });
    }
}
