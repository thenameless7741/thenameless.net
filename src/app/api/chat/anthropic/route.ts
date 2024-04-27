import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Payload {
  params: Anthropic.MessageCreateParamsStreaming;
  apiKey: string;
}

export const POST = async (req: NextRequest) => {
  const { params, apiKey }: Payload = await req.json();
  // if (!apiKey) {
  //   return NextResponse.json(
  //     { error: 'Anthropic API key is required' },
  //     { status: 400 },
  //   );
  // }

  // TODO: remove apiKey when a form for storing API key is implemented
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = anthropic.messages.stream(params);
  const textEncoder = new TextEncoder();

  const readableStream = new ReadableStream({
    start: async (controller) => {
      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          controller.enqueue(textEncoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });
  return new NextResponse(readableStream, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
