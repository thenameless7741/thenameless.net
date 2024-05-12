import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Payload {
  params: Anthropic.MessageCreateParamsStreaming;
  apiKey: string;
  metric?: boolean;
}

export const POST = async (req: NextRequest) => {
  const { params, apiKey, metric }: Payload = await req.json();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Anthropic API key is required' },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const textEncoder = new TextEncoder();
  const stream = anthropic.messages.stream(params);
  const start = new Date().getTime();

  const readableStream = new ReadableStream({
    start: async (controller) => {
      const m = { input: 0, output: 0, ttft: 0, e2e: 0 };

      try {
        for await (const event of stream) {
          switch (event.type) {
            case 'message_start':
              m.input = event.message.usage.input_tokens;
              break;
            case 'content_block_delta':
              if (!m.ttft) {
                const end = new Date().getTime();
                m.ttft = end - start;
              }

              const chunk = event.delta.text;
              controller.enqueue(textEncoder.encode(chunk));
              break;
            case 'message_delta':
              m.output = event.usage.output_tokens;
              break;
            case 'message_stop':
              if (!metric) continue;

              const end = new Date().getTime();
              m.e2e = end - start;

              const text = `<|metric|>${JSON.stringify(m)}`;
              controller.enqueue(textEncoder.encode(text));
              break;
            default:
              break;
          }
        }
        controller.close();
      } catch (res) {
        if (typeof res === 'object' && res !== null && 'error' in res) {
          const { error } = res.error as { type: string; error: string };
          controller.enqueue(
            textEncoder.encode(JSON.stringify(error, null, 2)),
          );
          controller.close();
        } else {
          throw res;
        }
      }
    },
  });
  return new NextResponse(readableStream, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
