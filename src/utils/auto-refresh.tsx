// reference: https://www.steveruiz.me/posts/nextjs-refresh-content
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

let AutoRefresh = ({ children }: Props) => children;

if (process.env.NODE_ENV === 'development') {
  AutoRefresh = ({ children }: Props) => {
    const router = useRouter();

    useEffect(() => {
      const ws = new WebSocket('ws://localhost:8080');

      ws.onmessage = (event) => {
        if (event.data === 'refresh') {
          router.refresh();
        }
      };

      return () => {
        ws.readyState === 1 && ws.close();
      };
    }, [router]);

    return children;
  };
}

export default AutoRefresh;
