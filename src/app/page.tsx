"use client";

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VIDEO_URL = 'https://sssumaa.com/wallpaper'; // FastAPIサーバーのURLを指定

const Home = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null); // 次の動画用のリファレンスを追加
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [nextVideoSrc, setNextVideoSrc] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchNextVideo = async () => {
    try {
      const response = await axios.get<{ videoUrl: string }>(VIDEO_URL);
      setNextVideoSrc(response.data.videoUrl);
      if (nextVideoRef.current) {
        nextVideoRef.current.src = response.data.videoUrl;
        nextVideoRef.current.load();
      }
    } catch (error) {
      console.error('Error fetching next video:', error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= video.duration / 3 && !isFetching && !nextVideoSrc) {
        setIsFetching(true);
        fetchNextVideo();
      }
    };

    const handleEnded = () => {
      if (nextVideoSrc) {
        setVideoSrc(nextVideoSrc);
        setNextVideoSrc(null);
        if (videoRef.current) {
          videoRef.current.src = nextVideoSrc;
          videoRef.current.load();
          videoRef.current.play().catch((error) => {
            console.error('Error attempting to play video:', error);
          });
        }
      }
      setIsFetching(false); // Ensure fetching flag is reset after playback starts
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Initial autoplay and fetch the first video URL
    fetchNextVideo();
    video.play().catch((error) => {
      console.error('Error attempting to play video:', error);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [nextVideoSrc, isFetching]);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
      <header>
        <h1>My Video Playback App</h1>
      </header>
      <video ref={videoRef} src={videoSrc} autoPlay muted controls style={{ width: '100%', height: '100%' }} />
      <video ref={nextVideoRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Home;
