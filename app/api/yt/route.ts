import { NextResponse } from "next/server";
const ytdl = require("ytdl-core");
const fs = require("fs");
import ytdl2 from "youtubedl-core";
import ytdlp from "ytdlp-nodejs";



export async function POST(request: Request, response: Response) {
    try {
        const data = await request.json();
        
        console.log(data);
        
        const url = data.url;
        const type = data.type;
        const selectedQuality = data.selectedQuality;

        

        if (!ytdl2.validateURL(url))
            return NextResponse.json({ error: "Invalid YouTube link. Please enter a valid YouTube video URL." }, { status: 400 });




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
                filter: 'audioonly',
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
            console.log("BOOOY" + selectedQuality);
            
            // const EventEmitter = require('events');
            // EventEmitter.defaultMaxListeners = 15; // Adjust the limit as needed
            const videoStream = ytdl(url, {
                format: 'mp4',
                filter: 'videoandaudio',
                quality: selectedQuality === 'highest' ? 'highest' : 'lowest'
            });

            const headers = {
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-type": `video/mp4`,
            };

            const thumbnailsOptions = {
                quality: "max" as string,
                type: "jpg" as string
            };

            console.log("come on");
            const thumb = ytdlp.thumbnail(url, {
                quality: "max",
                type: "jpg"
            });
            console.log(thumb);

            console.log("here");


            return new Response(videoStream, { headers });

        }



    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ error: "Internal server error " + err });
    }
}
