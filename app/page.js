"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const youtube = require('youtube-metadata-from-url');




export default function Home() {
  const [loadingMp3, setLoadingMp3] = useState(false);
  const [loadingMp4, setLoadingMp4] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [error, setError] = useState("");
  const [lastDownloadedLink, setLastDownloadedLink] = useState('');


  useEffect(() => {
    // Retrieve the last downloaded link from cookies when the component mounts
    const lastLink = getCookie('lastDownloadedLink');
    if (lastLink) {
      setLastDownloadedLink(lastLink);
    }
  }, []);

  async function getTitle(url) {
    try {
      const jsonx = await youtube.metadata(url);
      console.log(jsonx);
      return jsonx.title;
    } catch (err) {
      console.log("Error getTitle");
      return err; // or handle the error as needed
    }
  }

  
  async function downloadFile(url, type) {
    try {

      // Set the last downloaded link in cookies

      setCookie('lastDownloadedLink', url, 1);
      console.log("Cookie Set: " + url);

      if (type === 'mp3') {
        setLoadingMp3(true);
      } else {
        setLoadingMp4(true);
      }

      setError("");
      const title = await getTitle(url);
      console.log("Video to download: " + title); // Use the title here

      const response = await axios.post('/api/yt', { url, type }, { responseType: 'blob' });

      const blobUrl = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = blobUrl;


      link.download = `${title}.${type}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success('Video successfully downloaded');

      if (type === 'mp3') {
        setLoadingMp3(false);
      } else {
        setLoadingMp4(false);
      }
    } catch (error) {
      console.error('Error:', error);
      if (type === 'mp3') {
        setLoadingMp3(false);
      } else {
        setLoadingMp4(false);
      }
      setError("Invalid YouTube link or unable to download the video.");
      toast.error("Invalid YouTube link or unable to download the video.");
    }
  }

  function handleInputChange(event) {
    setYoutubeLink(event.target.value);
  }

  async function handleDownload(type) {
    if (!youtubeLink.trim()) {
      setError("Please enter a YouTube link.");
      toast.error("Please enter a YouTube link.");
      return;
    }

    // Reset error message
    setError("");

    // Attempt to download the file
    await downloadFile(youtubeLink, type);
  }

  // Function to set a cookie
  function setCookie(name, value, minutes) {
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000); // Convert minutes to milliseconds
    document.cookie = `${name}###${value};expires=${expires.toUTCString()};path=/`;
  }

  // Function to get a cookie
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('###');
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return '';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {(loadingMp3 || loadingMp4) && <div className="mb-4">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input
        type="text"
        value={youtubeLink}
        onChange={handleInputChange}
        placeholder="Enter YouTube link"
        className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full max-w-md text-blue-500"
      />

      <div className="flex">
        <button
          onClick={() => handleDownload('mp3')}
          disabled={loadingMp3}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {loadingMp3 ? "Downloading..." : "Download MP3"}
        </button>
        <button
          onClick={() => handleDownload('mp4')}
          disabled={loadingMp4}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loadingMp4 ? "Downloading..." : "Download MP4"}
        </button>
      </div>
      {lastDownloadedLink && <div className="mt-4">Last downloaded link: {lastDownloadedLink}</div>}
    </div>
  );
}
