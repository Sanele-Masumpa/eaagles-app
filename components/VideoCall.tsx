import React, { useEffect, useRef } from 'react';
import daily from '@/lib/dailyClient';

const VideoCall: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    daily.join({ url: 'https://eaglesring.daily.co' });
    daily.on('stream-added', (event: { stream: any; }) => {
      if (videoRef.current) {
        daily.attachStream(event.stream, videoRef.current);
      }
    });

    return () => {
      daily.leave();
    };
  }, []);

  return <div ref={videoRef} className="w-full h-full"></div>;
};

export default VideoCall;
