"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DownloadHistory from "@/components/DownloadHistory";
import ReactLoading from "react-loading";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
const youtube = require('youtube-metadata-from-url');




export default function Home() {
  const [loadingMp3, setLoadingMp3] = useState(false);
  const [loadingMp4, setLoadingMp4] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [error, setError] = useState("");
  const [lastDownloadedLink, setLastDownloadedLink] = useState('');
  const [downloadHistory, setDownloadHistory] = useState<Array<{
    url: string;
    fileName: string;
    timestamp: Date;
  }>>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Add state for the thumbnail URL
  const [isPremium, setIsPremium] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('highest');



  interface DownloadItem {
    url: string;
    fileName: string;
    timestamp: Date;
  }

  // Function to handle changes in quality selection
  const handleQualityChange = (event: any) => {
    setSelectedQuality(event.target.value);
  };

  const handleHistoryItemClick = (url: string) => {
    setYoutubeLink(url); // Set the input value to the clicked download history item URL
  };

  async function fetchThumbnail() {
    try {
      const response = await axios.post('/api/getThumbnail', { url: youtubeLink }); // Assuming the backend API returns thumbnail URL directly
      setThumbnailUrl(response.data); // Set the thumbnail URL in state
      console.log("Thumbnail Link: " + response.data);

    } catch (error) {
      console.log('Error fetching thumbnail:', error);
      // Handle error if needed
    }
  }
  const data = useUser();
  const user = data.user;
  let userType: string;


  useEffect(() => {


    // Retrieve the last downloaded link from cookies when the component mounts
    const lastLink = getCookie('lastDownloadedLink');
    if (lastLink) {
      setLastDownloadedLink(lastLink);
    }

    // Retrieve download history from cookies
    const history = getCookie('downloadHistory');
    if (history) {
      setDownloadHistory(JSON.parse(history));
    }

    const checkUserType = async () => {
      const unsafeMetadata = user?.unsafeMetadata; // Use with caution
      // console.log(user);

      userType = unsafeMetadata?.UserType as string;

      console.log("User Type: ");
      console.log(userType);

      if (userType === "Premium") {
        console.log("No ads");
        setIsPremium(true)
      }
      else
        setIsPremium(false)


    };

    checkUserType();

  }, []);

  async function getTitle(url: string) {
    try {
      const jsonx = await youtube.metadata(url);
      console.log(jsonx);
      return jsonx.title;
    } catch (err) {
      console.log("Error getTitle");
      return err; // or handle the error as needed
    }
  }


  async function downloadFile(url: string, type: string) {
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


      const response = await axios.post('/api/yt', { url, type, selectedQuality }, { responseType: 'blob' });

      const blobUrl = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = blobUrl;


      const title = await getTitle(url);
      const fileName = `${title}.${type}`;

      console.log("Video to download: " + title); // Use the title here


      link.download = `${title}.${type}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      fetchThumbnail();

      toast.success('Video successfully downloaded');

      // Update download history
      const updatedHistory = [{ url, fileName, timestamp: new Date() }, ...downloadHistory];
      setDownloadHistory(updatedHistory);
      setCookie('downloadHistory', JSON.stringify(updatedHistory), 10); // 7 days expiration

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

  function handleInputChange(event: any) {
    setYoutubeLink(event.target.value);
  }

  async function handleDownload(type: string) {
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
  function setCookie(name: string, value: any, hours: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000); // Convert minutes to milliseconds
    document.cookie = `${name}###${value};expires=${expires.toUTCString()};path=/`;
  }

  // Function to get a cookie
  function getCookie(name: string) {
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-y-2">
      {thumbnailUrl && (
        <div className="thumbnail-frame mt-4">
          <img src={thumbnailUrl} alt="Thumbnail" className=" h-auto max-w-lg rounded-2xl	" style={{ maxWidth: '400px', maxHeight: '400px' }} />
        </div>
      )}

      {(loadingMp3 || loadingMp4) && <ReactLoading type={"cylon"} color="#fff" />
      }
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div>
        <input
          type="text"
          value={youtubeLink}
          onChange={handleInputChange}
          placeholder="Enter YouTube link"
          className="rounded-md px-3 py-2 mr-2 mb-1 w-96 text-blue-600 focus:outline-none"
        />


        <select value={selectedQuality} onChange={handleQualityChange} className="rounded-md px-2 py-2 mt-1 mb-1 w-32  text-blue-600 focus:outline-none">
          <option value="default" disabled>Select Quality</option>
          <option value="lowest">Lowest</option>
          <option value="highest">Highest</option>
        </select>

      </div>

      <div className="flex">
        <button
          onClick={() => handleDownload('mp3')}
          disabled={loadingMp3}
          className="bg-blue-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg mr-2"
        >
          {loadingMp3 ? "Downloading..." : "Download MP3"}
        </button>
        <button
          onClick={() => handleDownload('mp4')}
          disabled={loadingMp4}
          className="bg-blue-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg mr-2"
        >
          {loadingMp4 ? "Downloading..." : "Download MP4"}
        </button>
      </div>
      {lastDownloadedLink && <div className="mt-4">Last link: {lastDownloadedLink}</div>}

      {downloadHistory.length > 0 && <DownloadHistory downloadHistory={downloadHistory} onHistoryItemClick={handleHistoryItemClick} />} {/* Use the DownloadHistory component */}





      <Ad isPremium={isPremium} />
    </div>

  );

  function Ad({ isPremium }: { isPremium: boolean }) {
    return (
      <>
        {!isPremium && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-200 bg-opacity-70 p-6 flex justify-center">
            <div className="ad-content">
              <p className="text-gray-800">AD</p>
              {/* Other ad content */}
            </div>
          </div>
        )}
      </>
    );
  }


}