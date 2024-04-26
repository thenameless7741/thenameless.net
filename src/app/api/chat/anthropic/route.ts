import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export const POST = async (req: NextRequest) => {
  return new Response('Hello, 世界!');
};
