'use client';

import LabelButton from '@/ui/button';
import { useState } from 'react';

const Page = () => {
  const [state, setState] = useState('');

  return (
    <>
      <h1>{state || 'void'}</h1>

      <LabelButton
        onPress={async () => {
          const params = {};
          const abort = new AbortController();

          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
          const res = await fetch(`${baseUrl}/api/chat/anthropic`, {
            body: JSON.stringify(params),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            signal: abort.signal,
          });

          const data = await res.text();
          setState(data);
        }}
      >
        press
      </LabelButton>
    </>
  );
};
export default Page;
