// hooks/usePusher.ts
import { useEffect } from 'react';
import Pusher from 'pusher-js';

const usePusher = (channelName: string, eventHandler: (data: any) => void) => {
  useEffect(() => {
    const pusher = new Pusher('805aff76e13b62e781d7', {
      cluster: 'ap2',
      forceTLS: true,
    });

    const channel = pusher.subscribe(channelName);
    channel.bind('my-event', (data: any) => {
      eventHandler(data);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventHandler]);
};

export default usePusher;
