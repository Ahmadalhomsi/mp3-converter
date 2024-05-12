"use client"
import "../globals.css";

import React, { useState } from 'react';
import axios from 'axios';

export default function TTS() {
  const [text, setText] = useState('');

  const downloadAudio = async () => {
    try {
        const response = await axios.post('/api/textToVoice', { text }, { responseType: 'blob' });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'audio/mp3' });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output.mp3'; // Set the desired file name

        // Append the link to the document body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the URL
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading audio:', error);
        // Handle error
    }
};


  return (
    <div className="flex flex-col items-center justify-center mx-auto">
  <h1 className="text-2xl font-bold mb-4">Text-to-Speech Converter</h1>
  <div className="flex-col items-center gap-3">
    <textarea
      placeholder="Enter text..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="mb-2 block p-2.5 w-64 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
    ></textarea>

    <button
      className="bg-blue-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg w-48"
      onClick={downloadAudio}
    >
      Download Audio
    </button>
  </div>
</div>

  );
}
