import { NextResponse } from "next/server";
import lib from "simple-tts-mp3";


export async function POST(request: Request, response: Response) {
    try {
        const data = await request.json();
        const text = data.text;
        console.log(text);
        

        // Generate the audio buffer
        const audioBuffer = await lib.getAudioBuffer(text);
        
        // Convert the audio buffer to a Blob
        const blob = new Blob([audioBuffer], { type: 'audio/mp3' });

        // Set the response headers
        const headers = {
            'Content-Type': 'audio/mp3',
            'Content-Disposition': 'attachment; filename="output.mp3"'
        };

        // Return the response with the audio file
        return new Response(blob, { headers });
    } catch (error) {
        // Handle errors
        console.error(error);
        return NextResponse.json(error);
    }
}
